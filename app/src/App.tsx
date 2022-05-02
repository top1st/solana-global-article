/* eslint-disable import/no-anonymous-default-export */
import React from 'react'  
import { Paper, Skeleton, TextField, Button} from '@mui/material'
import "./App.css"
import WalletContext from './WalletContext'
const App = () => {
  return (
    <>
    <header className='header'>
      <img src="/assets/solana.jpeg" className="solana-image" alt='solana' />
      <div className="title-container">
      <h1 className="main-title">Open Global Book</h1>
      <h4 className="main-subtitle">By Top1st</h4>
      </div>
    </header>
    <Paper elevation={20} className='content-box'>
      <Skeleton variant='text' />
      <Skeleton variant='text' />
      <Skeleton variant='text' />
    </Paper>
    <div className="three-words-input-container">
      <TextField
      id='outlined-basic'
      label='Write to the open book (5 words max)'
      variant='outlined'
      className='words-input'
      />
      <Button variant="contained" className="submit-button">Submit</Button>
    </div>
    </>
  )
}

export default () => {
  return <WalletContext>
    <App/>
  </WalletContext>
}
