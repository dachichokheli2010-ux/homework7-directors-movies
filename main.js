const express = require('express')
const path = require('path')
const db = require('./config/db')
const directorRouter = require('./directors/directors.controller')
const movieRouter = require('./movies/movies.controller')
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.use('/directors', directorRouter)
app.use('/movies', movieRouter)

db().then(() => {
    app.listen(3000, () => {
        console.log('server runngin on http://localhost:3000')
    })
})
