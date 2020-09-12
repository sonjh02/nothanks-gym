const io = require('./socket')
const useStore = require('./store')
const inform = require('./inform')
const stamp = require('./stamp')

const poke = () => {}

io.on('connection', client => {
  stamp('New Connection:', client.id)
  inform.conn()

  client.on('master', (code, cb) => {
    if (code == useStore(s => s.code)) {
      client.on('start', cb => {
        const n = useStore(s => s.players.length)
        if (n >= 2) {
          useStore(s => s.startGame)()
          inform.game()
          poke()
          stamp('Master Registered:', client.id)
          return cb('OK')
        }
      })
      return cb('OK')
    }
    cb('FAIL')
  })

  client.on('clients', cb => {
    stamp('Client List Requested:', client.id)
    io.clients((err, clients) => {
      const players = useStore(s => s.players)
      cb(
        clients.map(cid => ({
          cid,
          idx: players.findIndex(({ client }) => cid == client.id),
        })),
      )
    })
  })

  client.on('disconnect', () => {
    stamp('Disconnected:', client.id)
    inform.conn()
  })
})
