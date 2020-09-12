import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'

import ClientList from './components/ClientList'
import GameBoard from './components/GameBoard'

export default () => {
  return (
    <>
      <CssBaseline />
      <GameBoard />
      <ClientList />
    </>
  )
}
