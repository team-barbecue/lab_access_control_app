// import "./RoomLayout.css";

export default function RoomLayout({ desks, onToggle }) {
  return (
    <div className="room-layout">
      <h2 className="room-title">部屋のレイアウト</h2>
      <div className="room-grid">
        {desks.map((desk, index) => (
          <div
            key={desk.id}
            className={`desk ${desk.occupied ? "occupied" : "available"}`}
            onClick={() => onToggle(desk.id)}
          >
            <div className="desk-number">机 {desk.id}</div>
            <div className="desk-user">{desk.user}</div>
          </div>
        ))}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color legend-available"></div>
          <span>欠席</span>
        </div>
        <div className="legend-item">
          <div className="legend-color legend-occupied"></div>
          <span>出席</span>
        </div>
      </div>
    </div>
  );
}
