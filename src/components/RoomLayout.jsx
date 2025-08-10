import "./RoomLayout.css";

export default function RoomLayout({ desks, onToggle }) {
  // レイアウトに合わせて机の配列を分割
  const leftDesks = desks.slice(0, 3);         // 左の3席
  const topCenterDesks = desks.slice(3, 5);      // 中央上の2席
  const bottomCenterDesks = desks.slice(5, 9);   // 中央下の4席

  // 机をレンダリングするコンポーネント
  const Desk = ({ desk }) => (
    <div
      className={`desk ${desk.occupied ? "occupied" : "available"}`}
      onClick={() => onToggle(desk.id)}
    >
      <div className="desk-number">机 {desk.id}</div>
      <div className="desk-user">{desk.user}</div>
    </div>
  );

  return (
    <div className="room-layout">
      <h2 className="room-title">部屋のレイアウト</h2>
      <div className="room-grid">
        {/* 左の机グループ */}
        <div className="desk-group-left">
          {leftDesks.map((desk) => <Desk key={desk.id} desk={desk} />)}
        </div>

        {/* 中央上の机グループ */}
        <div className="desk-group-top-center">
          {topCenterDesks.map((desk) => <Desk key={desk.id} desk={desk} />)}
        </div>

        {/* 中央下の机グループ */}
        <div className="desk-group-bottom-center">
          {bottomCenterDesks.map((desk) => <Desk key={desk.id} desk={desk} />)}
        </div>

        {/* 静的な家具 */}
        <div className="static-item sofa-1">ソファ</div>
        <div className="static-item table-1">テーブル</div>
        <div className="static-item sofa-2">ソファ</div>
        <div className="static-item monitor-1">モニター</div>
        <div className="static-item door-1">ドア</div>
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