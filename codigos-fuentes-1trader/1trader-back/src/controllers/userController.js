const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
const STATICVAR = require("../helpers/utils").staticVar;
const response = require("../helpers/utils").response;
const randomIdUser = require("../helpers/utils").generateRandomIdUser;
const { generateToken } = require("../helpers/utils");
/// singleton implementar

// organizar la ortografia en los comentarios
/// dioccionaro de mensajes y errores
let initModel = initModels(sequelize);
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const fs = require("fs");
const {
  findUserByIdService,
  updateStatusActiveService,
} = require("../services/userService");
const { deleteFile } = require("../services/uploadServices");
const {
  findAllUsers,
  emitNotification,
  findAllUsersSockets,
  InitgetAllUsers,
} = require("../socket/socket");

dotenv.config();
let port = process.env.PORT;
let host = process.env.HOST_URL;
let server = process.env.SERVER_URL;
/**
 * Función para crear un usuario.
 */

async function createUser(req, res) {
  let user;
  let userExist;
  let idUserExist;
  req = req.body.data;

  try {
    let idUser = randomIdUser(8);
    idUserExist = await initModel.user.findAll({
      where: {
        idUser: idUser,
      },
    });
    if (idUserExist.length == 0) {
      userExist = await initModel.user.findAll({
        where: {
          email: req.user.email,
        },
      });
      if (userExist.length == 0) {
        let password = "";
        if (req.user.password) {
          password = await bcrypt.hash(req.user.password, 10);
        }

        let account = await initModel.account.create({});

        let userCreate = await initModel.user.create({
          idUser: idUser,
          fullName: req.user.fullName,
          email: req.user.email,
          phone: req.user.phone,
          password: password,
          rol_idrol: req.user.role,
          account_idaccount: account.dataValues.idAccount,
          termsAndConditions: req.user.termAndConditions,
          documentNumber: req.user?.documentNumber
            ? req.user?.documentNumber
            : null,
          documentType: req.user?.documentType ? req.user?.documentType : null,
          registerStatus: true,
          status: true,
          finishRegister: false,
          indicative: req.user.indicative,
          accountVerify: req.user.role !== 3 || req.user.role !== 1 ? 2 : 1,
        });
        user = await initModel.user.findAll({
          where: {
            id: userCreate.dataValues.id,
          },
          include: [
            {
              model: initModel.rol,
              as: "rol_",
            },
          ],
        });
        delete user[0].dataValues.password;
        user[0].dataValues.role = user[0].dataValues.rol_.dataValues.role;
        delete user[0].dataValues.rol_;
        if (user) {
          let responses = response(
            STATICVAR.USER_REGISTER_SUCCESSFUL,
            201,
            res,
            "ok",
            user
          );
          return responses;
        }
      } else if (userExist) {
        let responses = response(
          STATICVAR.USER_REGISTER_EXIST,
          400,
          res,
          "false",
          []
        );
        return responses;
      } else {
        let responses = response(
          STATICVAR.USER_REGISTER_ERROR,
          400,
          res,
          "false",
          []
        );
        return responses;
      }
    } else {
      createUser(req, res);
    }
  } catch (error) {
    throw (STATICVAR.USER_CREATE_ERROR, error);
  }
}

/**
 * Función para consultar si el usuario que se esta logeando existe
 * en la base de datos y si coinciden los datos de entrada.
 */

async function userLogin(req, res) {
  req = req.body.data.user;
  const { password } = req;
  try {
    let user = await initModel.user.findOne({
      where: { email: req.email },
      include: [
        {
          model: initModel.rol,
          as: "rol_",
        },
        {
          model: initModel.account,
          as: "account_",
        },
      ],
      attributes: [
        "id",
        "idUser",
        "fullName",
        "email",
        "avatar",
        "termsAndConditions",
        "finishRegister",
        "password",
      ],
    });
    if (Object.keys(user).length > 0) {
      const login = await bcrypt.compare(password, user.dataValues.password);
      delete user.dataValues.password;
      if (login) {
        user.dataValues.role = user.dataValues.rol_.dataValues.role;
        delete user.dataValues.rol_;
        const dataUser = {
          user: user,
          accessToken: generateToken(user),
        };
        console.log("Aqui llego : ", user.dataValues.role);
        if (user.dataValues.role === "User") {
          let statusActive = await updateStatusActiveService(
            user.dataValues.id,
            true
          );
          if (statusActive) {
            if (user.dataValues.role !== "Admin") {
              await emitNotification(
                `${user.dataValues.fullName} ha iniciado sesión`,
                "Admin",
                "Inicio de sesión"
              );
            }
            await findAllUsersSockets();
            return response("Usuario logeado.", 200, res, "ok", dataUser);
          }
          return response(STATICVAR.user_ERROR, 400, res, false, []);
        } else {
          return response("Usuario logeado.", 200, res, "ok", dataUser);
        }
      } else {
        let responses = response(
          "El usuario no se encuentra registrado",
          400,
          res,
          false,
          []
        );
        return responses;
      }
    }
  } catch (error) {
    response(STATICVAR.user_ERROR_METHOD, 400, res, false, []);
    // throw (STATICVAR.user_ERROR_METHOD, error);
  }
}

