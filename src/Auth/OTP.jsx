import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeliveryImg from "../assets/img/deliveryImg.png";
import "./Login.scss";
import ButtonSubmitField from "../Components/ButtonSubmitField";
import PostApi from "../services/PostApi";
import { ToastSuccess } from "../Utils/Toast/ToastMsg";

function OTP() {
  const numDigits = 4;
  const [otpDigits, setOtpDigits] = useState(Array(numDigits).fill(""));
  const [error, setError] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const forgotEmail = localStorage?.getItem("email");
  const handleOtpChange = (index, value) => {
    if (!Number.isNaN(Number(value)) && value.length <= 1) {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = value;
      if (newOtpDigits?.join("")?.length > 3) {
        setError(false);
      }
      setOtpDigits(newOtpDigits);

      // Move focus to the next input field if not the last digit
      if (index < numDigits - 1 && value.length === 1) {
        inputRefs.current[index + 1].focus();
      }
      if (index > 0 && value === "") {
        inputRefs.current[index - 1].focus();
      }
    }
  };
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otpDigits?.join("")?.length < 4) {
      setError(true);
      return;
    }
    try {
      const res = await PostApi("auth/otp-verify", {
        otp: Number(otpDigits?.join("")),
        email: forgotEmail,
      });
      if (res?.status === 200) {
        ToastSuccess(res?.message);
        navigate("/resetpassword");
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleResendOtp = async () => {
    try {
      const res = await PostApi("auth/resend-otp", {
        email: forgotEmail,
      });
      if (res?.status === 200) {
        ToastSuccess(res?.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div className="aspectHeight">
      <div className="logInPage forgotPage otpPage">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="enterpriseSec">
                <div className="enterpriseHeading">
                  <h1>NANDANI &nbsp;</h1>
                  <h1>ENTERPRISES</h1>
                </div>
                <div className="deliveryImgSec">
                  <img src={DeliveryImg} alt="" />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="loginFormSection">
                <div className="loginFormSec">
                  <h1 className="loginHeading">Enter OTP</h1>
                  <p>
                    Please enter a 4 digit OTP that has been sent to your email
                    address.
                  </p>
                  <div className="inputFeilds">
                    <form
                      onSubmit={(e) => {
                        handleOtpSubmit(e);
                      }}
                    >
                      <div className="mb-3 numberFields">
                        {otpDigits.map((digit, index) => (
                          <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={digit}
                            ref={(ref) => {
                              inputRefs.current[index] = ref;
                            }}
                            onChange={(e) =>
                              handleOtpChange(index, e.target.value)
                            }
                          />
                        ))}
                      </div>
                      {error && (
                        <div className="otpErrorMsgs">
                          Please enter a 4 digit otp
                        </div>
                      )}
                      <button
                        onClick={handleResendOtp}
                        className="resendOtp"
                        type="button"
                      >
                        Resend OTP
                      </button>
                      <ButtonSubmitField name="Submit" />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default OTP;
