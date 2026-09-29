// Modo manutenção ativo (Textos em Inglês)
const IS_MAINTENANCE = true;

bot.use(async (ctx, next) => {
  if (IS_MAINTENANCE) {
    return ctx.reply(
      '🚧 **BULL ROYALE ARENA - UNDER MAINTENANCE** 🚧\n\n' +
      '⚡ The liquidity warfare arena is currently being calibrated.\n' +
      '🐂 Official Beta launch will be announced shortly!',
      { parse_mode: 'Markdown' }
    );
  }
  return next();
});
