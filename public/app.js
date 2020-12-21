class Book {
  constructor(name, author, isbn) {
    this.name = name;
    this.author = author;
    this.isbn = isbn;
  }
}
class UI {
  addBookToList(book) {
    const bookList = document.getElementById("book-list");
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td></td>
      <td class="name">${book.name}</td>
      <td class="author">${book.author}</td>
      <td class="isbn">${book.isbn}</td>
      <td class="text-sm-start text-center"><a href="#" class="delete text-decoration-none fw-bold text-danger">X</a></td>
      `;
    bookList.appendChild(tr);
  }
  clearInputs() {
    document.getElementById("bookname").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
  showAlert(message, className) {
    const div = document.createElement("div");

    if (className === "success") {
      div.className = "alert alert-success";
    } else {
      div.className = "alert alert-danger";
    }
    div.setAttribute("role", "alert");
    div.textContent = message;

    const container = document.querySelector(".container");
    const form = document.getElementById("book-form");

    container.insertBefore(div, form);

    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }
  removeBookFromList(target) {
    if (target.classList[0] === "delete") {
      target.parentElement.parentElement.remove();
      ui.showAlert("Book Removed...", "success");
      Store.removeBookFromLocalStorage(
        target.parentElement.previousElementSibling.textContent
      );
    }
  }

  filterBooks(searchFor) {
    const books = document.querySelectorAll(
      `.${document.getElementById("searchBy").value}`
    );
    books.forEach(function (book) {
      if (book.outerText.toLowerCase().search(searchFor) === -1) {
        book.parentElement.classList.add("hidden");
      } else {
        book.parentElement.classList.remove("hidden");
      }
    });
  }
}
class Store {
  static addBookToLocalStorage(book) {
    let isAllowed = true;
    const ui = new UI();
    const books = Store.getAllBooksFromLocalStorage();
    books.forEach(function (cBook) {
      if (cBook.isbn === book.isbn) {
        isAllowed = false;
      }
    });
    if (isAllowed) {
      books.push(book);
      ui.addBookToList(book);
      ui.showAlert("Book Added...", "success");
    } else {
      ui.showAlert(
        "This Book Is Already In List / Wrong ISBN Number...",
        "error"
      );
    }
    localStorage.setItem("books", JSON.stringify(books));
  }
  static getAllBooksFromLocalStorage() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static removeBookFromLocalStorage(isbn) {
    const books = Store.getAllBooksFromLocalStorage();
    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
  static loadBooksFromLocalStorage() {
    const books = Store.getAllBooksFromLocalStorage();
    const ui = new UI();

    books.forEach(function (book) {
      ui.addBookToList(book);
    });
  }
  static clearLocalStorage() {
    localStorage.removeItem("books");
  }
}
document.addEventListener("DOMContentLoaded", Store.loadBooksFromLocalStorage);
document.getElementById("book-form").addEventListener("submit", function (e) {
  const name = document.getElementById("bookname").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;
  const ui = new UI();
  if (!name || !author || !isbn) {
    ui.showAlert("All Fields Are Must Required...", "error");
  } else {
    const book = new Book(
      name.charAt(0).toUpperCase() + name.slice(1),
      author.charAt(0).toUpperCase() + author.slice(1),
      isbn
    );

    Store.addBookToLocalStorage(book);
    ui.clearInputs();
  }

  e.preventDefault();
});
document.getElementById("book-list").addEventListener("click", function (e) {
  const ui = new UI();
  ui.removeBookFromList(e.target);

  e.preventDefault();
});
document.getElementById("search-book").addEventListener("keyup", function (e) {
  const book = this.value.toLowerCase();
  const ui = new UI();
  ui.filterBooks(book);
});
document.getElementById("searchBy").addEventListener("change", function () {
  document
    .getElementById("search-book")
    .setAttribute(
      "placeholder",
      `Search Book By it's ${document.getElementById("searchBy").value}...`
    );
});
document.getElementById("clear").addEventListener("click", function (e) {
  const isSure = confirm(
    "Are You Sure To Remove All The Books From Local Storage..."
  );
  if (isSure) {
    Store.clearLocalStorage();
    const ui = new UI();
    ui.showAlert(
      "All Books Are Removed From Your Browsers Local Storage...",
      "success"
    );
    document.getElementById("book-list").innerHTML = "";
  }
});
