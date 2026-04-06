var DataTypes = require("sequelize").DataTypes;
var _account = require("./account");
var _bank = require("./bank");
var _buy_services = require("./buy_services");
var _card = require("./card");
var _country = require("./country");
var _deposit = require("./deposit");
var _document_type = require("./document_type");
var _expenses = require("./expenses");
var _payment = require("./payment");
var _rol = require("./rol");
var _transaction = require("./transaction");
var _user = require("./user");
var _active = require("./active");

function initModels(sequelize) {
  var account = _account(sequelize, DataTypes);
  var bank = _bank(sequelize, DataTypes);
  var buy_services = _buy_services(sequelize, DataTypes);
  var card = _card(sequelize, DataTypes);
  var country = _country(sequelize, DataTypes);
  var deposit = _deposit(sequelize, DataTypes);
  var document_type = _document_type(sequelize, DataTypes);
  var expenses = _expenses(sequelize, DataTypes);
  var payment = _payment(sequelize, DataTypes);
  var rol = _rol(sequelize, DataTypes);
  var transaction = _transaction(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var active = _active(sequelize, DataTypes);

  deposit.belongsTo(account, { as: "account_", foreignKey: "account_idaccount" });
  account.hasMany(deposit, { as: "deposits", foreignKey: "account_idaccount" });
  expenses.belongsTo(account, { as: "account_", foreignKey: "account_idaccount" });
  account.hasMany(expenses, { as: "expenses", foreignKey: "account_idaccount" });
  payment.belongsTo(account, { as: "account_", foreignKey: "account_idAccount" });
  account.hasMany(payment, { as: "payments", foreignKey: "account_idAccount" });
  user.belongsTo(account, { as: "account_", foreignKey: "account_idaccount" });
  account.hasMany(user, { as: "users", foreignKey: "account_idaccount" });
  expenses.belongsTo(bank, { as: "bank_", foreignKey: "bank" });
  bank.hasMany(expenses, { as: "expenses", foreignKey: "bank" });
  transaction.belongsTo(buy_services, { as: "buy_", foreignKey: "buy_services_idbuy_services" });
  buy_services.hasMany(transaction, { as: "transactions", foreignKey: "buy_services_idbuy_services" });
  user.belongsTo(document_type, { as: "documentType_", foreignKey: "documentType" });
  document_type.hasMany(user, { as: "users", foreignKey: "documentType" });
  user.belongsTo(rol, { as: "rol_", foreignKey: "rol_idrol" });
  rol.hasMany(user, { as: "users", foreignKey: "rol_idrol" });
  buy_services.belongsTo(user, { as: "user_", foreignKey: "user_login_id" });
  user.hasMany(buy_services, { as: "buy_", foreignKey: "user_login_id" });
  card.belongsTo(user, { as: "user_", foreignKey: "user_login_id" });
  user.hasMany(card, { as: "cards", foreignKey: "user_login_id" });
  transaction.belongsTo(user, { as: "user_", foreignKey: "user_login_id" });
  user.hasMany(transaction, { as: "transactions", foreignKey: "user_login_id" });

  return {
    account,
    bank,
    buy_services,
    card,
    country,
    deposit,
    document_type,
    expenses,
    payment,
    rol,
    transaction,
    user,
    active,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
