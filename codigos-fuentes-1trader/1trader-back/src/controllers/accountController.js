const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
const response = require("../helpers/utils").response;
let initModel = initModels(sequelize);

/**
 * Función para consultar el abalance del usuario
 */
/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */

async function searchBalance(req, res) {
  const { userId } = req.params;
  try {
    const user = await initModel.user.findOne({
      where: { id: userId },
      include: [
        {
          model: initModel.account,
          as: "account_",
        },
      ],
      attributes: ["id"],
    });

    if (user) {
      let responses = response("balance...", 200, res, "ok", user);
      return responses;
    }
    let responses = response(
      "Error al consultar el balance",
      400,
      res,
      false,
      []
    );
    return responses;
  } catch (error) {
    console.log("Error al consultar el balance", error);
  }
}

async function findDepositAndExpenseById(req, res) {
  const { userId } = req.params;
  try {
    const user = await initModel.user.findOne({
      where: { id: userId },
      include: [
        {
          model: initModel.account,
          as: "account_",
          include: [
            {
              model: initModel.deposit,
              as: "deposits",
            },
            {
              model: initModel.expenses,
              as: "expenses",
            },
          ],
        },
        {
          model: initModel.card,
          as: "cards",
        },
      ],
    });

    if (user) {
      let responses = response("balance...", 200, res, "ok", user);
      return responses;
    }
    let responses = response(
      "Error al consultar el balance",
      400,
      res,
      false,
      []
    );
    return responses;
  } catch (error) {
    console.log("Error al consultar el balance", error);
  }
}


async function findDepositAndExpense(req, res) {
  const { userId } = req.params;
  try {
    const user = await initModel.user.findAll({

      include: [
        {
          model: initModel.account,
          as: "account_",
          include: [
            {
              model: initModel.deposit,
              as: "deposits",
            },
            {
              model: initModel.expenses,
              as: "expenses",
            },
          ],
        },
        {
          model: initModel.card,
          as: "cards",
        },
      ],
    });

    if (user) {
      let responses = response("balance...", 200, res, "ok", user);
      return responses;
    }
    let responses = response(
      "Error al consultar el balance",
      400,
      res,
      false,
      []
    );
    return responses;
  } catch (error) {
    console.log("Error al consultar el balance", error);
  }
}




module.exports = {
  searchBalance,
  findDepositAndExpenseById,
  findDepositAndExpense
};
