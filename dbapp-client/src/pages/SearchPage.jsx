import { useState, useEffect } from "react";
import SearchForm from "../components/SearchForm.jsx";
import BookCard from "../components/BookCard.jsx";
import Pagination from "../components/Pagination.jsx";
import { useGoogleBooks } from "../hooks/useGoogleBooks.jsx";
import rankingData from "../data/ranking.json";
import "../styles/SearchPage.css";

function SearchPage({ selectedRanking, user }) {
  const [currentQuery, setCurrentQuery] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const {
    books,
    loading,
    error,
    searchBooks,
    nextPage,
    previousPage,
    currentPage,
    totalItems,
    hasNextPage,
    hasPreviousPage,
    setBooks,
    setTotalItems,
    setCurrentPage,
  } = useGoogleBooks();

  const handleAddToWishlist = async (bookData) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          学生証番号: user.学生証番号,
          書籍ID: bookData.書籍ID,
          タイトル: bookData.タイトル,
        }),
      });

      if (!response.ok) {
        throw new Error("読みたい本の追加に失敗しました");
      }

      setWishlist((prev) => [
        ...prev,
        {
          学生証番号: user.学生証番号,
          書籍ID: bookData.書籍ID,
          タイトル: bookData.タイトル,
        },
      ]);

      alert("読みたい本リストに追加しました！");
    } catch (error) {
      console.error("エラー:", error);
      alert("読みたい本の追加中にエラーが発生しました");
    }
  };

  const handleRemoveFromWishlist = async (書籍ID) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/wishlist/${user.学生証番号}/${書籍ID}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("削除に失敗しました");
      }

      // wishlistの状態を更新
      setWishlist((prev) => prev.filter((book) => book.書籍ID !== 書籍ID));
      alert("読みたい本リストから削除しました！");
    } catch (error) {
      console.error("エラー:", error);
      alert("削除中にエラーが発生しました");
    }
  };

  useEffect(() => {
    if (selectedRanking) {
      handleRankingSelect(selectedRanking);
    }
  }, [selectedRanking]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/wishlist");
        if (!response.ok) {
          throw new Error("読みたい本リストの取得に失敗しました");
        }
        const data = await response.json();
        console.log("取得した読みたい本リスト:", data);
        setWishlist(data.filter((item) => item.学生証番号 === user.学生証番号));
      } catch (error) {
        console.error("エラー:", error);
      }
    };

    if (user) {
      fetchWishlist();
    }
  }, [user?.学生証番号]);

  useEffect(() => {
    console.log("現在の wishlist:", wishlist);
  }, [wishlist]);

  const handleRankingSelect = async (rankingId) => {
    const selectedBooks = rankingData.books.filter(
      (book) => book.id === rankingId
    );
    try {
      const results = await Promise.all(
        selectedBooks.map((book) =>
          fetch(`https://www.googleapis.com/books/v1/volumes/${book.book_id}`)
            .then((res) => res.json())
            .then((data) => data)
            .catch((error) => {
              console.error(`Error fetching book ${book.title}:`, error);
              return null;
            })
        )
      );

      const validResults = results.filter((book) => book != null);
      setBooks(validResults);
      setTotalItems(validResults.length);
      setCurrentPage(1);
    } catch (err) {
      console.error("ranking.jsonのエラー:", err);
    }
  };

  const handleSearch = (query) => {
    setCurrentQuery(query);
    searchBooks(query);
  };

  return (
    <div>
      <SearchForm onSearch={handleSearch} />
      {loading && <div className="loading">読み込み中...</div>}
      {error && <p className="error">エラーが発生しました: {error}</p>}
      <div className="book-grid">
        {books.map((book) => {
          console.log(
            "checking book:",
            book.id,
            "wishlist includes:",
            wishlist.some((item) => item.書籍ID === book.id)
          );

          return (
            <BookCard
              key={book.id}
              book={book}
              user={user}
              onAddToWishlist={handleAddToWishlist}
              onRemoveFromWishlist={handleRemoveFromWishlist}
              isInWishlist={wishlist.some((item) => item.書籍ID === book.id)}
            />
          );
        })}
      </div>
      {books.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          onNextPage={() => nextPage(currentQuery)}
          onPreviousPage={() => previousPage(currentQuery)}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
        />
      )}
    </div>
  );
}

export default SearchPage;
