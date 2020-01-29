const express = require('express')
const parser = require('body-parser')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(parser.urlencoded({ extended: true} ))
app.use(parser.json())

const ideaController = require('./controllers/Idea')
const userController = require('./controllers/Users')
const authController = require('./controllers/Auth')

app.use('/ideas', ideaController)
app.use('/users', userController)
app.use('/auth', authController)


app.set("port", process.env.PORT || 4000);

app.listen(app.get("port"), () => {
  console.log(`PORT: ${app.get("port")}`);
});