import { atom } from 'recoil'

export const socketObject = atom({
  key: 'socketObject',
  default: null,
})

export const socketColor = atom({
  key: 'socketColor',
  default: 'error',
})
