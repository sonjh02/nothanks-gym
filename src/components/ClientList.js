import React, { useState, useRef } from 'react'
import { useSocket, useLastMessage } from 'use-socketio'

import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import IconButton from '@material-ui/core/IconButton'
import VisibilityIcon from '@material-ui/icons/Visibility'
import SportsEsportsIcon from '@material-ui/icons/SportsEsports'
import RssFeedIcon from '@material-ui/icons/RssFeed'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import Divider from '@material-ui/core/Divider'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import Popover from '@material-ui/core/Popover'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import CreateIcon from '@material-ui/icons/Create'
import GamesIcon from '@material-ui/icons/Games'
import PriorityHighIcon from '@material-ui/icons/PriorityHigh'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PanToolIcon from '@material-ui/icons/PanTool'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing(1),
    right: theme.spacing(1),
    color: 'black',
  },
  drawer: {
    '& .MuiTypography-body1': {
      fontFamily: 'Consolas, monaco, monospace',
      fontWeight: 'bold',
    },
  },
  playin: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& > div': {
      margin: theme.spacing(1),
    },
  },
}))

export default () => {
  const classes = useStyles()
  const { socket } = useSocket()
  const { data: clientList } = useLastMessage('client_list')
  const { data: isMaster } = useLastMessage('master_granted')
  const [open, setOpen] = useState(false)
  const [nickAnchorEl, setNickAnchorEl] = useState(null)
  const [nick, setNick] = useState('')
  const [codeAnchorEl, setCodeAnchorEl] = useState(null)
  const [code, setCode] = useState('')
  const nickRef = useRef()
  const codeRef = useRef()

  const handleTakeSeat = () => {
    if (nick.length > 1) {
      socket.emit('take_seat', nick, ack => {
        console.log('take_seat', ack)
        if (ack === 'ok') {
          setNickAnchorEl(null)
        }
      })
    }
  }

  const handleTakeMaster = () => {
    if (code.length > 1) {
      socket.emit('take_master', code, ack => {
        console.log('take_master', ack)
        if (ack === 'ok') {
          setCodeAnchorEl(null)
        }
      })
    }
  }

  return (
    <>
      <div className={classes.root}>
        <IconButton
          color="inherit"
          aria-label="connect"
          onClick={() => setOpen(true)}
        >
          <RssFeedIcon />
        </IconButton>
      </div>
      <Drawer anchor={'right'} open={open} onClose={() => setOpen(false)}>
        <List>
          <ListItem button onClick={() => setOpen(false)}>
            <ListItemIcon>
              <ArrowForwardIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem
            button={!isMaster}
            onClick={e => {
              if (!isMaster) {
                setCodeAnchorEl(e.currentTarget)
              }
            }}
          >
            <ListItemIcon>
              <GamesIcon color={isMaster ? 'secondary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText
              primary={isMaster ? 'Game Master Granted' : 'Take Game Master'}
            />
          </ListItem>
          {isMaster && (
            <ListItem
              button
              onClick={() => socket.emit('start', ack => console.log(ack))}
            >
              <ListItemIcon>
                <PlayArrowIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Start Game" />
            </ListItem>
          )}
          {isMaster && (
            <ListItem button onClick={() => socket.emit('poke')}>
              <ListItemIcon>
                <PriorityHighIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Poke Manually" />
            </ListItem>
          )}
          {isMaster && (
            <ListItem button onClick={() => socket.emit('finish')}>
              <ListItemIcon>
                <PanToolIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Finish Game" />
            </ListItem>
          )}
          <ListItem
            button
            onClick={e => {
              setNickAnchorEl(e.currentTarget)
            }}
          >
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary="Take Seat" />
          </ListItem>
          <Divider />
          <ListSubheader>{'Connected Clients'}</ListSubheader>
          {Array.isArray(clientList) &&
            clientList.map(({ cid, idx }) => (
              <ListItem key={cid} className={classes.drawer}>
                <ListItemIcon>
                  {idx === -1 ? (
                    <VisibilityIcon />
                  ) : (
                    <SportsEsportsIcon color="secondary" />
                  )}
                </ListItemIcon>
                <ListItemText primary={cid} />
              </ListItem>
            ))}
        </List>
      </Drawer>
      <Popover
        open={!!nickAnchorEl}
        anchorEl={nickAnchorEl}
        onClose={() => setNickAnchorEl(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Paper
          component="form"
          className={classes.playin}
          onSubmit={e => {
            e.preventDefault()
            handleTakeSeat()
          }}
        >
          <TextField
            label="Nickname.length > 1"
            variant="outlined"
            value={nick}
            size={'small'}
            onChange={e => setNick(e.target.value)}
            inputRef={nickRef}
          />
          <IconButton
            color="primary"
            aria-label="directions"
            onClick={handleTakeSeat}
          >
            <CreateIcon />
          </IconButton>
        </Paper>
      </Popover>
      <Popover
        open={!!codeAnchorEl}
        anchorEl={codeAnchorEl}
        onClose={() => setCodeAnchorEl(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Paper
          component="form"
          className={classes.playin}
          onSubmit={e => {
            e.preventDefault()
            handleTakeMaster()
          }}
        >
          <TextField
            label="Master code"
            variant="outlined"
            value={code}
            type="password"
            size={'small'}
            onChange={e => setCode(e.target.value)}
            inputRef={codeRef}
          />
          <IconButton
            color="primary"
            aria-label="directions"
            onClick={handleTakeMaster}
          >
            <CreateIcon />
          </IconButton>
        </Paper>
      </Popover>
    </>
  )
}
