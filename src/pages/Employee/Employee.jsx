import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Employee.scss";
import SearchIcon from "../../assets/img/searchIcon.png";
import AddIcon from "../../assets/img/addIcon.png";
// eslint-disable-next-line import/no-unresolved
import EmployeeTable from "./EmployeeList/EmployeeTable";
import Pagination from "../../Pagination/Pagination";
import useDebounce from "../../Components/useDebounce";
import { usePagination } from "../../Pagination/usePagination";
import GetApi from "../../services/GetApi";
import DropDown from "../Attendance/DropDown";
import PostApi from "../../services/PostApi";
import { ToastSuccess } from "../../Utils/Toast/ToastMsg";

const pageLimit = 10;

export default function EmployeeHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(
    Number(sessionStorage.getItem("employeeCurrentPage")) || 1,
  );
  const [noRowsData, setNoRowsData] = useState([]);
  const [totalItems, setTotalItems] = useState(null);
  const [search, setSearch] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [loading, setLoading] = useState(false);
  const debouncedValue = useDebounce(search, 700, setCurrentPage);
  const [checkboxData, setCheckboxData] = useState([]);
  const [typeData, setTypeData] = useState([]);

  const queryParams = new URLSearchParams(location.search);
  const typeParam = queryParams.get("type");

  const { getSerialNumber } = usePagination({
    totalItems,
    pageSize: pageLimit,
    siblingCount: 1,
    currentPage,
  });
  async function getListData() {
    try {
      const params = {
        page: currentPage,
        limit: pageLimit,
      };

      if (debouncedValue?.length > 0) {
        params.search = debouncedValue;
      }
      if (selectValue?.length > 0) {
        if (selectValue !== "All") {
          params.typeId = selectValue;
        }
      }
      setLoading(true);
      // Make an API request here
      const response = await GetApi(`emp/employee-list`, params);
      if (response?.status === 200) {
        setLoading(false);
        setNoRowsData(response?.data?.data || []); // Update the data state with the API response
        setTotalItems(response?.data?.totalItems);
        sessionStorage.removeItem("employeeCurrentPage");
      }
    } catch (error) {
      console.error("Error fetching data on Employee List:", error);
      setLoading(false);
    }
  }

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
  };
  const handleBulkDelete = async () => {
    try {
      const res = await PostApi("emp/bulk-update-status", {
        userId: checkboxData,
      });
      if (res?.status) {
        ToastSuccess(res?.message);
        setCheckboxData([]);
        getListData();
      }
    } catch (error) {
      console.lor("error", error);
    }
  };

  const handleCheckbox = (item) => {
    if (checkboxData?.includes(item?.User?.userId)) {
      setCheckboxData((prevData) =>
        prevData?.filter((ele) => ele !== item?.User?.userId),
      );
    } else {
      setCheckboxData((prev) => [...prev, item?.User?.userId]);
    }
  };

  const handleActiveUser = async (activeUser) => {
    try {
      const res = await GetApi(`emp/active-employee/${activeUser}`);
      if (res?.status === 200) {
        ToastSuccess(res?.success);
        setCheckboxData([]);
        getListData();
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleSelect = (e) => {
    const { value } = e.target;
    setSelectValue(value);
    setCurrentPage(1);
    setCheckboxData([]);
  };

  useEffect(() => {
    (async () => {
      try {
        const typeRes = await GetApi(`auth/get-types`);

        if (typeRes?.status === 200) {
          if (typeParam?.length > 0) {
            const findType = typeRes?.data?.find(
              (ele) => ele?.typeName === typeParam,
            )?.typeId;
            setSelectValue(findType);
          }
          const typeFinalData = typeRes?.data?.map((ele) => ({
            value: ele?.typeId,
            label: ele?.typeName,
          }));
          setTypeData(typeFinalData);
        }
      } catch (error) {
        console.log("error", error);
      }
    })();
  }, []);

  useEffect(() => {
    getListData();
  }, [currentPage, selectValue, debouncedValue]);

  return (
    <div className="employeeSection ">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="employeeHeader">
              <div className="employeeheading">
                <h2>Employees</h2>
              </div>
              <div className="addEmployeeBtn">
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/employees/create`, {
                      state: {
                        editEmp: false,
                      },
                      replace: true,
                    })
                  }
                >
                  <img src={AddIcon} alt="" />
                  <span className="addEmployeeText">Add Employee</span>
                </button>
              </div>
            </div>
            <div className="employeeSearchSec employeeHeaderChange">
              <div className="dropdown">
                <DropDown
                  label="Type"
                  options={typeData}
                  handleSelect={handleSelect}
                  selectValue={selectValue}
                />
              </div>
              <div className="searchInputSec employeeHeaderSearch">
                <input
                  value={search}
                  onChange={(e) => {
                    handleSearch(e);
                  }}
                  placeholder="Search..."
                />
                <img src={SearchIcon} alt="" />
              </div>
              {checkboxData?.length > 0 && (
                <div className="deactiveBtnSec">
                  <button
                    onClick={handleBulkDelete}
                    type="button"
                    className="deactivateBtn"
                  >
                    Deactivate <span>({checkboxData?.length})</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="employeTable">
              <EmployeeTable
                handleActiveUser={handleActiveUser}
                checkboxData={checkboxData}
                loading={loading}
                currentPage={currentPage}
                getSerialNumber={getSerialNumber}
                currentTableData={noRowsData}
                handleCheckbox={handleCheckbox}
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
              onPageChange={(page) => {
                setCurrentPage(page);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
