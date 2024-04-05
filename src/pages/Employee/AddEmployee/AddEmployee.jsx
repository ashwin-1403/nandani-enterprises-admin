import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Employee from "../EmployeeDetails";
import PostApi from "../../../services/PostApi";
import { ToastSuccess } from "../../../Utils/Toast/ToastMsg";
import { initialEmployeeData } from "../../../data/data";
import GetApi from "../../../services/GetApi";

export function AddEmployee() {
  const { state } = useLocation();
  const [addEmployeeData, setAddEmployeeData] = useState(initialEmployeeData);
  const [verticalData, setVerticalData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [stationData, setStationData] = useState([]);
  const navigate = useNavigate();
  const handleAddEmployee = async () => {
    try {
      const EmployeeData = {
        ...addEmployeeData,
        email: addEmployeeData?.email?.toLowerCase(),
      };
      const addEmpRes = await PostApi(`emp/add-employee`, EmployeeData);
      if (addEmpRes?.status === 201) {
        ToastSuccess(addEmpRes?.message);
        navigate("/employees");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onLoadData = async () => {
    try {
      const verticalRes = await GetApi(
        `${process.env.REACT_APP_API}auth/get-verticals`,
      );
      const typeRes = await GetApi(
        `${process.env.REACT_APP_API}auth/get-types`,
      );
      const stationRes = await GetApi(
        `${process.env.REACT_APP_API}auth/all-station?page=1&limit=1000`,
      );
      if (verticalRes?.status === 200) {
        const verticalFinalData = verticalRes?.data?.map((ele) => ({
          value: ele?.verticalId,
          label: ele?.verticalName,
        }));
        setVerticalData(verticalFinalData);
      }

      if (typeRes?.status === 200) {
        const typeFinalData = typeRes?.data?.map((ele) => ({
          value: ele?.typeId,
          label: ele?.typeName,
        }));
        setTypeData(typeFinalData);
      }

      if (stationRes?.status === 200) {
        const stationIdFinalData = stationRes?.data?.data?.map((ele) => ({
          value: ele?.stationId,
          label: ele?.stationName,
        }));
        setStationData(stationIdFinalData);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    onLoadData();
  }, []);
  return (
    <Employee
      header="Add Employee"
      state={state}
      employeeData={addEmployeeData}
      setEmployeeData={setAddEmployeeData}
      buttonName="Submit"
      onSubmit={handleAddEmployee}
      verticalData={verticalData}
      typeData={typeData}
      stationData={stationData}
    />
  );
}

export default AddEmployee;
