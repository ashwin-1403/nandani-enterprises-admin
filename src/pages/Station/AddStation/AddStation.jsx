import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GenericStation from "../GenericStation";
import { AddStationInitialData } from "../../../Components/Constant";
import PostApi from "../../../services/PostApi";
import { ToastSuccess } from "../../../Utils/Toast/ToastMsg";
import GetApi from "../../../services/GetApi";

function AddStation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [genericData, setGenericData] = useState(AddStationInitialData);
  const handleSubmit = async () => {
    try {
      const response = await PostApi(`auth/create-station`, genericData);
      if (response?.status === 201) {
        ToastSuccess(response?.message);
        try {
          const res = await GetApi(`auth/get-station/${response?.stationId}`);
          if (res?.status === 200) {
            // setGenericData(response?.data);
            navigate(`/stations/${response?.stationId}`, {
              state: {
                editStationDisable: true,
                showQrCodeByStationId: true,
                editData: res?.data,
              },
              replace: true,
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <GenericStation
      setGenericData={setGenericData}
      genericData={genericData}
      state={state}
      header="Add Station"
      onSubmit={handleSubmit}
    />
  );
}

export default AddStation;
