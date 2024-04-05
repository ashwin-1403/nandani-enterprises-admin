import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import DeliveryImg from "../assets/img/deliveryImg.png";
import "./Login.scss";
import ButtonSubmitField from "../Components/ButtonSubmitField";
import { ToastSuccess } from "../Utils/Toast/ToastMsg";
import PostApi from "../services/PostApi";
import PasswordField from "../pages/ChangePassword/PasswordField";
import { ResetSchema } from "./schema";

function ResetPassword() {
  const email = localStorage?.getItem("email");
  const naviagte = useNavigate();
  const handleSubmit = async (values) => {
    try {
      const res = await PostApi("auth/reset-pass", {
        email,
        newPassword: values?.newPassword,
        confirmPassword: values?.confirmPassword,
      });
      if (res?.status === 200) {
        ToastSuccess(res?.message);
        naviagte("/");
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div className="aspectHeight">
      <div className="logInPage forgotPage resetPassword">
        <div className="container">
          <div className="row resetAlign">
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
                  <h1 className="loginHeading">Reset password</h1>
                  <div className="inputFeilds">
                    <Formik
                      initialValues={{
                        newPassword: "",
                        confirmPassword: "",
                      }}
                      validationSchema={ResetSchema}
                      onSubmit={(values) => {
                        handleSubmit(values);
                      }}
                    >
                      {({ errors, touched, handleChange, values }) => (
                        <Form>
                          <PasswordField
                            errors={errors?.newPassword}
                            touched={touched?.newPassword}
                            onChange={handleChange}
                            value={values?.newPassword}
                            label="New Password"
                            name="newPassword"
                          />
                          <PasswordField
                            errors={errors?.confirmPassword}
                            touched={touched?.confirmPassword}
                            onChange={handleChange}
                            value={values?.confirmPassword}
                            label="Confirm Password"
                            name="confirmPassword"
                          />
                          <ButtonSubmitField name="Submit" />
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
    </div>
  );
}

export default ResetPassword;
