import axios from "axios";

// You can use your own logic to set your local or production domain
const baseDomain = "http://192.168.0.101";
// The base URL is empty this time due we are using the jsonplaceholder API
const baseURL = `${baseDomain}:8006`;

export default axios.create({
  baseURL
});
