const express = require('express');
const path = require('path');

const db_sess = require('./private/controllers/db_session.js');


const app = express();

const indexRouter = require('./routes/index');

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(db_sess);


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'private')));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', indexRouter);

module.exports = app;
