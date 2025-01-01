import { useState } from "react";
import "../styles/SearchForm.css";

function SearchForm({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="本のタイトル、著者名など"
        className="search-input"
      />
      <button type="submit" className="search-button">
        検索
      </button>
    </form>
  );
}

export default SearchForm;
