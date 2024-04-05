import { useNavigate } from "react-router-dom";
import Qrcode from "../../../assets/img/qrCodeIcon.png";
import "./StationTable.scss";
import Table from "../../table/Table";
import TableCol from "../../table/TableCol";
import TableRow from "../../table/TableRow";
import DataNotAvailable from "../../../Components/DataNotFound/DataNotAvailable";
import DownloadQrCodeStation from "../DownloadQrCode/DownloadQrCodeStation";
import Loader from "../../../Utils/Loader/Loader";

export default function Station(props) {
  const { loading, currentTableData, getSerialNumber, currentPage } = props;
  const navigate = useNavigate();

  // const downloadQRCode = (stationId, stationName) => {
  //   const canvas = document.getElementById(stationId);

  //   // Create a new canvas with A4 dimensions and higher DPI (e.g., 300 DPI)
  //   const a4Canvas = document.createElement("canvas");
  //   const dpi = 75;
  //   a4Canvas.width = (100 * dpi) / 25.4; // A4 width in pixels at 300 DPI
  //   a4Canvas.height = (100 * dpi) / 25.4; // A4 height in pixels at 300 DPI

  //   const a4Context = a4Canvas.getContext("2d");

  //   // Calculate the scaling factor for the QR code
  //   const qrCodeWidth = canvas.width;
  //   const qrCodeHeight = canvas.height;
  //   const scaleFactorX = a4Canvas.width / qrCodeWidth;
  //   const scaleFactorY = a4Canvas.height / qrCodeHeight;
  //   const scaleFactor = Math.min(scaleFactorX, scaleFactorY);

  //   // Calculate the position to center the QR code on the A4 canvas
  //   const xOffset = (a4Canvas.width - qrCodeWidth * scaleFactor) / 2;
  //   const yOffset = (a4Canvas.height - qrCodeHeight * scaleFactor) / 2;

  //   // Draw the QR code onto the A4 canvas with proper scaling
  //   a4Context.drawImage(
  //     canvas,
  //     xOffset,
  //     yOffset,
  //     qrCodeWidth * scaleFactor,
  //     qrCodeHeight * scaleFactor,
  //   );

  //   // Convert the A4 canvas to a data URL
  //   const qrCodeURL = a4Canvas.toDataURL("image/png");

  //   // Create a link and trigger the download
  //   const link = document.createElement("a");
  //   link.href = qrCodeURL;
  //   link.download = `${stationName}.png`;
  //   link.click();
  // };
  const handleViewEdit = (UserId) => {
    navigate(`/stations/${UserId}`, {
      state: {
        editStationDisable: true,
      },
      replace: true,
    });
    sessionStorage.setItem("stationCurrentPage", currentPage);
  };
  if (currentTableData?.length === 0) {
    // Display a message when there is no data
    return loading ? <Loader startLoading={loading} /> : <DataNotAvailable />;
  }
  return (
    <Table className="tableStationWidth">
      <TableCol>
        <th>S. No</th>
        <th>Station Code</th>
        <th>Station Name</th>
        <th className="w-25">Address</th>
        <th>
          Station Manager
          <br /> Name
        </th>
        <th>
          Station Manager <br />
          Phone No.
        </th>
        <th>QR Code</th>
        <th>Actions</th>
      </TableCol>

      <TableRow>
        {currentTableData?.length === 0 ? (
          <p>Data Not Found !</p>
        ) : (
          currentTableData?.map((ele, ind) => (
            <tr>
              <td>{getSerialNumber(currentPage, ind)}</td>
              <td>{ele?.stationCode}</td>
              <td>{ele?.stationName}</td>
              <td>{ele?.address}</td>
              <td>{ele?.stationManagerName}</td>
              <td>+91 {ele?.managerNumber}</td>
              <td>
                <div className="d-flex justify-content-evenly gap-1">
                  <div className="qrCode">
                    <img src={Qrcode} alt="Qr Code" />
                  </div>
                  <DownloadQrCodeStation
                    stationName={ele?.stationName}
                    stationId={ele?.stationId}
                    address={ele?.address}
                    managerName={ele?.stationManagerName}
                    managerNumber={ele?.managerNumber}
                    // downloadQRCode={downloadQRCode}
                  />
                </div>
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => handleViewEdit(ele?.stationId)}
                  className="editButton"
                >
                  View / Edit
                </button>
              </td>
            </tr>
          ))
        )}
      </TableRow>
    </Table>
  );
}
