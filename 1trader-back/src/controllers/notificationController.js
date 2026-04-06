const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
const response = require("../helpers/utils").response;
let initModel = initModels(sequelize);
const bcrypt = require("bcrypt");

async function notificationsUsers() {
  let userNotificatios = await initModel.user.findAll({
    include: [
      {
        model: initModel.account,
        as: "account_",
        include: [
          {
            model: initModel.deposit,
            as: "deposits",
            attributes: [
              'idDeposit',
              //
              // [sequelize.fn('COUNT', sequelize.col('idDeposit')), 'deposits']


            ],
            group: ['deposit.idDeposit'],
          },
          {
            model: initModel.expenses,
            as: "expenses",

          },
        ],
      },
    ],
  });
  if (userNotificatios.length > 0) {
    //[0].dataValues.account_.dataValues.deposits[0].dataValues
    console.log("userNotificatios", userNotificatios)
    //return response("Notifications users...", 200, res, "ok", userNotificatios);
  } else {
    // return response("Error get notifications users ...", 400, res, "false", []);
  }
}
module.exports = {
  notificationsUsers,
};
