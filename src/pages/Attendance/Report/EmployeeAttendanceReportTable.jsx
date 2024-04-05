import { formatDate, formatTime } from "../../../Auth/schema";
import DataNotAvailable from "../../../Components/DataNotFound/DataNotAvailable";
import { usePagination } from "../../../Pagination/usePagination";
import Loader from "../../../Utils/Loader/Loader";
import Table from "../../table/Table";
import TableCol from "../../table/TableCol";
import TableRow from "../../table/TableRow";

function EmployeeAttendanceReportTable({
  loading,
  dataCol,
  dataRow,
  totalItems,
  currentPage,
  pageLimit,
}) {
  const { getSerialNumber } = usePagination({
    totalItems,
    pageSize: pageLimit,
    siblingCount: 1,
    currentPage,
  });
  if (dataRow?.length === 0) {
    // Display a message when there is no data
    return loading ? <Loader startLoading={loading} /> : <DataNotAvailable />;
  }
  return (
    <Table className="tableWidth">
      <TableCol>
        {dataCol?.map((ele) => (
          <th>{ele}</th>
        ))}
      </TableCol>
      <TableRow>
        {dataRow?.map((ele, ind) => (
          <tr>
            <td>{getSerialNumber(currentPage, ind)}</td>
            <td>{ele?.createdAt ? formatDate(ele?.createdAt) : "---"}</td>
            <td>
              {ele?.checkIn ? (
                <>
                  {formatTime(ele?.checkIn)}
                  <br />
                  {ele?.stationName}{" "}
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
                  {ele?.autoCheckout ? "(Auto)" : ele?.stationName}
                </>
              ) : (
                "---"
              )}
            </td>
            <td>{ele?.gpsOffDuration || "---"}</td>
            <td>{ele?.totalDuration || "---"}</td>
          </tr>
        ))}
      </TableRow>
    </Table>
  );
}

export default EmployeeAttendanceReportTable;
