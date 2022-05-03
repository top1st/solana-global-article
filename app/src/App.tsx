/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from "react";
import { Paper, Skeleton, TextField, Button } from "@mui/material";
import "./App.css";
import WalletContext from "./WalletContext";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js"
import idl from './solana_global_article.json'


const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [solanaArticle, setSolanaArticle] = useState("");

  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const checkAndAddWords = (e: any) => {
    let words = e.target.value.split(" ");
    for (let i = 0; i < words.length; i++) {
      if (words[i].length > 15) {
        return;
      }
    }
    if (words.length > 5) return;
    setInputValue(words.join(" "));
  };

  const initialize = async () => {
    if (!wallet) return;
    const provider = new AnchorProvider(connection, wallet, {});
  };

  return (
    <>
      <header className="header">
        <img src="/assets/solana.jpeg" className="solana-image" alt="solana" />
        <div className="title-container">
          <h1 className="main-title">Open Global Book</h1>
          <h4 className="main-subtitle">By Top1st</h4>
        </div>
        <div className="wallet-connect">
          <WalletMultiButton />
        </div>
      </header>
      <Paper elevation={20} className="content-box">
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </Paper>
      <div className="three-words-input-container">
        <TextField
          id="outlined-basic"
          label="Write to the open book (5 words max)"
          variant="outlined"
          className="words-input"
          value={inputValue}
          onChange={checkAndAddWords}
        />
        <Button variant="contained" className="submit-button">
          Submit
        </Button>
      </div>
    </>
  );
};

export default () => {
  return (
    <WalletContext>
      <App />
    </WalletContext>
  );
};
