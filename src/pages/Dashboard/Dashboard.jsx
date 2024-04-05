import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./dashboard.scss";
import notificationIcon from "../../assets/img/notificationIcon.png";
import userIcon from "../../assets/img/UserIcon.png";
import StationSVG from "../../Components/SVGComponent/StationSVG";
import PayoutSVG from "../../Components/SVGComponent/PayoutSVG";
import AttendanceSVG from "../../Components/SVGComponent/AttendanceSVG";
import EmployeeSVG from "../../Components/SVGComponent/EmployeeSVG";
import DashboardSVG from "../../Components/SVGComponent/DashboardSVG";
import MainLogo from "../../assets/img/MainLogo.png";
import Humburger from "../../assets/img/burgarIcon.png";
import GetApi from "../../services/GetApi";
import { ToastSuccess } from "../../Utils/Toast/ToastMsg";

function Dashboard({ isUser, setIsUser, children }) {
  const [show, setShow] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();
  const profileSubDivRef = useRef(null);
  const userName = localStorage.getItem("userName");
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileSubDivRef.current &&
        !profileSubDivRef.current.contains(event.target)
      ) {
        // Click occurred outside of profileSubDiv and the component is shown, close it
        setIsShown(false);
      }
    };

    // Add event listener to handle outside clicks
    document.addEventListener("mousedown", handleOutsideClick);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleClick = () => {
    // Toggle shown state
    setIsShown((current) => !current);
  };

  const handleLogout = () => {
    ToastSuccess("User logout successfully");
    localStorage.removeItem("token");
    localStorage.removeItem("passwordStatus");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("userName");
    setIsUser(false);
    setIsShown(false);
    navigate("/");
  };

  const handleCloseProfileSubDiv = () => {
    // Close the profileSubDiv
    setIsShown(false);
  };

  const handleNotification = async () => {
    try {
      const res = await GetApi("/checkNotification");
      if (res?.status === 200) {
        setNotificationCount(0);
      }
    } catch (error) {
      console.log("error", error);
    }
    navigate("/notifications");
  };

  const getNewNotificationCount = async () => {
    try {
      const res = await GetApi("/getNotificationCount");
      if (res?.status === 200) {
        setNotificationCount(res?.totalItems);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (isUser) {
      // Call the function immediately when the component mounts
      getNewNotificationCount();

      // Set up an interval to call the function every one minute (60000 milliseconds)
      const intervalId = setInterval(getNewNotificationCount, 60000);

      // Clear the interval when the component unmounts to prevent memory leaks
      return () => clearInterval(intervalId);
    }
  }, [isUser]);

  return (
    <>
      {isUser && (
        <div className={`sidebar ${show ? "close" : ""}`}>
          <div className="logo-details">
            <img src={MainLogo} className="mainLogo" alt="" />
            <span className="logo_name">NANDANI ENTERPRISES</span>
          </div>

          <ul className="nav-links">
            <li>
              <NavLink to="/dashboard">
                <DashboardSVG />
                <span className="link_name">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/employees">
                <EmployeeSVG />
                <span className="link_name">Employees</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/stations">
                <StationSVG />
                <span className="link_name">Stations</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="attendanceIcon" to="/attendence">
                <AttendanceSVG />
                <span className="link_name attendanceNav">Attendance</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/payouts">
                <PayoutSVG />
                <span className="link_name">Payouts</span>
              </NavLink>
            </li>
          </ul>
        </div>
      )}

      <section className={`${isUser && "home-section"}`}>
        {isUser && (
          <div className="headerContentSec">
            <div className="home-content">
              <div
                tabIndex="0"
                role="button"
                onClick={() => setShow(!show)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setShow(!show);
                  }
                }}
              >
                <img className="bx bx-menu" src={Humburger} alt="" />
              </div>
              <div className="headerIconsSec">
                <div className="notificationDiv">
                  <button
                    type="button"
                    onClick={() => {
                      handleNotification();
                    }}
                    className="notificationButton"
                  >
                    {notificationCount === 0 ? null : (
                      <div className="notificationCount">
                        <p>{notificationCount}</p>
                      </div>
                    )}
                    <img
                      className="notificationIcon"
                      src={notificationIcon}
                      alt=""
                    />
                  </button>
                </div>
                <span>
                  <b>{userName}</b>
                </span>
                <button
                  className="profileLogoutBtn"
                  type="button"
                  onClick={handleClick}
                >
                  <img className="profileLogoutIcon" src={userIcon} alt="" />
                </button>
                {isShown && (
                  <div className="profileSubDiv" ref={profileSubDivRef}>
                    <NavLink
                      to="/ChangePassword?pass=change"
                      onClick={handleCloseProfileSubDiv}
                    >
                      <h6>Change Password</h6>
                    </NavLink>
                    <button
                      className="logOut"
                      onClick={handleLogout}
                      type="button"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="commonBG">{children}</div>
      </section>
    </>
  );
}
export default Dashboard;
