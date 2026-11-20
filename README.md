# Homework 7 – Directors & Movies (one to many)

ერთ რეჟისორს შეიძლება ჰქონდეს რამდენიმე ფილმი, ერთ ფილმს აქვს 1 რეჟისორი.

## Start

1) npm i
2) create `.env` and write `MONGO_URL` inside of it
3) npm run seed (optional - fills DB with 4 directors and 10 movies, deletes old ones)
4) npm run dev
5) open http://localhost:3000 - page where you can create / edit / delete directors and movies

## Directors – `/directors`

| method | url | body |
| ------ | --- | ---- |
| GET    | /directors?fullName=&country=&page=&limit= | – |
| GET    | /directors/:id | – |
| POST   | /directors | `{ "fullName": "Christopher Nolan", "birthYear": 1970, "country": "UK" }` |
| PUT    | /directors/:id | any of the fields above |
| DELETE | /directors/:id | – (also deletes director's movies) |

GET returns director with populated `movies`.

## Movies – `/movies`

| method | url | headers | body |
| ------ | --- | ------- | ---- |
| GET    | /movies?title=&genre=&year=&yearFrom=&yearTo=&director=&page=&limit= | – | – |
| GET    | /movies/:id | – | – |
| POST   | /movies | `director-id: <director _id>` | `{ "title": "Inception", "desc": "Dream heist", "releaseYear": 2010, "genre": "Sci-Fi" }` |
| PUT    | /movies/:id | – | any of the fields above |
| DELETE | /movies/:id | – | – (also removes it from director's `movies`) |

GET returns movie with populated `director`.

Filter examples:
- `/movies?genre=comedy` - only Comedy movies
- `/movies?year=2020` - only movies released in 2020
- `/movies?page=2&limit=3` - pagination

## Middlewares

- `check-director-id-in-headers` - on `POST /movies`, movie can't be created without a valid `director-id` header of existing director
- `rate-limit` - on `POST /directors` and `POST /movies` (10 requests per minute, then blocked for 5 minutes)
- `validate` - zod validation of body (create / update) and query params (movies filter)
- `check-object-id-in-params` - checks `:id` is valid ObjectId
