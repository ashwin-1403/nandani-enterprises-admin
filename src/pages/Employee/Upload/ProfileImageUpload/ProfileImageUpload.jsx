/* eslint-disable jsx-a11y/alt-text */
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import GalleryIcon from "../../../../assets/img/GalleryIcon.png";
import PostApi from "../../../../services/PostApi";
import GetApi from "../../../../services/GetApi";
import CropModal from "./CropModal";
import { ToastFailure } from "../../../../Utils/Toast/ToastMsg";

export default function ProfileImageUpload({
  setEmployeeData,
  employeeData,
  disable,
}) {
  const [locationImg, setLocationImg] = useState(
    employeeData?.profileImage || "",
  );
  const [modalShow, setModalShow] = useState(false);
  const [fileInfo, setFileInfo] = useState();
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({
    aspect: 1 / 1,
    width: 250,
    height: 250,
  });
  const imageRef = useRef(null);

  const onImageLoaded = (image) => {
    imageRef.current = image;
  };

  const onCropChange = (newCrop) => {
    setCrop(newCrop);
  };
  async function getCroppedImg(image, crop, fileName, fileType) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    // Convert the canvas content to a Blob
    const croppedBlob = await new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });

    // Create a File object with the desired name
    const file = new File([croppedBlob], fileName, {
      lastModified: new Date().getTime(),
      type: fileType,
    });
    return file;
  }
  const getChunkSize = async (fileSize) => {
    let FILE_CHUNK = 5242880; // 3MB
    if (fileSize > 31457280) {
      FILE_CHUNK = Math.floor(fileSize / 6);
    }
    return FILE_CHUNK;
  };

  const uploadMultipartFile = async (multipartData) => {
    let lastChunkSize;
    const FILE_CHUNK_SIZE = await getChunkSize(multipartData.selectedFile.size);
    const fileSize = multipartData.selectedFile.size;

    let NUM_CHUNKS = Math.floor(fileSize / FILE_CHUNK_SIZE);

    if (fileSize % FILE_CHUNK_SIZE > 0) {
      NUM_CHUNKS += 1;
    }

    const promisesArray = [];
    let start;
    let end;
    let blob;
    /* eslint-disable no-await-in-loop */
    for (let index = 1; index < NUM_CHUNKS + 1; index += 1) {
      start = (index - 1) * FILE_CHUNK_SIZE;
      end = index * FILE_CHUNK_SIZE;

      if (index === NUM_CHUNKS - 1) {
        lastChunkSize = fileSize - end;
        if (lastChunkSize < 5242880) {
          // if chunksize is less than 5 MB then merge it in second last chunk
          NUM_CHUNKS -= 1;
        }
      }

      blob =
        index < NUM_CHUNKS
          ? multipartData.selectedFile.slice(start, end)
          : multipartData.selectedFile.slice(start);

      const response = await GetApi(
        `${process.env.REACT_APP_API}getPresigned`,
        {
          fileName: multipartData?.fileName,
          partNumber: index,
          uploadId: multipartData?.uploadId,
        },
      );
      if (response?.status === 200) {
        const signedUrl = response?.data;
        /* eslint-disable no-loop-func */
        const uploadResponse = new Promise((resolve) => {
          axios
            .put(signedUrl, blob, {
              headers: { "Content-Type": multipartData.selectedFile.type },
            })
            .then((res) => {
              resolve(res);
            });
        });
        /* eslint-disable no-loop-func */
        promisesArray.push(uploadResponse);
      }
    }
    /* eslint-disable no-await-in-loop */

    const resolvedArray = await Promise.all(promisesArray);

    const uploadPartsArray = [];

    resolvedArray.forEach((resolvedPromise, index) => {
      uploadPartsArray.push({
        ETag: JSON.parse(resolvedPromise.headers.etag),
        PartNumber: index + 1,
      });
    });

    const data = {
      fileName: multipartData.fileName,
      parts: uploadPartsArray,
      uploadId: multipartData.uploadId,
    };

    const completeUploadResponse = await PostApi(
      `${process.env.REACT_APP_API}completeUpload`,
      data,
    );
    if (completeUploadResponse?.status === 200) {
      setLocationImg(completeUploadResponse?.data?.ImageUrl);
    }
  };
  const uploadMedia = async (selectedFile, i, percentagePerFile, arrLength) => {
    const extensionArr = selectedFile.name.split(".");
    const fileExtension = extensionArr[extensionArr.length - 1].toLowerCase(); //
    const contentTypeName = selectedFile.type;
    const response = await PostApi(`${process.env.REACT_APP_API}startUpload`, {
      extension: fileExtension,
      contentType: contentTypeName,
    });
    if (response?.status === 200) {
      const uploadId = response?.data?.UploadId;
      const fileName = response?.data?.Key;
      setEmployeeData((prev) => ({ ...prev, profileImage: fileName }));

      const multipartData = {
        selectedFile,
        uploadId,
        fileName,
        i,
        percentagePerFile,
        arrLength,
      };
      uploadMultipartFile(multipartData);
    }
  };

  const uploadMultiPart = (File) => {
    const percentagePerFile = [];
    const totalFileSize = 0;
    for (let i = 0; i < File.length; i += 1) {
      const perFileSize = Math.floor((File[i].size * 100) / totalFileSize);
      percentagePerFile.push(perFileSize);
      uploadMedia(File[i], i, percentagePerFile, File.length);
    }
  };
  const handleCropSubmit = async () => {
    if (imageRef.current && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageRef.current,
        crop,
        fileInfo?.name,
        fileInfo?.type,
      );
      uploadMultiPart([croppedImageUrl]);
      setModalShow(false);
    }
  };

  const acceptImageOnly = (file) => {
    const imageFormat = ["image/jpeg", "image/jpg", "image/png"];
    return file?.type.includes("image/") && imageFormat.includes(file?.type);
  };
  const handleInput = (event) => {
    const file = event.target.files[0];
    setFileInfo(file);
    if (acceptImageOnly(event.target.files[0])) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = function () {
          const width = img.naturalWidth;
          const height = img.naturalHeight;
          if (width <= 250 && height <= 250) {
            ToastFailure(
              "Image dimensions should not be less than or equal to 250x250 pixels",
            );
          } else {
            setSrc(reader.result);
            setModalShow(true);
          }
        };
      };
      reader.readAsDataURL(file);
    } else {
      ToastFailure("Error: Please upload a PNG, JPEG, or JPG file.");
    }
    event.target.value = "";
  };
  useEffect(() => {}, [modalShow]);
  return (
    <div className="row">
      <div className="col-md-4 mx-auto">
        <div className="profileImageInput">
          <div className="profileBorder">&nbsp;</div>
          {locationImg && (
            <img
              src={locationImg}
              className="profileImage"
              alt="ProfileImage"
            />
          )}
          <input
            disabled={disable}
            type="file"
            accept="image/jpg, image/jpeg, image/png"
            onChange={handleInput}
            className="filetype"
          />
          {src && (
            <CropModal
              src={src}
              crop={crop}
              onImageLoaded={onImageLoaded}
              onCropChange={onCropChange}
              handleCropSubmit={handleCropSubmit}
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
          )}
          <div className="galleryIconDiv">
            <img className="galleryIcon" src={GalleryIcon} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
