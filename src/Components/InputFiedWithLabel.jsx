function InputFiedWithLabel({
  errors,
  touched,
  label,
  name,
  onChange,
  value,
  placeholder,
  disable,
  classnames,
}) {
  return (
    <div className={`col-sm-12 ${classnames || "col-md-4"}`}>
      <div className="groupInfo">
        <label htmlFor="type">{label}</label>
        <input
          type="text"
          name={name}
          value={value}
          disabled={disable}
          onChange={onChange}
          className="form-control employeInfoInput"
          placeholder={placeholder}
          aria-label="First name"
        />
      </div>
      {errors && touched ? (
        <div
          style={{
            color: "red",
            marginTop: "-17px",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          {errors}
        </div>
      ) : null}
    </div>
  );
}

export default InputFiedWithLabel;
