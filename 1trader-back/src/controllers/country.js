const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
const response = require("../helpers/utils").response;
let initModel = initModels(sequelize);

const { Op } = require("sequelize");

async function getCountries(req, res) {
    try {
        let countries = await initModel.country.findAll();

        if (countries) {
            return response(
                "Desósito del usuario",
                200,
                res,
                "ok",
                countries
            );
        } else {
            return response(
                "Error al listar países",
                400,
                res,
                "false",
                []
            );
        }
    } catch (error) {
        throw error;
    }
}

async function getCountryById(req, res) {

    try {
        const { idDeposit } = req.params;

        let deposits = await initModel.deposit.findOne({
            where: {
                idDeposit: idDeposit
            },
        });

        if (deposits) {
            let responses = response(
                "Paises",
                200,
                res,
                "ok",
                deposits
            );
            return responses;
        } else {
            let responses = response(
                "Error al listar paises",
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


module.exports = {
    getCountries,
    getCountryById
};
