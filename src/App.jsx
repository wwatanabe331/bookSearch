import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchPage from "./pages/SearchPage";
import BookDetail from "./pages/BookDetail";
import ReadingList from "./pages/ReadingList";
import "./App.css";

function App() {
  const [selectedRanking, setSelectedRanking] = useState(null);

  const handleRankingSelect = (rankingId) => {
    setSelectedRanking(rankingId);
  };

  return (
    <Router>
      <Navbar onRankingSelect={handleRankingSelect} />
      <Routes>
        <Route
          path="/"
          element={<SearchPage selectedRanking={selectedRanking} />}
        />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/reading-list" element={<ReadingList />} />
      </Routes>
    </Router>
  );
}

export default App;
