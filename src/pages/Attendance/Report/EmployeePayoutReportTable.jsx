import { formatDate } from "../../../Auth/schema";
import DataNotAvailable from "../../../Components/DataNotFound/DataNotAvailable";
import { usePagination } from "../../../Pagination/usePagination";
import Loader from "../../../Utils/Loader/Loader";
import Table from "../../table/Table";
import TableCol from "../../table/TableCol";
import TableRow from "../../table/TableRow";

function EmployeePayoutReportTable({
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
            <td>{ele?.total_kilometers || "---"}</td>
            <td>{ele?.latest_rate_per_km || "---"}</td>
            <td>{ele?.total_payment}</td>
            <td>
              {ele?.total_payment === 0
                ? "---"
                : `${ele?.isPaid ? "Paid" : "Unpaid"}`}
            </td>
          </tr>
        ))}
      </TableRow>
    </Table>
  );
}

export default EmployeePayoutReportTable;
