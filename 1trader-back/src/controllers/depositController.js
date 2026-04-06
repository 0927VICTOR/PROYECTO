const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
const response = require("../helpers/utils").response;
let initModel = initModels(sequelize);
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
import { emitNotification, emitNotificationCreationDepositExpenses, getAllDepositsAndExpenses1, getPaymentsNotificationsUser } from "../socket/socket";
import { formatPrice, generateCardToken } from "../helpers/utils";
import { verifyTokenCard } from "../middleware/verfyOauth";
import deposit from "../models/deposit";

/**
 * Funcion para crear un deposito de un usuario
 */
async function createDeposit(req, res) {
  let cards;
  let user;
  let cardExits = false;
  let cardCreate;
  let findCard;
  let idCard

  let { user: userReq, cardInfo, deposit } = req.body.data

  try {
    req = req.body.data;
    let cardUser = req.cardInfo;
    cards = await initModel.card.findAll({
      where: { user_login_id: userReq.id },
    });

    let cardToken = generateCardToken(cardInfo.cardNumber)
    let cvvToken = generateCardToken(cardInfo.ccv)
    let expYearToken = generateCardToken(cardInfo.expYear)
    let monthToken = generateCardToken(cardInfo.month)

    if (cards.length > 0) {
      for (let card in cards) {
        let tokenCard = cards[card]
        let token = await verifyTokenCard(tokenCard.dataValues.cardNumber)
        if (cardInfo.cardNumber === token) {
          idCard = tokenCard.dataValues.idCard
        }
      }
    }

    if (idCard == undefined) {
      cardCreate = await initModel.card.create({
        user_login_id: userReq.id,
        cardNumber: cardToken,
        cvv: cvvToken,
        expYear: expYearToken,
        month: monthToken,
        termAndConditions: cardUser.termAndConditions
      })
    }

    user = await initModel.user.findOne({
      where: { id: userReq.id },
    });

    let createDeposit = await initModel.deposit.create({
      amount: deposit.amount,
      depositDate: deposit.depositDate,
      ecommerce: deposit.ecommerce,
      state: deposit.state,
      account_idaccount: user.dataValues.account_idaccount,
      idCard: idCard ? idCard : cardCreate.dataValues.idCard,
      hour: deposit.hour
    });
    let fullName = {
      fullName: req.user.fullName
    }
    user = await initModel.user.update(fullName, {
      where: { id: req.user.id },
    });

    user = await initModel.user.findOne({
      where: { id: req.user.id },
    });
    delete user.dataValues.password

    if (createDeposit) {
      let responses
      await emitNotificationCreationDepositExpenses(`${req.user.fullName} ha solicitado un depósito.`, 'Admin', 'Depósito')
      await getPaymentsNotificationsUser()
      await getAllDepositsAndExpenses1()
      responses = response("Depósito creado con exito", 201, res, "ok", { deposit: createDeposit, user: user.dataValues });

      return responses
    } else {
      return response("Error al crear el depósito", 400, res, "false", []);
    }
  } catch (error) {
    console.log(error);
    return response("Error al crear el depósito", 400, res, "false", []);
  }
}

