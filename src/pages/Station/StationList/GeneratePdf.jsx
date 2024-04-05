import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportTemplate from "./ReportTemplate";
import DownloadIcon from "../../../assets/img/qrCodedownloadIcon.png";

function GeneratePdf({
  managerName,
  managerNumber,
  stationId,
  stationName,
  address,
}) {
  const [drawImaged, setDrawImaged] = useState();
  const downloadQRCode = (stationId) => {
    const canvas = document.getElementById(stationId);

    // Create a new canvas with A4 dimensions and higher DPI (e.g., 300 DPI)
    const a4Canvas = document.createElement("canvas");
    const dpi = 75;
    a4Canvas.width = (100 * dpi) / 25.4; // A4 width in pixels at 300 DPI
    a4Canvas.height = (100 * dpi) / 25.4; // A4 height in pixels at 300 DPI

    const a4Context = a4Canvas.getContext("2d");

    // Calculate the scaling factor for the QR code
    const qrCodeWidth = canvas?.width;
    const qrCodeHeight = canvas?.height;
    // eslint-disable-next-line no-unsafe-optional-chaining
    const scaleFactorX = a4Canvas?.width / qrCodeWidth;
    // eslint-disable-next-line no-unsafe-optional-chaining
    const scaleFactorY = a4Canvas?.height / qrCodeHeight;
    const scaleFactor = Math.min(scaleFactorX, scaleFactorY);

    // Calculate the position to center the QR code on the A4 canvas
    const xOffset = (a4Canvas.width - qrCodeWidth * scaleFactor) / 2;
    const yOffset = (a4Canvas.height - qrCodeHeight * scaleFactor) / 2;

    // Draw the QR code onto the A4 canvas with proper scaling
    a4Context.drawImage(
      canvas,
      xOffset,
      yOffset,
      qrCodeWidth * scaleFactor,
      qrCodeHeight * scaleFactor,
    );

    // Convert the A4 canvas to a data URL
    const qrCodeURL = a4Canvas.toDataURL("image/png");
    setDrawImaged(qrCodeURL);
  };
  useEffect(() => {
    downloadQRCode(stationId);
  }, [stationId]);
  return (
    <div>
      <PDFDownloadLink
        document={
          <ReportTemplate
            managerName={managerName}
            managerNumber={managerNumber}
            address={address}
            stationName={stationName}
            drawImage={drawImaged}
          />
        }
        fileName={`${stationName}.pdf`}
      >
        <img src={DownloadIcon} alt="downloadIcon" />
      </PDFDownloadLink>
    </div>
  );
}
export default GeneratePdf;
