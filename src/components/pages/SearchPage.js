import React from 'react'
import {Link} from 'react-router-dom'
import * as BooksAPI from '../../BooksAPI'
import Book from '../Book'

class SearchPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      books: [],
      results: [],
      query: ""
    };
  }

  componentDidMount(){
    BooksAPI.getAll()
    .then(resp => {
      this.setState({books: resp});
    })
  }

  updateQuery = query => {
    this.setState({query: query}, this.submitSearch)
  }

  submitSearch(){
    // just catching some pitfalls
    if(this.state.query === "" || this.state.query === undefined){
      return this.setState({results: []});
    }
    BooksAPI.search(this.state.query.trim())
    .then(resp => {
      if(resp.error){
        return this.setState({results: []});
      }
      else{
        /*
         * b is the book from the response
         * B is ultimately a single copy of b, preventing duplicates
         * B registers if b is in an assigned shelf already
         * bug ex: searching "linux"
         */
        resp.forEach(b => {
          let f = this.state.books.filter(B => B.id === b.id);
          // if the book is valid, the book from the response
          // gets its shelf updated
          if(f[0]) {b.shelf = f[0].shelf};
        })
        return this.setState({results: resp});
      }
    })
  }

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
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">Close</Link>
          <div className="search-books-input-wrapper">
            <input type="text" placeholder="Search by title or author" value= {this.state.query}
            onChange={(event) => this.updateQuery(event.target.value)}/>
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {this.state.results.map((book, key) => <Book updateBookshelf={this.updateBookshelf} book={book} key={key}/>)}
          </ol>
        </div>
      </div>
  )}
}

export default SearchPage
