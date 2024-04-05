import { NavLink } from "react-router-dom";
import "./Report.scss";
// import ReportImg from "../assets/img/ReportImg.png";
import BackArrow from "../../../assets/img/backArrow.png";
import ReportDetails from "./ReportDetails";
import Loader from "../../../Utils/Loader/Loader";
// import IsImage from "../../Employee/IsImage";
import DataNotAvailable from "../../../Components/DataNotFound/DataNotAvailable";
// import ReportSearch from "./ReportSearchSection/ReportSearch";
import DefaultImage from "../../../assets/img/EmployeImg.png";

export default function ReportHeader({
  identifier,
  state,
  loading,
  header,
  tableData,
  pageLimit,
  empData,
  totalItems,
  currentPage,
  setCurrentPage,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  handleClearAll,
}) {
  if (loading) {
    return <Loader startLoading={loading} />;
  }
  return (
    <div className="addEmployeeSection">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="addEmployeeHeader">
              <div className="d-flex align-items-center">
                <NavLink to={`${state?.path}`}>
                  <img src={BackArrow} alt="" />
                </NavLink>

                <h2>{header}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="reportHeaderSection mt-5">
        <div className="container">
          <div className="row">
            <div className="col-xl-10 col-md-12 mx-auto">
              {empData ? (
                <div className="reportHead">
                  <div className="headContent">
                    <div className="printImageDiv">
                      <img
                        className={`${
                          empData?.profileImage === null ? "p-4" : "detailImg"
                        }`}
                        src={
                          empData?.profileImage === null
                            ? DefaultImage
                            : empData?.profileImage
                        }
                        alt="Default"
                      />
                    </div>
                  </div>
                  <div className="headContent">
                    <div>
                      <h6>Full Name</h6>
                      <h5>{`${empData?.employeeName} ${empData?.employeeLastName}`}</h5>
                    </div>
                    <div>
                      <h6>Vertical</h6>
                      <h5>{empData?.Vertical?.verticalName}</h5>
                    </div>
                  </div>
                  <div className="headContent">
                    <div>
                      <h6>Ph. Number</h6>
                      <h5>{`+91 ${empData?.User?.mobile}`}</h5>
                    </div>
                    <div>
                      <h6>Process</h6>
                      <h5>{empData?.Process?.processName || "N/A"}</h5>
                    </div>
                  </div>
                  <div className="headContent">
                    <div>
                      <h6>Emp. Code</h6>
                      <h5>{empData?.employeeCode}</h5>
                    </div>
                    <div>
                      <h6>Type</h6>
                      <h5>{empData?.Type?.typeName}</h5>
                    </div>
                  </div>
                  <div className="headContent">
                    <div>
                      <h6>Station</h6>
                      <h5>{empData?.Station?.stationName}</h5>
                    </div>
                  </div>
                </div>
              ) : (
                <DataNotAvailable />
              )}
            </div>
          </div>
        </div>
        <ReportDetails
          userId={state.userId}
          pageLimit={pageLimit}
          identifier={identifier}
          loading={loading}
          tableData={tableData}
          empData={empData}
          totalItems={totalItems}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          handleClearAll={handleClearAll}
        />
      </div>
    </div>
  );
}
