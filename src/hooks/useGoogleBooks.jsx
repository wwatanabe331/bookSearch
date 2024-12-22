// src/hooks/useGoogleBooks.jsx
import { useState } from "react";

export const useGoogleBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const MAX_RESULTS = 10; // 1ページあたり10冊

  //詳細検索をする可能性
  // const buildQueryString = (searchParams) => {
  //   if (typeof searchParams === "string") {
  //     return encodeURIComponent(searchParams);
  //   }

  //   const params = [];
  //   if (searchParams.query) {
  //     params.push(searchParams.query);
  //   }
  //   if (searchParams.author) {
  //     params.push(`inauthor:${searchParams.author}`);
  //   }
  //   if (searchParams.title) {
  //     params.push(`intitle:${searchParams.title}`);
  //   }
  //   return encodeURIComponent(params.join(" "));
  // };
  const buildQueryString = (query) => {
    return encodeURIComponent(query);
  };

  const searchBooks = async (searchParams, page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const startIndex = (page - 1) * MAX_RESULTS;
      const queryString = buildQueryString(searchParams);
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${queryString}&langRestrict=ja&startIndex=${startIndex}&maxResults=${MAX_RESULTS}`
      );

      if (!response.ok) {
        throw new Error(`検索に失敗しました: ${response.status}`);
      }

      const data = await response.json();
      setBooks(data.items || []);
      setTotalItems(data.totalItems || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextPage = (searchParams) => {
    const nextPageNumber = currentPage + 1;
    if ((nextPageNumber - 1) * MAX_RESULTS < totalItems) {
      searchBooks(searchParams, nextPageNumber);
    }
  };

  const previousPage = (searchParams) => {
    if (currentPage > 1) {
      searchBooks(searchParams, currentPage - 1);
    }
  };

  return {
    books,
    loading,
    error,

    searchBooks,
    nextPage,
    previousPage,

    currentPage,
    totalItems,
    hasNextPage: currentPage * MAX_RESULTS < totalItems,
    hasPreviousPage: currentPage > 1,

    setBooks,
    setTotalItems,
    setCurrentPage,
  };
};
