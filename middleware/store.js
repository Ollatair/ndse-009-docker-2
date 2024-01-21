const defaultList = require('../utils/constants');
const Book = require('../models/book');

const store = {
  books: [],
};

defaultList.forEach((book) => {
  store.books.push(new Book(book));
});

module.exports = store;
