// Datetable 
$(document).ready(function() {
    $('#example').DataTable();
} );


//Book Class
class Book{
	constructor(title,author,isbn){
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}
//UI Class
class UI{
	//Add Book To List method
	addBookToList(book){
		//select <tbody id="book-list">
		const bookList = document.getElementById('book-list');
		//create row element
		const row = document.createElement('tr');
		//Insert colum in row element
		row.innerHTML = `
			<td>${book.title}</td>
			<td>${book.author}</td>
			<td>${book.isbn}</td>
			<td><a href="#" class="btn btn-danger delete">X</a></td>
		`;
		//append row to booklist
		bookList.appendChild(row);
		
	}

	//Delete Book from List method
	deleteBook(target){
		if(target.classList.contains('delete')){
			target.parentElement.parentElement.remove();
		}
	}

	//Clear Field form textinput method
	clearField(){
		document.getElementById('title').value = '';
		document.getElementById('author').value = '';
		document.getElementById('isbn').value = '';
	}

	//Show Alert method
	showAlert(message,className){
		//select modal body
		const modalBody = document.querySelector('.modal-body');
		//select form
		const form = document.querySelector('#book-form');
		//create div element
		const div = document.createElement('div');
		//add className to div element
		div.className = `alert alert-${className}`;
		//create text node and append to div element
		div.appendChild(document.createTextNode(message));
		//insert div element between modalBody and form
		modalBody.insertBefore(div,form);
		//setTimeout after 2 second
		setTimeout(function(){
			document.querySelector('.alert').remove();
		},2000);
	}

	//Show Alert For Delete Book method
	showAlertForDelete(message,className){
		//select card
		const card = document.querySelector('.card');
		//select table
		const table = document.querySelector('.dataTables_wrapper');
		//create div element
		const div = document.createElement('div');
		//add className to div element
		div.className = `delete-alert alert alert-${className}`;
		//create Text node and append to div element
		div.appendChild(document.createTextNode(message));
		//insert div element between card and table element
		card.insertBefore(div,table);
		//setTimeOut after 2 second
		setTimeout(function(){
			document.querySelector('.delete-alert').remove();
		},2000);
	}
}
//Store Class
class Store{
	//get book form local storage
	static getBooks(){
		let books = '';
		if(localStorage.getItem('books') === null){
			books = [];
		}else{
			books = JSON.parse(localStorage.getItem('books'));
		}
		return books;
	}
	//add book to local storage
	static addBookToLocalStorage(book){
		let books = Store.getBooks();
		books.push(book);
		localStorage.setItem('books',JSON.stringify(books));
	}
	//display book from local storage
	static displayBooks(){
		const books = Store.getBooks();
		books.forEach(function(book){
			const ui = new UI();
			ui.addBookToList(book);
		});
	}
	//delete book form local storage
	static deleteBookFromLocalStorage(isbn){
		const books = Store.getBooks();
		books.forEach(function(book,index){
			if(book.isbn === isbn){
				books.splice(index,1);
			}
		});
		localStorage.setItem('books',JSON.stringify(books));
	}
}


//Event Listener for add book
document.getElementById('book-form').addEventListener('submit',function(e){

	//variable from frontend form
	const title = document.getElementById('title').value;
	const author = document.getElementById('author').value;
	const isbn = document.getElementById('isbn').value;

	//Instantiate Book
	const book = new Book(title,author,isbn);

	//Instantiate UI
	const ui = new UI();

	if(title == '' || author == '' || isbn == ''){
		//show error alert
		ui.showAlert('Please fill all fields.','danger');
	}else{
		//add book to list
		ui.addBookToList(book);
		//add book to local storage
		Store.addBookToLocalStorage(book);
		//show success alert
		ui.showAlert('Insert Book Successfully.','success');
		//clear data from textinput field
		ui.clearField();
	}
	

	e.preventDefault();
});

//DOM Content Loaded
document.addEventListener('DOMContentLoaded',Store.displayBooks);

//Event Listener for delete book
document.getElementById('book-list').addEventListener('click',function(e){
	//Instantiate UI
	const ui = new UI();
	//delete book from list
	ui.deleteBook(e.target);
	//delete book from local storage
	Store.deleteBookFromLocalStorage(e.target.parentElement.previousElementSibling.textContent);
	//show alert for delete book
	ui.showAlertForDelete('Delete Book Successfully','success');

	e.preventDefault();
});