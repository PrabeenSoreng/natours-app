import axios from "axios";
import { showAlert } from "./alerts";

export const updateSetting = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "http://localhost:8000/api/v1/users/updateMyPassword"
        : "http://localhost:8000/api/v1/users/updateMe";
    const result = await axios({
      method: "PATCH",
      url,
      data,
    });
    if (result.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} successfully updated!`);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
