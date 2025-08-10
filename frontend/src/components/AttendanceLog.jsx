import "./AttendanceLog.css";

export default function AttendanceLog({ logs, onShowFullLog }) {
  // ISO形式のタイムスタンプを "HH:mm" 形式にフォーマットする関数
  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Tokyo",
    });
  };

  return (
    <div className="attendance-log-widget">
      <h2 className="log-title">入退室ログ</h2>
      <ul className="log-list">
        {logs.map((log, index) => (
          <li key={index} className={`log-item log-${log.action}`}>
            <div className="log-main-info">
              <span className="log-time">{formatTime(log.timestamp)}</span>
              <span className="log-user">{log.userName}</span>
              <span className="log-action">
                {log.action === "enter" ? "が入室" : "が退室"}
              </span>
            </div>
            {/* コメントが存在する場合のみ、コメント欄を表示 */}
            {log.comment && (
              <div className="log-comment">
                <span className="comment-icon">📝</span>
                {log.comment}
              </div>
            )}
          </li>
        ))}
      </ul>
      <button className="full-log-button" onClick={onShowFullLog}>
        全てのログを表示
      </button>
    </div>
  );
}