async function findAllDeposits(req, res) {
  try {
    let deposits = await initModel.deposit.findAll({});
    if (deposits) {
      let responses = response("retiros del usuario", 200, res, "ok", deposits);
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

async function findDepositByIdUser(req, res) {
  try {
    const { userId } = req.params;

    let user = await initModel.user.findOne({
      where: {
        id: userId,
      },
    });

    let deposits = await initModel.deposit.findAll({
      where: {
        account_idaccount: user.dataValues.account_idaccount,
        //date: { [Op.startsWith]: despositDate },
      },
    });
    if (deposits) {
      let responses
      setTimeout(() => {
        responses = response(
          "Desósitos del usuario",
          200,
          res,
          "ok",
          deposits
        );
      }, 1000);


      return responses;
    } else {
      let responses = response(
        "Error al buscar los depósitos",
        400,
        res,
        "false",
        []
      );
      return responses;
    }
  } catch (error) {
    throw error;
  }
}



async function findDepositById(req, res) {
  try {
    const { idDeposit } = req.params;

    let deposits = await initModel.deposit.findOne({
      where: {
        idDeposit: idDeposit,
      },
    });

    if (deposits) {
      let responses = response(
        "Despósito del usuario",
        200,
        res,
        "ok",
        deposits
      );
      return responses;
    } else {
      let responses = response(
        "Error al buscar el depósito",
        400,
        res,
        "false",
        []
      );
      return responses;
    }
  } catch (error) {
    throw error;
  }
}

async function updateDepositAndExpenses(req, res) {
  let data;
  let dataDeposit = false;
  let newBalance;
  req.body.data.paymentDeposit ? (dataDeposit = true) : (dataDeposit = false);

  dataDeposit
    ? (data = req.body.data.paymentDeposit)
    : (data = req.body.data.paymentExpense);

  let {
    idUser,
    typeOperation,
    idOperation,
    paymentDate,
    amount,
    state,
    description,
    hour
  } = data;
  let user;

  if (description == "") {
    user = await initModel.user.findOne({
      include: [
        {
          model: initModel.account,
          as: "account_",
        },
      ],
      where: { id: idUser },
    });

    let balanceUser = user.dataValues.account_.dataValues.balance;
    if (typeOperation == 'expense') {
      if (amount > balanceUser) {
        return response(
          "No cuenta con el suficiente saldo para realizar el retiro",
          400,
          res,
          false,
          []
        );
      }
    }

    let transaction = await initModel.transaction.create({
      date: paymentDate,
      transactionType: dataDeposit ? "Deposit" : "Expense",
      transactionNumber: idOperation,
      amount: amount,
      status: state,
      user_login_id: user.dataValues.id,
      hour: hour
    });

    if (dataDeposit) {
      let despositUpdate = await initModel.deposit.update({ state: state }, {
        where: { idDeposit: idOperation },
      });
      newBalance = {
        balance: balanceUser + amount,
      };
    } else {
      let expenseUpdate = await initModel.expenses.update({ state: state }, {
        where: { idExpenses: idOperation },
      });
      newBalance = {
        balance: balanceUser - amount,
      };
    }

    let balanceUpdate = await initModel.account.update(newBalance, {
      where: { idAccount: user.dataValues.account_idaccount },
    });

    let userUpdate = await initModel.user.findOne({
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
      where: { id: idUser },
    });

    if (userUpdate) {
      await getPaymentsNotificationsUser()
      await getAllDepositsAndExpenses1()
      dataDeposit == true ?
        await emitNotification(`Se ha aprobado un depósito con valor de ${formatPrice(amount)} USD`, 'User', 'Depósito')
        : await emitNotification(`Se ha aprobado un retiro con valor de ${formatPrice(amount)} USD`, 'User', 'Retiro')

      return response(
        "Despósito aceptado con exito",
        200,
        res,
        "ok",
        userUpdate
      );
    }
  } else {
    if (dataDeposit) {
      let newDeposit = {
        state: state,
        description: description
      }
      let depositUpdate = await initModel.deposit.update(newDeposit, { where: { idDeposit: idOperation } })
      let deposit = await initModel.deposit.findOne({ where: { idDeposit: idOperation } })

      if (deposit) {
        return response(
          "Despósito rechazado con exito",
          200,
          res,
          "ok",
          deposit
        );
      }

    }
    else {
      let newExpense = {
        state: state,
        description: description
      }
      let expenseUpdate = await initModel.expenses.update(newExpense, { where: { idExpenses: idOperation } })
      let expense = await initModel.expenses.findOne({ where: { idExpenses: idOperation } })
      if (expense) {
        return response(
          "Retiro rechazado con exito",
          200,
          res,
          "ok",
          expense
        );
      }

    }
  }
}


export {
  createDeposit,
  findAllDeposits,
  findDepositByIdUser,
  findDepositById,
  updateDepositAndExpenses,
};
