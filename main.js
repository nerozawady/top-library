// eslint-disable-next-line strict, lines-around-directive
'use strict';

// TODO - genres should be a collection of tags

const library = [];
const ETBody = document.querySelector('tbody');
const EAddBook = document.querySelector('#add-book');
const EForm = document.querySelector('form');
const EFormCancel = document.querySelector('#form__cancel');
const EFormAdd = document.querySelector('#form__add');
const EFormEdit = document.querySelector('#form__edit');

function Book(id, title, author, date, pages, read) {
  this.metadata = {
    id,
  };
  this.title = title;
  this.author = author;
  this.date = date;
  this.pages = pages;
  this.read = read;
}

function updateLibraryIds(removedBookId) {
  for (let i = Number(removedBookId); i < library.length; i += 1) {
    library[i].metadata.id = i;
  }
}

function addBookToDOM(book) {
  const ETRow = document.createElement('tr');

  const ERemove = document.createElement('button');
  ERemove.textContent = 'X';
  ERemove.addEventListener('click', event => {
    const bookID = event.target.parentElement.getAttribute('data-id');
    event.target.parentElement.remove();
    library.splice(bookID, 1);
    updateLibraryIds(bookID);
  });
  ETRow.append(ERemove);

  // TODO - implement feature: click "Edit" to get a form and edit the book, update library info
  const EEdit = document.createElement('button');
  EEdit.textContent = 'Edit';
  ETRow.append(EEdit);

  Object.entries(book).forEach(([propName, propValue]) => {
    if (propName !== 'metadata') {
      const ETD = document.createElement('td');
      ETD.setAttribute('data-prop-name', propName);

      if (propName === 'read') {
        const ERead = document.createElement('input');
        ERead.type = 'checkbox';
        ERead.checked = propValue;

        ERead.addEventListener('change', event => {
          const bookId = event.target.parentElement.parentElement.getAttribute('data-id');
          library[bookId].read = !library[bookId].read;
        });

        ETD.append(ERead);
      } else {
        ETD.textContent = propValue;
      }

      if (propValue === '') {
        ETD.classList.add('empty-value');
      }

      ETRow.append(ETD);
    } else {
      ETRow.setAttribute('data-id', propValue.id);
    }
  });

  ETBody.append(ETRow);
}

function showAddBookForm() {
  EFormAdd.classList.remove('hidden');
  EForm.classList.remove('hidden');
}

EAddBook.addEventListener('click', showAddBookForm);
// TODO
// EEdit.addEventListener("click")

// function showEditBookForm() {
//   EFormEdit.classList.remove('hidden');
//   EForm.classList.remove('hidden');
// }

EFormCancel.addEventListener('click', () => {
  EForm.classList.add('hidden');
  if (!EFormAdd.classList.contains('hidden')) {
    EFormAdd.classList.add('hidden');
  } else {
    EFormEdit.classList.add('hidden');
  }
  EForm.reset();
});

function validateInputs() {
  const EBookTitle = document.querySelector('#form-book-title');
  const bookTitle = EBookTitle.value.trim();
  const EBookTitleErrorMsg = document.querySelector('#form-book-title-error');

  const EBookAuthor = document.querySelector('#form-book-author');
  const bookAuthor = EBookAuthor.value.trim();
  const EBookAuthorErrorMsg = document.querySelector('#form-book-author-error');

  if (bookTitle === '' && !EBookTitle.classList.contains('invalid-input')) {
    EBookTitle.classList.remove('valid-input');
    EBookTitle.classList.add('invalid-input');
    EBookTitleErrorMsg.classList.remove('hidden');
  } else if (bookTitle !== '' && !EBookTitle.classList.contains('valid-input')) {
    EBookTitle.classList.remove('invalid-input');
    EBookTitle.classList.add('valid-input');
    EBookTitleErrorMsg.classList.add('hidden');
  }

  if (bookAuthor === '' && !EBookAuthor.classList.contains('invalid-input')) {
    EBookAuthor.classList.remove('valid-input');
    EBookAuthor.classList.add('invalid-input');
    EBookAuthorErrorMsg.classList.remove('hidden');
  } else if (bookAuthor !== '' && !EBookAuthor.classList.contains('valid-input')) {
    EBookAuthor.classList.remove('invalid-input');
    EBookAuthor.classList.add('valid-input');
    EBookAuthorErrorMsg.classList.add('hidden');
  }
}

EFormAdd.addEventListener('click', event => {
  event.preventDefault();
  validateInputs();

  const formHasError = EForm.querySelector('.invalid-input') !== null;
  if (!formHasError) {
    EForm.requestSubmit(EFormAdd);
  }
});

EForm.addEventListener('submit', event => {
  event.preventDefault();
  const formData = new FormData(EForm);

  const book = new Book(
    library.length,
    formData.get('title'),
    formData.get('author'),
    formData.get('date'),
    formData.get('pages'),
    formData.get('read') === 'on' ?? false
  );

  library.push(book);
  addBookToDOM(library.at(-1));

  EForm.reset();
  EForm.classList.add('hidden');
});

function init() {
  EForm.reset();

  library.push(new Book(0, 'Book 1', 'Adam', '2023-01-12', 481, false));
  addBookToDOM(library.at(-1));
  library.push(new Book(1, 'Book 2', 'Sam', '1523-07-27', 193, false));
  addBookToDOM(library.at(-1));
  library.push(new Book(2, 'Book 3', 'Derek', '1023-11-03', 231, true));
  addBookToDOM(library.at(-1));
}

init();
