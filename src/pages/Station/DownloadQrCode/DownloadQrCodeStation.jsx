import QRCode from "qrcode.react";
import "./DownloadQrcodeStation.scss";
import GeneratePdf from "../StationList/GeneratePdf";

function DownloadQrCodeStation({
  managerName,
  managerNumber,
  address,
  stationId,
  stationName,
}) {
  return (
    <>
      <QRCode
        className="QrCodestation"
        id={stationId}
        value={stationId}
        size={200}
      />
      <button
        // onClick={() => downloadQRCode(stationId, stationName)}
        className="qrcodeDownloadIcon"
        type="button"
      >
        <GeneratePdf
          managerName={managerName}
          managerNumber={managerNumber}
          address={address}
          stationName={stationName}
          stationId={stationId}
        />
      </button>
    </>
  );
}

export default DownloadQrCodeStation;
