import { useState } from "react";
import axios from "axios";
import "./documentUpload.scss";
import PlusIcon from "../../../../assets/img/plusIcon.png";
import CrossIcon from "../../../../assets/img/crossIcon.png";
import PostApi from "../../../../services/PostApi";
import GetApi from "../../../../services/GetApi";

export default function DocumentUpload({
  disable,
  setEmployeeData,
  employeeData,
}) {
  const [imageDocuments, setImageDocuments] = useState(
    employeeData?.documentImage || [],
  );
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
      // setLocationImg(completeUploadResponse?.data?.url);
      setImageDocuments((images) => [
        ...images,
        completeUploadResponse?.data?.ImageUrl,
      ]);
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
      setEmployeeData((prev) => ({
        ...prev,
        documentImage: [...prev.documentImage, fileName],
      }));

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
  const handleInput = (event) => {
    const fileData = [];
    for (let i = 0; i < event.target.files.length; i += 1) {
      fileData.push(event.target.files[i]);
    }
    uploadMultiPart(fileData);
    event.target.value = "";
  };

  const removeImage = (index) => {
    const updatedImages = [...employeeData.documentImage];
    updatedImages.splice(index, 1);
    setEmployeeData((prev) => ({ ...prev, documentImage: updatedImages }));
    const updatedImageDocuments = [...imageDocuments];
    updatedImageDocuments.splice(index, 1);
    setImageDocuments(updatedImageDocuments);
  };

  return (
    <div>
      <div className="profileImageInput">
        <div className="d-flex profileImageInputBox">
          {imageDocuments?.map((imageDocument, index) => (
            <div key={index} className="inputFileUploadSec">
              <div className="inputFileUpload">
                {disable ? null : (
                  <button
                    type="button"
                    className="closeIcon"
                    onClick={() => removeImage(index)}
                  >
                    <img
                      className="CloseIconImg"
                      src={CrossIcon}
                      alt="Remove"
                    />
                  </button>
                )}
                <div className="plusIcondiv">
                  <img src={PlusIcon} alt="" />
                </div>
                <div className="documentImg">
                  <img
                    src={imageDocument}
                    className="profileImage"
                    alt="ProfileImage"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="inputFileUploadSec">
            <div className="inputFileUpload">
              <div className="plusIcondiv">
                <img src={PlusIcon} alt="" />
              </div>
              <input
                type="file"
                disabled={disable}
                onChange={handleInput}
                className="filetype"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
