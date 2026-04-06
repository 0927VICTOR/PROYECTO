const validToken = require("../controllers/authSecurityController").validToken
const express = require("express");
const authSecurity = express.Router();

/**
 * 
 * *************************************************************************************************
 *                                          Rutas de authSecurity
 * *************************************************************************************************
 */

/** *************************  PETICIONES POST   **************************/
//            =====>Petición para validar el roken del usuario
authSecurity.post("/api/validate/token", validToken);



module.exports ={authSecurity};