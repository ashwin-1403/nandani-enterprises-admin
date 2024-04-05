import axios from "axios";
import { formatDateForFilter } from "../../../Auth/schema";
import { ToastFailure, ToastSuccess } from "../../../Utils/Toast/ToastMsg";

export default async function DownloadDetailSheet(
  url,
  userId,
  startDate,
  endDate,
) {
  const startD =
    startDate === null ? "" : `${formatDateForFilter(startDate)} 00:00:00`;
  const endD =
    endDate === null ? "" : `${formatDateForFilter(endDate)} 23:59:59`;
  try {
    await axios
      .get(
        `${process.env.REACT_APP_API}${url}/${userId}?startDate=${startD}&endDate=${endD}`,
      )
      .then(() => {
        ToastSuccess("Success.");
        window.open(
          `${process.env.REACT_APP_API}${url}/${userId}?startDate=${startD}&endDate=${endD}`,
          "_self",
        );
      });
  } catch (error) {
    ToastFailure(error?.response?.data?.message);
  }
}
