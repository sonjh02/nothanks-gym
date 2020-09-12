import io from 'socket.io-client'
import { clients } from './store'
import { useSetRecoilState } from 'recoil'

const socket = io('http://localhost:3001')
export const connUpdate = () =>
  socket.emit('clients', list => useSetRecoilState(clients)(list))

socket.on('game-update', connUpdate)

export default socket
