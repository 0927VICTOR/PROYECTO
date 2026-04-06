const jwt = require("jsonwebtoken");
const CryptoJS = require('crypto-js');
const moment = require("moment");
require("dotenv").config();

const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");

let initModel = initModels(sequelize);

function generateToken(user) {
  let payload = {
    sub: user,
    iat: moment().unix(),
    exp: moment().add(20, "minute").unix(),
  };
  return jwt.sign(payload, process.env.SECRET_KEY);
}

function generateCardToken(card) {
  var encrypted = CryptoJS.AES.encrypt(card, process.env.SECRET_KEY).toString();
  return encrypted
}


function generateRandomIdUser(num) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let result = "";
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

const response = (msg, code, res, status, data) => {
  return res.status(code).send({ status: status, data, msg });
};

const formatPrice = (val) => {
  try {
    if (val > 0) {
      let value = parseFloat(val).toFixed(0);
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return `$${value}`;
    } else if (val === 0) {
      return "$" + val;
    } else if (val === "") {
      return val;
    }
    return null;
  } catch (error) {
    console.error(error);
  }
}

class staticVar {
  static USER_REGISTER_SUCCESSFUL = "Usuario registrado exitosamente";
  static USER_REGISTER_EXIST = "El usuario ya se encuentra registrado";
  static USER_REGISTER_ERROR = "Error al registrar usuario";
  static USER_CREATE_ERROR = "error method ==> createUserLogin";
  static USER_LOGIN_ERROR = "Error: email o contraseña incorrectas";
  static USER_LOGOUT = "cerrando sesión de usuario";
  static USER_LOGIN_ERROR_METHOD = "error method ==> userLogin";
  static USER_LOGOUT_ERROR_METHOD = "error method ==> userLogout";
  static USER_DELETED_SUCCESSFUL = "Usuario eliminado exitosamente";
  static USER_DELETED_ERROR = "Error: usuario no encontrado";
  static USER_DELETE_USER_ERROR_METHOD = "error method ==> deleteUserLogin";
  static USER_UPDATE_SUCCESSFUL = "Usuario actualizado exitosamente";
  static USER_UPDATE_ERROR = "Error al actulizar el usuario";
  static USER_UPDATE_ERROR_METHOD = "error method ==> updatePasswordUserLogin";
  static USER_UPDATE_AVATAR_SUCCESSFULL = "Avatar actualizado exitosamente";
  static USER_UPDATE_AVATAR_ERROR = "Error al actualizar la imagen Avatar";
  static USER_UPDATE_FILE_ERROR = "Formato de archivo NAME_FILE no valido, extensiones permitidas:  EXT_AVALIBLE";
  static USER_UPDATE_AVATAR_LOADING_ERROR = "Error al cargar la imagen Avatar";
  static USER_UPDATE_AVATAR_ERROR_METHOD =
    "error method ==> updateAvatarUserLogin";
}
module.exports = { staticVar, response, generateRandomIdUser, generateToken, initModel, generateCardToken, formatPrice };
