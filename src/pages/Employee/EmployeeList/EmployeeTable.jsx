import { useNavigate } from "react-router-dom";
import { dataEmpCol } from "../../../data/data";
import Table from "../../table/Table";
import TableCol from "../../table/TableCol";
import TableRow from "../../table/TableRow";
import "./EmployeeTable.scss";
import DataNotAvailable from "../../../Components/DataNotFound/DataNotAvailable";
import IsImage from "../IsImage";
import Loader from "../../../Utils/Loader/Loader";

export default function EmployeeTable({
  handleActiveUser,
  checkboxData,
  loading,
  currentPage,
  getSerialNumber,
  currentTableData,
  handleCheckbox,
}) {
  const navigate = useNavigate();
  const handleViewEdit = (UserId) => {
    navigate(`/employees/${UserId}`, {
      state: {
        editEmp: true,
      },
      replace: true,
    });
    sessionStorage.setItem("employeeCurrentPage", currentPage);
  };
  if (currentTableData?.length === 0) {
    // Display a message when there is no data
    return loading ? <Loader startLoading={loading} /> : <DataNotAvailable />;
  }
  return (
    <Table>
      <TableCol>
        {dataEmpCol?.map((ele, ind) =>
          ind === 5 ? <th className="emailSpecific">{ele}</th> : <th>{ele}</th>,
        )}
      </TableCol>
      <TableRow>
        {currentTableData?.map((ele, ind) => (
          <tr>
            <td>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={checkboxData?.includes(ele?.User?.userId)}
                  onClick={() => handleCheckbox(ele)}
                  id="flexCheckDefault"
                  style={{
                    visibility: ele?.User?.status ? "visible" : "hidden",
                  }}
                />

                <label className="form-check-label" htmlFor="flexCheckDefault">
                  {getSerialNumber(currentPage, ind)}
                </label>
              </div>
            </td>
            <td>{ele?.employeeCode}</td>
            <td>
              <IsImage Url={ele?.profileImage} />
            </td>
            <td>
              {/* eslint-disable no-nested-ternary */}
              {ele?.User?.lastLogin === null ? (
                "New"
              ) : ele?.User?.status ? (
                "Active"
              ) : (
                <div>
                  <p>Deactive</p>
                  <button
                    onClick={() => handleActiveUser(ele?.User?.userId)}
                    type="button"
                    className="activeButton"
                  >
                    Active
                  </button>
                </div>
              )}
              {/* eslint-disable no-nested-ternary */}
            </td>
            <td className="fullName">{`${ele?.employeeName} ${ele?.employeeLastName}`}</td>
            <td>{ele?.User.email}</td>
            <td>{ele?.Vertical.verticalName || "---"}</td>
            <td>{ele?.Process.processName || "---"}</td>
            <td>{ele?.Type.typeName || "---"}</td>
            <td>{ele?.aadharCardNumber || "---"}</td>
            <td>{ele?.User.mobile || "---"}</td>
            <td>{ele?.Station.stationName || "---"}</td>
            <td>{ele?.PayOuts.perKMRate || "---"}</td>
            <td>{ele?.EmployeeBank.accountNumber || "---"}</td>
            <td>
              <button
                type="button"
                onClick={() => handleViewEdit(ele?.User?.userId)}
                className="editButton"
              >
                View/Edit
              </button>
            </td>
          </tr>
        ))}
      </TableRow>
    </Table>
  );
}
