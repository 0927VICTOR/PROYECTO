const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connection = require("./db/connectionDB");
const { router } = require("./routes/routes");
const { authSecurity } = require("./routes/authSecurityRoutes");
const accountController =
  require("./controllers/accountController").searchBalance;
import { Server as WebSocketServer } from "socket.io";
import http from "http";
import { notificationsUsers } from "./controllers/notificationController";
import { test, getNotificationsUserDepositsExpenses, connected, getAllDepositsAndExpenses, getAllDepositsAndExpenses1, initSocket, InitgetAllUsers, getDataGoolgeSocket } from './socket/socket'
import { squeduleTask } from "./services/nodeCronService";
dotenv.config();
let port = process.env.PORT;

const app = express();
const server = http.createServer(app);

const io = new WebSocketServer(server, { path: "/socket/1trader", cors: { origin: "*" } });


app.use(express.static(__dirname + '/public'))

const whitelist = [
  "http://localhost:3000",
  "https://2e24-181-62-56-224.ngrok-free.app.com:4000",
];

// ✅ Enable pre-flight requests
// app.options("*", cors());

app.use(express.json());
/*io.on("connection", async (socket) => {
  
  console.log("conectado al socket...")
  socket.on("conectado", async (mensaje) => {
    console.log("Mensaje : ", mensaje);
  });
  socket.on('new-deposit', async (socket) => {
    //console.log("soy el new deposit  =>", socket)
    try {
      await createDeposit(socket)
      let dataUsers =await connection.sequelize.query('call gambatte_db.notifications_user();')
      io.emit('notificatios-users', { data: dataUsers });
    } catch (error) {
      throw error;
    }
  
  })

  try {
   //let dataUsers = await notificationsUsers();
    let dataUsers =await connection.sequelize.query('call gambatte_db.notifications_user();')
    //console.log("dataUsers", dataUsers);
    io.emit('notificatios-users', { data: dataUsers });
  } catch (error) {
    throw error;
  }
});*/

// const corsOptions = {
//   credentials: true,
//   origin: (origin, callback) => {
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

// app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept,typepayment, Access-Control-Allow-Request-Method, multipart/form-data"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.get("/api/test:userId", accountController);
app.use("/1trader", router);
app.use("/1trader", authSecurity);

const credentials = {
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  dialect: process.env.DIALECT,
};

const main = async () => {
  let sequelize = await connection.sequelize;
  sequelize.authenticate();
  server.listen(port, () => {
    squeduleTask()
    console.log("Server listening port: ", port);
  });
  // await getNotificationsUserDepositsExpenses()
  await getAllDepositsAndExpenses()
  // await getAllDepositsAndExpenses1()
  await InitgetAllUsers()

  await initSocket()

  return sequelize;
};
export { io }
main()

