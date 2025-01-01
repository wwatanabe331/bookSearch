import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const loginData = {
      学生証番号: event.target.elements.studentId.value,
      学生氏名: event.target.elements.studentName.value,
    };

    try {
      const success = await onLogin(loginData);
      if (success) {
        navigate("/");
      } else {
        alert("ログインに失敗しました");
      }
    } catch (error) {
      console.error("エラー:", error);
      alert("エラーが発生しました");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>ログイン</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentId">学生証番号</label>
            <input id="studentId" name="studentId" type="text" required />
          </div>
          <div className="form-group">
            <label htmlFor="studentName">学生氏名</label>
            <input id="studentName" name="studentName" type="text" required />
          </div>
          <div className="form-group">
            <button type="submit">ログイン</button>
          </div>
        </form>
      </div>
    </div>
  );
}
