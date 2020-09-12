import React from 'react'

import { useSocket, useLastMessage } from 'use-socketio'

import { makeStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar'

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(0.5),
    '& .MuiChip-root': {
      margin: theme.spacing(0.5),
    },
  },
  player: {
    marginTop: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(0.5),
    '& .MuiChip-root': {
      margin: theme.spacing(0.5),
    },
  },
}))

export default () => {
  const classes = useStyles()
  const { data: isSeated } = useLastMessage('seat_granted')
  const { data: gameState } = useLastMessage('game_update')
  const { data: gameReport } = useLastMessage('game_report')
  const { socket } = useSocket()

  const myTurn =
    gameState &&
    gameState.turn !== -1 &&
    gameState.deck &&
    gameState.players[gameState.turn].cid === socket.id

  const report =
    Array.isArray(gameReport) &&
    gameReport.map(({ name, hand, coin }) => {
      hand.sort()
      let sum = hand.length > 0 ? hand[0] : 0
      for (let i = 1; i < hand.length; i++) {
        if (hand[i - 1] + 1 !== hand[i]) {
          sum += hand[i]
        }
      }
      sum -= coin
      return { name, sum }
    })

  return (
    <>
      <Paper className={classes.root}>
        <Chip
          avatar={<Avatar>{gameState ? gameState.deck : ''}</Avatar>}
          label="Deck"
          color="default"
        />
        <Chip
          avatar={<Avatar>{gameState ? gameState.open : ''}</Avatar>}
          label="Card"
          color="secondary"
          clickable={isSeated}
        />
        <Chip
          avatar={<Avatar>{gameState ? gameState.coin : ''}</Avatar>}
          label="Coin"
          color="primary"
          clickable={isSeated}
        />
        {myTurn && <Chip label="Your Turn" color="default" />}
      </Paper>
      {gameState &&
        Array.isArray(gameState.players) &&
        gameState.players.map(({ hand, coin, name }, idx) => {
          if (!hand) {
            hand = []
          }
          if (!coin) {
            coin = ''
          }
          hand.sort()
          const handChips = []
          if (hand.length > 0) {
            handChips.push([hand[0]])
            for (let i = 1; i < hand.length; i++) {
              if (hand[i - 1] + 1 === hand[i]) {
                handChips[handChips.length - 1].push(hand[i])
              } else {
                handChips.push([hand[i]])
              }
            }
          }
          return (
            <Paper className={classes.player} key={idx}>
              <Chip
                label={name}
                color={idx === gameState.turn ? 'secondary' : 'default'}
              />
              <Chip
                avatar={<Avatar>{coin}</Avatar>}
                label="Coin"
                color="primary"
              />
              {handChips.map(list => (
                <Chip
                  key={list[0]}
                  avatar={<Avatar>{list[0]}</Avatar>}
                  label={list.slice(1).join(',')}
                  color="default"
                />
              ))}
            </Paper>
          )
        })}
      {report && (
        <Paper className={classes.player}>
          <Chip label="Last Game Report" color="default" />
          {report.map(({ name, sum }) => (
            <Chip
              key={name}
              avatar={<Avatar>{sum}</Avatar>}
              label={name}
              color="default"
            />
          ))}
        </Paper>
      )}
    </>
  )
}
