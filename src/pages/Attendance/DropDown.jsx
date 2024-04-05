import selectIcon from "../../assets/img/selectIcon.png";

function DropDown({
  disable,
  name,
  options,
  selectValue,
  handleSelect,
  label,
}) {
  return (
    <div className="dropdown">
      <div className="selectIcondiv">
        <img src={selectIcon} alt="" />
      </div>
      {label && <label className="attendanceLabel">{label}</label>}
      <select
        disabled={disable}
        name={name}
        className="selectDropdown"
        value={selectValue}
        onChange={handleSelect}
        id="cars"
      >
        <option value="">All</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DropDown;
