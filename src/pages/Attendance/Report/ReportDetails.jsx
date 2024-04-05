import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import Select from "../../../Components/SelectComponent/Select";
import "./ReportDetails.scss";
// import DownloadBtn from "../../../Components/DownloadBtn";
import "../../../Pagination/pagination.scss";
import { dataAttenceDetail, dataPayoutDetail } from "../../../data/data";
import Pagination from "../../../Pagination/Pagination";
import EmployeeAttendanceReportTable from "./EmployeeAttendanceReportTable";
import EmployeePayoutReportTable from "./EmployeePayoutReportTable";
import Date from "../../DatePicker/Date";

export default function AttendanceHeader(props) {
  const {
    // userId,
    startDate,
    pageLimit,
    loading,
    endDate,
    setStartDate,
    setEndDate,
    identifier,
    tableData,
    totalItems,
    currentPage,
    setCurrentPage,
    handleClearAll,
  } = props;
  return (
    <div className="attendanceSearchSec">
      <div className="attendanceSearchBar">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="attendanceSearchContent">
                <div className="attendanceFilter">
                  <div className="dropdown labelDropdown">
                    <label htmlFor="">Download report</label>
                    <div className="d-flex gap-3 startDateSec">
                      <Date>
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          dateFormat="dd-MM-yyyy"
                          onKeyDown={(e) => {
                            if (e.key !== "Enter") {
                              e.preventDefault();
                            }
                          }}
                          placeholderText="Start-Date"
                        />
                      </Date>
                      <Date>
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          dateFormat="dd-MM-yyyy"
                          onKeyDown={(e) => {
                            if (e.key !== "Enter") {
                              e.preventDefault();
                            }
                          }}
                          placeholderText="End-Date"
                        />
                      </Date>
                      <div className="clearAllInactive">
                        <button
                          disabled={!startDate || !endDate}
                          onClick={() => {
                            handleClearAll();
                          }}
                          className={`${
                            !startDate || !endDate ? "inActiveBtn" : "ActiveBtn"
                          }`}
                          type="button"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="employeeAttendanceReportBtn">
                  <DownloadBtn
                    userId={userId}
                    identifier={identifier}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </div> */}
              </div>
            </div>
          </div>
          {identifier === "Attendance" ? (
            <EmployeeAttendanceReportTable
              loading={loading}
              dataCol={dataAttenceDetail}
              dataRow={tableData}
              totalItems={totalItems}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageLimit={pageLimit}
            />
          ) : (
            <EmployeePayoutReportTable
              loading={loading}
              dataCol={dataPayoutDetail}
              dataRow={tableData}
              totalItems={totalItems}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageLimit={pageLimit}
            />
          )}
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={totalItems || 0}
            pageSize={pageLimit}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}
