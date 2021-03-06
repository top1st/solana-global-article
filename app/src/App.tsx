/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect, useCallback } from "react";
import { Paper, Skeleton, TextField, Button } from "@mui/material";
import "./App.css";
import WalletContext from "./WalletContext";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program, web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { IDL } from "./solana_global_article";
import config from "./config";

const programID = new PublicKey("zaR6MXmj1DjeCdNBix6R6CA53H6rRXRoiBh4LEAvP2G");

const { SystemProgram, Keypair } = web3;

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
    const program = new Program(IDL, programID, provider);
    const keyPairOne = Keypair.generate();
    try {
      await program.methods
        .initialize()
        .accounts({
          article: keyPairOne.publicKey,
          personThatPays: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([keyPairOne])
        .rpc();
      console.log("done", keyPairOne.publicKey.toString());
    } catch (error) {
      console.log("#1", error);
      return alert(error);
    }
  };

  const uploadWords = async () => {
    if (!wallet) return;
    const provider = new AnchorProvider(connection, wallet, {});
    const program = new Program(IDL, programID, provider);
    try {
      await program.methods
        .writeIntoArticle(inputValue)
        .accounts({ article: config.solana_article_account })
        .rpc();
    } catch (error) {
      console.log("#2", error);
      return alert(error);
    }
    getAndSetArticle();
  };

  const getAndSetArticle = useCallback(async () => {
    if (!wallet) return;
    const provider = new AnchorProvider(connection, wallet, {});
    const program = new Program(IDL, programID, provider);
    const aritcleData = await program.account.article.fetch(
      config.solana_article_account
    );
    setSolanaArticle(aritcleData.content);
    setIsLoading(false);
  }, [connection, wallet]);

  useEffect(() => {
    if (wallet) {
      getAndSetArticle();
    }
  }, [getAndSetArticle, wallet]);

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
      {isLoading ? (
        <Paper elevation={20} className="content-box">
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </Paper>
      ) : (
        <Paper elevation={20} className="content-box">
          {solanaArticle}
        </Paper>
      )}
      <div className="three-words-input-container">
        <TextField
          id="outlined-basic"
          label="Write to the open book (5 words max)"
          variant="outlined"
          className="words-input"
          value={inputValue}
          onChange={checkAndAddWords}
        />
        <Button
          variant="contained"
          className="submit-button"
          onClick={uploadWords}
        >
          Submit
        </Button>
        {/* <Button onClick={initialize} color="secondary" variant="contained">initialize</Button> */}
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
