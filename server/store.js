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

module.exports.store = store
module.exports.addPlayer = (client, name) => {
    state.players = [...state.players, { client, name }]
}
module.exports.removePlayer: cid =>
  set(({ players }) => ({
    players: players.filter(({ client }) => cid != client.id),
  }))

/*

module.exports = require('zustand').default(set => ({
  ,
  startGame: () =>
    set(({ players }) => {
      const n = players.length
      const coin = n < 6 ? 11 : n > 6 ? 7 : 6
      const turn = Math.floor(Math.random() * n)
      const deck = createDeck()
      return {
        turn,
        open: 0,
        coin: 0,
        players: players.map(({ client, name }) => ({
          client,
          name,
          hand: [],
          coin,
        })),
      }
    }),
  flipCard: () =>
    set(({ deck }) => {
      const open = deck.pop()
      return { deck, open }
    }),
  takeCard: () =>
    set(({ players, turn, open, coin }) => {
      players[turn].hand.push(open)
      players[turn].coin += coin
      return { players, open: 0, coin: 0 }
    }),
  playChip: () =>
    set(({ players, turn, coin }) => {
      players[turn].coin -= 1
      return { players, coin: coin + 1 }
    }),
  nextTurn: () =>
    set(({ players, turn }) => {
      const n = players.length
      return { turn: turn < n - 1 ? turn + 1 : 0 }
    }),
  endGame: () => set({ deck: null }),
}))
*/
