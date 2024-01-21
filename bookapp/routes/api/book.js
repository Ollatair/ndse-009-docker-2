const express = require('express');

const router = express.Router();
const fileMulter = require('../../middleware/file');
const store = require('../../middleware/store');
const Book = require('../../models/book');

// получить все книги | получаем массив всех книг
router.get('/', (req, res) => {
  const { books } = store;
  res.json(books);
});

// получить книгу по **ID** | получаем объект книги, если запись не найдена, вернём **Code: 404**
router.get('/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);
  if (idx !== -1) {
    res.json(books[idx]);
  } else {
    res.status(404);
    res.json('404 | книга не найдена');
  }
});

// Метод отдаёт на скачиваение файл книги по её **:id**.
router.get('/:id/download', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);
  if (idx !== -1) {
    const bookId = books[idx];
    const filePath = bookId.fileBook;

    // Отправка файла на скачивание
    res.download(filePath, (err) => {
      if (err) {
        res.status(404);
        res.json('404 | Файл не найден');
      }
    });
  } else {
    res.status(404);
    res.json('404 | книга не найдена');
  }
});

// создать книгу | создаём книгу и возвращаем её же вместе с присвоенным **ID**
router.post('/', fileMulter.single('fileBook'), (req, res) => {
  const { books } = store;
  const data = req.body;

  const newBook = new Book(data);
  books.push(newBook);
  if (req.file) {
    const { path } = req.file;
    newBook.fileBook = path;
  }
  res.status(201);
  res.json(newBook);
});

// редактировать книгу по **ID** | редактируем объект книги, если не найдена, вернём **Code: 404**
router.put('/:id', fileMulter.single('fileBook'), (req, res) => {
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

    res.json(books[idx]);
  } else {
    res.status(404);
    res.json('404 | книга не найдена');
  }
});

// удалить книгу по **ID** | удаляем книгу и возвращаем ответ: **'ok'**
router.delete('/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    books.splice(idx, 1);
    res.json('ok');
  } else {
    res.status(404);
    res.json('404 | книга не найдена');
  }
});

module.exports = router;
