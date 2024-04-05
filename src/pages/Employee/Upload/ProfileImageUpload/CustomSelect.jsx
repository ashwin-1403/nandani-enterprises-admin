function CustomSelect({
  options,
  value,
  onChange,
  label,
  disable,
  name,
  errors,
  touched,
}) {
  return (
    <div className="col-sm-12 col-md-4">
      <div className="groupInfo">
        <label htmlFor="type">{label}</label>
        <select
          name={name}
          disabled={disable}
          className="form-select employeInfoInput"
          aria-label="Default select example"
          value={value}
          onChange={onChange}
        >
          <option value="" selected>
            Select
          </option>

          {options.map((option) => (
            <option key={option?.value} value={option?.value}>
              {option?.label}
            </option>
          ))}
        </select>
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

export default CustomSelect;
