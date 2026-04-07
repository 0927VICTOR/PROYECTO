const sequelize = require("../db/connectionDB").sequelize;
const initModels = require("../models/init-models");
const response = require("../helpers/utils").response;
let initModel = initModels(sequelize);

async function findAllActives(req, res) {
    try {
        let actives = await initModel.active.findAll({});
        if (actives) {
            let responses = response("activos", 200, res, "ok", actives);
            return responses;
        } else {
            let responses = response(
                "Error al buscar los activos",
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

async function createActive(req, res) {
    try {
        let active = await initModel.active.create({
            name: req.body.name
        })
        if (active) {
            return response("Activo", 201, res, "ok", active);
        }
        response("Error al crear activos", 400, res, "false", []);
    } catch (error) {
        console.log(error);
        return response("Ha ocurrido un error interno", 500, res, "false", [])
    }
}

module.exports = {
    createActive,
    findAllActives,
};
