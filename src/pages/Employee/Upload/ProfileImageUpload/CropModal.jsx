import Modal from "react-bootstrap/Modal";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./CropModal.scss";

export default function CropModal(props) {
  const {
    src,
    crop,
    onImageLoaded,
    onCropChange,
    handleCropSubmit,
    show,
    onHide,
  } = props;
  return (
    <Modal
      className="modalMain"
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header onClick={onHide} closeButton />
      <Modal.Body>
        <div className="modalBody">
          <ReactCrop
            src={src}
            crop={crop}
            onImageLoaded={onImageLoaded}
            onChange={onCropChange}
            minWidth={250}
            minHeight={250}
            maxWidth={250}
            maxHeight={250}
          />
          <button
            type="button"
            className="cropAndSaveBtn mt-3 "
            onClick={handleCropSubmit}
          >
            Crop and Save
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
