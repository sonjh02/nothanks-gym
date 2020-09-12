exports.game = () =>
  io.emit(
    'game-update',
    useStore(({ players, deck, open, coin, turn }) => ({
      players,
      deck: deck.length,
      open,
      coin,
      turn,
    })),
  )
exports.conn = () => io.emit('conn-update')
