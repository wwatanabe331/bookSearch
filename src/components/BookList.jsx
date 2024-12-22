import BookCard from "./BookCard";
import "../styles/BookList.css";

function BookList({ books }) {
  if (!books || books.length === 0) {
    return <p className="no-results">検索結果がありません</p>;
  }

  return (
    <div className="book-list">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

export default BookList;
