import "./Header.css";

export default function Header({ currentCount, maxCount, onPageChange, currentPage }) {
  return (
    <header className="header">
      <h1>研究室管理システム - Lab A</h1>
      <div className="current-users">
        <span>出席者数</span>
        <div className="user-count">
          <span>{currentCount}</span> / {maxCount} 人
        </div>
      </div>
      <nav className="navigation">
        <button 
          className={`nav-btn ${currentPage === 'room' ? 'active' : ''}`}
          onClick={() => onPageChange('room')}
        >
          部屋
        </button>
        <button 
          className={`nav-btn ${currentPage === 'enter' ? 'active' : ''}`}
          onClick={() => onPageChange('enter')}
        >
          入室
        </button>
        <button 
          className={`nav-btn ${currentPage === 'exit' ? 'active' : ''}`}
          onClick={() => onPageChange('exit')}
        >
          退室
        </button>
      </nav>
    </header>
  );
}