/**
 * Función para consultar si el usuario que se esta logeando existe
 * en la base de datos y si coinciden los datos de entrada.
 */
async function userLogout(req, res) {
  req = req.body.data.user;
  try {
    let status = {
      statusActive: false,
    };
    let userOut = await initModel.user.update(status, {
      where: { id: req.id },
    });
    if (userOut) {
      let user = await findUserByIdService(req.id);
      if (user) {
        if (user.dataValues.role == "User") {
          console.log("llego aqui ", status);
          await emitNotification(
            `${user.dataValues.fullName} ha cerrado sesión`,
            "Admin",
            "Cierre de sesión"
          );
        }
        await findAllUsersSockets();

        return response(STATICVAR.USER_LOGOUT, 200, res, "ok", []);
      }
    }
    return response(STATICVAR.user_ERROR, 400, res, false, []);
  } catch (error) {
    throw (STATICVAR.USER_LOGOUT_ERROR_METHOD, error);
  }
}

/**
 * Función para eliminar un usuario
 */

async function deleteUserLogin(req, res) {
  try {
    req = req.query;
    const user = await initModel.user.destroy({
      where: { id: req.id },
    });
    if (user == 1) {
      let responses = response(
        STATICVAR.USER_DELETED_SUCCESSFUL,
        200,
        res,
        "ok",
        []
      );
      await InitgetAllUsers();
      await findAllUsersSockets();
      return responses;
    } else {
      let responses = response(
        STATICVAR.USER_DELETED_ERROR,
        400,
        res,
        false,
        []
      );
      return responses;
    }
  } catch (error) {
    throw (STATICVAR.USER_DELETE_USER_ERROR_METHOD, error);
  }
}

/**
 * Función para actualizar la contraseña de un usuario
 */

async function updatePasswordUserLogin(req, res) {
  req = req.body.data;
  try {
    const passwordNew = await bcrypt.hash(req.user.password, 10);
    let password = {
      password: passwordNew,
    };
    const user = await initModel.user.update(password, {
      where: { id: req.user.id },
    });
    if (user[0] == "1") {
      let responses = response(
        STATICVAR.USER_UPDATE_AVATAR_SUCCESSFULL,
        200,
        res,
        "ok",
        []
      );
      return responses;
    }
    let responses = response(STATICVAR.USER_UPDATE_ERROR, 400, res, false, []);
    return responses;
  } catch (error) {
    throw (STATICVAR.USER_UPDATE_ERROR_METHOD, error);
  }
}

/**
 * Función para actualizar la imagen  de un usuario
 */
//// validar extenciones de imagenes
/// optimización de img
//// obtener img ruta

const validateFile = async (files) => {
  return new Promise(async (resolve, reject) => {
    if (files.length > 0) {
      resolve(true);
    } else {
      reject(false);
    }
  });
};

async function updateFile(req, res) {
  let user = null;
  let { idUser } = req.params;
  let { fileName } = req.body;
  try {
    user = await findUserByIdService(idUser);
    if (user && user.dataValues.avatar) {
      if (deleteFile(user.dataValues.avatar)) {
        user = await initModel.user.update(
          { avatar: fileName },
          {
            where: { id: idUser },
          }
        );
        if (user[0] == "1") {
          user = await findUserByIdService(idUser);
          findAllUsersSockets()
          return response(
            STATICVAR.USER_UPDATE_AVATAR_SUCCESSFULL,
            200,
            res,
            "ok",
            user
          );
        }
      } else {
        return false;
      }
    } else {
      console.log("updateFile", fileName);
      user = await initModel.user.update(
        { avatar: fileName },
        {
          where: { id: idUser },
        }
      );
      if (user[0] == "1") {
        user = await findUserByIdService(idUser);
        return response(
          STATICVAR.USER_UPDATE_AVATAR_SUCCESSFULL,
          200,
          res,
          "ok",
          user
        );
      }
    }
  } catch (error) {
    throw (STATICVAR.USER_UPDATE_AVATAR_ERROR_METHOD, error);
  }
}

