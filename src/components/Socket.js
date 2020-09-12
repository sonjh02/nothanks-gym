import React, { useEffect } from 'react'
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'
import io from 'socket.io-client'
import { socketObject, socketColor } from '../store/socket'
import { clients } from '../store/clients'

import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import RssFeedIcon from '@material-ui/icons/RssFeed'
import Badge from '@material-ui/core/Badge'

const openSocket = () => io('http://localhost:3001')

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    top: theme.spacing(1),
    right: theme.spacing(1),
    color: 'black',
    '& .MuiBadge-colorPrimary': {
      backgroundColor: '#11DD11',
    },
    '& .MuiBadge-colorSecondary': {
      backgroundColor: '#1111DD',
    },
    '& .MuiBadge-colorError': {
      backgroundColor: '#888888',
    },
  },
}))

const Icon = () => {
  const color = useRecoilValue(socketColor)
  return (
    <Badge color={color} variant="dot">
      <RssFeedIcon />
    </Badge>
  )
}

export default () => {
  const classes = useStyles()
  const [socket, setSocket] = useRecoilState(socketObject)
  const setColor = useSetRecoilState(socketColor)
  const setClients = useSetRecoilState(clients)

  useEffect(() => {
    const socket_ = openSocket()
    setSocket(socket_)
    return () => (socket ? socket.close() : 0)
  }, [])

  useEffect(() => {
    if (socket) {
      setColor('primary')
      socket.on('connect', () => {
        console.log('yay')
      })
      socket.on('conn-update', () => {
        setColor('secondary')
        socket.emit('clients', list => {
          setClients(list)
          setColor('primary')
        })
      })
      socket.on('disconnect', (...reasons) => console.log(reasons))
    } else {
      setColor('error')
    }
  }, [socket])

  return (
    <div className={classes.root}>
      <IconButton color="inherit" aria-label="connect">
        <Icon />
      </IconButton>
    </div>
  )
}
