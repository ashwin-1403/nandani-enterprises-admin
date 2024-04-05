import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Pagination from "../../Pagination/Pagination";
import "../Employee/Employee";
import AttendenceTable from "./AttendenceList/AttendenceTable";
import "react-datepicker/dist/react-datepicker.css";
import useDebounce from "../../Components/useDebounce";
// import DownloadIcon from "../../assets/img/downloadIcon.png";
import SearchIcon from "../../assets/img/searchIcon.png";
import DropDown from "./DropDown";
import "../../Components/downloadBtn.scss";
import "./Report/ReportDetails.scss";
import "./Attendence.scss";
import Date from "../DatePicker/Date";
import GetApi from "../../services/GetApi";
import { usePagination } from "../../Pagination/usePagination";
import { ToastFailure } from "../../Utils/Toast/ToastMsg";
import {
  formatDateForFilter,
  getCurrentDate,
  getDateObject,
} from "../../Auth/schema";
// import DownloadSheet from "./Report/DownloadSheet";

const pageLimit = 10;

function AttendenceList() {
  const storedStartDate = sessionStorage.getItem("startDate");
  const storedEndDate = sessionStorage.getItem("endDate");
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    storedStartDate ? getDateObject(sessionStorage.getItem("startDate")) : null,
  );
  const [endDate, setEndDate] = useState(
    storedEndDate ? getDateObject(sessionStorage.getItem("endDate")) : null,
  );
  const [currentPage, setCurrentPage] = useState(
    Number(sessionStorage.getItem("attendenceCurrentPage")) || 1,
  );
  const [noRowsData, setNoRowsData] = useState();
  const [totalItems, setTotalItems] = useState(null);
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 700, setCurrentPage);
  const [verticalData, setVerticalData] = useState([]);
  const [processData, setProcessData] = useState([]);
  const [stationData, setStationData] = useState([]);
  const [filterObj, setFilterObj] = useState({
    vertical:
      sessionStorage.getItem("vertical") !== null
        ? sessionStorage.getItem("vertical")
        : "",
    process:
      sessionStorage.getItem("process") !== null
        ? sessionStorage.getItem("process")
        : "",
    station:
      sessionStorage.getItem("station") !== null
        ? sessionStorage.getItem("station")
        : "",
  });

  const params = {
    page: currentPage,
    limit: pageLimit,
  };
  const { getSerialNumber } = usePagination({
    totalItems,
    pageSize: pageLimit,
    siblingCount: 1,
    currentPage,
  });

  const isClearAllDisabled = () =>
    Object.values(filterObj).every((value) => value.length === 0) &&
    (!startDate || !endDate) &&
    search.length === 0;

  const handleClearAll = () => {
    setFilterObj((prev) => ({
      ...prev,
      vertical: "",
      process: "",
      station: "",
    }));
    setSearch("");
    setStartDate(null);
    setEndDate(null);
    sessionStorage.removeItem("vertical");
    sessionStorage.removeItem("process");
    sessionStorage.removeItem("station");
    sessionStorage.removeItem("startDate");
    sessionStorage.removeItem("endDate");
    sessionStorage.removeItem("attendenceCurrentPage");
    setCurrentPage(1);
  };
  const handleSelect = (e) => {
    const { name, value } = e.target;
    setFilterObj((prev) => ({ ...prev, [name]: value }));
    sessionStorage.setItem(name, value);
    setCurrentPage(1);
  };

  const handleChangeForVertical = (e) => {
    const { name, value } = e.target;
    setFilterObj((prev) => ({ ...prev, [name]: value, process: "" }));
    sessionStorage.setItem(name, value);
    sessionStorage.setItem("process", "");
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
  };
  const checkForProcess = () => {
    const operationObj = verticalData?.find(
      (ele) => ele?.label === "Operations",
    );

    return (
      filterObj?.vertical?.length > 0 &&
      operationObj?.value === filterObj?.vertical
    );
  };

  const fetchProcesData = async () => {
    if (checkForProcess()) {
      try {
        const processRes = await GetApi(
          `${process.env.REACT_APP_API}auth/get-process/${filterObj?.vertical}`,
        );
        if (processRes?.status === 200) {
          const processFinalData = processRes?.data?.map((ele) => ({
            value: ele?.processId,
            label: ele?.processName,
          }));
          setProcessData(processFinalData);
        }
      } catch (error) {
        console.log("error", error);
      }
    } else {
      setProcessData([]);
    }
  };

  const onLoadData = async () => {
    try {
      const verticalRes = await GetApi(
        `${process.env.REACT_APP_API}auth/get-verticals`,
      );
      const stationRes = await GetApi(
        `${process.env.REACT_APP_API}auth/all-station?page=1&limit=1000`,
      );
      if (verticalRes?.status === 200) {
        const verticalFinalData = verticalRes?.data?.map((ele) => ({
          value: ele?.verticalId,
          label: ele?.verticalName,
        }));
        const stationIdFinalData = stationRes?.data?.data?.map((ele) => ({
          value: ele?.stationId,
          label: ele?.stationName,
        }));
        setVerticalData(verticalFinalData);
        setStationData(stationIdFinalData);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleStartDateFilter = (date) => {
    if (formatDateForFilter(date) > getCurrentDate()) {
      ToastFailure("Start date can't be greater than today date.");
      return;
    }

    if (endDate === null) {
      setEndDate(date);
      sessionStorage.setItem("endDate", date.toISOString());
    }

    if (
      date !== null &&
      endDate !== null &&
      formatDateForFilter(date) > formatDateForFilter(endDate)
    ) {
      ToastFailure("Start date can't be greater than end date.");
      return;
    }
    setStartDate(date);
    sessionStorage.setItem("startDate", date.toISOString());
    setCurrentPage(1);
  };

  const handleEndDateFilter = (date) => {
    if (formatDateForFilter(date) > getCurrentDate()) {
      ToastFailure("End date can't be greater than today date.");
      return;
    }

    if (startDate === null) {
      setStartDate(date);
      sessionStorage.setItem("startDate", date.toISOString());
    }

    if (
      startDate !== null &&
      date !== null &&
      formatDateForFilter(startDate) > formatDateForFilter(date)
    ) {
      ToastFailure("Start date can't be greater than end date.");
      return;
    }

    setEndDate(date);
    sessionStorage.setItem("endDate", date.toISOString());
    setCurrentPage(1);
  };

  // const handleAttendenceDownloadReport = async () => {
  //   DownloadSheet(
  //     "emp/AttendanceReport",
  //     debouncedValue,
  //     filterObj.vertical,
  //     filterObj.process,
  //     filterObj.station,
  //     startDate,
  //     endDate,
  //   );
  // };

  async function getListData() {
    try {
      if (startDate && endDate) {
        params.startDate = `${formatDateForFilter(startDate)} 00:00:00`;
        params.endDate = `${formatDateForFilter(endDate)} 23:59:59`;
      }
      if (debouncedValue?.length > 0) {
        params.search = debouncedValue;
      }

      if (filterObj?.vertical?.length > 0) {
        if (filterObj?.vertical !== "All") {
          params.verticalId = filterObj?.vertical;
        }
      }
      if (filterObj?.process?.length > 0) {
        if (filterObj?.process !== "All") {
          params.processId = filterObj?.process;
        }
      }
      if (filterObj?.station?.length > 0) {
        if (filterObj?.station !== "All") {
          params.stationId = filterObj?.station;
        }
      }
      setLoading(true);
      // Make an API request here
      const response = await GetApi(`emp/attendance-list-search`, params);
      if (response?.status === 200) {
        setLoading(false);
        setNoRowsData(response?.data?.data); // Update the data state with the API response
        setTotalItems(response?.data?.totalItems);
        const shouldKeepSessionStorage =
          filterObj.vertical ||
          filterObj.process ||
          filterObj.station ||
          startDate ||
          endDate;

        if (!shouldKeepSessionStorage) {
          sessionStorage.removeItem("attendenceCurrentPage");
        }
      }
    } catch (error) {
      console.error("Error fetching data on Employee List:", error);
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchProcesData();
  }, [filterObj?.vertical]);
  useEffect(() => {
    if (checkForProcess()) {
      fetchProcesData();
    } else {
      setProcessData([]);
    }
  }, [filterObj?.vertical, verticalData]);
  useEffect(() => {
    onLoadData();
  }, []);
  useEffect(() => {
    getListData();
  }, [
    filterObj?.process,
    filterObj?.vertical,
    filterObj?.station,
    currentPage,
    debouncedValue,
    startDate,
    endDate,
  ]);

  return (
    <div className="employeeSection attendanceEmployeeSection attendanceReportSec">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="employeeHeader">
              <div className="employeeheading">
                <h2>Attendance Report</h2>
              </div>
              {/* <div className="addEmployeeBtn downloadBtn">
                <button
                  onClick={() => handleAttendenceDownloadReport()}
                  type="button"
                >
                  <img src={DownloadIcon} alt="" />
                  <span className="addEmployeeText">Download Report</span>
                </button>
              </div> */}
            </div>
            <div className="employeeSearchSec">
              <div className="searchInputSec">
                <input
                  value={search}
                  onChange={(e) => {
                    handleSearch(e);
                  }}
                  placeholder="Search..."
                />
                <img className="attendanceSearchIcon" src={SearchIcon} alt="" />
              </div>
              <DropDown
                name="vertical"
                label="Vertical"
                selectValue={filterObj?.vertical}
                options={verticalData}
                handleSelect={handleChangeForVertical}
              />
              <DropDown
                name="process"
                label="Process"
                disable={!processData?.length}
                selectValue={filterObj?.process}
                options={processData}
                handleSelect={handleSelect}
              />
              <DropDown
                name="station"
                label="Station"
                selectValue={filterObj?.station}
                options={stationData}
                handleSelect={handleSelect}
              />
              <div className="d-flex gap-3 attendanceDateHeader">
                <Date label="Start-Date">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => handleStartDateFilter(date)}
                    dateFormat="dd-MM-yyyy"
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") {
                        e.preventDefault();
                      }
                    }}
                  />
                </Date>
                <Date label="End-Date">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => handleEndDateFilter(date)}
                    dateFormat="dd-MM-yyyy"
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") {
                        e.preventDefault();
                      }
                    }}
                  />
                </Date>
              </div>
              <div
                className={`${
                  isClearAllDisabled()
                    ? "inActiveBtn clearBtn"
                    : "clearAll clearBtn"
                }`}
              >
                <button
                  disabled={isClearAllDisabled()}
                  onClick={() => {
                    handleClearAll();
                  }}
                  type="button"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="employeTable">
              <AttendenceTable
                currentTableData={noRowsData || []}
                loading={loading}
                currentPage={currentPage}
                getSerialNumber={getSerialNumber}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
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
    </div>
  );
}

export default AttendenceList;
