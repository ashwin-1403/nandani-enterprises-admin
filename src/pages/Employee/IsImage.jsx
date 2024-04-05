// import { useState } from "react";
import DefaultImage from "../../assets/img/EmployeImg.png";

function IsImage({ Url }) {
  // const [isPrintableImage, setIsPrintableImage] = useState(true);
  const imageUrl = Url;

  // const handleImageLoad = () => {
  //   // Image loaded successfully, do nothing
  // };

  // const handleImageError = () => {
  //   // Image failed to load, set isPrintableImage to false
  //   setIsPrintableImage(false);
  // };

  return (
    <div className="printImageDiv">
      {/* {isPrintableImage ? (
        <img
          className="employeImg"
          src={imageUrl === null ? DefaultImage : imageUrl}
          alt="Printable"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : ( */}
      <img
        className="employeImg"
        src={imageUrl === null ? DefaultImage : imageUrl}
        alt="Default"
      />
      {/* )} */}
    </div>
  );
}

export default IsImage;
