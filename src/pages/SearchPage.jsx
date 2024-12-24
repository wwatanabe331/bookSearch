import { useState, useEffect } from "react";
import SearchForm from "../components/SearchForm";
import BookList from "../components/BookList";
import Pagination from "../components/Pagination";
import { useGoogleBooks } from "../hooks/useGoogleBooks.jsx";
import rankingData from "../data/ranking.json";
import "../styles/SearchPage.css";

function SearchPage({ selectedRanking }) {
  // propsとしてselectedRankingを受け取る
  const [currentQuery, setCurrentQuery] = useState("");
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

  // ranking_data
  useEffect(() => {
    if (selectedRanking) {
      handleRankingSelect(selectedRanking);
    }
  }, [selectedRanking]);

  const handleRankingSelect = async (rankingId) => {
    const selectedBooks = rankingData.books.filter(
      (book) => book.id === rankingId
    );

    try {
      // 検索クエリを最適化
      const results = await Promise.all(
        selectedBooks.map((book) =>
          fetch(
            // ここid検索でもいい
            // `https://www.googleapis.com/books/v1/volumes?q=` +
            //   `intitle:"${encodeURIComponent(book.title)}"` +
            //   `+inauthor:"${encodeURIComponent(book.author)}"` +
            //   "&langRestrict=ja&maxResults=1"
            `https://www.googleapis.com/books/v1/volumes/${book.book_id}`
          )
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
      <BookList books={books} />
      {books.length > 0 && (
        <Pagination
          currentPage={currentPage} //ページ番号
          totalItems={totalItems} //総数
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
