import { useState, useEffect } from "react";
import { setCookie, getCookie, USER_ID_COOKIE } from "../utils/cookies";
import "./AttendanceForm.css";

export default function AttendanceForm({ API_URL, onAttendanceUpdate, pageType = "enter" }) {
  const [formData, setFormData] = useState({
    userID: "",
    comment: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isLoadingUsername, setIsLoadingUsername] = useState(false);

  // ページ読み込み時にクッキーからユーザーIDを復元
  useEffect(() => {
    const savedUserID = getCookie(USER_ID_COOKIE);
    if (savedUserID) {
      setFormData(prev => ({ ...prev, userID: savedUserID }));
    }
  }, []);

  // ユーザーIDが変更されたときにユーザー名を取得
  useEffect(() => {
    if (formData.userID.trim()) {
      fetchUsername(formData.userID);
    } else {
      setUsername("");
    }
  }, [formData.userID]);

  // ユーザー名を取得する関数
  const fetchUsername = async (userID) => {
    setIsLoadingUsername(true);
    try {
      const response = await fetch(`${API_URL}/api/users`);
      const users = await response.json();
      const user = users.find(u => u.userID === userID);
      if (user) {
        setUsername(user.userName);
      } else {
        setUsername("");
      }
    } catch (error) {
      console.error("ユーザー名の取得に失敗しました:", error);
      setUsername("");
    } finally {
      setIsLoadingUsername(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const action = pageType; // pageTypeに基づいてアクションを決定
      const url = `${API_URL}/api/users/${formData.userID}/${action}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userID: formData.userID,
          comment: formData.comment
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 成功時にユーザーIDをクッキーに保存
        setCookie(USER_ID_COOKIE, formData.userID, 30);
        
        const actionText = pageType === "enter" ? "入室" : "退室";
        setMessage(`ユーザーID: ${formData.userID}の${actionText}が正常に記録されました`);
        setFormData({
          userID: "",
          comment: ""
        });
        setUsername("");
        
        // 親コンポーネントに更新を通知
        if (onAttendanceUpdate) {
          onAttendanceUpdate();
        }
      } else {
        setMessage(`エラー: ${result.error || "入退室の記録に失敗しました"}`);
      }
    } catch (error) {
      setMessage(`エラー: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // ユーザーIDが変更されたらクッキーに保存
    if (name === 'userID') {
      setCookie(USER_ID_COOKIE, value, 30);
    }
  };

  return (
    <div className="attendance-form">
      <h2>{pageType === 'enter' ? "入室記録" : "退室記録"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userID">ユーザーID:</label>
          <input
            type="text"
            id="userID"
            name="userID"
            value={formData.userID}
            onChange={handleInputChange}
            required
            placeholder="ユーザーIDを入力してください"
            autoComplete="off"
          />
          {username && (
            <div className="username-display">
              <span className="username-label">ユーザー名:</span>
              <span className="username-value">{username}</span>
            </div>
          )}
          {isLoadingUsername && (
            <div className="username-loading">ユーザー名を取得中...</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="comment">コメント (任意):</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="コメントがあれば入力してください"
            rows="3"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="submit-btn"
        >
          {isSubmitting ? "送信中..." : `${pageType === "enter" ? "入室" : "退室"}記録`}
        </button>
      </form>

      {message && (
        <div className={`message ${message.includes("エラー") ? "error" : "success"}`}>
          {message}
        </div>
      )}
    </div>
  );
}
