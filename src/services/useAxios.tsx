import axios from 'axios'
import jwt_decode from "jwt-decode";
import dayjs from 'dayjs'
import { store } from '../global';
import { loginUser, logoutUser } from '../global/auth/auth.slice';
import moment from 'moment';

export const baseURL = 'http://162.254.35.36:4300';

const useAxios = () => {
  const stateGlobale = store.getState();
  const { auth } = stateGlobale;
  const dispatch = store.dispatch;


  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${auth.access_token}` }
  });


  axiosInstance.interceptors.request.use(async (req: any) => {
    const time = moment().unix();
    const user = auth.access_token ? jwt_decode(auth.access_token) : null;
    let isExpired = false;
    if (user !== null) {
      if (time > user.exp) {
        isExpired = true
      }
    }

    if (!isExpired) return req;

    const response = await axios(`${baseURL}/auth/refresh/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.refresh_token}`
      }
    }).then(r => r);
    const { data } = response;
    if (data.access_token !== undefined && data.refresh_token !== undefined) {
      // console.log('in refrech token');

      dispatch(loginUser({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        isAuthenticated: true
      }))

      req.headers.Authorization = `Bearer ${data.access_token}`;
      return req
    } else {
      dispatch(logoutUser());
      document.location = '/pages/login';
    }
  })

  return axiosInstance
}

export default useAxios;