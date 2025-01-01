import React, { useState, useEffect } from "react";
import "../styles/BookCard.css";
import "../styles/ReadingList.css";

function ReadingList({ user }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookDetails, setBookDetails] = useState({});

  // 読みたい本リストを取得
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/wishlist");
        if (!response.ok) {
          throw new Error("読みたい本リストの取得に失敗しました");
        }
        const data = await response.json();
        setWishlist(data.filter((item) => item.学生証番号 === user.学生証番号));
      } catch (error) {
        console.error("エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user.学生証番号]);

  // 本の詳細情報を取得
  useEffect(() => {
    const fetchBookDetails = async () => {
      const details = {};
      for (const book of wishlist) {
        try {
          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes/${book.書籍ID}`
          );
          if (response.ok) {
            const data = await response.json();
            details[book.書籍ID] = data;
          }
        } catch (error) {
          console.error(`Error fetching book ${book.書籍ID}:`, error);
        }
      }
      setBookDetails(details);
    };

    if (wishlist.length > 0) {
      fetchBookDetails();
    }
  }, [wishlist]);

  const handleRemove = async (書籍ID) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/wishlist/${user.学生証番号}/${書籍ID}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setWishlist(wishlist.filter((book) => book.書籍ID !== 書籍ID));
      }
    } catch (error) {
      console.error("削除エラー:", error);
    }
  };

  if (loading) return <div>読み込み中...</div>;

  const getCalilSearchUrl = (bookDetails) => {
    const title = bookDetails?.volumeInfo?.title || "";
    const authors = bookDetails?.volumeInfo?.authors?.[0] || "";
    return `https://chslib.nihon-u.ac.jp/opac/opac_search/?lang=0&amode=2&appname=Netscape&version=5&cmode=0&smode=0&kywd=${encodeURIComponent(
      title + " " + authors
    )}&index_amazon_s=Books&node_s=`;
  };

  const getReadButton = (bookDetails) => {
    const viewability = bookDetails?.accessInfo?.viewability;
    const previewLink = bookDetails?.volumeInfo?.previewLink;
    if (viewability === "ALL_PAGES") {
      return { text: "読む", link: previewLink, show: true };
    } else if (viewability === "PARTIAL") {
      return { text: "試し読み", link: previewLink, show: true };
    } else {
      return { text: "", link: "", show: false };
    }
  };

  return (
    <div className="reading-list">
      {/* <h1>読みたい本リスト</h1> */}
      {wishlist.length === 0 ? (
        <div className="empty-message">まだ本が登録されていません</div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((book) => {
            const details = bookDetails[book.書籍ID];
            const readButton = getReadButton(details);

            return (
              <div key={book.書籍ID} className="book-card">
                <div className="book-image">
                  <img
                    src={
                      details?.volumeInfo?.imageLinks?.thumbnail ||
                      "/placeholder-book.png"
                    }
                    alt={details?.volumeInfo?.title || book.タイトル}
                  />
                </div>
                <div className="book-info">
                  <h3>{details?.volumeInfo?.title || book.タイトル}</h3>
                  <p className="author-date">
                    {details?.volumeInfo?.authors?.join(", ")}
                    {details?.volumeInfo?.publishedDate &&
                      ` · ${details.volumeInfo.publishedDate.slice(0, 4)}`}
                  </p>
                  <p className="description">
                    {details?.volumeInfo?.description?.slice(0, 200)}
                    {details?.volumeInfo?.description?.length > 200
                      ? "..."
                      : ""}
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
                    <button
                      onClick={() => handleRemove(book.書籍ID)}
                      className="add-button"
                    >
                      削除
                    </button>
                    <a
                      href={getCalilSearchUrl(details)}
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
          })}
        </div>
      )}
    </div>
  );
}

export default ReadingList;
