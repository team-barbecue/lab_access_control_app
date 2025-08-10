import { useState, useEffect } from "react";
import RoomLayout from "./components/RoomLayout";
import AttendanceLog from "./components/AttendanceLog";
import Header from "./components/Header";
import "./App.css";

export default function App() {
  const API_URL = 'http://localhost:3001';
  const [desks, setDesks] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // ユーザー情報を取得して座席の状態をセット
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

    // ログ情報を取得してそのままセット
    fetch(`${API_URL}/api/logs`)
      .then((res) => res.json())
      .then((data) => {
        setLogs(data); // APIからのデータを直接stateに保存
      });
  }, []);

  const toggleAttendance = async (id) => {
    const desk = desks.find((d) => d.id === id);
    if (!desk) return;

    const url = `${API_URL}/api/users/${desk.userID}/${desk.occupied ? "exit" : "enter"}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: desk.user }),
    });
    const result = await res.json();

    if (result.success) {
      // 座席の占有状態を更新
      setDesks((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, occupied: !d.occupied } : d
        )
      );

      // 新しいログオブジェクトをAPIの形式で作成
      const newLog = {
        userID: desk.userID,
        userName: desk.user,
        action: desk.occupied ? "exit" : "enter",
        timestamp: result.user.lastUpdate, // APIからのタイムスタンプを使用
        comment: null, // クリックによる入退室にはコメントは無いためnull
      };
      
      // ログリストの先頭に新しいログを追加
      setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
    } else {
      // alert(result.error || "エラーが発生しました");
    }
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
        <RoomLayout desks={desks} onToggle={toggleAttendance} />
        <div className="controls">
          <AttendanceLog logs={logs} onShowFullLog={showFullLog} />
        </div>
      </div>
    </div>
  );
}
