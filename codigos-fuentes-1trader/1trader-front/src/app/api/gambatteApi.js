import axios from 'axios'
import { BASE_URL_DEV, BASE_URL_NGROK, BASE_URL_PROD } from '../utils/constant'
// axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.get['ngrok-skip-browser-warning'] = true;
// axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.get['Access-Control-Allow-Credentials'] = true;
// axios.defaults.headers.post['ngrok-skip-browser-warning'] = true;
// axios.defaults.headers.get['ngrok-skip-browser-warning'] = true;
export const gambatteApi = axios.create({ baseURL: BASE_URL_PROD })
