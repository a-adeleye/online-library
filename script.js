let myLibrary = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

//DOM Objects

const addBookBtn = document.querySelector(".add-book");
const removeBookBtn = document.querySelector(".remove-book");
const readBookBtn = document.querySelector(".read-books");
const unreadBookBtn = document.querySelector(".unread-books");

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

const clearForm = () => {
  $title.value = "";
  $author.value = "";
  $pages.value = "";
  $read.checked = false;
};

function storeData() {
  localStorage.setItem("myLibraryBook", JSON.stringify(myLibrary));
}

function addForm() {
  modalForm.style.display = "flex";
}

function closeModal() {
  modalForm.style.display = "none";
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

// Event listeners

addBookBtn.addEventListener("click", addForm);
closeBtn.addEventListener("click", closeModal);
$read.addEventListener("click", setReadStatus);

function setReadStatus() {
  if ($read.checked == true) {
    return ($read.value = true);
  } else return ($read.value = false);
}

submit.addEventListener("click", function () {
  addBookToLibrary();
  storeData();
  closeModal();
  clearForm();
  updateData();
  updateBookCard();
});

//DOM Contents

function updateData() {
  hideStat();
  progressStat.textContent = progress();
  totalBooks.textContent = totalBooksCount();
  totalReadBooks.textContent = totalReadCount();
  totalUnreadBooks.textContent = totalUnreadCount();
}

function updateBookCard() {
  const index = myLibrary.length;
  let book = myLibrary[index - 1];
  const bookCardsRow = document.querySelector("#bookCards");
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
  console.log(index);
  card.parentNode.removeChild(card);
  myLibrary.splice([index], 1);
  updateData();
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
  updateData();
}

function hideStat() {
  let noBooks = document.querySelector(".noBooks");
  let statsRow = document.querySelector("#stats");
  if (myLibrary.length < 1) {
    noBooks.style.display = "block";
    statsRow.style.display = "none";
  } else {
    noBooks.style.display = "none";
    statsRow.style.display = "flex";
  }
}

function filterRead() {
  const readBtn = document.querySelector(".readBtn");
  const unreadBtn = document.querySelector(".unreadBtn");
  let cards = Array.from(document.getElementsByClassName("unread"));

  cards.forEach(card => hide(card));

  function hide(elem) {

    if(readBtn.checked == true && unreadBtn.checked == true){
      elem.parentNode.style.display = "flex";
    } else if (readBtn.checked == true){
      elem.parentNode.style.display = "none";
    } else {
      elem.parentNode.style.display = "flex";
    }
  } 
}

function filterUnread() {
  const readBtn = document.querySelector(".readBtn");
  const unreadBtn = document.querySelector(".unreadBtn");

  let readBooks = Array.from(document.getElementsByClassName("read"));
  let unreadBooks = Array.from(document.getElementsByClassName("unread"));

  cards.forEach(card => hide(card));
  
  function hide(book) {
    if(unreadBtn.checked == true && readBtn.checked == true){
      readBooks.parentNode.style.display = "flex";
      unreadBooks.parentNode.style.display = "flex";
    } else if (readBtn.checked == true){
      readBooks.parentNode.style.display = "flex";
      unreadBooks.parentNode.style.display = "none";
    } else {
      unreadBooks.parentNode.style.display = "flex";
      readBooks.parentNode.style.display = "none";
    }
  } 
}


readBookBtn.addEventListener('click', filterRead);
unreadBookBtn.addEventListener('click', filterUnread);