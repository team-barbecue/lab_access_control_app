import "./AttendanceLog.css";

export default function AttendanceLog({ logs, onShowFullLog }) {
  return (
    <div className="control-panel">
      <h3>出席ログ</h3>
      <div className="log-section">
        {logs.map((log, index) => (
          <div key={index} className="log-entry">
            <div>
              <span
                className={`status-indicator ${
                  log.type === "in" ? "status-in" : "status-out"
                }`}
              ></span>
              {log.text}
            </div>
            <div className="log-time">{log.time}</div>
          </div>
        ))}
      </div>
      <button
        className="btn btn-primary"
        style={{ marginTop: "1rem" }}
        onClick={onShowFullLog}
      >
        詳細ログを表示
      </button>
    </div>
  );
}
