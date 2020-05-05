import Axios from "axios";
import { API_URL } from "../../constants/API";
import Cookie from "universal-cookie";
import userTypes from "../types/user";

const { ON_LOGIN_FAIL, ON_LOGIN_SUCCESS, ON_LOGOUT_SUCCESS } = userTypes;

const cookieObj = new Cookie();

export const loginHandler = (userData) => {
  return (dispatch) => {
    const { username, password } = userData;

    dispatch({
      type: "ON_LOADING",
      payload: true,
    });

    Axios.get(`${API_URL}/users`, {
      params: {
        username,
        password,
      },
    })
      .then((res) => {
        if (res.data.length > 0) {
          dispatch({
            type: "ON_LOADING",
            payload: false,
          });

          dispatch({
            type: ON_LOGIN_SUCCESS,
            payload: res.data[0],
          });
        } else {
          dispatch({
            type: ON_LOGIN_FAIL,
            payload: "Username atau password salah",
          });

          dispatch({
            type: "ON_LOADING",
            payload: false,
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: ON_LOGIN_FAIL,
          payload: "Terjadi kesalahan jaringan.",
        });

        dispatch({
          type: "ON_LOADING",
          payload: false,
        });
        console.log(err);
      });
  };
};

export const userKeepLogin = (userData) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/users`, {
      params: {
        id: userData.id,
      },
    })
      .then((res) => {
        if (res.data.length > 0) {
          dispatch({
            type: ON_LOGIN_SUCCESS,
            payload: res.data[0],
          });
        } else {
          dispatch({
            type: ON_LOGIN_FAIL,
            payload: "Username atau password salah",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const logoutHandler = () => {
  cookieObj.remove("authData", { path: "/" });
  return {
    type: ON_LOGOUT_SUCCESS,
  };
};

export const registerHandler = (userData) => {
  return (dispatch) => {

    dispatch({
      type: "ON_LOADING",
      payload: true,
    });

    Axios.get(`${API_URL}/users`, {
      params: {
        username: userData.username,
      },
    })
      .then((res) => {
        if (res.data.length > 0) {
          dispatch({
            type: "ON_REGISTER_FAIL",
            payload: "Username sudah digunakan",
          });

          dispatch({
            type: "ON_LOADING",
            payload: false,
          });

        } else {
          Axios.post(`${API_URL}/users`, { ...userData, role: "user" })
            .then((res) => {
              console.log(res.data);
              dispatch({
                type: "ON_LOADING",
                payload: false,
              });

              dispatch({
                type: ON_LOGIN_SUCCESS,
                payload: res.data,
              });
            })
            .catch((err) => {
              dispatch({
                type: ON_LOGIN_FAIL,
                payload: "Terjadi kesalahan jaringan.",
              });

              dispatch({
                type: "ON_LOADING",
                payload: false,
              });

              console.log(err);
            });
        }
      })
      .catch((err) => {
        dispatch({
          type: ON_LOGIN_FAIL,
          payload: "Terjadi kesalahan jaringan.",
        });

        dispatch({
          type: "ON_LOADING",
          payload: false,
        });

        console.log(err);
      });
  };
};

export const cookieChecker = () => {
  return {
    type: "COOKIE_CHECK",
  };
};

