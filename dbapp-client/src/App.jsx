import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchPage from "./pages/SearchPage";
import BookDetail from "./pages/BookDetail";
import ReadingList from "./pages/ReadingList";
import Login from "./pages/Login";
import "./App.css";

function App() {
  const [selectedRanking, setSelectedRanking] = useState(null);
  const [user, setUser] = useState(null);

  const handleRankingSelect = (rankingId) => {
    setSelectedRanking(rankingId);
  };

  const handleLogin = async (userData) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.student);
        // 新規登録の場合はメッセージを表示
        if (data.message) {
          alert(data.message);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("エラー:", error);
      return false;
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  // ログイン必須のルートを保護するためのコンポーネント
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // App.jsx
  return (
    <Router>
      <Navbar
        user={user}
        onLogout={handleLogout}
        onRankingSelect={handleRankingSelect}
      />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SearchPage selectedRanking={selectedRanking} user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:id"
          element={
            <ProtectedRoute>
              <BookDetail user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reading-list"
          element={
            <ProtectedRoute>
              <ReadingList user={user} />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
