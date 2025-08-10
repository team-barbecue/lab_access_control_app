import { useState, useEffect } from "react";
import RoomLayout from "./components/RoomLayout";
import AttendanceLog from "./components/AttendanceLog";
import AttendancePage from "./components/AttendancePage";
import Header from "./components/Header";
import CommentModal from "./components/CommentModal"; // モーダルをインポート
import "./App.css";

export default function App() {
  const API_URL = 'http://localhost:3001';
  const [desks, setDesks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState('room'); // 'room' or 'enter' or 'exit'

  // --- モーダル用のStateを追加 ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [comment, setComment] = useState("");
  // ---------------------------------

  useEffect(() => {
    // URLから初期ページを設定
    const path = window.location.pathname;
    if (path === '/enter') {
      setCurrentPage('enter');
    } else if (path === '/exit') {
      setCurrentPage('exit');
    } else {
      setCurrentPage('room');
    }

    // ブラウザの戻るボタンに対応
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath === '/enter') {
        setCurrentPage('enter');
      } else if (currentPath === '/exit') {
        setCurrentPage('exit');
      } else {
        setCurrentPage('room');
      }
    };

    window.addEventListener('popstate', handlePopState);

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

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // URLを更新
    if (page === 'room') {
      window.history.pushState({}, '', '/');
    } else {
      window.history.pushState({}, '', `/${page}`);
    }
  };

  const currentCount = desks.filter((d) => d.occupied).length;
  const maxCount = desks.length;

  // ページコンテンツをレンダリング
  const renderPageContent = () => {
    switch (currentPage) {
      case 'enter':
        return <AttendancePage API_URL={API_URL} pageType="enter" />;
      case 'exit':
        return <AttendancePage API_URL={API_URL} pageType="exit" />;
      default:
        return (
          <>
            <RoomLayout desks={desks} onToggle={toggleAttendance} />
            <div className="controls">
              <AttendanceLog logs={logs} onShowFullLog={showFullLog} />
            </div>
          </>
        );
    }
  };

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
