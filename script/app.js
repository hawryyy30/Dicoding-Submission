const clock = document.querySelector(".clock");
const addBookButton = document.querySelector("#add-book-button");
const bookListKey = "booklist";

document.addEventListener("DOMContentLoaded", () => {
	renderCards();
	if (typeof Storage !== "undefined") {
		if (localStorage.getItem(bookListKey) === null) {
			localStorage.setItem(bookListKey, "");
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

	bookshelf.addEventListener('click',(e)=>{
		if(e.target.classList.contains("deleteButton")){
			const bookId = e.target.parentElement.getAttribute("bookId");
			const bookList = JSON.parse(localStorage.getItem(bookListKey));
			const newBookList = bookList.filter((book) => book.bookid !== +bookId);
			localStorage.setItem(bookListKey, JSON.stringify(newBookList));
			renderCards();
		}
	})

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
			bookid: +new Date(),
			bookTitle: bookTitle,
			bookYear: bookYear,
			bookAuthor: bookAuthor,
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
			bookid: +new Date(),
			bookTitle: bookTitle,
			bookYear: bookYear,
			bookAuthor: bookAuthor,
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

	function renderCards() {
		let bookList = JSON.parse(localStorage.getItem(bookListKey));
		const onGoingBookShelf = document.querySelector(".ongoing .bookshelf");
		const finishedBookShelf = document.querySelector(".finished .bookshelf");
		let onGoingBookCards = "";
		let finishedBookCards = "";
	  
		if (bookList === null || bookList.length === 0) {
		  onGoingBookShelf.innerHTML = "";
		  finishedBookShelf.innerHTML = "";
		  return;
		}
	  
		for (const book of bookList) {
		  if (!book.isComplete) {
			onGoingBookCards += `
			  <div class="book-card" bookId="${book.bookid}">
				<div class="book-illustration"></div>
				<p class="book-title">${book.bookTitle}</p>
				<p class="book-author">${book.bookAuthor}, ${book.bookYear}</p>
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
			  <div class="book-card" bookId="${book.bookid}">
				<div class="book-illustration"></div>
				<p class="book-title">${book.bookTitle}</p>
				<p class="book-author">${book.bookAuthor}, ${book.bookYear}</p>
				<button class="deleteButton">
				  <i class="fa-solid fa-trash"></i> Delete
				</button>
				<button class="read">
				  <i class="fa-solid fa-x"></i> Unread
				</button>
			  </div>
			`;
		  }
		}
	  
		onGoingBookShelf.innerHTML = onGoingBookCards;
		finishedBookShelf.innerHTML = finishedBookCards;
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
