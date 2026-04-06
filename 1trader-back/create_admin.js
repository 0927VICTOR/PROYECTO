const { sequelize } = require("./src/db/connectionDB");
const initModels = require("./src/models/init-models");
const bcrypt = require("bcrypt");

async function run() {
  const models = initModels(sequelize);
  try {
    const roles = await models.rol.findAll();
    console.log("Roles encontrados:", roles.map(r => ({ id: r.idRol, name: r.role })));

    const adminRole = roles.find(r => r.role === 'Admin');
    if (!adminRole) {
      console.error("No se encontró el rol 'Admin'.");
      return;
    }

    const password = await bcrypt.hash("admin123456", 10);
    const account = await models.account.create({});
    
    const user = await models.user.create({
      idUser: "ADM001",
      fullName: "Admin Test",
      email: "admin@test.com",
      password: password,
      rol_idrol: adminRole.idRol,
      account_idaccount: account.idAccount,
      status: 1,
      accountVerify: 1,
      finishRegister: 1
    });

    console.log("¡Administrador creado con éxito!");
    console.log("Email: admin@test.com");
    console.log("Password: admin123456");
  } catch (error) {
    console.error("Error al crear el admin:", error);
  } finally {
    await sequelize.close();
  }
}

run();
