const { v4: uuid } = require('uuid');

class Book {
  constructor(data = {}) {
    const {
      title, description, authors, favorite, fileCover, fileName, fileBook,
    } = data;

    this.id = uuid();
    this.title = title ?? '';
    this.description = description ?? '';
    this.authors = authors ?? '';
    this.favorite = favorite === 'on' ? true : Boolean(favorite);
    this.fileCover = fileCover ?? '';
    this.fileName = fileName ?? '';
    this.fileBook = fileBook ?? '';
  }
}

module.exports = Book;
