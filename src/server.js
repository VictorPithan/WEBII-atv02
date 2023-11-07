const path = require("path");
const express = require("express")
const app = express()
const { usersRouter } = require('./routes/users-routes');
const { dataSource } = require("./config/datasource");

app.use(express.static(path.join(__dirname, '..', 'public')))

app.use(express.urlencoded({ extended: false}))

app.use(express.json())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const session = require('express-session');

const dotenv = require('dotenv').config();

const API_SECRET = process.env.API_SECRET;

app.use(session({
    secret: API_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

const db = dataSource.initialize()

db.then(() => {
  console.log('Database Connected')
})

app.use(usersRouter)

app.use('*', (req, res) => {
  res.redirect('/')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} => https://localhost:${PORT}`)
})