import { useNavigate } from "react-router-dom";
import Table from "../../table/Table";
import TableCol from "../../table/TableCol";
import TableRow from "../../table/TableRow";
import { dataPayCol } from "../../../data/data";
import "../Payout.scss";
import Loader from "../../../Utils/Loader/Loader";
import DataNotAvailable from "../../../Components/DataNotFound/DataNotAvailable";
import { formatDate } from "../../../Auth/schema";

function Payouts({
  currentTableData,
  loading,
  currentPage,
  getSerialNumber,
  handleUpdatePay,
}) {
  const navigate = useNavigate();
  const handlePayoutReport = (userId) => {
    navigate(`/payouts/${userId}`, {
      state: {
        userId,
        path: window.location.pathname,
      },
      replace: true,
    });
    sessionStorage.setItem("payoutCurrentPage", currentPage);
  };
  if (currentTableData?.length === 0) {
    // Display a message when there is no data
    return loading ? <Loader startLoading={loading} /> : <DataNotAvailable />;
  }
  return (
    <div className="payoutsSection">
      <Table>
        <TableCol>
          {dataPayCol?.map((ele) => (
            <th>{ele}</th>
          ))}
        </TableCol>
        <TableRow>
          {currentTableData?.map((ele, ind) => (
            <tr>
              <td>{getSerialNumber(currentPage, ind)}</td>
              <td>{ele?.employeeCode}</td>
              <td>
                <button
                  onClick={() => handlePayoutReport(ele?.userId)}
                  className="payoutTableName"
                  type="button"
                >
                  {`${ele?.employeeName} ${ele?.employeeLastName}`}
                </button>
              </td>
              <td>{ele?.mobile || "---"}</td>
              <td>{ele?.processName || "---"}</td>
              <td>{ele?.typeName || "---"}</td>
              <td>{ele?.total_kilometers || "---"}</td>
              <td>{ele?.latest_rate_per_km || "---"}</td>
              <td>{ele?.total_payment || "---"}</td>
              <td>{ele?.total_paid_payment || "---"}</td>
              <td>{ele?.remaining_payment || "---"}</td>
              <td>{ele?.max_paydate ? formatDate(ele?.max_paydate) : "---"}</td>
              <td>
                <button
                  type="button"
                  onClick={() => {
                    handleUpdatePay(ele?.userId);
                  }}
                  className="editButton"
                >
                  UPDATE PAY
                </button>
              </td>
            </tr>
          ))}
        </TableRow>
      </Table>
    </div>
  );
}
export default Payouts;
