import axios from 'axios';
require('dotenv').config()
const SerpApi = require('google-search-results-nodejs');

const getDataGoogleService = (param, api_key) => {
    const params = {
        engine: "google_finance",
        q: `${param}`
    };

    return new Promise((resolve, reject) => {
        try {
            let search = getInstance(api_key)
            search.json(params, (data) => {
                if (data) {
                    return resolve(data)
                }
            });
        } catch (e) {
            console.log('Error getDataGoogleService', e);
            return reject(e)
        }

    })
}

const getInstance = (api_key) => {
    let search = new SerpApi.GoogleSearch(api_key);
    return search
}

const getDataGoogleFilterActiveService = (url, api_key) => {
    // console.log('url ==============> ', url);
    const params = {
        api_key: api_key,
    };

    return new Promise(async (resolve, reject) => {
        try {
            let { data } = await axios.get(url, { params })
            return resolve(data)
        } catch (e) {
            console.log('Error getDataGoogleFilterActiveService', e);
            return reject(e)
        }

    })
}
export {
    getDataGoogleService,
    getDataGoogleFilterActiveService
}

{/* <const callback = function (data) {
    console.log(data);
    let { markets } = data
    Object.keys(markets).forEach(el => {
        console.log(markets[el])
    })
    console.log(Object.keys(markets));
};

// Show result as JSON
search.json(params, callback>); */}