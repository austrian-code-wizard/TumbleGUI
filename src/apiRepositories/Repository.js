import axios from "axios";

// You can use your own logic to set your local or production domain
const baseDomain = "http://0.0.0.0";
// The base URL is empty this time due we are using the jsonplaceholder API
const baseURL = `${baseDomain}:8006`;

export default axios.create({
  baseURL
});
