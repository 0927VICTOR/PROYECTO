const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
const response = require("../helpers/utils").response;

/// singleton implementar

// organizar la ortografia en los comentarios
/// dioccionaro de mensajes y errores
let initModel = initModels(sequelize);

async function createBank(req, res) {
  const { name } = req.body.data.bank;
  let bankExist = await initModel.bank.findAll({
    where: { name: name },
  });
  if (bankExist.length > 0) {
    return response(
      "Error el banco ya se encuentra registrado",
      400,
      res,
      false,
      []
    );
  } else {
    let bank = await initModel.bank.create({
      name: name,
    });

    return response("Banco registrado con exito", 201, res, "ok", bank);
  }
}


async function findBanks(req, res) {
    let bankExist = await initModel.bank.findAll({});
    if (bankExist.length > 0) {
      return  response(
        "Bancos registrados ....",
        200,
        res,
        "ok",
        bankExist
      );
    } else {
      return response("Error al buscar los bancos", 400, res, false, []);
    }
  }

  async function findBankById(req, res) {
    const {idBank}= req.params
    let bankExist = await initModel.bank.findOne({where:{idBank:idBank}});
    if (bankExist) {
      return  response(
        "Banco registrado ....",
        200,
        res,
        "ok",
        bankExist
      );
    } else {
      return response("Error al buscar los bancos", 400, res, false, []);
    }
  }

  async function updateBank(req, res) {
    const {idBank}= req.params
    const { name } = req.body.data.bank;
    let data = {
        name: name
    }
    let bankExist = await initModel.bank.update(data,{where:{idBank:idBank}});
    if (bankExist) {
    let bank = await initModel.bank.findOne({where:{idbank:idBank}});
      return  response(
        "banco actualizado con exito",
        200,
        res,
        "ok",
        bank
      );
    } else {
      return response("Error al actualizar el banco", 400, res, false, []);
    }
  }


  async function deleteBank(req, res) {
    const {idBank}= req.params
    let bankExist = await initModel.bank.destroy({where:{idbank:idBank}});
    if (bankExist ==1) {
      return  response(
        "banco eliminado con exito",
        200,
        res,
        "ok",
        []
      );
    } else {
      return response("Error al eliminar el banco", 400, res, false, []);
    }
  }  


module.exports = {
  createBank,
  findBanks,
  findBankById,
  updateBank,
  deleteBank
  
};
