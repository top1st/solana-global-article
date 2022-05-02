import * as anchor from "@project-serum/anchor";
import { Accounts, Program } from "@project-serum/anchor";
import { SolanaGlobalArticle } from "../target/types/solana_global_article";

describe("solana-global-article", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaGlobalArticle as Program<SolanaGlobalArticle>;

  const deployerKeypair = anchor.web3.Keypair.generate()
  const personThatPays = provider.wallet

  it("Is initialized!", async () => {

    // Add your test here.
    const tx = await program.methods.initialize()
      .accounts({
        article: deployerKeypair.publicKey,
        personThatPays: personThatPays.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([deployerKeypair])
      .rpc();
    console.log("Your transaction signature", tx);
    console.log("Program Id", program.programId)
    console.log(await program.account.article.all())

  });

  it("Should write an article with 1 word successfully", async () => {
    await program.methods.writeIntoArticle("123 345 0987")
      .accounts({ article: deployerKeypair.publicKey })
      .signers([])
      .rpc()

    console.log(await program.account.article.fetch(deployerKeypair.publicKey))
  })


});
