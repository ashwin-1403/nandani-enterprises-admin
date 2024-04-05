import { NavLink } from "react-router-dom";
import { Form, Formik } from "formik";
import { useState } from "react";
import InputFiedWithLabel from "../../Components/InputFiedWithLabel";
import "./GenericStation.scss";
import BackArrow from "../../assets/img/backArrow.png";
import QrCode from "../qrcode/QrCode";
import { StationSchema } from "../../Auth/schema";
import CustomSelect from "../Employee/Upload/ProfileImageUpload/CustomSelect";
import { states } from "../../data/data";

export default function GenericStation({
  state,
  header,
  onSubmit,
  setGenericData,
  genericData,
}) {
  const { editStationDisable } = state;

  const [disable, setDisable] = useState(editStationDisable);
  const handleGenericData = (e, handleChange) => {
    const { name, value } = e.target;
    setGenericData((v) => ({ ...v, [name]: value }));
    handleChange(e);
  };

  return (
    <div className="stationSection">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="addStationHeader">
              <div className="d-flex align-items-center">
                <NavLink to="/stations">
                  <img src={BackArrow} alt="" />
                </NavLink>

                <h2>{header}</h2>
              </div>
              {disable && state?.editStationDisable && (
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
          <div className="col-md-8 mx-auto">
            <div className="profileInfoSec">
              <Formik
                initialValues={genericData}
                validationSchema={StationSchema}
                onSubmit={(values) => {
                  onSubmit(values);
                }}
              >
                {({ errors, touched, handleChange }) => (
                  <Form>
                    <div className="profileInfoHeading">
                      <h3>
                        <span>Station Info</span>
                      </h3>
                    </div>
                    <div className="row">
                      <InputFiedWithLabel
                        errors={errors?.stationCode}
                        touched={touched?.stationCode}
                        onChange={(e) => handleGenericData(e, handleChange)}
                        value={genericData?.stationCode}
                        disable={disable}
                        label="Station code"
                        name="stationCode"
                      />
                      <InputFiedWithLabel
                        classnames="col-md-8"
                        errors={errors?.stationName}
                        touched={touched?.stationName}
                        value={genericData?.stationName}
                        onChange={(e) => handleGenericData(e, handleChange)}
                        disable={disable}
                        label="Station Name"
                        name="stationName"
                      />
                      <div className="col-sm-12 col-md-4"> &nbsp;</div>
                      <div className="col-sm-12">
                        <InputFiedWithLabel
                          classnames="col-sm-12"
                          errors={errors?.address}
                          touched={touched?.address}
                          value={genericData?.address}
                          onChange={(e) => handleGenericData(e, handleChange)}
                          disable={disable}
                          label="Address"
                          name="address"
                        />
                      </div>

                      <InputFiedWithLabel
                        errors={errors?.country}
                        touched={touched?.country}
                        value="India"
                        onChange={(e) => handleGenericData(e, handleChange)}
                        disable="true"
                        label="Country"
                        name="country"
                      />

                      <CustomSelect
                        value={genericData.state}
                        errors={errors?.state}
                        touched={touched?.state}
                        onChange={(e) => handleGenericData(e, handleChange)}
                        disable={disable}
                        label="State"
                        name="state"
                        options={states}
                      />
                      <InputFiedWithLabel
                        errors={errors?.city}
                        touched={touched?.city}
                        value={genericData?.city}
                        onChange={(e) => handleGenericData(e, handleChange)}
                        disable={disable}
                        label="City"
                        name="city"
                      />
                      <InputFiedWithLabel
                        errors={errors?.pinCode}
                        touched={touched?.pinCode}
                        value={genericData?.pinCode}
                        onChange={(e) => handleGenericData(e, handleChange)}
                        disable={disable}
                        label="Pincode"
                        name="pinCode"
                      />
                      <InputFiedWithLabel
                        errors={errors?.latitude}
                        touched={touched?.latitude}
                        value={genericData?.latitude}
                        onChange={(e) => handleGenericData(e, handleChange)}
                        disable={disable}
                        label="Latitude"
                        name="latitude"
                      />
                      <InputFiedWithLabel
                        errors={errors?.longitude}
                        touched={touched?.longitude}
                        value={genericData?.longitude}
                        onChange={(e) => handleGenericData(e, handleChange)}
                        disable={disable}
                        label="Longitude"
                        name="longitude"
                      />
                    </div>

                    <div className="profileInfoSec">
                      <div className="profileInfoHeading">
                        <h3>
                          <span>Station Manager Info</span>
                        </h3>
                      </div>
                      <div className="row">
                        <InputFiedWithLabel
                          errors={errors?.stationManagerName}
                          touched={touched?.stationManagerName}
                          onChange={(e) => handleGenericData(e, handleChange)}
                          value={genericData?.stationManagerName}
                          disable={disable}
                          label="Manager Name"
                          name="stationManagerName"
                        />
                        <InputFiedWithLabel
                          errors={errors?.managerNumber}
                          touched={touched?.managerNumber}
                          value={genericData?.managerNumber}
                          onChange={(e) => handleGenericData(e, handleChange)}
                          disable={disable}
                          label="Manager Number"
                          name="managerNumber"
                        />
                      </div>
                    </div>
                    {state?.showQrCodeByStationId && (
                      <div className="row">
                        <div className="col-md-12 mt-3 mb-2">
                          <QrCode
                            disable={disable}
                            qrCodeByText={state?.stationId}
                          />
                        </div>
                      </div>
                    )}

                    {disable ? null : (
                      <div className="row">
                        <div className="col-md-12">
                          <div className="profileInfoSubmit">
                            <button type="submit">
                              {state?.showQrCodeByStationId
                                ? "Save"
                                : "Submit & Generate QR code"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
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
