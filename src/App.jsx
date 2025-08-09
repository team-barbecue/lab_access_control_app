import { useState } from "react";
import RoomLayout from "./components/RoomLayout";
import AttendanceLog from "./components/AttendanceLog";
import Header from "./components/Header";
import "./App.css";

export default function App() {
  const initialDesks = [
    { id: 1, user: "田中さん", occupied: false },
    { id: 2, user: "佐藤さん", occupied: true },
    { id: 3, user: "山田さん", occupied: false },
    { id: 4, user: "鈴木さん", occupied: true },
    { id: 5, user: "高橋さん", occupied: false },
    { id: 6, user: "伊藤さん", occupied: false },
    { id: 7, user: "渡辺さん", occupied: true },
    { id: 8, user: "加藤さん", occupied: false },
    { id: 9, user: "木村さん", occupied: false },
    { id: 10, user: "小林さん", occupied: false },
    { id: 11, user: "中村さん", occupied: false },
    { id: 12, user: "松本さん", occupied: false },
  ];

  const [desks, setDesks] = useState(initialDesks);
  const [logs, setLogs] = useState([
    { text: "佐藤さんが出席", type: "in", time: "14:30" },
    { text: "高橋さんが欠席に変更", type: "out", time: "14:15" },
    { text: "鈴木さんが出席", type: "in", time: "13:45" },
    { text: "渡辺さんが出席", type: "in", time: "13:20" },
    { text: "中村さんが欠席に変更", type: "out", time: "12:50" },
  ]);

  const toggleAttendance = (id) => {
    setDesks((prev) =>
      prev.map((desk) =>
        desk.id === id ? { ...desk, occupied: !desk.occupied } : desk
      )
    );

    const desk = desks.find((d) => d.id === id);
    const now = new Date().toLocaleTimeString("ja-JP", {
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
