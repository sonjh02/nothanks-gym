import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'
import App from './App'

ReactDOM.render(
  <RecoilRoot>
    <StrictMode>
      <App />
    </StrictMode>
  </RecoilRoot>,
  document.getElementById('root'),
)
