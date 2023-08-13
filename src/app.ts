import express from 'express';
const solanaWeb3 = require("@solana/web3.js");
const { getOrCreateAssociatedTokenAccount } = require("@solana/spl-token");
const bs58 = require('bs58')
// API to create transaction
const app = express();
const port = 4000;

app.get('/', async (req, res) => {
  const { mintAddress, reciverWallet } = req.body;
  try {
    const connection = new solanaWeb3.Connection(
      solanaWeb3.clusterApiUrl("devent"),
      "confirmed"
    );

    const payer = solanaWeb3.Keypair.fromSecretKey(
      bs58.decode(
        "57bRM31BgagdfhjGjKcbDTWTcv8qVfNkkRBe3Y1vbV8Si5vBxy2ZrEed74FTryuMtpSj27EMLmumMa99JQSFjVMP"
      )
    );
    const reciverPublicKey = new solanaWeb3.PublicKey(reciverWallet);
    const o2Mint = new solanaWeb3.PublicKey(mintAddress);
    const o2TokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      o2Mint,
      reciverPublicKey
    );
    return res.json({ status: true, toWalletAddress: o2TokenAccount.address });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, message: "something went wrong!", error });
  }
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
