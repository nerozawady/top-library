const ETBody = document.querySelector('tbody');
const EAddBook = document.querySelector('#add-book');
const EForm = document.querySelector('form');
const EFormCancel = document.querySelector('#form__cancel');
const EFormAdd = document.querySelector('#form__add');
const EFormEdit = document.querySelector('#form__edit');
const EBooks = document.getElementsByName('book');

class BookList {
  #books = [];

  addBook(title, author, date, pages, read) {
    this.#books.push({
      metadata: {
        id: this.#books.length,
      },
      title,
      author,
      date,
      pages,
      read,
    });
  }

  removeBook(id) {
    id = Number(id);
    this.#books.splice(id, 1);
    for (let i = id; i < this.#books.length; i += 1) {
      this.#books[i].metadata.id = i;
    }
  }

  toggleRead(id) {
    this.#books[id].read = !this.#books[id].read;
  }

  editBook(id, title, author, date, pages, read) {
    id = Number(id);
    this.#books[id] = {
      metadata: {
        id,
      },
      title,
      author,
      date,
      pages,
      read,
    };
  }

  getBook(id) {
    id = Number(id);
    return this.#books.at(id);
  }
}

const library = new BookList();

function addBookToDOM(book) {
  const ETRow = document.createElement('tr');
  ETRow.setAttribute('name', 'book');

  const ERemove = document.createElement('button');
  ERemove.textContent = 'X';
  ERemove.addEventListener('click', event => {
    const bookID = Number(event.target.parentElement.getAttribute('data-id'));
    event.target.parentElement.remove();
    // event.target.parentElement.remove();
    // EBooks.pop(bookID);

    for (let i = bookID; i < EBooks.length; i += 1) {
      EBooks[i].setAttribute('data-id', i);
    }

    library.removeBook(bookID);
  });
  ETRow.append(ERemove);

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
          library.toggleRead(bookId);
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

  // const book = new Book(
  //   library.length,
  //   formData.get('title'),
  //   formData.get('author'),
  //   formData.get('date'),
  //   formData.get('pages'),
  //   formData.get('read') === 'on' ?? false
  // );

  // library.push(book);

  library.addBook(
    formData.get('title'),
    formData.get('author'),
    formData.get('date'),
    formData.get('pages'),
    formData.get('read') === 'on'
  );
  addBookToDOM(library.getBook(-1));

  EForm.reset();
  EForm.classList.add('hidden');
});

function init() {
  EForm.reset();

  library.addBook('Book 1', 'Adam', '2023-01-12', 481, false);
  addBookToDOM(library.getBook(-1));
  library.addBook('Book 2', 'Sam', '1523-07-27', 193, false);
  addBookToDOM(library.getBook(-1));
  library.addBook('Book 3', 'Derek', '1023-11-03', 231, true);
  addBookToDOM(library.getBook(-1));

  // EBooks = document.querySelectorAll('tr[data-id]');
}

init();
