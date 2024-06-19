import { boot } from 'quasar/wrappers'
import io from 'socket.io-client';


// const socket = io('http://localhost:3000/', {
const socket = io(process.env.SOCKET_URL, {
  transports: ['websocket', 'polling'],
  path: process.env.SOCKET_PATH,
  auth: {
    'headercheck': process.env.SOCKET_SECRET
  }
});

export default boot(({ app }) => {
  app.config.globalProperties.$socket = socket;
})

export { socket }
