import React from 'react'
import {Link} from 'react-router-dom'
import Shelf from '../Shelf'
import * as BooksAPI from '../../BooksAPI'

class MainPage extends React.Component{
  constructor(props){
    super(props);
    // books shown on the MainPage; books are on the shelves currently
    this.state = {
      books: []
    };
  }

  componentDidMount(){
    BooksAPI.getAll()
    .then(resp => {
      this.setState({books: resp});
    })
  }

  /* we get a promise, hence .then; when the promise is fulfilled...
   * resp(onse) gets the book in question, sets the shelf appropriately
   * the state is updated so that the book (MainPage) added to whatever
   * shelf is added to the books; prevents duplicates
   * (can't have one book in two different shelves)
   */
  updateBookshelf = (book, shelf) => {
    BooksAPI.update(book, shelf)
    .then(resp => {
      book.shelf = shelf;
      this.setState(state => ({
           books: state.books.filter(b => b.id !== book.id).concat([book])
      }))
    })
  }

  render(){
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            {/*names based on shelf names in API*/}
            <Shelf updateBookshelf={this.updateBookshelf} name="Currently Reading" books={this.state.books.filter(book => book.shelf === "currentlyReading")} />
            <Shelf updateBookshelf={this.updateBookshelf} name="Want to Read" books={this.state.books.filter(book => book.shelf === "wantToRead")} />
            <Shelf updateBookshelf={this.updateBookshelf} name="Read" books={this.state.books.filter(book => book.shelf === "read")} />
          </div>
        </div>
        <div className="open-search">
          <Link id="open-search-link" to="/search">Add a book</Link>
        </div>
      </div>
    )
  }
}

export default MainPage
