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
        const logData = data.map((log) => ({
          text: `${log.userName}が${log.action === "enter" ? "出席" : "欠席に変更"}`,
          type: log.action === "enter" ? "in" : "out",
          time: new Date(log.timestamp).toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setLogs(logData);
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
      setDesks((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, occupied: !d.occupied } : d
        )
      );

      const now = new Date(result.user.lastUpdate).toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setLogs((prev) => [
        {
          text: `${desk.user}が${desk.occupied ? "欠席に変更" : "出席"}`,
          type: desk.occupied ? "out" : "in",
          time: now,
        },
        ...prev.slice(0, 9),
      ]);
    } else {
      alert(result.error || "エラーが発生しました");
    }
  };

  const showFullLog = () => {
    alert("詳細ログページに移動します...");
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
