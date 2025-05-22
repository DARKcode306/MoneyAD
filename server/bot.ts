import { Telegraf } from 'telegraf';
import { createHash } from 'crypto';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const APP_URL = process.env.APP_URL || 'https://0fc81a13-f317-4544-9182-7199a3f8f470-00-21jytxln2zux.picard.replit.dev';

export const bot = new Telegraf(BOT_TOKEN);

// Validate data from WebApp
export function validateWebAppData(initData: string) {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  const dataToCheck = Array.from(urlParams.entries())
    .filter(([key]) => key !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = createHash('sha256')
    .update(BOT_TOKEN)
    .digest();

  const generatedHash = createHash('hmac-sha256')
    .update(dataToCheck)
    .update(secretKey)
    .digest('hex');

  return hash === generatedHash;
}

// Setup bot commands
bot.command('start', (ctx) => {
  ctx.reply('Welcome! Click the button below to open the app:', {
    reply_markup: {
      inline_keyboard: [[
        { text: 'Open App', web_app: { url: APP_URL } }
      ]]
    }
  });
});

// Handle referral links
bot.command('invite', async (ctx) => {
  const user = ctx.from;
  if (!user) return;

  const inviteLink = `https://t.me/${ctx.botInfo.username}?start=ref_${user.id}`;
  ctx.reply(`Share this link with your friends to earn points:\n${inviteLink}`);
});