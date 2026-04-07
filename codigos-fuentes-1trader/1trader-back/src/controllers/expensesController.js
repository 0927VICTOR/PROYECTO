const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
const response = require("../helpers/utils").response;
let initModel = initModels(sequelize);
const bcrypt = require("bcrypt");
const { Op, Model } = require("sequelize");
const { getNotificationsUserDepositsExpenses, getPaymentsNotificationsUser, emitNotificationCreationDepositExpenses, getCantDepositsExpenses } = require("../socket/socket");

async function findAllExpenses(req, res) {
  try {
    let expenses = await initModel.expenses.findAll({});
    if (expenses) {
      let responses = response("retiros del usuario", 200, res, "ok", expenses);
      return responses;
    } else {
      let responses = response(
        "Error al buscar los retiros",
        400,
        res,
        "false",
        []
      );
      return responses;
    }
  } catch (error) {
    console.log(error);
  }
}

async function findExpensesByUserId(req, res) {
  // Aqui se dede de hace un join debido a que se puede llegar a expenses com usuarios -> cuenta -> expenses
  try {
    const { userId } = req.params;
    let user = await initModel.user.findOne({
      where: {
        id: userId,
      },
      include: [
        {
          model: initModel.account,
          as: "account_",
          include: [
            {
              model: initModel.expenses,
              as: "expenses",
            }
          ]
        },
      ]
    });
    console.log("user", user)
    if (user) {
      delete user.dataValues.password
      if (user) {
        return response("retiros del usuario", 200, res, "ok", user);
      }
    } else {
      return response("Error al buscar los retiros", 400, res, "false", []);
    }
  } catch (error) {
    return response("Ha ocurrido un error interno", 500, res, "false", [])
  }
}

async function findExpensesById(req, res) {
  try {
    const { idExpenses } = req.params;

    let expenses = await initModel.expenses.findOne({
      where: {
        idExpenses: idExpenses,
      },
    });
    if (expenses) {
      let responses = response("retiro del usuario", 200, res, "ok", expenses);
      return responses;
    } else {
      let responses = response(
        "Error al buscar los retiro",
        400,
        res,
        "false",
        []
      );
      return responses;
    }
  } catch (error) {
    console.log(error);
  }
}

async function createExpenses(req, res) {
  try {
    const { id, idUser, fullName, email } = req.body.data.user;
    const { bank, keyAccount, amount, swiftCode, hour } = req.body.data.expenses;
    let countRow = await initModel.user.update(fullName, { where: { id: id } })
    if (countRow) {
      let user = await initModel.user.findOne({ where: { id: id } })
      if (user) {
        let expense = await initModel.expenses.create({
          amount: amount,
          expensesDate: Date.now(),
          bank: bank,
          keyAccount: keyAccount,
          swiftCode: swiftCode,
          state: 0,
          account_idaccount: user.dataValues.account_idaccount,
          hour: hour
        });
        if (expense) {
          // console.log('createExpenses', expense);
          await emitNotificationCreationDepositExpenses(`${fullName} ha solicitado un retiro.`, 'Admin', 'Retiro')
          await getPaymentsNotificationsUser()
          // await getCantDepositsExpenses()
          return response("Retiros del usuario", 201, res, "ok", expense);
        }
        response("Error al crear los los retiro", 400, res, "false", []);
      }
      else {
        return response("Error al crear los los retiro", 400, res, "false", [])
      }
    }
    else {
      return response("Error al crear los los retiro", 400, res, "false", [])
    }

  } catch (error) {
    console.log(error);
    return response("Ha ocurrido un error interno", 500, res, "false", [])
  }
}

module.exports = {
  createExpenses,
  findAllExpenses,
  findExpensesByUserId,
  findExpensesById,
};
