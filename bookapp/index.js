const express = require('express');

const indexRouter = require('./routes/index');
const bookRouter = require('./routes/book');

const user = require('./routes/api/user');
const book = require('./routes/api/book');
const error404 = require('./middleware/err-404');

const app = express();
app.use(express.urlencoded());
app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/books', bookRouter);
app.use('/public', express.static(`${__dirname}/public`));
app.use('/api/user', user);
app.use('/api/books', book);

app.use(error404);

const PORT = process.env.PORT || 3000;
const REDIS_URL = process.env.REDIS_URL || "localhost";


app.listen(PORT);

console.log(`Сервер запущен на http://localhost:${PORT}`)
