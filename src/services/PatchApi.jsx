import { axiosInstance } from "../App";

export default async function PatchApi(endpoint, data) {
  const response = await axiosInstance.patch(endpoint, data);
  return response?.data;
}
