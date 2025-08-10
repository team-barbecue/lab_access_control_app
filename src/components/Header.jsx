import "./Header.css";

export default function Header({ currentCount, maxCount }) {
  return (
    <header className="header">
      <h1>研究室管理システム - Lab A</h1>
      <div className="current-users">
        <span>出席者数</span>
        <div className="user-count">
          <span>{currentCount}</span> / {maxCount} 人
        </div>
      </div>
    </header>
  );
}