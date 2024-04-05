import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Form, Formik } from "formik";
import "./EmployeeDetails.scss";
import BackArrow from "../../assets/img/backArrow.png";
import ProfileImageUpload from "./Upload/ProfileImageUpload/ProfileImageUpload";
import DocumentUpload from "./Upload/DocumentUpload/DocumentUpload";
import InputFiedWithLabel from "../../Components/InputFiedWithLabel";
import CustomSelect from "./Upload/ProfileImageUpload/CustomSelect";
import { EmployeeSchema } from "../../Auth/schema";
import GetApi from "../../services/GetApi";

export default function Employee({
  header,
  state,
  employeeData,
  setEmployeeData,
  onSubmit,
  buttonName,
  verticalData,
  typeData,
  stationData,
}) {
  const [disable, setDisable] = useState(state?.editEmp);
  const [processData, setProcessData] = useState([]);
  const fetchProcesData = async () => {
    try {
      const processRes = await GetApi(
        `${process.env.REACT_APP_API}auth/get-process/${employeeData?.verticalId}`,
      );
      if (processRes?.status === 200) {
        const processFinalData = processRes?.data?.map((ele) => ({
          value: ele?.processId,
          label: ele?.processName,
        }));
        setProcessData(processFinalData);
      } else {
        setProcessData([]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const checkForProcess = () => {
    const operationObj = verticalData?.find(
      (ele) => ele?.label === "Operations",
    );

    return (
      employeeData?.verticalId?.length > 0 &&
      operationObj?.value === employeeData?.verticalId
    );
  };

  useEffect(() => {
    if (checkForProcess()) {
      fetchProcesData();
    } else {
      setProcessData([]);
    }
  }, [employeeData?.verticalId, verticalData]);

  const handleFormChange = (e, handleChange) => {
    const { name, value } = e.target;
    setEmployeeData((v) => ({ ...v, [name]: value }));
    handleChange(e);
  };

  const handleFormChangeForVertical = (e, handleChange) => {
    const { name, value } = e.target;
    setEmployeeData((v) => ({ ...v, [name]: value, processId: "" }));
    handleChange(e);
  };

  return (
    <div className="addEmployeeSection">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="addEmployeeHeader">
              <div className="d-flex align-items-center">
                <NavLink to="/employees">
                  <img src={BackArrow} alt="" />
                </NavLink>

                <h2>{header}</h2>
              </div>
              {disable && state?.editEmp && (
                <div className="editBtn">
                  <button onClick={() => setDisable(false)} type="button">
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <Formik
            initialValues={employeeData}
            validationSchema={EmployeeSchema}
            onSubmit={(values) => {
              onSubmit(values);
            }}
          >
            {({ errors, touched, handleChange }) => (
              <Form>
                <div className="col-md-12 col-lg-8  mx-auto">
                  <div className="ProfileImageUploadSec">
                    <ProfileImageUpload
                      handleProfile={handleChange}
                      errors={errors?.profileImage}
                      touched={touched?.profileImage}
                      disable={disable}
                      setEmployeeData={setEmployeeData}
                      employeeData={employeeData}
                    />
                  </div>
                  <div className="profileInfoSec">
                    <div className="profileInfoHeading">
                      <h3>
                        <span>Personal Info</span>
                      </h3>
                    </div>
                    <div className="row">
                      <InputFiedWithLabel
                        errors={errors?.employeeName}
                        touched={touched?.employeeName}
                        label="First name"
                        name="employeeName"
                        disable={disable}
                        value={employeeData?.employeeName}
                        onChange={(e) => handleFormChange(e, handleChange)}
                      />
                      <InputFiedWithLabel
                        errors={errors?.employeeMiddleName}
                        touched={touched?.employeeMiddleName}
                        label="Middle name"
                        name="employeeMiddleName"
                        disable={disable}
                        value={employeeData?.employeeMiddleName}
                        onChange={(e) => handleFormChange(e, handleChange)}
                      />
                      <InputFiedWithLabel
                        errors={errors?.employeeLastName}
                        touched={touched?.employeeLastName}
                        label="Last name"
                        name="employeeLastName"
                        disable={disable}
                        value={employeeData?.employeeLastName}
                        onChange={(e) => handleFormChange(e, handleChange)}
                      />

                      <InputFiedWithLabel
                        errors={errors?.mobile}
                        touched={touched?.mobile}
                        label="Mobile number (primary)"
                        name="mobile"
                        disable={state?.editEmp}
                        value={employeeData?.mobile}
                        onChange={(e) => handleFormChange(e, handleChange)}
                      />
                      <InputFiedWithLabel
                        label="Additional mobile no"
                        name="additionalContact"
                        disable={disable}
                        value={employeeData?.additionalContact}
                        onChange={(e) => handleFormChange(e, handleChange)}
                      />
                      <InputFiedWithLabel
                        errors={errors?.email}
                        touched={touched?.email}
                        label="Email ID"
                        name="email"
                        disable={disable}
                        value={employeeData?.email}
                        onChange={(e) => handleFormChange(e, handleChange)}
                      />
                      <InputFiedWithLabel
                        errors={errors?.aadharCardNumber}
                        touched={touched?.aadharCardNumber}
                        label="Aadhaar no."
                        name="aadharCardNumber"
                        disable={disable}
                        value={employeeData?.aadharCardNumber}
                        onChange={(e) => handleFormChange(e, handleChange)}
                      />
                    </div>
                  </div>

                  <div className="profileInfoSec">
                    <div className="profileInfoHeading">
                      <h3 className="LongHeading">
                        {" "}
                        <span>Employment Info</span>
                      </h3>
                    </div>
                    <div className="row">
                      <InputFiedWithLabel
                        errors={errors?.employeeCode}
                        touched={touched?.employeeCode}
                        label="Emp code"
                        name="employeeCode"
                        disable={disable}
                        value={employeeData?.employeeCode}
                        onChange={(e) => handleFormChange(e, handleChange)}
                      />

                      <CustomSelect
                        errors={errors?.stationId}
                        touched={touched?.stationId}
                        name="stationId"
                        disable={disable}
                        label="Station name"
                        value={employeeData?.stationId}
                        onChange={(e) => handleFormChange(e, handleChange)}
                        options={stationData}
                      />
                      <InputFiedWithLabel
                        errors={errors?.perKMRate}
                        touched={touched?.perKMRate}
                        label="Rate/KM"
                        name="perKMRate"
                        disable={disable}
                        value={employeeData?.perKMRate}
                        onChange={(e) => handleFormChange(e, handleChange)}
                      />
                      <CustomSelect
                        errors={errors?.verticalId}
                        touched={touched?.verticalId}
                        name="verticalId"
                        disable={disable}
                        label="Vertical"
                        value={employeeData?.verticalId}
                        onChange={(e) =>
                          handleFormChangeForVertical(e, handleChange)
                        }
                        options={verticalData}
                      />
                      <CustomSelect
                        errors={errors?.processId}
                        touched={touched?.processId}
                        name="processId"
                        disable={disable || processData?.length === 0}
                        label="Process"
                        value={employeeData?.processId}
                        onChange={(e) => {
                          handleFormChange(e, handleChange);
                        }}
                        options={processData}
                      />
                      <CustomSelect
                        errors={errors?.typeId}
                        touched={touched?.typeId}
                        name="typeId"
                        disable={disable}
                        label="Type"
                        value={employeeData?.typeId}
                        onChange={(e) => handleFormChange(e, handleChange)}
                        options={typeData}
                      />
                    </div>
                  </div>
                  <div className="profileInfoSec">
                    <div className="profileInfoHeading">
                      <h3>
                        {" "}
                        <span>Bank Info</span>
                      </h3>
                    </div>
                    <div className="row">
                      <InputFiedWithLabel
                        errors={errors?.bankName}
                        touched={touched?.bankName}
                        label="Bank name"
                        name="bankName"
                        disable={disable}
                        value={employeeData?.bankName}
                        onChange={(e) => handleFormChange(e, handleChange)}
                      />
                      <InputFiedWithLabel
                        errors={errors?.branchName}
                        touched={touched?.branchName}
                        label="Branch name"
                        name="branchName"
                        disable={disable}
                        value={employeeData?.branchName}
                        onChange={(e) => handleFormChange(e, handleChange)}
                      />
                      <InputFiedWithLabel
                        errors={errors?.ifscCode}
                        touched={touched?.ifscCode}
                        label="IFSC code"
                        name="ifscCode"
                        disable={disable}
                        value={employeeData?.ifscCode}
                        onChange={(e) => handleFormChange(e, handleChange)}
                      />
                      <InputFiedWithLabel
                        errors={errors?.accountNumber}
                        touched={touched?.accountNumber}
                        label="Account number"
                        name="accountNumber"
                        disable={disable}
                        value={employeeData?.accountNumber}
                        onChange={(e) => handleFormChange(e, handleChange)}
                      />
                    </div>
                  </div>

                  <div
                    className={`documentUploadSec ${
                      !disable ? "mb-1" : "mb-5"
                    }`}
                  >
                    <h3>Document upload</h3>
                    <DocumentUpload
                      disable={disable}
                      setEmployeeData={setEmployeeData}
                      employeeData={employeeData}
                    />
                  </div>

                  {disable ? null : (
                    <div className="profileInfoSubmit">
                      <button type="submit">{buttonName}</button>
                    </div>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