async function updateFileDocuments(req, res) {
  let user = null;
  let { idUser } = req.params;
  let { documents } = req.body;
  try {
    user = await findUserByIdService(idUser);
    if (
      user &&
      user.dataValues.documentImagenFront &&
      user.dataValues.documentImagenPost
    ) {
      if (
        deleteFile(user.dataValues.documentImagenFront) &&
        deleteFile(user.dataValues.documentImagenPost)
      ) {
        user = await initModel.user.update(
          {
            documentImagenFront: documents.documentImagenFront,
            documentImagenPost: documents.documentImagenPost,
          },
          {
            where: { id: idUser },
          }
        );
        if (user[0] == "1") {
          user = await findUserByIdService(idUser);
          return response(
            STATICVAR.USER_UPDATE_AVATAR_SUCCESSFULL,
            200,
            res,
            "ok",
            user
          );
        }
      } else {
        return false;
      }
    } else {
      user = await initModel.user.update(
        {
          documentImagenFront: documents.documentImagenFront,
          documentImagenPost: documents.documentImagenPost,
        },
        {
          where: { id: idUser },
        }
      );
      if (user[0] == "1") {
        user = await findUserByIdService(idUser);
        return response(
          STATICVAR.USER_UPDATE_AVATAR_SUCCESSFULL,
          200,
          res,
          "ok",
          user
        );
      }
    }
  } catch (error) {
    throw (STATICVAR.USER_UPDATE_AVATAR_ERROR_METHOD, error);
  }
}

/**
 * Función para actualizar datos generales de un usuario
 */

async function updateUserLogin(req, res) {
  try {
    const { id } = req.params;
    const { fullName, email, phone, documentNumber, postalCode, indicative } =
      req.body.data.user;
    let { documentType } = req.body.data.user;
    // Reivisar bien la logica para los tipos de documentos...
    // Falta revisar este metodo si el usuario es administrador el campo finishRegister debe de ir en true o null
    let data = {
      fullName: fullName,
      email: email,
      phone: phone,
      documentNumber: documentNumber,
      documentType: documentType,
      postalCode: postalCode,
      finishRegister: true,
      indicative: indicative,
    };
    await initModel.user.update(data, {
      where: { id: id },
    });

    let user = await findUserByIdService(id);
    if (user) {
      let responses = response(
        "Usuario actualizado exitosamente",
        200,
        res,
        "ok",
        user
      );
      return responses;
    } else {
      let responses = response(
        "Error al actualizar datos del usuario",
        400,
        res,
        false,
        []
      );
      return responses;
    }
  } catch (error) {
    throw (STATICVAR.USER_UPDATE_AVATAR_ERROR_METHOD, error);
  }
}

/**
 * Función para actualizar datos generales de un usuario
 */

async function updateFinishRegisterUser(req, res) {
  try {
    const { userId } = req.params;
    let data = {
      finishRegister: true,
    };
    await initModel.user.update(data, {
      where: { id: userId },
    });

    let user = await initModel.user.findOne({
      where: { id: userId },
    });
    delete user.dataValues.password;
    if (user) {
      let responses = response(
        "Usuario actualizado exitosamente",
        200,
        res,
        "ok",
        user
      );
      return responses;
    } else {
      let responses = response(
        "Error al actualizar datos del usuario",
        400,
        res,
        false,
        []
      );
      return responses;
    }
  } catch (error) {
    throw (STATICVAR.USER_UPDATE_AVATAR_ERROR_METHOD, error);
  }
}

async function findUser(req, res) {
  try {
    const { role } = req.headers;
    const { userId } = req.params;
    let user = await initModel.user.findOne({
      where: { id: userId },
      include: [
        {
          model: initModel.rol,
          as: "rol_",
        },
        {
          model: initModel.account,
          as: "account_",
        },
      ],
    });
    if (role == "User") {
      delete user.dataValues.documentNumber;
      delete user.dataValues.documentType;
      delete user.dataValues.statusActive;
      delete user.dataValues.account_idaccount;
      delete user.dataValues.postalCode;
      delete user.dataValues.role;
    }
    delete user.dataValues.password;
    user.dataValues.role = user.dataValues.rol_.dataValues.role;
    delete user.dataValues.rol_idrol;
    delete user.dataValues.rol_;
    if (user) {
      let responses = response("Users", 200, res, "ok", user);
      return responses;
    } else {
      let responses = response("Error al buscar usuario", 400, res, false, []);
      return responses;
    }
  } catch (error) {
    console.log(STATICVAR.USER_UPDATE_AVATAR_ERROR_METHOD, error);
  }
}

