const express = require('express');

const router = express.Router();
const fileMulter = require('../middleware/file');
const store = require('../middleware/store');
const Book = require('../models/book');

const PORT = process.env.CNT_PORT || 3002;
const BASE_URL = process.env.BASE_URL || "http://counterapp";

// index — просмотр списка всех книг (вывод заголовков);
router.get('/', (req, res) => {
  const { books } = store;
  res.render('books/index', {
    title: 'Книги',
    books,
  });
});

// создать книгу
router.get('/create', (req, res) => {
  res.render('books/create', {
    title: 'Книга | добавить',
    book: {},
  });
});

// создать книгу
router.post('/create', fileMulter.single('fileBook'), (req, res) => {
  const { books } = store;
  const data = req.body;

  const newBook = new Book(data);
  books.push(newBook);
  if (req.file) {
    const { path } = req.file;
    newBook.fileBook = path;
  }

  res.redirect('/books');
});

// view — информация по конкретной книге;
router.get('/:id', async (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);
  if (idx !== -1) {
    let cnt = 0;
    try {
      const response = await fetch(`${BASE_URL}:${PORT}/counter/${id}/incr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }); 
      const data = await response.json();
      cnt = data.cnt; 
    } catch (error) {
      console.log(error);
    }
 
    res.render('books/view', {
      title: `Книга | ${books[idx].title}`,
      book: books[idx],
      count: cnt
    });
  } else {
    res.redirect('/404');
  }
});

// update — редактирование книги.
router.get('/update/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    res.render('books/update', {
      title: `Книга | ${books[idx].title}`,
      book: books[idx],
    });
  } else {
    res.redirect('/404');
  }
});

// update — редактирование книги.
router.post('/update/:id', fileMulter.single('fileBook'), (req, res) => {
  const { books } = store;
  const {
    title, description, authors, favorite, fileCover, fileName,
  } = req.body;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    books[idx] = {
      ...books[idx],
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
    };

    if (req.file) {
      const { path } = req.file;
      books[idx].fileBook = path;
    }

    res.redirect(`/books/${id}`);
  } else {
    res.redirect('/404');
  }
});

// удалить книгу по **ID**
router.post('/delete/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    books.splice(idx, 1);
    res.redirect('/books');
  } else {
    res.redirect('/404');
  }
});

module.exports = router;
