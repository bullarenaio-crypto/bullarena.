require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');
const http = require('http');

// 1. Validação de Variáveis de Ambiente
const botToken = process.env.BOT_TOKEN;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!botToken || !supabaseUrl || !supabaseKey) {
  console.error('ERRO: Faltam variáveis de ambiente essenciais (BOT_TOKEN, SUPABASE_URL ou SUPABASE_KEY)!');
  process.exit(1);
}

// Inicializar Bot e Supabase
const bot = new Telegraf(botToken);
const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// CONFIGURAÇÃO DE SEGURANÇA / MANUTENÇÃO
// ==========================================
// TRUE = O bot está em manutenção (ninguém consegue apostar, só o admin)
// FALSE = O bot está aberto ao público
const IS_MAINTENANCE = true; 

// Põe aqui o teu ID de Telegram pessoal para poderes testar mesmo em manutenção
// (Podes descobrir o teu ID enviando mensagem a bots como @userinfobot)
const ADMIN_TELEGRAM_ID = process.env.ADMIN_ID ? Number(process.env.ADMIN_ID) : null;

// Middleware de verificação de manutenção
bot.use(async (ctx, next) => {
  if (!ctx.from) return next();
  
  const userId = ctx.from.id;
  const isAdmin = ADMIN_TELEGRAM_ID && userId === ADMIN_TELEGRAM_ID;

  if (IS_MAINTENANCE && !isAdmin) {
    return ctx.reply(
      '🚧 **BULL ROYALE ARENA - EM MANUTENÇÃO** 🚧\n\n' +
      '⚡ A nossa arena de apostas está a ser preparada e otimizada.\n' +
      '🐂 O lançamento oficial será brevemente anunciado. Fica atento!',
      { parse_mode: 'Markdown' }
    );
  }

  return next();
});

// ==========================================
// COMANDOS DO BOT
// ==========================================

// Comando /start
bot.start(async (ctx) => {
  const user = ctx.from;
  console.log(`Utilizador ${user.username || user.id} iniciou o bot.`);

  // Opcional: Registar ou verificar o utilizador no Supabase
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert({ 
        telegram_id: user.id, 
        username: user.username || 'Sem username',
        first_name: user.first_name,
        updated_at: new Date()
      }, { onConflict: 'telegram_id' });

    if (error) console.error('Erro ao guardar no Supabase:', error.message);
  } catch (err) {
    console.error('Exceção ao ligar ao Supabase:', err);
  }

  // Mensagem de boas-vindas com menus interativos
  await ctx.reply(
    '🚨 **BULL ROYALE ARENA** 🚨\n\n' +
    '⚡ Bem-vindo à experiência de apostas definitiva.\n' +
    '🐂 Escolhe uma opção abaixo para começar:',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('💰 O Meu Saldo', 'btn_balance'), Markup.button.callback('🎮 Jogar / Apostar', 'btn_play')],
        [Markup.button.callback('📊 Ranking', 'btn_ranking'), Markup.button.callback('ℹ️ Ajuda', 'btn_help')]
      ])
    }
  );
});

// Ações dos botões interativos
bot.action('btn_balance', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('💰 O teu saldo atual na Arena é de: **0.00 BRL** (Modo de Demonstração)', { parse_mode: 'Markdown' });
});

bot.action('btn_play', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('🎮 O módulo de apostas e jogos rápidos estará disponível no lançamento oficial!');
});

bot.action('btn_ranking', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('📊 O ranking de apostadores da temporada ainda está vazio.');
});

bot.action('btn_help', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('ℹ️ Para qualquer dúvida, contacta o suporte oficial em https://bullroyale.io');
});

// ==========================================
// ARRRIQUE DO BOT E SERVIDOR WEB (RENDER)
// ==========================================
bot.launch()
  .then(() => {
    console.log('🚀 Bull Royale Bot (Definitivo) iniciado com sucesso!');
    console.log(`🔒 Modo Manutenção: ${IS_MAINTENANCE ? 'ATIVADO' : 'DESATIVADO'}`);
  })
  .catch((err) => {
    console.error('Erro ao iniciar o bot:', err);
  });

// Mini servidor HTTP para o Web Service gratuito do Render não dar timeout
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bull Royale Bot Engine is running!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌐 Servidor HTTP web ativo na porta ${PORT}`);
});

// Encerramento seguro
process.once('SIGINT', () => {
  server.close();
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  server.close();
  bot.stop('SIGTERM');
});
