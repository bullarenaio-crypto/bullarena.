const { Telegraf } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');

// 1. Carregar variáveis de ambiente (certifica-te de que estao configuradas no Render)
const BOT_TOKEN = process.env.BOT_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!BOT_TOKEN) {
  console.error("ERRO: BOT_TOKEN não está definido nas variáveis de ambiente!");
  process.exit(1);
}

// 2. Inicializar o Bot e o Supabase
const bot = new Telegraf(BOT_TOKEN);
const supabase = (SUPABASE_URL && SUPABASE_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

if (!supabase) {
  console.warn("AVISO: Supabase não inicializado. Verifique as credenciais SUPABASE_URL e SUPABASE_KEY.");
} else {
  console.log("Supabase conectado com sucesso!");
}

// 3. Comando /start
bot.start((ctx) => {
  const userName = ctx.from.first_name || "Guerreiro";
  
  const welcomeMessage = `
🔥 **Bem-vindo à Arena, ${userName}!**

O **Bull Royale** é a tua plataforma de duelos rápidos em $SOL na rede Solana. 

⚡ **Como funciona:**
- Entra em duelos relâmpago de 1 hora.
- Cofres 100% *non-custodial* e resultados validados por oráculos on-chain.
- Menos conversa, mais volume.

Usa os comandos abaixo para navegar:
/duel - Ver duelos ativos ou criar um novo
/profile - Ver o teu saldo e estatísticas
/help - Ajuda e suporte
  `;

  ctx.replyWithMarkdown(welcomeMessage);
});

// 4. Comando /duel (Exemplo de estrutura para os duelos)
bot.command('duel', async (ctx) => {
  ctx.reply(
    "⚔️ **Arena de Duelos**\n\nNeste momento não há duelos abertos criados por ti. Queres iniciar um duelo flash de $SOL?",
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🚀 Criar Novo Duelo", callback_data: "create_duel" }],
          [{ text: "📊 Ver Duelos Ativos", callback_data: "list_duels" }]
        ]
      }
    }
  );
});

// 5. Comando /profile (Puxando dados do Supabase se configurado)
bot.command('profile', async (ctx) => {
  const telegramId = ctx.from.id;

  if (!supabase) {
    return ctx.reply("⚠️ Base de dados temporariamente indisponível.");
  }

  try {
    // Exemplo de consulta à tabela de utilizadores no Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    if (error || !data) {
      return ctx.reply("📭 Ainda não tens uma conta registada na base de dados. Participa num duelo para criar o teu perfil!");
    }

    ctx.reply(`👤 **Teu Perfil**\n\nID: \`${data.telegram_id}\`\nSaldo: \`${data.balance || 0} SOL\``, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error("Erro ao buscar perfil:", err);
    ctx.reply("❌ Ocorreu um erro ao carregar o teu perfil.");
  }
});

// 6. Tratamento de Botões Inline (Exemplo)
bot.action('create_duel', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply("⚙️ Funcionalidade de criação de duelo via Telegram em breve! Fica atento.");
});

bot.action('list_duels', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply("📋 A carregar duelos ativos na rede Solana...");
});

// 7. Iniciar o Bot
bot.launch()
  .then(() => {
    console.log("🤖 Bot do Bull Royale iniciado com sucesso!");
  })
  .catch((err) => {
    console.error("Erro ao iniciar o bot:", err);
  });

// Permitir encerramento gracioso
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
