import cron from 'node-cron'
import { io } from "../index";
import { getDataGoogleService } from './googleServices';
let cont = 0
const squeduleTask = async function () {
    cron.schedule("*/2 * * * *", async () => {
        console.log('running a task every 10 seconds');
        let data = null
        try {
            data = await getDataGoogleService('amazon', process.env.APY_KEY_GOOGLE_1)
            if (data.hasOwnProperty('error')) {
                console.log('squeduleTask === La cuenta se ha quedado sin búsquedas.');
                data = await getData(process.env.APY_KEY_GOOGLE_1)
                if (data.hasOwnProperty('error')) {
                    console.log('squeduleTask 1 === La cuenta se ha quedado sin búsquedas.');
                    data = await getData(process.env.APY_KEY_GOOGLE_2)
                    if (data.hasOwnProperty('error')) {
                        console.log('squeduleTask 2 === La cuenta se ha quedado sin búsquedas.');
                        data = await getData(process.env.APY_KEY_GOOGLE_3)
                        if (data.hasOwnProperty('error')) {
                            console.log('squeduleTask 3 === La cuenta se ha quedado sin búsquedas.');
                            data = await getData(process.env.APY_KEY_GOOGLE_4)
                            if (data.hasOwnProperty('error')) {
                                console.log('squeduleTask 4 === La cuenta se ha quedado sin búsquedas.');
                                data = await getData(process.env.APY_KEY_GOOGLE_5)
                                if (data.hasOwnProperty('error')) {
                                    console.log('squeduleTask 5 === La cuenta se ha quedado sin búsquedas.');
                                } else {
                                    // console.log('Mostrando data', data);
                                    io.emit("finance-google-data", { data });
                                }
                            } else {
                                // console.log('Mostrando data', data);
                                io.emit("finance-google-data", { data });
                            }
                        } else {
                            //console.log('Mostrando data', data);
                            io.emit("finance-google-data", { data });
                        }
                    } else {
                        // console.log('Mostrando data', data);
                        io.emit("finance-google-data", { data });
                    }
                } else {
                    //console.log('Mostrando data', data);
                    io.emit("finance-google-data", { data });
                }
            }
            else if (Object.keys(data).length > 0) {
                // console.log("dataUsers desde el controller", data);
                // console.log('conectado...........');
                io.emit("finance-google-data", { data });
                // io.emit("finance-google-data", { data });
            }
        } catch (e) {
            console.log('mostrando el error', e);
        }
    });
}

let getData = async (api_key) => {
    let d = await getDataGoogleService('amazon', api_key)
    return d
}

export {
    squeduleTask
}