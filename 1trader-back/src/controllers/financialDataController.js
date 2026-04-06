const SerpApi = require("google-search-results-nodejs");
const {
    getDataGoogleFilterActiveService,
    getDataGoogleService,
} = require("../services/googleServices");
const { response } = require("../helpers/utils");
const search = new SerpApi.GoogleSearch(
    "641cf5882802f085a54bd1af6eb5a2620333ca32c6765150296c5270846e63fb"
);

async function getFinancialActive(req, res) {
    try {
        let dataGoogleFinancial = await getDataGoogleService(req.query.active, process.env.APY_KEY_GOOGLE_1);
        if (dataGoogleFinancial) {
            if (dataGoogleFinancial.hasOwnProperty('error')) {
                console.log('squeduleTask === La cuenta se ha quedado sin búsquedas.');
                let r1 = await getData(process.env.APY_KEY_GOOGLE_1)
                if (r1.hasOwnProperty('error')) {
                    console.log('squeduleTask 1 === La cuenta se ha quedado sin búsquedas.');
                    let r2 = await getData(process.env.APY_KEY_GOOGLE_2)
                    if (r2.hasOwnProperty('error')) {
                        console.log('squeduleTask 2 === La cuenta se ha quedado sin búsquedas.');
                        let r3 = await getData(process.env.APY_KEY_GOOGLE_3)
                        if (r3.hasOwnProperty('error')) {
                            console.log('squeduleTask 3 === La cuenta se ha quedado sin búsquedas.');
                            let r4 = await getData(process.env.APY_KEY_GOOGLE_4)
                            if (r4.hasOwnProperty('error')) {
                                console.log('squeduleTask 4 === La cuenta se ha quedado sin búsquedas.');
                                let r5 = await getData(process.env.APY_KEY_GOOGLE_5)
                                if (r5.hasOwnProperty('error')) {
                                    console.log('squeduleTask 4 === La cuenta se ha quedado sin búsquedas.');
                                } else {
                                    // console.log('Mostrando r5', r5);
                                    //console.log('Mostrando r1', r1);
                                    let filterData = r5?.futures_chain?.map((el) => {
                                        // console.log(el);
                                        return {
                                            stock: el.stock,
                                            price: el.price,
                                            extracted_price: el.extracted_price,
                                            currency: el.currency,
                                            percentage: el.price_movement.prcentage,
                                            movement: el?.price_movement?.movement,
                                            serpapi_link: el.serpapi_link,
                                        };
                                    });
                                    // console.log(filterData);
                                    return response("Activos encontrados", 200, res, "ok", filterData);
                                }
                            } else {
                                // console.log('Mostrando r4', r4);
                                //console.log('Mostrando r1', r1);
                                let filterData = r4?.futures_chain?.map((el) => {
                                    // console.log(el);
                                    return {
                                        stock: el.stock,
                                        price: el.price,
                                        extracted_price: el.extracted_price,
                                        currency: el.currency,
                                        percentage: el.price_movement.prcentage,
                                        movement: el?.price_movement?.movement,
                                        serpapi_link: el.serpapi_link,
                                    };
                                });
                                // console.log(filterData);
                                return response("Activos encontrados", 200, res, "ok", filterData);
                            }
                        } else {
                            //console.log('Mostrando r3', r3);
                            //console.log('Mostrando r1', r1);
                            let filterData = r3?.futures_chain?.map((el) => {
                                // console.log(el);
                                return {
                                    stock: el.stock,
                                    price: el.price,
                                    extracted_price: el.extracted_price,
                                    currency: el.currency,
                                    percentage: el.price_movement.prcentage,
                                    movement: el?.price_movement?.movement,
                                    serpapi_link: el.serpapi_link,
                                };
                            });
                            // console.log(filterData);
                            return response("Activos encontrados", 200, res, "ok", filterData);
                        }
                    } else {
                        // console.log('Mostrando r2', r2);
                        //console.log('Mostrando r1', r1);
                        let filterData = r2?.futures_chain?.map((el) => {
                            // console.log(el);
                            return {
                                stock: el.stock,
                                price: el.price,
                                extracted_price: el.extracted_price,
                                currency: el.currency,
                                percentage: el.price_movement.prcentage,
                                movement: el?.price_movement?.movement,
                                serpapi_link: el.serpapi_link,
                            };
                        });
                        // console.log(filterData);
                        return response("Activos encontrados", 200, res, "ok", filterData);
                    }
                } else {
                    //console.log('Mostrando r1', r1);
                    let filterData = r1?.futures_chain?.map((el) => {
                        // console.log(el);
                        return {
                            stock: el.stock,
                            price: el.price,
                            extracted_price: el.extracted_price,
                            currency: el.currency,
                            percentage: el.price_movement.prcentage,
                            movement: el?.price_movement?.movement,
                            serpapi_link: el.serpapi_link,
                        };
                    });
                    // console.log(filterData);
                    return response("Activos encontrados", 200, res, "ok", filterData);
                }
            } else {
                let filterData = dataGoogleFinancial?.futures_chain?.map((el) => {
                    // console.log(el);
                    return {
                        stock: el.stock,
                        price: el.price,
                        extracted_price: el.extracted_price,
                        currency: el.currency,
                        percentage: el.price_movement.prcentage,
                        movement: el?.price_movement?.movement,
                        serpapi_link: el.serpapi_link,
                    };
                });
                // console.log(filterData);
                return response("Activos encontrados", 200, res, "ok", filterData);
            }

        } else {
            return response("Activos encontrados", 400, res, "false", []);
        }
    } catch (error) {
        return response(
            "Error al tratar de consultar las apis de Google Financial",
            500,
            res,
            "false",
            []
        );
    }
}

