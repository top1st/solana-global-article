use anchor_lang::prelude::*;

declare_id!("zaR6MXmj1DjeCdNBix6R6CA53H6rRXRoiBh4LEAvP2G");

#[program]
pub mod solana_global_article {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let article_account = &mut ctx.accounts.article;
        article_account.content = "".to_string();

        Ok(())
    }

    pub fn write_into_article(ctx:Context<WriteIntoArticle>, three_words: String) -> Result<()> {
        let article = &mut ctx.accounts.article;
        let split_iterator = three_words.trim().split(" ");
        let mut final_words = Vec::new();
        let mut conuter_added = 0;
        for s in split_iterator {
            if s.trim().is_empty() {
                continue;
            }
            if s.trim().len() >= 15 {
                return Err(Errors::WordTooLong.into());
            }
            final_words.push(s);
            conuter_added += 1;
            if conuter_added >= 3 {
                break;
            }
        }
        let mut joined_words = final_words.join(" ");
        joined_words.push_str(" ");
        article.content.push_str(&joined_words);
    
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = person_that_pays,
        space = 8
        + 32
        + 10000
    )]
    pub article: Account<'info, Article>,
    #[account(mut)]
    pub person_that_pays: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct WriteIntoArticle<'info> {
    #[account(mut)]
    pub article: Account<'info, Article>,
}

#[account]
pub struct Article {
    pub content: String
}

#[error_code]
pub enum Errors {
    #[msg("Each word must be less than 15 characters")]
    WordTooLong
}

