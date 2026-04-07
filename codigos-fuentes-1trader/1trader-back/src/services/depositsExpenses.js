const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
let initModel = initModels(sequelize);

export async function findDepositAndExpense() {
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
            return user;
        }
        return false;
    } catch (error) {
        console.log("Error al consultar depositos y retiros", error);
    }
}