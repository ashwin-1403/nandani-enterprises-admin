import { Form, Formik } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import DeliveryImg from "../assets/img/deliveryImg.png";
import "./Login.scss";
import ButtonSubmitField from "../Components/ButtonSubmitField";
import PostApi from "../services/PostApi";
import { ToastSuccess } from "../Utils/Toast/ToastMsg";
import { LoginSchema } from "./schema";
import PasswordField from "../pages/ChangePassword/PasswordField";
import Loader from "../Utils/Loader/Loader";

export function Login({ setIsUser }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await PostApi("auth/login", {
        email: values?.email,
        password: values?.password,
      });
      if (res?.status === 200 && res?.passwordStatus !== true) {
        setLoading(false);
        setIsUser(true);
        localStorage.setItem("passwordStatus", res?.passwordStatus);
        localStorage.setItem("isLogin", true);
        localStorage.setItem("token", res?.data?.accessToken);
        localStorage.setItem("userName", res?.user);
        ToastSuccess(res?.message);
        navigate("/dashboard");
      } else {
        localStorage.setItem("passwordStatus", res?.passwordStatus);
        localStorage.setItem("token", res?.data?.accessToken);
        navigate("/changepassword");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="aspectHeight">
      <div className="logInPage">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="enterpriseSec">
                <div className="enterpriseHeading">
                  <h1>NANDANI&nbsp;</h1>
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
                  <h2 className="welcomeHeading">Hello, Welcome</h2>
                  <h1 className="loginHeading">Login</h1>
                  <div className="inputFeilds">
                    <Formik
                      initialValues={{
                        email: "",
                        password: "",
                      }}
                      validationSchema={LoginSchema}
                      onSubmit={(values) => {
                        handleSubmit(values);
                      }}
                    >
                      {({ errors, touched, handleChange, values }) => (
                        <Form>
                          <div className="mb-3">
                            <label
                              htmlFor="exampleInputEmail1"
                              className="form-label"
                            >
                              Email Address
                            </label>
                            <input
                              type="text"
                              name="email"
                              onChange={handleChange}
                              value={values?.email}
                              className="form-control"
                              id="exampleInputEmail1"
                              aria-describedby="emailHelp"
                            />
                            {errors.email && touched.email ? (
                              <div className="LoginMsgs">{errors.email}</div>
                            ) : null}
                          </div>
                          <PasswordField
                            errors={errors?.password}
                            touched={touched?.password}
                            value={values?.password}
                            label="Password"
                            onChange={handleChange}
                            name="password"
                          />
                          <div className="mb-3 form-check">
                            <div className="forgotSec">
                              <div>
                                {/* <input
                                  type="checkbox"
                                  className="form-check-input rememberMe"
                                  id="exampleCheck1"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="exampleCheck1"
                                >
                                  Remember me
                                </label> */}
                              </div>
                              <div>
                                <NavLink
                                  className="textDecorationNone"
                                  to="/forgotpassword"
                                >
                                  {" "}
                                  <p>Forgot password?</p>
                                </NavLink>
                              </div>
                            </div>
                          </div>
                          <ButtonSubmitField name="Login" />
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && <Loader startLoading={loading} />}
    </div>
  );
}

export default Login;
