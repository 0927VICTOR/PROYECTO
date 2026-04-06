import { findUserByIdService, findUsersServices } from "../services/userService";

const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
const response = require("../helpers/utils").response;
let initModel = initModels(sequelize);

async function createPayment(req, res) {
  try {
    let totalInvesmentAmount = 0;
    let updateBalance;
    let userUpdate;
    let count = 0;
    req = req.body.data.earningPayment;
    let actives = req.actives;
    let user = await initModel.user.findOne({
      where: { id: req.clientId },
      include: [
        {
          model: initModel.account,
          as: "account_",
        },
      ],
    });
    if (user) {
      for (let active in actives) {
        let data_actives = actives[active];
        await initModel.payment.create({
          title: data_actives.title,
          price: data_actives.price,
          percentage: data_actives.price_movement.percentage,
          value: data_actives.price_movement.value,
          movement: data_actives.price_movement.movement,
          investmentValue: data_actives.payment.investmentValue,
          date: data_actives.payment.date,
          hour: data_actives.payment.hour,
          result: data_actives.payment.result,
          total: data_actives.payment.total,
          status: data_actives.payment.status,
          account_idAccount: user.dataValues.account_idaccount,
        });
        totalInvesmentAmount += data_actives.payment.investmentValue;
        count++;
        if (count == actives.length) {
          break;
        }
      }
      let total = {
        balance: user.dataValues.account_.balance - totalInvesmentAmount,
      };
      updateBalance = await initModel.account.update(total, {
        where: { idAccount: user.dataValues.account_idaccount },
      });
      if (updateBalance) {
        userUpdate = await initModel.user.findOne({
          where: { id: req.clientId },
          include: [
            {
              model: initModel.account,
              as: "account_",
              include: [
                {
                  model: initModel.payment,
                  as: "payments",
                }
              ]
            },
          ],
          attributes: { exclude: ['password'] }
        });
      }
      if (userUpdate) {
        return response(
          "activos registrados existosamente",
          201,
          res,
          "ok",
          userUpdate
        );
      } else {
        return response("error al crear los activos", 400, res, "false", []);
      }
    } else {
      return response("error usuario no encontrado ", 400, res, "false", []);
    }
  } catch (error) {
    console.log(error);
    return response("Lo sentimos ha ocurrido un error interno ", 500, res, "false", []);
  }
}

async function findAllPayments(req, res) {
  try {
    let payments = await findUsersServices()
    if (payments) {
      return response("Pagos y ganancias", 200, res, "ok", payments);
    } else {
      return response(
        "Error al buscar los pagos y ganancias",
        400,
        res,
        "false",
        []
      );
    }
  } catch (error) {
    return response("Lo sentimos ha ocurrido un error interno ", 500, res, "false", []);
  }
}

async function findAllPaymentsById(req, res) {
  try {
    let payments = await initModel.payment.findAll({});
    if (payments) {
      return response("Pagos y ganancias", 200, res, "ok", payments);
    } else {
      return response(
        "Error al buscar los pagos y ganancias",
        400,
        res,
        "false",
        []
      );
    }
  } catch (error) {
    return response("Lo sentimos ha ocurrido un error interno ", 500, res, "false", []);
  }
}

const updateActive = async (req, res) => {

  let { id } = req.params
  let payload = req.body
  console.log(payload);
  try {
    let user = await initModel.user.findOne({
      where: { id: id },
      include: [
        {
          model: initModel.account,
          as: "account_",
        },
      ],
    })
    if (user) {
      if (payload.statusPayment) {
        let total = {
          balance: user.dataValues.account_.balance + payload.total,
        };
        let updateBalance = await initModel.account.update(total, {
          where: { idAccount: user.dataValues.account_idaccount },
        })
        if (updateBalance) {
          let data = { status: payload.status, statusPayment: payload.statusPayment, total: payload.total, result: payload.result }
          let payment = await initModel.payment.update(data, { where: { idPayment: payload.idPayment } })
          if (payment) {
            let userUpdate = await initModel.user.findOne({
              where: { id: id },
              include: [
                {
                  model: initModel.account,
                  as: "account_",
                  include: [
                    {
                      model: initModel.payment,
                      as: "payments",
                    }
                  ]
                },
              ],
              attributes: { exclude: ['password'] }
            });
            if (userUpdate) {
              return response(
                "activos registrados existosamente",
                201,
                res,
                "ok",
                userUpdate
              );
            } else {
              return response("error al crear los activos", 400, res, "false", []);
            }
          }
        }
      } else {
        let data = { status: payload.status, statusPayment: payload.statusPayment, total: payload.total, result: payload.result }
        let payment = await initModel.payment.update(data, { where: { idPayment: payload.idPayment } })
        if (payment) {
          let userUpdate = await initModel.user.findOne({
            where: { id: id },
            include: [
              {
                model: initModel.account,
                as: "account_",
                include: [
                  {
                    model: initModel.payment,
                    as: "payments",
                  }
                ]
              },
            ],
            attributes: { exclude: ['password'] }
          });
          if (userUpdate) {
            return response(
              "activos registrados existosamente",
              201,
              res,
              "ok",
              userUpdate
            );
          } else {
            return response("error al crear los activos", 400, res, "false", []);
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    return response("Lo sentimos ha ocurrido un error interno ", 500, res, "false", []);
  }
}

export { createPayment, findAllPayments, updateActive };