async function findUsers(req, res) {
  try {
    const { role } = req.headers;

    let users = await initModel.user.findAll({
      include: [
        {
          model: initModel.rol,
          as: "rol_",
        },
        {
          model: initModel.account,
          as: "account_",
        },
        {
          model: initModel.card,
          as: "cards",
        },
      ],
    });
    if (users) {
      users.map((user) => {
        delete user.dataValues.password;
        user.dataValues.role = user.dataValues.rol_.dataValues.role;
        delete user.dataValues.rol_idrol;
        delete user.dataValues.rol_;
        // delete user.dataValues.documentNumber;
        // delete user.dataValues.documentType;
        // delete user.dataValues.statusActive
        delete user.dataValues.account_idaccount;
        delete user.dataValues.postalCode;
        // delete user.dataValues.role
      });
      let responses = response("Users", 200, res, "ok", users);
      return responses;
    } else {
      let responses = response("Error al buscar usuarios", 400, res, false, []);
      return responses;
    }
  } catch (error) {
    throw (STATICVAR.USER_UPDATE_AVATAR_ERROR_METHOD, error);
  }
}

async function validateEmail(req, res) {
  try {
    const { email, id } = req.body;
    if (id !== null) {
      const user = await initModel.user.findOne({ where: { id: id } });
      if (user) {
        if (email === user?.email) {
          return response("Email el del usuario", 200, res, "ok", { email: 1 });
        }
        const emailExist = await initModel.user.findOne({
          where: { email: email },
        });
        if (!emailExist) {
          return response("Email no es de nadie", 200, res, "ok", { email: 2 });
        }
        return response("Email esta siendo utilizado", 200, res, "ok", {
          email: 3,
        });
      } else {
        if (email !== null) {
          const emailExist = await initModel.user.findOne({
            where: { email: email },
          });
          if (!emailExist) {
            return response("Email no es de nadie", 200, res, "ok", {
              email: 2,
            });
          }
          return response("Email esta siendo utilizado", 200, res, "ok", {
            email: 3,
          });
        } else {
          return response("Email no es de nadie", 500, res, "ok", { email: 4 });
        }
      }
    } else {
      if (email !== null) {
        const emailExist = await initModel.user.findOne({
          where: { email: email },
        });
        if (!emailExist) {
          return response("Email no es de nadie", 200, res, "ok", { email: 2 });
        }
        return response("Email esta siendo utilizado", 200, res, "ok", {
          email: 3,
        });
      } else {
        return response("Email no es de nadie", 200, res, "ok", { email: 2 });
      }
    }
  } catch (error) {
    return response("Ha ocurrido un error interno", 500, res, "ok", {
      email: 4,
    });
  }
}

async function findData(data_user) {
  let data = "";
  let descriptions = data_user.description;
  if (descriptions.length > 1) {
    for (let description in descriptions) {
      data += data_user.description[description].label + ",";
    }
  } else {
    data += data_user.description[0].label;
  }
  data = data.slice(0, data.length - 1);
  return data;
}

async function updateAcountVerify(req, res) {
  let data_user = req.body.data;
  let data;
  if (data_user.accountVerify == 1) {
    data = {
      accountVerify: data_user.accountVerify,
      description: "",
    };
  } else {
    data = {
      accountVerify: data_user.accountVerify,
      description: await findData(data_user),
    };
  }
  let userUpdate = initModel.user.update(data, {
    where: { id: data_user.clientId },
  });
  if (userUpdate) {
    let user = await initModel.user.findOne({
      where: { id: data_user.clientId },
    });
    if (user) {
      return response("Usuario actualizado exitosamente", 200, res, "ok", user);
    } else {
      return response("Error al actualizar el usuario ", 400, res, false, []);
    }
  }
}

module.exports = {
  userLogin,
  userLogout,
  createUser,
  deleteUserLogin,
  updatePasswordUserLogin,
  updateFile,
  updateFileDocuments,
  updateUserLogin,
  findUser,
  findUsers,
  updateFinishRegisterUser,
  validateEmail,
  updateAcountVerify,
};
