import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'
import { SocketIOProvider } from 'use-socketio'

import App from './App'

ReactDOM.render(
  <SocketIOProvider url="http://localhost:3001">
    <RecoilRoot>
      <StrictMode>
        <App />
      </StrictMode>
    </RecoilRoot>
  </SocketIOProvider>,
  document.getElementById('root'),
)
