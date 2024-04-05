import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GenericStation from "../GenericStation";
import { ToastSuccess } from "../../../Utils/Toast/ToastMsg";
import PatchApi from "../../../services/PatchApi";
import Loader from "../../../Utils/Loader/Loader";
import GetApi from "../../../services/GetApi";

function EditStation() {
  const { state } = useLocation();
  const naviagte = useNavigate();
  const [loading, setLoading] = useState(false);
  const [genericData, setGenericData] = useState();
  const stationUrlData = useParams();
  const userId = stationUrlData?.id;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await PatchApi(
        `auth/update-station/${userId}`,
        genericData,
      );
      if (response?.status === 200) {
        setLoading(false);
        ToastSuccess(response?.message);
        naviagte("/stations");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleEditChange = async () => {
    try {
      const res = await GetApi(`auth/get-station/${userId}`);
      if (res?.status === 200) {
        setGenericData({
          stationName: res?.data?.stationName,
          stationManagerName: res?.data?.stationManagerName,
          managerNumber: res?.data?.managerNumber,
          stationCode: res?.data?.stationCode,
          address: res?.data?.address,
          city: res?.data?.city,
          state: res?.data?.state,
          country: "india",
          latitude: res?.data?.latitude,
          longitude: res?.data?.longitude,
          pinCode: res?.data?.pinCode,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    handleEditChange();
  }, []);
  return (
    <div>
      {genericData && (
        <GenericStation
          setGenericData={setGenericData}
          genericData={genericData}
          state={state}
          header="Edit Station"
          onSubmit={handleSubmit}
        />
      )}
      {loading && <Loader startLoading={loading} />}
    </div>
  );
}

export default EditStation;
