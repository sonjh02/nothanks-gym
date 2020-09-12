const io = require('./socket')

const createDeck = () => {
  const deck = Array(33)
    .fill()
    .map((z, i) => i + 3)
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck.slice(9)
}

const state = {
  code: '38317',
  players: [],
  deck: null,
  open: 0,
  coin: 0,
  turn: -1,
  waiting: '',
}

const mutator = {
  addPlayer: (client, name) => {
    if (!state.deck) {
      const nameIdx = state.players.findIndex(p => p.name == name)
      const cidIdx = state.players.findIndex(p => p.client.id == client.id)
      if (cidIdx != -1) {
        state.players[cidIdx] = { client, name }
      } else if (nameIdx != -1) {
        state.players[nameIdx] = { client, name }
      } else {
        state.players = [...state.players, { client, name }]
      }
      return true
    }
    return false
  },
  removePlayer: cid => {
    if (!state.deck) {
      state.players = state.players.filter(({ client }) => cid != client.id)
    }
  },
  startGame: () => {
    const n = state.players.length
    const player_coin = n < 6 ? 11 : n > 6 ? 7 : 6
    state.turn = Math.floor(Math.random() * n)
    state.deck = createDeck()
    state.open = 0
    state.coin = 0
    state.players = state.players.map(({ client, name }) => ({
      client,
      name,
      hand: [],
      coin: player_coin,
    }))
  },
  flipCard: () => {
    state.open = state.deck.pop()
  },
  takeCard: () => {
    state.players[state.turn].hand.push(state.open)
    state.players[state.turn].coin += state.coin
    state.open = 0
    state.coin = 0
  },
  playChip: () => {
    state.players[state.turn].coin -= 1
    state.coin += 1
  },
  nextTurn: () => {
    state.turn += 1
    if (state.turn >= state.players.length) {
      state.turn = 0
    }
  },
  finishGame: () => {
    io.emit(
      'game_report',
      state.players.map(({ client, hand, coin, name }) => ({
        cid: client.id,
        hand,
        coin,
        name,
      })),
    )
    state.waiting = ''
    state.deck = null
    state.turn = -1
    state.players = []
  },
  setWaiting: cid => {
    state.waiting = cid
  },
}

module.exports = selector =>
  selector ? selector({ ...state, ...mutator }) : { ...state, ...mutator }
