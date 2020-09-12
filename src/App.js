import React from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilValue } from 'recoil'
import { clients } from './store/clients'

import Button from '@material-ui/core/Button'
import RefreshIcon from '@material-ui/icons/Refresh'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import Socket from './components/Socket'

export default () => {
  const clientList = useRecoilValue(clients)
  clientList.sort((c1, c2) => c1.idx - c2.idx)
  return (
    <>
      <List aria-label="client list">
        {clientList.map(({ cid, idx }) => (
          <ListItem key={cid}>{cid}</ListItem>
        ))}
      </List>
      <Socket />
    </>
  )
}
