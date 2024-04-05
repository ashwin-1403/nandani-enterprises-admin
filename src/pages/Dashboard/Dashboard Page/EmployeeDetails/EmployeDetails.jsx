import { useNavigate } from "react-router-dom";
import Arrow from "../../../../assets/img/ArrowIcon.png";

export default function EmployeDetails({
  render,
  type,
  image,
  paraHead,
  cardDetail,
}) {
  const navigate = useNavigate();
  const handleMoreInfo = (render) => {
    navigate(render);
  };
  return (
    <div className="employeeContentSec">
      <div className="employeeContent">
        <div className="employeeCount">
          <h1>{cardDetail}</h1>
        </div>
        <div className="employeeIcon">
          <img src={image} alt="" />
        </div>
      </div>
      <p className="employeNumberHeading">{paraHead}</p>
      <div className="moreInfoSec">
        <button onClick={() => handleMoreInfo(render, type)} type="submit">
          More info <img src={Arrow} alt="" />
        </button>
      </div>
    </div>
  );
}
