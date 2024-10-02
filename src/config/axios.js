import axios from "axios";

const api = axios.create({
  baseURL: "http://14.225.220.131:8080/api/",
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
