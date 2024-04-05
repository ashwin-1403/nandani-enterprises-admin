import * as Yup from "yup";
import GetApi from "../services/GetApi";

const getVerticalList = async () => {
  const verticalRes = await GetApi(
    `${process.env.REACT_APP_API}auth/get-verticals`,
  );

  const operationObj = verticalRes?.data?.find(
    (ele) => ele?.verticalName === "Operations",
  );
  return operationObj?.verticalId;
};

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email.")
    .required("Email is mandatory.")
    .test(
      "conditional-validation",
      "No leading or trailing spaces are allowed",
      (value) => value === undefined || value.trim() === value,
    ),
  password: Yup.string()
    .required("Password is mandatory.")
    .min(6, "Password must contain minimum 6 characters")
    .max(32, "Password must contain maximum 32 characters")
    .test(
      "conditional-validation",
      "No leading or trailing spaces are allowed",
      (value) => value === undefined || value.trim() === value,
    ),
});
export const ForgotSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email.")
    .required("Email is mandatory."),
});

export const ResetSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required("Please enter a new password")
    .min(6, "Password must contain minimum 6 characters")
    .max(32, "Password must contain maximum 32 characters")
    .matches(/[0-9]/, "At least one Digit")
    .matches(/[a-z]/, "At least one Lowercase")
    .matches(/[A-Z]/, "At least one Uppercase")
    .matches(/(?=.*?[#?!@$%^&*-])/, "At least one Special Characters")
    .test(
      "conditional-validation",
      "No leading or trailing spaces are allowed",
      (value) => value === undefined || value.trim() === value,
    ),

  confirmPassword: Yup.string()
    .required("Please re-type your password")
    .oneOf([Yup.ref("newPassword")], "Passwords does not match")
    .test(
      "conditional-validation",
      "No leading or trailing spaces are allowed",
      (value) => value === undefined || value.trim() === value,
    ),
});

export const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required("Please enter a old password")
    .min(6, "Password must contain minimum 6 characters")
    .max(32, "Password must contain maximum 32 characters")
    .test(
      "conditional-validation",
      "No leading or trailing spaces are allowed",
      (value) => value === undefined || value.trim() === value,
    ),
  newPassword: Yup.string()
    .required("Please enter a new password")
    .min(6, "Password must contain minimum 6 characters")
    .max(32, "Password must contain maximum 32 characters")
    .matches(/[0-9]/, "At least one Digit")
    .matches(/[a-z]/, "At least one Lowercase")
    .matches(/[A-Z]/, "At least one Uppercase")
    .matches(/(?=.*?[#?!@$%^&*-])/, "At least one Special Characters")
    .test(
      "conditional-validation",
      "No leading or trailing spaces are allowed",
      (value) => value === undefined || value.trim() === value,
    ),

  confirmPassword: Yup.string()
    .required("Please re-type your password")
    .oneOf([Yup.ref("newPassword")], "Passwords does not match")
    .test(
      "conditional-validation",
      "No leading or trailing spaces are allowed",
      (value) => value === undefined || value.trim() === value,
    ),
});

export const StationSchema = Yup.object().shape({
  stationName: Yup.string()
    .required("Station Name is mandatory.")
    .matches(/^[A-Za-z\s]+$/, "Station contain alphabet")
    .max(50, "Maximum 50 characters allowed."),
  stationManagerName: Yup.string()
    .required("Station Manager Name is mandatory.")
    .matches(/^[A-Za-z\s]+$/, "Manager Name must contain alphabet"),
  stationCode: Yup.string()
    .required("Station Code is mandatory.")
    .max(50, "Maximum 50 characters allowed."),
  address: Yup.string().required("Address is mandatory."),
  city: Yup.string()
    .required("City is mandatory.")
    .matches(/^[A-Za-z\s]+$/, "City must contain alphabet")
    .max(50, "Maximum 50 characters allowed."),
  state: Yup.string()
    .required("State is mandatory.")
    .matches(/^[A-Za-z\s]+$/, "State must contain alphabet")
    .max(50, "Maximum 50 characters allowed."),
  country: Yup.string()
    .required("Country is mandatory.")
    .matches(/^[A-Za-z\s]+$/, "Country must contain alphabet")
    .max(50, "Maximum 50 characters allowed."),
  latitude: Yup.string().required("Latitude is mandatory."),
  longitude: Yup.string().required("Longitude is mandatory."),
  managerNumber: Yup.string()

    .required("Mobile Number is mandatory.")
    .matches(/^[0-9]+$/, "Mobile Number must contain numeric")
    .matches(/^\d{10}$/, "Please enter 10-digit number"),
  pinCode: Yup.string()
    .required("Pincode is mandatory.")
    .matches(/^[0-9]+$/, "Pincode must contain numeric"),
});

export const EmployeeSchema = Yup.object().shape({
  employeeName: Yup.string()
    .required("First Name is mandatory.")
    .matches(/^[A-Za-z\s]+$/, "First name contain alphabet")
    .max(50, "Maximum 50 characters allowed."),
  employeeMiddleName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "First name contain alphabet")
    .max(50, "Maximum 50 characters allowed."),
  employeeLastName: Yup.string()
    .required("Last Name is mandatory.")
    .matches(/^[A-Za-z\s]+$/, "Last name contain alphabet")
    .max(50, "Maximum 50 characters allowed."),
  mobile: Yup.string()
    .required("Mobile Number is mandatory.")
    .matches(/^[0-9]+$/, "Mobile Number must contain numeric")
    .matches(/^\d{10}$/, "Please enter 10-digit number"),
  email: Yup.string().required("Email is mandatory."),
  aadharCardNumber: Yup.string()
    .required("Aadhaar Number is mandatory.")
    .matches(/^[0-9]+$/, "Aadhar must contain numeric")
    .matches(/^\d{12}$/, "Please enter 12-digit number"),
  employeeCode: Yup.string()
    .required("Emp Code is mandatory.")
    .matches(/^[0-9]+$/, "Employee code must contain numeric"),
  stationId: Yup.string().required("Station is mandatory."),
  perKMRate: Yup.string().required(
    "Rate is mandatory.\nIn case of no rate/KM, enter 0 & proceed",
  ),
  verticalId: Yup.string().required("Vertical is mandatory."),
  processId: Yup.string().test(
    "conditional-validation",
    "Process is required.",
    async function (value) {
      const verticalId = this.resolve(Yup.ref("verticalId"));

      const response = await getVerticalList();

      if (verticalId === response) {
        return value !== undefined && value !== "";
      }
      return true;
    },
  ),
  typeId: Yup.string().required("Type is mandatory."),
  bankName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Bank name contain alphabet")
    .max(50, "Maximum 50 characters allowed"),
  branchName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Branch name contain alphabet")
    .max(50, "Maximum 50 characters allowed"),
  ifscCode: Yup.string().max(50, "Maximum 50 characters allowed"),
  accountNumber: Yup.string()
    .max(50, "Maximum 50 characters allowed")
    .matches(/^[0-9]+$/, "Account number must contain digit"),
});

export function formatTime(inputDate) {
  const date = new Date(inputDate);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = (hours % 12).toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${period}`;
}

export function formatDate(inputDate) {
  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function formatDateForFilter(inputDate) {
  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

export function getCurrentDate() {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

export function getDateObject(inputDate) {
  return new Date(inputDate);
}
