const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
const STATICVAR = require("../helpers/utils").staticVar;
let { initModel } = require('../helpers/utils')


const findUserByIdService = async (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await initModel.user.findOne({
                where: { id: idUser },
                include: [
                    {
                        model: initModel.account,
                        as: "account_",
                    },
                    {
                        model: initModel.rol,
                        as: "rol_",
                    },
                ],
            });
            if (user) {
                delete user.dataValues.password
                user.dataValues.role = user.dataValues.rol_.dataValues.role;
                return resolve(user)
            }
            reject(false)
        } catch (error) {
            reject(error)
        }
    })
}

async function findUsersServices() {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await initModel.user.findAll({
                include: [
                    {
                        model: initModel.rol,
                        as: "rol_",
                    },
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
                    {
                        model: initModel.card,
                        as: "cards",
                    },
                ],
                // attributes: { exclude: ['password'] }
            });
            if (users) {
                users.map((user) => {
                    delete user.dataValues.password;
                    user.dataValues.role = user.dataValues.rol_.dataValues.role;
                    delete user.dataValues.rol_idrol
                    delete user.dataValues.rol_
                    delete user.dataValues.documentNumber
                    delete user.dataValues.documentType
                    // delete user.dataValues.statusActive
                    delete user.dataValues.account_idaccount
                    delete user.dataValues.postalCode
                    // delete user.dataValues.role
                })
                return resolve(users)
            } else {
                reject(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}

async function updateStatusActiveService(userId, statusActive) {
    return new Promise(async (resolve, reject) => {
        try {
            await initModel.user.update({ statusActive }, {
                where: { id: userId },
            });

            let user = await initModel.user.findOne({
                where: { id: userId },
            });
            if (user) {
                return resolve(true)
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    findUserByIdService,
    findUsersServices,
    updateStatusActiveService
}