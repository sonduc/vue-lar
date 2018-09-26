import Ls from "./ls";
import { forEach } from "lodash";
const BASE_API = "http://ws-api.lc/api/";
export default {
  async login(loginData) {
    try {
      let response = await axios.post(BASE_API + "login", {
        username: loginData.email,
        password: loginData.password
      });
      Ls.set("auth.token", response.data.access_token);
      toastr["success"]("Logged In!", "Success");
      return response.data.access_token;
    } catch (error) {
      if (error.response.status === 401) {
        toastr["error"]("Invalid Credentials", "Error");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
    }
  },

  async logout() {
    try {
      await axios.get(BASE_API + "logout");

      Ls.remove("auth.token");
      toastr["success"]("Logged out!", "Success");
    } catch (error) {
      console.log("Error", error.message);
    }
  },

  async check() {
    let response = Ls.get("auth.token");
    // console.log(response);

    return !!response;
  },
  //Lấy danh sách các permissions của người đăng nhập hiện tại
  async getProfile() {
    try {
      let response = await axios.get(BASE_API + "profile?include=roles");
      if (response.data.data.roles) {
        let permissions = {};
        forEach(response.data.data.roles.data, role => {
          permissions = { ...permissions, ...role.permissions };
        });
        return permissions;
      }
    } catch (error) {
      console.log("Error", error.message);
    }
  },

  //Check phân quyền của user đối với từng hành động
  async canAccess(permissions, per) {
    if (permissions["admin.super-admin"] || permissions[per]) {
      return true;
    }
    return false;
  }
};
