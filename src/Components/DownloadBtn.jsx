import DownloadIcon from "../assets/img/downloadIcon.png";
import "./downloadBtn.scss";
import DownloadDetailSheet from "../pages/Attendance/Report/DownloadDetailSheet";

export default function DownloadBtn({
  endDate,
  startDate,
  identifier,
  userId,
}) {
  const handleDetailedReport = async () => {
    if (identifier === "Attendance") {
      DownloadDetailSheet("emp/AttendanceReport", userId, startDate, endDate);
    } else {
      DownloadDetailSheet("EmployeesPayOutReport", userId, startDate, endDate);
    }
  };
  return (
    <div className="downloadBtn">
      <button
        onClick={() => {
          handleDetailedReport();
        }}
        type="button"
      >
        <img src={DownloadIcon} alt="" />
        <span>Download Report</span>
      </button>
    </div>
  );
}
