let myLibrary = [];

class Book {
  constructor (title, author, pages, read){
    this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  }
}

//DOM Objects
const bookCardsRow = document.querySelector("#bookCards");
const addBookBtn = document.querySelector(".add-book");
const removeBookBtn = document.querySelector(".remove-book");
const readBookBtn = document.querySelector(".read-books");
const unreadBookBtn = document.querySelector(".unread-books");

const noBooks = document.querySelector(".noBooks");
const statsRow = document.querySelector("#stats");

const modalForm = document.querySelector(".modal-container");
const closeBtn = document.querySelector(".close");

const $title = document.querySelector("#title");
const $author = document.querySelector("#author");
const $pages = document.querySelector("#pages");
const $read = document.querySelector("#read");
const submit = document.querySelector("#submit");

const totalBooks = document.querySelector("#totalBooks");
const totalReadBooks = document.querySelector("#totalReadBooks");
const totalUnreadBooks = document.querySelector("#totalunReadBooks");
const progressStat = document.querySelector("#progressStat");

//Functions

function addBookToLibrary() {
  let title = $title.value;
  let author = $author.value;
  let pages = $pages.value;
  let read = setReadStatus();
  let newBook = new Book(title, author, pages, read);
  myLibrary.push(newBook);
}

function setReadStatus() {
  if ($read.checked == true) {
    return ($read.value = true);
  } else return ($read.value = false);
}

function addForm() {
  modalForm.style.display = "flex";
}

function closeModal() {
  modalForm.style.display = "none";
}

const clearForm = () => {
  $title.value = "";
  $author.value = "";
  $pages.value = "";
  $read.checked = false;
};

function updateBooks() {
  bookCardsRow.textContent = "";
  myLibrary.forEach((book) => createCard(book));
}

function storeData() {
  localStorage.setItem("myLibraryBook", JSON.stringify(myLibrary));
}

const populateData = () => {
  myLibrary = JSON.parse(localStorage.getItem("myLibraryBook"));
};

function createCard(book) {
  const card = document.createElement("div");
  card.className = "card";
  const title = document.createElement("h4");
  const author = document.createElement("h5");
  const pages = document.createElement("h5");
  const readStatus = document.createElement("h6");
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete";
  deleteBtn.setAttribute("onclick", "deleteBook()");
  deleteBtn.textContent = "Delete";

  title.textContent = book.title;
  author.textContent = book.author;
  pages.textContent = `${book.pages} pages`;
  if (book.read) {
    readStatus.textContent = "read";
    readStatus.className = "read";
  } else {
    readStatus.textContent = "unread";
    readStatus.className = "unread";
  }
  readStatus.setAttribute("onclick", "toggleRead()");
  card.appendChild(title);
  card.appendChild(author);
  card.appendChild(pages);
  card.appendChild(readStatus);
  card.appendChild(deleteBtn);
  bookCardsRow.appendChild(card);
}

function deleteBook(e) {
  e = e || window.event;
  let card = e.target.parentNode;
  let index = Array.from(card.parentNode.children).indexOf(card);
  card.parentNode.removeChild(card);
  myLibrary.splice([index], 1);
  storeData();
  updateStats();
  toggleStats();
}

function toggleRead(e) {
  e = e || window.event;
  let card = e.target.parentNode;
  let index = Array.from(card.parentNode.children).indexOf(card);
  if (card.childNodes.item(3).textContent == "unread") {
    card.childNodes.item(3).textContent = "read";
    card.childNodes.item(3).className = "read";
    myLibrary[index].read = true;
  } else {
    card.childNodes.item(3).textContent = "unread";
    card.childNodes.item(3).className = "unread";
    myLibrary[index].read = false;
  }
  storeData();
  updateStats();
}

function totalBooksCount() {
  return myLibrary.length;
}

function totalReadCount() {
  let count = 0;
  for (let i = 0; i < myLibrary.length; i++) {
    if (myLibrary[i].read) {
      count += 1;
    }
  }
  return count;
}

function totalUnreadCount() {
  let count = 0;
  for (let i = 0; i < myLibrary.length; i++) {
    if (!myLibrary[i].read) {
      count += 1;
    }
  }
  return count;
}

function progress() {
  if (!totalBooksCount()) {
    let progress = "";
    return progress;
  } else {
    let progress = Math.floor((totalReadCount() / totalBooksCount()) * 100);
    return progress + "%";
  }
}

function updateStats() {
  progressStat.textContent = progress();
  totalBooks.textContent = totalBooksCount();
  totalReadBooks.textContent = totalReadCount();
  totalUnreadBooks.textContent = totalUnreadCount();
}

function filterRead() {
  const readBtn = document.querySelector(".readBtn");
  const unreadBtn = document.querySelector(".unreadBtn");
  let allCards = Array.from(document.getElementsByClassName("card"));
  let unreadBookCards = Array.from(document.getElementsByClassName("unread"));
  let readBookCards = Array.from(document.getElementsByClassName("read"));

  if (readBtn.checked == false && unreadBtn.checked == false) {
    allCards.forEach((card) => (card.style.display = "flex"));
  }

  if (readBtn.checked == true && unreadBtn.checked == true) {
    allCards.forEach((card) => (card.style.display = "flex"));
  }

  if (readBtn.checked == true && unreadBtn.checked == false) {
    unreadBookCards.forEach((card) => (card.parentNode.style.display = "none"));
    readBookCards.forEach((card) => (card.parentNode.style.display = "flex"));
  }

  if (readBtn.checked == false && unreadBtn.checked == true) {
    readBookCards.forEach((card) => (card.parentNode.style.display = "none"));
    unreadBookCards.forEach((card) => (card.parentNode.style.display = "flex"));
  }
}

function toggleStats() {
  if (myLibrary.length > 0) {
    statsRow.style.display = "flex";
    noBooks.style.display = "none";
  } else {
    statsRow.style.display = "none";
    noBooks.style.display = "flex";
  }
}

function validateForm() {
  if (
    $title.checkValidity() &&
    $author.checkValidity() &&
    $pages.checkValidity()
  ) {
    return true;
  } else {
    return false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  $pages.addEventListener("input", () => {
    if (!$pages.checkValidity()) $pages.value = "";
  });

  addBookBtn.addEventListener("click", addForm);

  closeBtn.addEventListener("click", closeModal);

  $read.addEventListener("click", setReadStatus);

  readBookBtn.addEventListener("click", filterRead);

  unreadBookBtn.addEventListener("click", filterRead);

  submit.addEventListener("click", function () {
    if (validateForm()) {
      addBookToLibrary();
      storeData();
      updateBooks();
      toggleStats();
      closeModal();
      updateStats();
      clearForm();
    } else {
      return;
    }
  });

  if (!localStorage.getItem("myLibraryBook")) {
    storeData();
  } else {
    populateData();
  }
  toggleStats();
  updateBooks();
  updateStats();
});