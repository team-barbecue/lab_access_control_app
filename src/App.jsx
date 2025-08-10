import { useState, useEffect } from "react";
import RoomLayout from "./components/RoomLayout";
import AttendanceLog from "./components/AttendanceLog";
import Header from "./components/Header";
import CommentModal from "./components/CommentModal"; // モーダルをインポート
import "./App.css";

export default function App() {
  const API_URL = 'http://localhost:3001';
  const [desks, setDesks] = useState([]);
  const [logs, setLogs] = useState([]);

  // --- モーダル用のStateを追加 ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [comment, setComment] = useState("");
  // ---------------------------------

  useEffect(() => {
    fetch(`${API_URL}/api/users`)
      .then((res) => res.json())
      .then((data) => {
        const deskData = data.map((u, i) => ({
          id: i + 1,
          user: u.userName,
          occupied: u.isInRoom,
          userID: u.userID,
        }));
        setDesks(deskData);
      });

    fetch(`${API_URL}/api/logs`)
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
      });
  }, []);

  // 机クリック時の処理：モーダルを開く
  const handleDeskClick = (id) => {
    const desk = desks.find((d) => d.id === id);
    if (desk) {
      setSelectedDesk(desk);
      setIsModalOpen(true);
    }
  };

  // モーダルを閉じる処理
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDesk(null);
    setComment(""); // コメントをリセット
  };

  // フォーム送信時の処理：APIリクエスト
  const handleSubmitAttendance = async () => {
    if (!selectedDesk) return;

    const url = `${API_URL}/api/users/${selectedDesk.userID}/${selectedDesk.occupied ? "exit" : "enter"}`;
    
    // APIに送信するデータ
    const body = {
      userName: selectedDesk.user,
      comment: comment || null, // コメントが空ならnullを送信
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await res.json();

    if (result.success) {
      // 座席の状態を更新
      setDesks((prev) =>
        prev.map((d) =>
          d.id === selectedDesk.id ? { ...d, occupied: !d.occupied } : d
        )
      );

      // 新しいログオブジェクトを作成
      const newLog = {
        userID: selectedDesk.userID,
        userName: selectedDesk.user,
        action: selectedDesk.occupied ? "exit" : "enter",
        timestamp: result.user.lastUpdate,
        comment: comment || null,
      };
      
      setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
    } else {
      // alert(result.error || "エラーが発生しました");
    }
    
    handleCloseModal(); // 処理完了後にモーダルを閉じる
  };

  const showFullLog = () => {
    // alert("詳細ログページに移動します...");
  };

  const currentCount = desks.filter((d) => d.occupied).length;
  const maxCount = desks.length;

  return (
    <div className="app">
      <Header currentCount={currentCount} maxCount={maxCount} />
      <div className="container">
        {/* toggleAttendanceをhandleDeskClickに変更 */}
        <RoomLayout desks={desks} onToggle={handleDeskClick} />
        <div className="controls">
          <AttendanceLog logs={logs} onShowFullLog={showFullLog} />
        </div>
      </div>

      {/* モーダルコンポーネントをレンダリング */}
      {selectedDesk && (
        <CommentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitAttendance}
          comment={comment}
          setComment={setComment}
          desk={selectedDesk}
        />
      )}
    </div>
  );
}