let getData = async (api_key) => {
    let d = await getDataGoogleService('amazon', api_key)
    return d
}

let getDataFilter = async (param, api_key) => {
    let d = await getDataGoogleService(param, api_key)
    return d
}

async function getFinancialFilterActive(req, res) {
    try {
        let data = await getDataGoogleFilterActiveService(req.query.url, process.env.APY_KEY_GOOGLE_1);
        if (data) {
            if (data.hasOwnProperty('error')) {
                console.log('squeduleTask === La cuenta se ha quedado sin búsquedas.');
                let r1 = await getDataFilter(eq.query.url, process.env.APY_KEY_GOOGLE_1)
                if (r1.hasOwnProperty('error')) {
                    console.log('squeduleTask 1 === La cuenta se ha quedado sin búsquedas.');
                    let r2 = await getDataFilter(eq.query.url, process.env.APY_KEY_GOOGLE_2)
                    if (r2.hasOwnProperty('error')) {
                        console.log('squeduleTask 2 === La cuenta se ha quedado sin búsquedas.');
                        let r3 = await getDataFilter(eq.query.url, process.env.APY_KEY_GOOGLE_3)
                        if (r3.hasOwnProperty('error')) {
                            console.log('squeduleTask 3 === La cuenta se ha quedado sin búsquedas.');
                            let r4 = await getDataFilter(eq.query.url, process.env.APY_KEY_GOOGLE_4)
                            if (r4.hasOwnProperty('error')) {
                                console.log('squeduleTask 4 === La cuenta se ha quedado sin búsquedas.');
                                let r5 = await getDataFilter(eq.query.url, process.env.APY_KEY_GOOGLE_5)
                                if (r5.hasOwnProperty('error')) {
                                    console.log('squeduleTask 5 === La cuenta se ha quedado sin búsquedas.');
                                } else {
                                    // console.log('Mostrando r5', r5);
                                    return response("Activos encontrados", 200, res, "ok", r5.summary);
                                }
                            } else {
                                // console.log('Mostrando r4', r4);
                                return response("Activos encontrados", 200, res, "ok", r4.summary);
                            }
                        } else {
                            //console.log('Mostrando r3', r3);
                            return response("Activos encontrados", 200, res, "ok", r3.summary);
                        }
                    } else {
                        // console.log('Mostrando r2', r2);
                        return response("Activos encontrados", 200, res, "ok", r2.summary);
                    }
                } else {
                    //console.log('Mostrando r1', r1);
                    return response("Activos encontrados", 200, res, "ok", r1.summary);
                }
            } else {
                return response("Activos encontrados", 200, res, "ok", data.summary);
            }
        } else {
            return response("Activos encontrados", 400, res, "false", []);
        }
    } catch (error) {
        return response(
            "Error al tratar de consultar las apis de Google Financial",
            500,
            res,
            "false",
            []
        );
    }
}

async function getFinancialInit(req, res) {

    try {
        let data = await getDataGoogleService('amazon', process.env.APY_KEY_GOOGLE_1)
        if (data.hasOwnProperty('error')) {
            console.log('squeduleTask === La cuenta se ha quedado sin búsquedas.');
            let r1 = await getData(process.env.APY_KEY_GOOGLE_1)
            if (r1.hasOwnProperty('error')) {
                console.log('squeduleTask 1 === La cuenta se ha quedado sin búsquedas.');
                let r2 = await getData(process.env.APY_KEY_GOOGLE_2)
                if (r2.hasOwnProperty('error')) {
                    console.log('squeduleTask 2 === La cuenta se ha quedado sin búsquedas.');
                    let r3 = await getData(process.env.APY_KEY_GOOGLE_3)
                    if (r3.hasOwnProperty('error')) {
                        console.log('squeduleTask 3 === La cuenta se ha quedado sin búsquedas.');
                        let r4 = await getData(process.env.APY_KEY_GOOGLE_4)
                        if (r4.hasOwnProperty('error')) {
                            console.log('squeduleTask 4 === La cuenta se ha quedado sin búsquedas.');
                            let r5 = await getData(process.env.APY_KEY_GOOGLE_5)
                            if (r5.hasOwnProperty('error')) {
                                console.log('squeduleTask 5 === La cuenta se ha quedado sin búsquedas.');
                            } else {
                                // console.log('Mostrando r5', r5);
                                return response("Activos encontrados", 200, res, "ok", r5);
                            }
                        } else {
                            // console.log('Mostrando r4', r4);
                            return response("Activos encontrados", 200, res, "ok", r4);
                        }
                    } else {
                        //console.log('Mostrando r3', r3);
                        return response("Activos encontrados", 200, res, "ok", r3);
                    }
                } else {
                    // console.log('Mostrando r2', r2);
                    return response("Activos encontrados", 200, res, "ok", r2);
                }
            } else {
                //console.log('Mostrando r1', r1);
                return response("Activos encontrados", 200, res, "ok", r1);
            }
        }
        else if (Object.keys(data).length > 0) {
            // console.log("dataUsers desde el controller", data);
            // console.log('conectado...........');
            return response("Activos encontrados", 200, res, "ok", data);
            // io.emit("finance-google-data", { data });
        }
    } catch (e) {
        console.log('mostrando el error', e);
    }
}
module.exports = {
    getFinancialActive,
    getFinancialFilterActive,
    getFinancialInit,
};
