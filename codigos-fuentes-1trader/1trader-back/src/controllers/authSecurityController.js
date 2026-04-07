const verifyTokenSession = require("../middleware/verfyOauth").verifyTokenSision

const validToken = (req, res) => {
    verifyTokenSession(req, res);
};

module.exports ={validToken};