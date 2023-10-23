const clock = document.querySelector(".clock");
const addBookButton = document.querySelector("#add-book-button");
const bookListKey = "booklist";

document.addEventListener("DOMContentLoaded", () => {
    if (typeof Storage !== "undefined") {
        if (localStorage.getItem(bookListKey) === null) {
            localStorage.setItem(bookListKey, JSON.stringify([]));
        }
    } else {
        alert("Your Browser doesn't support Local Storage");
    }

    function checkStorage() {
        return typeof Storage !== "undefined";
    }

    const addToFinishedButton = document.querySelector("#addToFinished");
    const addToOngoingButton = document.querySelector("#addToOngoing");
    const bookshelf = document.querySelector("#booklist");
    const searchButton = document.querySelector("#search-button");
    renderCards();

    searchButton.addEventListener("click", (e) => {
        const searchValue = document.querySelector("#input-book-name").value;
        bookshelf.scrollIntoView({ behavior: "smooth", block: "start" });
        if (searchValue === "") {
            renderCards();
            return;
        }
        const bookList = JSON.parse(localStorage.getItem(bookListKey));
        const filteredBookList = bookList.filter((book) => {
            return book.title.toLowerCase().includes(searchValue.toLowerCase());
        });
        const onGoingBookShelf = document.querySelector(".ongoing .bookshelf");
        const finishedBookShelf = document.querySelector(".finished .bookshelf");
        let onGoingBookCards = "";
        let finishedBookCards = "";
        if (filteredBookList === null || filteredBookList.length === 0) {
            onGoingBookShelf.innerHTML = `No books found with the title "${searchValue}"`;
            finishedBookShelf.innerHTML = `No books found with the title "${searchValue}"`;
            return;
        }
        for (const book of filteredBookList) {
            if (!book.isComplete) {
                onGoingBookCards += `
                  <div class="book-card" bookId="${book.id}">
                    <div class="book-illustration"></div>
                    <p class="book-title">${book.title}</p>
                    <p class="book-author">${book.author}, ${book.year}</p>
                    <button class="deleteButton">
                      <i class="fa-solid fa-trash"></i> Delete
                    </button>
                    <button class="read">
                      <i class="fa-solid fa-check"></i> Read
                    </button>
                  </div>
                `;
            } else {
                finishedBookCards += `
                  <div class="book-card" bookId="${book.id}">
                    <div class="book-illustration"></div>
                    <p class="book-title">${book.title}</p>
                    <p class="book-author">${book.author}, ${book.year}</p>
                    <button class="deleteButton">
                      <i class="fa-solid fa-trash"></i> Delete
                    </button>
                    <button class="unread">
                      <i class="fa-solid fa-x"></i> Unread
                    </button>
                  </div>
                `;
            }
        }
        onGoingBookShelf.innerHTML = onGoingBookCards;
        finishedBookShelf.innerHTML = finishedBookCards;
        countBooks();
    });

    bookshelf.addEventListener("click", (e) => {
        if (e.target.classList.contains("deleteButton")) {
            if (confirm("Are you sure you want to delete this book?")) {
                const bookId = e.target.parentElement.getAttribute("bookId");
                const bookList = JSON.parse(localStorage.getItem(bookListKey));
                const newBookList = bookList.filter((book) => book.id !== +bookId);
                localStorage.setItem(bookListKey, JSON.stringify(newBookList));
                renderCards();
            }
        } else if (e.target.classList.contains("read")) {
            const bookId = e.target.parentElement.getAttribute("bookId");
            const bookList = JSON.parse(localStorage.getItem(bookListKey));
            const newBookList = bookList.map((book) => {
                if (book.id === +bookId) {
                    return {
                        ...book,
                        isComplete: true,
                    };
                }
                return book;
            });
            localStorage.setItem(bookListKey, JSON.stringify(newBookList));
            renderCards();
        } else if (e.target.classList.contains("unread")) {
            const bookId = e.target.parentElement.getAttribute("bookId");
            const bookList = JSON.parse(localStorage.getItem(bookListKey));
            const newBookList = bookList.map((book) => {
                if (book.id === +bookId) {
                    return {
                        ...book,
                        isComplete: false,
                    };
                }
                return book;
            });
            localStorage.setItem(bookListKey, JSON.stringify(newBookList));
            renderCards();
        }
    });

    setInterval(() => {
        const date = new Date();
        clock.textContent = `${date.getHours()} : ${date.getMinutes()} : ${date.getSeconds()} `;
    }, 1000);

    addBookButton.addEventListener("click", (e) => {
        if (e.target.value === "Add Book") {
            e.target.value = "Close";
        } else {
            e.target.value = "Add Book";
        }
        const addBookModal = document.querySelector(".add-book-modal");
        addBookModal.classList.toggle("hidden");
    });

    addToFinishedButton.addEventListener("click", (e) => {
        const bookTitle = document.querySelector("#book-title").value;
        const bookYear = document.querySelector("#book-year").value;
        const bookAuthor = document.querySelector("#book-author").value;
        if (bookTitle === "" || bookYear === "" || bookAuthor === "") {
            alert("Isi semua field");
            return;
        }
        const newBook = {
            id: +new Date(),
            title: bookTitle,
            year: parseInt(bookYear),
            author: bookAuthor,
            isComplete: true,
        };
        console.log(newBook);
        resetForm();
        addNewBook(newBook);
        renderCards();
    });

    addToOngoingButton.addEventListener("click", (e) => {
        const bookTitle = document.querySelector("#book-title").value;
        const bookYear = document.querySelector("#book-year").value;
        const bookAuthor = document.querySelector("#book-author").value;
        if (bookTitle === "" || bookYear === "" || bookAuthor === "") {
            alert("Please fill in all fields before adding a new book.");
            return;
        }
        const newBook = {
            id: +new Date(),
            title: bookTitle,
            year: parseInt(bookYear),
            author: bookAuthor,
            isComplete: false,
        };
        resetForm();
        addNewBook(newBook);
        renderCards();
    });

    function resetForm() {
        document.querySelector("#book-title").value = "";
        document.querySelector("#book-year").value = "";
        document.querySelector("#book-author").value = "";
    }

    function countBooks() {
        const finishedCounter = document.querySelector("#finishedCounter");
        const ongoingCounter = document.querySelector("#onGoingCounter");
        const bookCounter = document.querySelector("#bookCounter");

        let bookList = JSON.parse(localStorage.getItem(bookListKey));
        if (bookList === null || bookList.length === 0) {
            finishedCounter.textContent = 0;
            ongoingCounter.textContent = 0;
            bookCounter.textContent = 0;
            return;
        }
        let finishedCounterValue = 0;
        let ongoingCounterValue = 0;
        let bookCounterValue = 0;
        for (const book of bookList) {
            if (book.isComplete) {
                finishedCounterValue++;
            } else {
                ongoingCounterValue++;
            }
            bookCounterValue++;
        }
        finishedCounter.textContent = finishedCounterValue;
        ongoingCounter.textContent = ongoingCounterValue;
        bookCounter.textContent = bookCounterValue;
    }

    function renderCards() {
        let bookList = JSON.parse(localStorage.getItem(bookListKey));
        const onGoingBookShelf = document.querySelector(".ongoing .bookshelf");
        const finishedBookShelf = document.querySelector(".finished .bookshelf");
        let onGoingBookCards = "";
        let finishedBookCards = "";

        if (bookList === null || bookList.length === 0) {
            onGoingBookShelf.innerHTML = "You are not currently reading any books.";
            finishedBookShelf.innerHTML = "You haven't finished any books yet.";
            countBooks();
            return;
        }

        const onGoingBooks = bookList.filter((book) => !book.isComplete);
        const finishedBooks = bookList.filter((book) => book.isComplete);

        if (onGoingBooks.length === 0) {
            onGoingBookShelf.innerHTML = "You are not currently reading any books.";
        } else {
            for (const book of onGoingBooks) {
                onGoingBookCards += `
              <div class="book-card" bookId="${book.id}">
                <div class="book-illustration"></div>
                <p class="book-title">${book.title}</p>
                <p class="book-author">${book.author}, ${book.year}</p>
                <button class="deleteButton">
                  <i class="fa-solid fa-trash"></i> Delete
                </button>
                <button class="read">
                  <i class="fa-solid fa-check"></i> Read
                </button>
              </div>
            `;
            }
            onGoingBookShelf.innerHTML = onGoingBookCards;
        }

        if (finishedBooks.length === 0) {
            finishedBookShelf.innerHTML = "You haven't finished any books yet.";
        } else {
            for (const book of finishedBooks) {
                finishedBookCards += `
              <div class="book-card" bookId="${book.id}">
                <div class="book-illustration"></div>
                <p class="book-title">${book.title}</p>
                <p class="book-author">${book.author}, ${book.year}</p>
                <button class="deleteButton">
                  <i class="fa-solid fa-trash"></i> Delete
                </button>
                <button class="unread">
                  <i class="fa-solid fa-x"></i> Unread
                </button>
              </div>
            `;
            }
            finishedBookShelf.innerHTML = finishedBookCards;
        }

        countBooks();
    }

    function addNewBook(newBook) {
        let bookList = [];
        if (checkStorage()) {
            const savedBooks = localStorage.getItem(bookListKey);
            if (savedBooks !== null && savedBooks !== "") {
                bookList = JSON.parse(savedBooks);
            }
            bookList.push(newBook);
            localStorage.setItem(bookListKey, JSON.stringify(bookList));
        }
    }
});