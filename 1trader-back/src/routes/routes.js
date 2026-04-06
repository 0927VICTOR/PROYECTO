const express = require("express");
let morgan = require('morgan')
const fileUpload = require('express-fileupload')
const controllerUser = require('../controllers/userController');
const controllerAccount = require('../controllers/accountController');
const controllerDeposit = require('../controllers/depositController');
const controllerExpenses = require('../controllers/expensesController');
const controllerBank = require('../controllers/bankController');
const controllerPayment = require('../controllers/paymentAdapter')
// const upload = require("../libs/storange").default;

const { uploapFile, getImageFile } = require('../services/uploadServices');
const { getCountries, getCountryById } = require("../controllers/country");
const { getFinancialActive, getFinancialFilterActive, getFinancialInit } = require("../controllers/financialDataController");
const { createActive, findAllActives } = require("../controllers/actives");

const router = express();
router.use(morgan('dev'));
//            =====> RUTAS MODULO USUARIO
router.post('/api/user', controllerUser.createUser);
router.post('/api/validate/email', controllerUser.validateEmail);
router.post('/api/update/acount/verify', controllerUser.updateAcountVerify);
router.get('/api/account/:userId', controllerAccount.searchBalance);
router.get('/api/account/deposit/expense/:userId', controllerAccount.findDepositAndExpenseById);
router.get('/api/account/deposit/expense', controllerAccount.findDepositAndExpense);
router.get('/api/user', controllerUser.findUsers);
router.get('/api/user/id/:userId', controllerUser.findUser);
router.get('/api/user/photo/:imageFile', getImageFile)
router.use(fileUpload())
router.put('/api/user/upload-file/:idUser', uploapFile);
router.put('/api/user/update-file-documents/:idUser', controllerUser.updateFileDocuments);
router.put('/api/user/updatePassword', controllerUser.updatePasswordUserLogin);
router.put('/api/user/photo-update/:idUser', controllerUser.updateFile)


//            =====> Petición para actualizar datos generales de usuario
router.put('/api/user/update/:id', controllerUser.updateUserLogin);
router.put('/api/user/finishRegister/:userId', controllerUser.updateFinishRegisterUser);
//            =====> Petición para eliminar usuario
router.delete('/api/user', controllerUser.deleteUserLogin);
//            =====> Petición para logear usuario
router.post('/api/user/login', controllerUser.userLogin);
//            =====>Petición para cerrar sesión de usuario
router.post('/api/user/logout', controllerUser.userLogout);

//            =====>RUTAS MODULO DEPOSITOS
router.post('/api/deposit', controllerDeposit.createDeposit);
router.put('/api/deposit/expense', controllerDeposit.updateDepositAndExpenses);
router.get('/api/deposit/:userId', controllerDeposit.findDepositByIdUser);
router.get('/api/deposits', controllerDeposit.findAllDeposits);
router.get('/api/deposit/id/:idDeposit', controllerDeposit.findDepositById);

//            =====> RUTAS MODULO RETIROS
router.post('/api/expenses', controllerExpenses.createExpenses);
router.get('/api/expenses', controllerExpenses.findAllExpenses);
router.get('/api/expenses/:userId', controllerExpenses.findExpensesByUserId);
router.get('/api/expenses/id/:idExpenses', controllerExpenses.findExpensesById);

//            =====> RUTAS MODULO PAISES
router.get('/api/countries', getCountries);
router.get('/api/country/:id', getCountryById);


//            =====> RUTAS MODULO BANCK
router.post('/api/bank', controllerBank.createBank);
router.get('/api/bank', controllerBank.findBanks);
router.get('/api/bank/:idBank', controllerBank.findBankById);
router.put('/api/bank/:idBank', controllerBank.updateBank);
router.delete('/api/bank/:idBank', controllerBank.deleteBank);

//            =====> RUTAS MODULO GOOGLE FINANCIAL
router.get('/api/get-google-fianancial', getFinancialActive);
router.get('/api/get-google-fianancial-init', getFinancialInit);
router.get('/api/get-google-fianancial-filter-active', getFinancialFilterActive);


//            =====> RUTAS MODULO PAYMENTS
router.post('/api/create-payment', controllerPayment.createPayment);
router.get('/api/get-payments', controllerPayment.findAllPayments);
router.put('/api/update-payment/:id', controllerPayment.updateActive);

//            =====> RUTAS MODULO ACTIVOS
router.post('/api/create-active', createActive);
router.get('/api/get-actives', findAllActives);

module.exports = { router };