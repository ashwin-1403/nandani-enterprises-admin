import { useNavigate } from "react-router-dom";
import Table from "../../table/Table";
import TableCol from "../../table/TableCol";
import TableRow from "../../table/TableRow";
import { dataAttenceCol } from "../../../data/data";
import Loader from "../../../Utils/Loader/Loader";
import DataNotAvailable from "../../../Components/DataNotFound/DataNotAvailable";
import { formatDate, formatTime } from "../../../Auth/schema";
// import GetApi from "../../services/GetApi";

function Attendence({
  currentTableData,
  loading,
  currentPage,
  getSerialNumber,
}) {
  const navigate = useNavigate();

  const handleAttendenceReport = (userId) => {
    navigate(`/attendence/${userId}`, {
      state: {
        userId,
        path: window.location.pathname,
      },
      replace: true,
    });
    sessionStorage.setItem("attendenceCurrentPage", currentPage);
  };
  if (currentTableData?.length === 0) {
    // Display a message when there is no data
    return loading ? <Loader startLoading={loading} /> : <DataNotAvailable />;
  }
  return (
    <div className="attendance-section">
      <Table>
        <TableCol>
          {dataAttenceCol?.map((ele) => (
            <th>{ele}</th>
          ))}
        </TableCol>
        <TableRow>
          {currentTableData?.map((ele, ind) => (
            <tr>
              <td>{getSerialNumber(currentPage, ind)}</td>
              <td>{ele?.createdAt ? formatDate(ele?.createdAt) : "---"}</td>
              <td>{ele?.employeeCode}</td>
              <td>
                <button
                  onClick={() => handleAttendenceReport(ele?.userId)}
                  className="payoutTableName"
                  type="button"
                >
                  {`${ele?.employeeName} ${ele?.employeeLastName}`}
                </button>
              </td>
              <td>{ele?.typeName}</td>
              <td>
                {ele?.checkIn ? (
                  <>
                    {formatTime(ele?.checkIn)}
                    <br />
                    {ele?.checkinStation || "---"}{" "}
                  </>
                ) : (
                  "---"
                )}
              </td>
              <td>
                {ele?.checkOut ? (
                  <>
                    {formatTime(ele?.checkOut)}
                    <br />
                    {ele?.autoCheckout
                      ? "(Auto)"
                      : ele?.checkoutStation || "---"}
                  </>
                ) : (
                  "---"
                )}
              </td>
              <td>{ele?.verticalName}</td>
              <td>{ele?.processName || "---"}</td>
              <td>{ele?.stationName}</td>

              <td>{ele?.gpsOffDuration || "---"}</td>
              <td>{ele?.totalDuration || "---"}</td>
            </tr>
          ))}
        </TableRow>
      </Table>
    </div>
  );
}

export default Attendence;
