import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import "./changePassword.scss";
import PasswordField from "./PasswordField";
import PostApi from "../../services/PostApi";
import { ToastSuccess } from "../../Utils/Toast/ToastMsg";
import { ChangePasswordSchema } from "../../Auth/schema";

export default function ChangePassword({ setIsUser, classname }) {
  const navigate = useNavigate();
  const handleSubmitChange = async (values) => {
    try {
      const res = await PostApi("auth/update-pass", {
        oldPassword: values?.oldPassword,
        newPassword: values?.newPassword,
        confirmPassword: values?.confirmPassword,
      });
      if (res?.status === 200) {
        setIsUser(true);
        ToastSuccess(res?.message);
        localStorage.setItem("isLogin", true);
        localStorage.setItem("passwordStatus", false);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className={`changePasswordSection ${classname}`}>
      <div className="container">
        <div className="row ">
          <div className="col-md-8 col-lg-8 col-xl-5 mx-auto">
            <div className="changePasswordSec">
              <div className="changeheading">
                <h3>Change Password</h3>
              </div>

              <Formik
                initialValues={{
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                }}
                validationSchema={ChangePasswordSchema}
                onSubmit={(values) => {
                  handleSubmitChange(values);
                }}
              >
                {({ errors, touched, handleChange, values }) => (
                  <Form>
                    <div className="col-sm-12">
                      <PasswordField
                        errors={errors?.oldPassword}
                        touched={touched?.oldPassword}
                        value={values?.oldPassword}
                        label="Current Password"
                        onChange={handleChange}
                        name="oldPassword"
                      />
                      <PasswordField
                        errors={errors?.newPassword}
                        touched={touched?.newPassword}
                        value={values?.newPassword}
                        label="New Password"
                        onChange={handleChange}
                        name="newPassword"
                      />
                      <PasswordField
                        errors={errors?.confirmPassword}
                        touched={touched?.confirmPassword}
                        value={values?.confirmPassword}
                        label="Confirm New Password"
                        onChange={handleChange}
                        name="confirmPassword"
                      />
                    </div>
                    <div className="SubmitBtnSec">
                      <button type="submit" className="SubmitBtn">
                        Submit
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
