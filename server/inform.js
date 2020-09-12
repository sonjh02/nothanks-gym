const io = require('./socket')
const useStore = require('./store')
const timeoutCallback = require('timeout-callback')
const stamp = require('./stamp')

const game = () =>
  io.emit(
    'game_update',
    useStore(({ players, deck, open, coin, turn }) => ({
      players: players.map(({ client, hand, coin, name }) => ({
        cid: client.id,
        hand,
        coin,
        name,
      })),
      deck: deck ? deck.length : '',
      open,
      coin,
      turn,
    })),
  )

const conn = () => {
  io.clients((err, clients) => {
    const players = useStore(s => s.players)
    const list = clients.map(cid => ({
      cid,
      idx: players.findIndex(p => cid == p.client.id),
    }))
    list.sort((i1, i2) => i1.idx - i2.idx)
    io.emit('client_list', list)
  })
  if (!useStore(s => s.deck)) {
    game()
  }
}

const poke = () => {
  const { deck, waiting, players, turn, setWaiting } = useStore()
  if (!deck) {
    return stamp('Game not started')
  }
  if (waiting) {
    return stamp('Waiting', waiting)
  }
  setWaiting(players[turn].client.id)
  players[turn].client.emit(
    'your_turn',
    useStore(({ players, deck, open, coin, turn }) => {
      const others = [...players.slice(turn + 1), ...players.slice(0, turn)]
      return {
        opponents: others.map(({ hand, coin }) => ({ hand, coin })),
        you: { hand: players[turn].hand, coin: players[turn].coin },
        open,
        coin,
        deck: deck.length,
      }
    }),
    /*timeoutCallback(3000,*/ nothanks => {
      setWaiting('')
      if (nothanks instanceof Error) {
        return io.emit('game_halted')
      }
      const { deck, players, turn } = useStore()
      if (!deck) {
        return 0
      }
      // console.log(nothanks, players[turn].coin)
      if (players[turn].coin == 0) {
        nothanks = false
      }
      if (nothanks) {
        const { playChip, nextTurn } = useStore()
        playChip()
        nextTurn()
        stamp(players[turn].name, 'playChip')
        game()
        setTimeout(poke, 400)
      } else {
        const { deck, flipCard, takeCard, finishGame } = useStore()
        takeCard()
        stamp(players[turn].name, 'takeCard')
        if (deck.length > 0) {
          flipCard()
          game()
          setTimeout(poke, 400)
        } else {
          finishGame()
          conn()
          game()
        }
      }
    } /*)*/,
  )
}

exports.game = game
exports.poke = poke
exports.conn = conn
