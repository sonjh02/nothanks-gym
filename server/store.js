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
  turn: 0,
}

const mutator = {
  addPlayer: (client, name) => {
    state.players = [...state.players, { client, name }]
  },
  removePlayer: cid => {
    state.players = state.players.filter(({ client }) => cid != client.id)
  },
  startGame: () => {
    const n = state.players.length
    const player_coin = n < 6 ? 11 : n > 6 ? 7 : 6
    state.turn = Math.floor(Math.random() * n)
    state.deck = createDeck()
    state.open = 0
    state.coin = 0
    state.players = players.map(({ client, name }) => ({
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
  },
  nextTurn: () => {
    state.turn += 1
    if (state.turn >= state.players.length) {
      state.turn = 0
    }
  },
  finishGame: () => {
    state.deck = null
  },
}

module.exports = selector => selector({ ...state, ...mutator })
