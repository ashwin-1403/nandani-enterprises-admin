import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "../../assets/img/addIcon.png";
import Pagination from "../../Pagination/Pagination";
import "../Employee/Employee";
import StationTable from "./StationList/StationTable";
import "../../Pagination/pagination.scss";
import GetApi from "../../services/GetApi";
import useDebounce from "../../Components/useDebounce";
import { usePagination } from "../../Pagination/usePagination";
import SearchIcon from "../../assets/img/searchIcon.png";

const pageLimit = 10;
function StationHeader() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(
    Number(sessionStorage.getItem("stationCurrentPage")) || 1,
  );
  const [noRowsData, setNoRowsData] = useState(null);
  const [totalItems, setTotalItems] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const debouncedValue = useDebounce(search, 700, setCurrentPage);

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
        setCurrentPage(1);
      }
      setLoading(true);
      // Make an API request here
      const response = await GetApi(`auth/all-station`, params);
      if (response?.status === 200) {
        setLoading(false);
        setNoRowsData(response?.data?.data); // Update the data state with the API response
        setTotalItems(response?.data?.totalItems);
        sessionStorage.removeItem("stationCurrentPage");
      }
    } catch (error) {
      console.error("Error fetching data on station List:", error);
      setLoading(false);
    }
  }

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  useEffect(() => {
    getListData();
  }, [currentPage, debouncedValue]);

  return (
    <div className="employeeSection">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="employeeHeader">
              <div className="employeeheading">
                <h2>Stations</h2>
              </div>
              <div className="addEmployeeBtn">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/stations/create", {
                      state: {
                        path: window.location.pathname,
                      },
                      replace: true,
                    })
                  }
                >
                  <img src={AddIcon} alt="" />
                  <span className="addEmployeeText">Add Station</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="searchInputSec">
          <input
            onChange={handleSearch}
            type="text"
            name="search"
            value={search}
            placeholder="Search..."
          />
          <img src={SearchIcon} alt="" />
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="employeTable">
              <StationTable
                loading={loading}
                currentPage={currentPage}
                getSerialNumber={getSerialNumber}
                currentTableData={noRowsData || []}
                searchValue={search}
                handleSearch={handleSearch}
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

export default StationHeader;
