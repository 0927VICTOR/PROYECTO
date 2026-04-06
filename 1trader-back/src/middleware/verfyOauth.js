const jwt = require("jsonwebtoken");
const { findUserByIdService } = require("../services/userService");
const { initModel } = require("../helpers/utils");
const response = require("../helpers/utils").response;
import { promisifyAll } from 'bluebird';
const CryptoJS = require('crypto-js');
promisifyAll(jwt);
require('dotenv').config()
module.exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  let token;
  if (!authHeader) {
    return res.status(401).send({
      Authorization: false,
      message: "Falta la cabecera de autenticación",
    });
  } else {
    token = authHeader.split(" ")[1];
  }
  if (token == null) {
    return res.status(401).send({ Authorization: false, message: "Forbidden" });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err)
      return res
        .status(401)
        .send({ Authorization: false, message: "El token es invalido" });
    req.user = user;
    return next();
  });
};

module.exports.verifyTokenSision = (req, res) => {
  const authHeader = req.headers["authorization"];
  let token;
  if (!authHeader) {
    return res.status(401).send({
      Authorization: false,
      message: "Falta la cabecera de autenticación",
    });
  } else {
    token = authHeader.split(" ")[1];
    token = token.replaceAll('"', "");
  }
  if (token == null) {
    return res.status(401).send({ Authorization: false, message: "Forbidden" });
  }
  jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
    if (err) {
      return res
        .status(401)
        .send({ Authorization: false, message: "El token es invalido" });
    }
    // console.log('llego', user);
    req.user = user;
    let {
      id,
      idUser,
      fullName,
      email,
      avatar,
      termsAndConditions,
      finishRegister,
      role,
    } = req.user.sub;
    try {
      let getUser = await findUserByIdService(id)
      // console.log('hola', getUser.dataValues.account_);
      if (getUser) {
        return response("El token es valido", 200, res, "ok", {
          user: {
            role,
            ...getUser.dataValues
          },
          Authorization: true,
        });
      }
    } catch (error) {
      console.log('Mostrando el error', error);
    }
  });
};



module.exports.verifyTokenCard = async (cards) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cards, process.env.SECRET_KEY);
    const originalCard = bytes.toString(CryptoJS.enc.Utf8);
    return originalCard
  } catch (e) {
    throw e;
  }
};
