import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Report from "../../Attendance/Report/Report";
import GetApi from "../../../services/GetApi";
import { ToastFailure } from "../../../Utils/Toast/ToastMsg";
import { formatDateForFilter, getCurrentDate } from "../../../Auth/schema";

const pageLimit = 10;

function PayoutReport() {
  const { state } = useLocation();
  const [payoutData, setPayoutData] = useState([]);
  const [totalItems, setTotalItems] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [empData, setEmpData] = useState();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const params = {
    page: currentPage,
    limit: pageLimit,
  };

  const handleAttendanceByUserId = async () => {
    try {
      setLoading(true);
      if (startDate && endDate) {
        params.startDate = `${formatDateForFilter(startDate)} 00:00:00`;
        params.endDate = `${formatDateForFilter(endDate)} 23:59:59`;
      }
      const res = await GetApi(
        `payout/get-payouts-byId/${state.userId}`,
        params,
      );
      if (res?.status === 200) {
        setLoading(false);
        setPayoutData(res?.data?.data);
        setTotalItems(res?.data?.totalItems);
        // setEmpData(empRes?.data);
      }
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };
  const handleEmpDetail = async () => {
    try {
      const empRes = await GetApi(`emp/employeeById/${state.userId}`);
      if (empRes?.status === 200) {
        setLoading(false);
        setEmpData(empRes?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleClearAll = () => {
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
  };

  const handleStartDateFilter = (date) => {
    if (formatDateForFilter(date) > getCurrentDate()) {
      ToastFailure("Start date can't be greater than today date.");
      return;
    }

    if (endDate === null) {
      setEndDate(date);
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
    setCurrentPage(1);
  };

  const handleEndDateFilter = (date) => {
    if (formatDateForFilter(date) > getCurrentDate()) {
      ToastFailure("End date can't be greater than today date.");
      return;
    }

    if (startDate === null) {
      setStartDate(date);
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
    setCurrentPage(1);
  };

  useEffect(() => {
    handleEmpDetail();
  }, []);
  useEffect(() => {
    handleAttendanceByUserId();
  }, [startDate, endDate, currentPage]);

  return (
    <Report
      identifier="Payout"
      state={state}
      header="Employee Payout Report"
      loading={loading}
      tableData={payoutData}
      empData={empData}
      totalItems={totalItems}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      startDate={startDate}
      endDate={endDate}
      pageLimit={pageLimit}
      setStartDate={handleStartDateFilter}
      setEndDate={handleEndDateFilter}
      handleClearAll={handleClearAll}
    />
  );
}

export default PayoutReport;
