import { SOCKET_URL } from "app/utils/constant";
import io, { Manager } from "socket.io-client";
let socket
// // const manager = new Manager("https://ecommercepayments.ovh");
// // let socket = manager.socket("/loans");
// let socket = io("http://localhost:4000", { path: "/socket/gambatte" }, { forceNew: true })
// // let socket = io("https://ecommercepayments.ovh", { path: "/socket/gambatte" });

// export default socket;



export const initiateSocket = () => {
    socket = io(SOCKET_URL, { path: "/socket/1trader" });
    // console.log(`Connecting socket...`);
    return socket
}