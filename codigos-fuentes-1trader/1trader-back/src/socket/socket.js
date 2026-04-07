import { io } from "../index";
import { sequelize } from "../db/connectionDB";
import { querys } from "../helpers/querys";
import { findDepositAndExpense } from "../services/depositsExpenses";
import { findUsersServices } from "../services/userService";
import { getDataGoogle } from "../services/googleServices";

export async function initSocket() {
  io.on("connection", async (socket) => {
    console.log("Un usuario conectado ", socket.id);
    io.emit('conectado', { msg: 'Conectado desde el servidor!!!' })
    try {
      //let dataUsers = await notificationsUsers();
      let data = await sequelize.query(
        querys.getNotificationsUsers(), { type: sequelize.QueryTypes.SELECT }
      );
      if (data) {
        io.emit("notificatios-users", { data });
      }
    } catch (error) {
      throw error;
    }

  });
}

export const getNotificationsUserDepositsExpenses = async () => {
  io.on("connection", async (socket) => {
    try {
      console.log('llego getNotificationsUserDepositsExpenses');
      //let dataUsers = await notificationsUsers();
      let data = await sequelize.query(
        querys.getNotificationsUsers(), { type: sequelize.QueryTypes.SELECT }
      );
      let depositsExpenses = await findDepositAndExpense()
      //console.log("dataUsers desde el controller", dataUsers);
      io.emit("notificatios-users", { data });

    } catch (error) {
      throw error;
    }
  });
};

export const getAllDepositsAndExpenses = async () => {

  io.on("connection", async (socket) => {
    try {
      //let dataUsers = await notificationsUsers();
      let data = await sequelize.query(
        querys.getNotificationsUsers(), { type: sequelize.QueryTypes.SELECT }
      );
      let depositsExpenses = await findDepositAndExpense()
      // console.log("dataUsers desde el controller", depositsExpenses);
      io.emit("deposits-expenses", { depositsExpenses });

    } catch (error) {
      throw error;
    }
  });
}

export const getAllDepositsAndExpenses1 = async () => {
  //let dataUsers = await notificationsUsers();
  let depositsExpenses = await findDepositAndExpense()
  //console.log("dataUsers desde el controller", dataUsers);
  io.emit("deposits-expenses", { depositsExpenses });
}

export const getPaymentsNotificationsUser = async () => {
  try {
    //let dataUsers = await notificationsUsers();
    let data = await sequelize.query(
      querys.getNotificationsUsers(), { type: sequelize.QueryTypes.SELECT }
    );
    if (data) {
      io.emit("notificatios-users", { data });
    }
  } catch (error) {
    throw error;
  }
}

// export const getCantDepositsExpenses = async () => {
//   try {
//     //let dataUsers = await notificationsUsers();
//     let data = await sequelize.query(
//       querys.getNotificationsUsers(), { type: sequelize.QueryTypes.SELECT }
//     );
//     if (data) {
//       let mapData = []
//       let filterData = []
//       filterData = data?.filter(x => x?.rol_idrol === 2 && x?.cant_deposits > 0 || x?.cant_expenses > 0)
//       if (filterData?.length > 0) {
//         mapData = filterData.map(el => {
//           return {
//             id: el.id,
//             cantDeposits: el?.cant_deposits,
//             cantExpenses: el?.cant_expenses,
//           }
//         })
//       }
//       io.emit("cant-deposits-expenses", { mapData });
//     }
//   } catch (error) {
//     throw error;
//   }
// }

export const emitNotificationCreationDepositExpenses = async (msg, type, operationType) => {
  try {
    //console.log("dataUsers desde el controller", dataUsers);
    io.emit("notification-created", { msg: msg, type, operationType: operationType });
  } catch (error) {
    throw error;
  }
}

export const emitNotification = async (msg, type, operationType) => {
  try {
    io.emit("notification", { msg: msg, type: type, operationType: operationType });
  } catch (error) {
    throw error;
  }
}

export const InitgetAllUsers = async () => {
  io.on("connection", async (socket) => {
    try {
      let users = await findUsersServices()
      //console.log("dataUsers desde el controller", dataUsers);
      io.emit("users", { users });

    } catch (error) {
      throw error;
    }
  });
}

export const findAllUsersSockets = async () => {
  try {
    let users = await findUsersServices()
    // console.log("dataUsers desde el socket", users);
    io.emit("users", { users });
  } catch (error) {
    throw error;
  }
}

