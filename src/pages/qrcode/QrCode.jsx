import QRCode from "qrcode.react";
import "../Station/GenericStation.scss";
import "./qrcode.scss";

function QrCode(props) {
  const { qrCodeByText } = props;
  return (
    <div>
      <QRCode value={qrCodeByText} />
    </div>
  );
}
export default QrCode;
