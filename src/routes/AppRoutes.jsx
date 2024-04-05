import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import DashboardContent from "../pages/Dashboard/Dashboard Page/DashboardContent";
import Employee from "../pages/Employee/Employee";
import { AddEmployee } from "../pages/Employee/AddEmployee/AddEmployee";
import { EditEmployee } from "../pages/Employee/EditEmployee/EditEmployee";
import ChangePassword from "../pages/ChangePassword/ChangePassword";
import Notification from "../pages/Notification/Notification";
import { Login } from "../Auth/Login";
import Forgot from "../Auth/Forgot";
import OTP from "../Auth/OTP";
import ResetPassword from "../Auth/ResetPassword";
import PayoutHeader from "../pages/payouts/Payout";
import PayoutReport from "../pages/payouts/PayoutReport/PayoutReport";
import AttendenceList from "../pages/Attendance/Attendence";
import AttendenceReport from "../pages/Attendance/AttendenceReport/AttendenceReport";
import Station from "../pages/Station/Station";
import AddStation from "../pages/Station/AddStation/AddStation";
import EditStation from "../pages/Station/EditStation/EditStation";

function AppRoutes({ isUser, setIsUser }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const Param = queryParams.get("pass");
  return (
    <Dashboard isUser={isUser} setIsUser={setIsUser}>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login setIsUser={setIsUser} />
            </PublicRoute>
          }
        />
        <Route
          path="/forgotpassword"
          element={
            <PublicRoute>
              <Forgot />
            </PublicRoute>
          }
        />
        <Route
          path="/otpvalidate"
          element={
            <PublicRoute>
              <OTP />
            </PublicRoute>
          }
        />
        <Route
          path="/resetpassword"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardContent />
            </PrivateRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <PrivateRoute>
              <Employee />
            </PrivateRoute>
          }
        />
        <Route
          path="/stations"
          element={
            <PrivateRoute>
              <Station />
            </PrivateRoute>
          }
        />
        <Route
          path="/stations/create"
          element={
            <PrivateRoute>
              <AddStation />
            </PrivateRoute>
          }
        />
        <Route
          path="/stations/:id"
          element={
            <PrivateRoute>
              <EditStation />
            </PrivateRoute>
          }
        />
        <Route
          path="/attendence"
          element={
            <PrivateRoute>
              <AttendenceList />
            </PrivateRoute>
          }
        />
        <Route
          path="/attendence/:id"
          element={
            <PrivateRoute>
              <AttendenceReport />
            </PrivateRoute>
          }
        />

        <Route
          path="/payouts"
          element={
            <PrivateRoute>
              <PayoutHeader />
            </PrivateRoute>
          }
        />
        <Route
          path="/payouts/:id"
          element={
            <PrivateRoute>
              <PayoutReport />
            </PrivateRoute>
          }
        />
        <Route
          path="/employees/create"
          element={
            <PrivateRoute>
              <AddEmployee />
            </PrivateRoute>
          }
        />

        <Route
          exact
          path="/employees/:id"
          element={
            <PrivateRoute>
              <EditEmployee />
            </PrivateRoute>
          }
        />

        <Route
          exact
          path="/notifications"
          element={
            <PrivateRoute>
              <Notification />
            </PrivateRoute>
          }
        />
        {Param === "change" && (
          <Route
            path="/changepassword"
            element={
              <PrivateRoute>
                <ChangePassword setIsUser={setIsUser} />
              </PrivateRoute>
            }
          />
        )}
        <Route
          path="/changepassword"
          element={
            <PublicRoute>
              <ChangePassword setIsUser={setIsUser} classname="mt-5" />
            </PublicRoute>
          }
        />
      </Routes>
    </Dashboard>
  );
}

export default AppRoutes;

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const loginStatus = localStorage.getItem("passwordStatus");

  const isAuthenticated = Boolean(token) && loginStatus === "false";
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const loginStatus = localStorage.getItem("passwordStatus");

  const isAuthenticated = Boolean(token) && loginStatus === "false";
  return isAuthenticated ? children : <Navigate to="/" />;
}
