
import imgAvatar from '../css/img/avatar-user.png'
import noImage from '../css/img/no-image.png'
import imagenVisa from '../css/img/imagen-visa.png'



export const topBarHeight = 64
export const sideNavWidth = 260
export const navbarHeight = 60
export const sidenavCompactWidth = 80
export const containedLayoutWidth = 1200
export const MAILFORMAT = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
export const ERRORNETWORK = 'Network Error'
export const BASE_URL_DEV = 'http://localhost:4000/1trader/api'
export const BASE_URL_PROD = process.env.REACT_APP_API_URL || 'https://back.1trader.online/1trader/api'
export const BASE_URL_NGROK = 'https://d302-181-62-56-224.ngrok-free.app/api'
// export const SOCKET_URL = 'http://localhost:4000'
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'https://back.1trader.online'
export const IMG_AVATAR = imgAvatar
export const NO_IMAGE = noImage
export const MSG_DEPOSI = 'Su solicitud está siendo procesada, esto podría tardar algunos minutos. Espere un momento'
export const SYSTEM_NOT_AVALIBLE = 'Lo sentimos el sistema no esta diponible en estos momentos.'
export const ERROR_TRANSACTION = 'No sa ha podido relizar esta transacción.'
export const ERROR_OPERATION = 'No sa ha podido relizar esta operación.'
export const DATA_UPDATE = 'Datos actualizados correctamente.'
export const DATA_DELETE = 'Se ha elimiando el registri correctamente.'
export const IMG_MASTERCARD = '/assets/images/logos/visa.png'
export const IMG_MASTERCARD_OLD = '/assets/images/logos/mastercard.png'
export const IMG_VISA_OLD = '/assets/images/logos/logo-visa.png'
export const IMG_VISA = '/assets/images/logos/mastercard.png';
export const IMGEN_VISA = imagenVisa
export const ROL_USER = 'User'
export const ROL_USER_ADMIN = 'Admin'
export const ROL_USER_SYSTEM = 'User system'
