import axios from "axios";

const api = axios.create({
  baseURL: "https://66f3691871c84d8058789db4.mockapi.io/orders",
});

//  làm 1 hành động gì đó trc khi call api
const handleBefore = (config) => {
  const token = localStorage.getItem("token");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
};

const handleError = (error) => {
  console.log(error);
};

api.interceptors.request.use(handleBefore, handleError);

export default api;
