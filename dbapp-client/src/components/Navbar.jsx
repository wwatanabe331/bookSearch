import { Link, useNavigate } from "react-router-dom";
import { Home, BookMarked, Lightbulb, LogIn, LogOut } from "lucide-react";
import "../styles/Navbar.css";
import { useState } from "react";

function Navbar({ user, onLogout, onRankingSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (rankingId) => {
    onRankingSelect(rankingId);
    setIsOpen(false);
    navigate("/");
  };

  return (
    <nav>
      <Link to="/">
        <Home size={20} />
        <span>検索</span>
      </Link>
      <Link to="/reading-list">
        <BookMarked size={20} />
        <span>読みたい本リスト</span>
      </Link>
      <div className="dropdown">
        <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
          <Lightbulb size={20} />
          <span>話題から探す ▼</span>
        </button>
        {isOpen && (
          <div className="dropdown-content">
            <button onClick={() => handleSelect(1)} className="dropdown-item">
              青空文庫の名作ランキング
            </button>
            <button onClick={() => handleSelect(2)} className="dropdown-item">
              2024直木賞・芥川賞
            </button>
          </div>
        )}
      </div>
      {user ? (
        <button onClick={onLogout} className="nav-link">
          <LogOut size={20} />
          <span>ログアウト</span>
        </button>
      ) : (
        <Link to="/login" className="nav-link">
          <LogIn size={20} />
          <span>ログイン</span>
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
