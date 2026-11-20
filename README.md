# Homework 7 – Directors & Movies (one to many)

ერთ რეჟისორს შეიძლება ჰქონდეს რამდენიმე ფილმი, ერთ ფილმს აქვს 1 რეჟისორი.

## Start

1) npm i
2) create `.env` and write `MONGO_URL` inside of it
3) npm run seed (optional - fills DB with 3 directors and 7 movies, deletes old ones)
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
| GET    | /movies?title=&genre=&yearFrom=&yearTo=&director=&page=&limit= | – | – |
| GET    | /movies/:id | – | – |
| POST   | /movies | `director-id: <director _id>` | `{ "title": "Inception", "desc": "Dream heist", "releaseYear": 2010, "genre": "Sci-Fi" }` |
| PUT    | /movies/:id | – | any of the fields above |
| DELETE | /movies/:id | – | – (also removes it from director's `movies`) |

GET returns movie with populated `director`.
