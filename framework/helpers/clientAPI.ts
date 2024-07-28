import axios from "axios";
import { config } from "../config/config";

const clientRestfulBooker = axios.create({
  baseURL: config.apiURL,
  validateStatus: function(status: number) {
    return status <= 500;
  },
});

export { clientRestfulBooker };