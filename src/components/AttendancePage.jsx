import AttendanceForm from "./AttendanceForm";
import "./AttendancePage.css";

export default function AttendancePage({ API_URL, pageType = 'enter' }) {
  const handleAttendanceUpdate = () => {
    // 入退室が更新された時の処理（必要に応じて実装）
    console.log(`${pageType}記録が更新されました`);
  };

  return (
    <div className="attendance-page">
      <div className="page-container">
        <div className="main-content">
          <AttendanceForm 
            API_URL={API_URL} 
            onAttendanceUpdate={handleAttendanceUpdate}
            pageType={pageType}
          />
        </div>
      </div>
    </div>
  );
}
