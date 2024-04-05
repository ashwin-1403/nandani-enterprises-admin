import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Employee from "../EmployeeDetails";
import PatchApi from "../../../services/PatchApi";
import { ToastSuccess } from "../../../Utils/Toast/ToastMsg";
import GetApi from "../../../services/GetApi";

export function EditEmployee() {
  const { state } = useLocation();
  const empUrlData = useParams();
  const userId = empUrlData.id;
  const navigate = useNavigate();
  const [verticalData, setVerticalData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [stationData, setStationData] = useState([]);
  const [editEmployeeData, setEditEmployeeData] = useState();

  const handleEditEmployee = async () => {
    try {
      const editedEmployeeData = {
        ...editEmployeeData,
        email: editEmployeeData?.email?.toLowerCase(),
      };
      const res = await PatchApi(
        `emp/employee-update/${userId}`,
        editedEmployeeData,
      );
      if (res?.status === 200) {
        ToastSuccess(res?.message);
        navigate("/employees");
      }
    } catch (error) {
      console.log("error", error);
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

  const handleEditChange = async () => {
    try {
      const res = await GetApi(`emp/employeeById/${userId}`);
      if (res?.status === 200) {
        setEditEmployeeData({
          profileImage: res?.data?.profileImage,
          employeeName: res?.data?.employeeName,
          employeeMiddleName: res?.data?.employeeMiddleName,
          employeeLastName: res?.data?.employeeLastName,
          mobile: res?.data?.User?.mobile,
          additionalContact: res?.data?.additionalContact,
          email: res?.data?.User?.email,
          aadharCardNumber: res?.data?.aadharCardNumber,
          employeeCode: res?.data?.employeeCode,
          stationId: res?.data?.Station?.stationId,
          perKMRate: res?.data?.PayOuts?.perKMRate,
          verticalId: res?.data?.Vertical?.verticalId,
          processId: res?.data?.Process?.processId
            ? res?.data?.Process?.processId
            : "",
          typeId: res?.data?.Type?.typeId,
          bankName: res?.data?.EmployeeBank?.bankName || "",
          branchName: res?.data?.EmployeeBank?.branchName || "",
          ifscCode: res?.data?.EmployeeBank?.ifscCode || "",
          accountNumber: res?.data?.EmployeeBank?.accountNumber || "",
          documentImage:
            res?.data?.documentImage?.length > 0
              ? res?.data?.documentImage.split(",")
              : [],
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    onLoadData();
    handleEditChange();
  }, []);

  return (
    editEmployeeData && (
      <Employee
        header="Edit Employee"
        state={state}
        employeeData={editEmployeeData}
        setEmployeeData={setEditEmployeeData}
        buttonName="Save"
        onSubmit={handleEditEmployee}
        verticalData={verticalData}
        typeData={typeData}
        stationData={stationData}
      />
    )
  );
}

export default EditEmployee;
