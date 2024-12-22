import "../styles/BookCard.css";

function BookCard({ book }) {
  // 大学の図書館用のURL
  const getCalilSearchUrl = () => {
    const title = book.volumeInfo?.title || "";
    const authors = book.volumeInfo?.authors?.[0] || "";
    // return `https://calil.jp/search?q=${encodeURIComponent(
    //   title + " " + authors
    // )}`;
    return `https://chslib.nihon-u.ac.jp/opac/opac_search/?lang=0&amode=2&appname=Netscape&version=5&cmode=0&smode=0&kywd=${encodeURIComponent(
      title + " " + authors
    )}&index_amazon_s=Books&node_s=`;
  };

  // プレビューの状態を確認
  const getReadButton = () => {
    const viewability = book.accessInfo?.viewability;
    const previewLink = book.volumeInfo?.previewLink;

    if (viewability === "ALL_PAGES") {
      return { text: "読む", link: previewLink, show: true };
    } else if (viewability === "PARTIAL") {
      return { text: "試し読み", link: previewLink, show: true };
    } else {
      return { text: "", link: "", show: false };
    }
  };

  const readButton = getReadButton();

  return (
    <div className="book-card">
      <div className="book-image">
        <img
          src={book.volumeInfo.imageLinks?.thumbnail || "/placeholder-book.png"}
          alt={book.volumeInfo.title}
        />
      </div>

      <div className="book-info">
        <h3>{book.volumeInfo.title}</h3>
        <p className="author-date">
          {book.volumeInfo.authors?.join(", ")}
          {book.volumeInfo.publishedDate &&
            ` · ${book.volumeInfo.publishedDate.slice(0, 4)}`}
        </p>
        <p className="description">
          {book.volumeInfo.description?.slice(0, 200)}
          {book.volumeInfo.description?.length > 200 ? "..." : ""}
        </p>

        <div className="action-buttons">
          {readButton.show && (
            <a
              href={readButton.link}
              target="_blank"
              rel="noopener noreferrer"
              className="read-button"
            >
              {readButton.text}
            </a>
          )}
          <button className="add-button">読みたいに追加</button>
          <a
            href={getCalilSearchUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="library-button"
          >
            図書館で借りる
          </a>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
