require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');
const http = require('http');

// 1. Validação detalhada de Variáveis de Ambiente
const botToken = process.env.BOT_TOKEN;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('--- A VERIFICAR VARIÁVEIS DE AMBIENTE ---');
console.log('BOT_TOKEN:', botToken ? 'Definido ✅' : 'FALTA ❌');
console.log('SUPABASE_URL:', supabaseUrl ? `Definido (${supabaseUrl}) ✅` : 'FALTA ❌');
console.log('SUPABASE_KEY:', supabaseKey ? 'Definido ✅' : 'FALTA ❌');

if (!botToken || !supabaseUrl || !supabaseKey) {
  console.error('ERRO CRÍTICO: Faltam variáveis de ambiente no Render!');
  process.exit(1);
}

// Inicializar Bot e Supabase
const bot = new Telegraf(botToken);
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuração de Manutenção
const IS_MAINTENANCE = true; 
const ADMIN_TELEGRAM_ID = process.env.ADMIN_ID ? Number(process.env.ADMIN_ID) : null;

bot.use(async (ctx, next) => {
  if (!ctx.from) return next();
  const userId = ctx.from.id;
  const isAdmin = ADMIN_TELEGRAM_ID && userId === ADMIN_TELEGRAM_ID;

  if (IS_MAINTENANCE && !isAdmin) {
    return ctx.reply(
      '🚧 **BULL ROYALE ARENA - EM MANUTENÇÃO** 🚧\n\n' +
      '⚡ A nossa arena de apostas está a ser preparada.\n' +
      '🐂 O lançamento oficial será brevemente anunciado!',
      { parse_mode: 'Markdown' }
    );
  }
  return next();
});

bot.start(async (ctx) => {
  await ctx.reply('🚨 **BULL ROYALE ARENA** 🚨\n\n⚡ Modo de manutenção ativo.', { parse_mode: 'Markdown' });
});

bot.launch()
  .then(() => {
    console.log('🚀 Bull Royale Bot iniciado com sucesso!');
  })
  .catch((err) => {
    console.error('Erro ao iniciar o bot:', err);
  });

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bull Royale Bot Engine is running!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌐 Servidor HTTP web ativo na porta ${PORT}`);
});
