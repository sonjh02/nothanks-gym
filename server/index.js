const io = require('./socket')
const useStore = require('./store')
const inform = require('./inform')
const stamp = require('./stamp')

io.on('connection', client => {
  stamp('New Connection:', client.id)
  inform.conn()

  client.on('take_master', (code, cb) => {
    if (typeof cb != 'function') {
      cb = () => {}
    }
    if (code != useStore(s => s.code)) {
      return cb('master promotion fail: invalid code')
    }
    client.on('start', cb => {
      if (typeof cb != 'function') {
        cb = () => {}
      }
      const n = useStore(s => s.players.length)
      if (n < 2) {
        return cb('game start fail: players registered = ' + n)
      }
      const { startGame, flipCard } = useStore()
      startGame()
      flipCard()
      inform.game()
      inform.poke()
      stamp('Game Started')
      cb('game started')
    })
    client.on('poke', inform.poke)
    client.on('finish', cb => {
      if (typeof cb != 'function') {
        cb = () => {}
      }
      const { finishGame } = useStore()
      finishGame()
      inform.game()
      stamp('Game Finished')
      cb('game finished')
    })

    stamp('Master Registered:', client.id)
    client.emit('master_granted', true)
    cb('ok')
  })

  client.on('client_list', () => {
    stamp('Client List Requested:', client.id)
    inform.conn()
  })

  client.on('take_seat', (nick, cb) => {
    if (typeof cb != 'function') {
      cb = () => {}
    }
    if (('' + nick).length <= 1) {
      return cb('nickname too short')
    }
    if (useStore(s => s.addPlayer)(client, nick)) {
      stamp(nick, 'Taken Seat:', client.id)
      client.emit('seat_granted', true)
    }
    inform.conn()
    cb('ok')
  })

  client.on('disconnect', () => {
    stamp('Disconnected:', client.id)
    useStore(s => s.removePlayer)(client.id)
    inform.conn()
  })
})
