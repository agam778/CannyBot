const { Bot, GrammyError, HttpError } = require("grammy");
const { autoQuote } = require("@roziscoding/grammy-autoquote");
const fs = require("fs");
const path = require("path");

if (fs.existsSync(".env")) {
  require("dotenv").config();
}

if (!process.env.LOG_CHANNEL) {
  console.error("LOG_CHANNEL not set in environment variables! Exiting...");
}

if (!process.env.BOT_TOKEN) {
  console.error("BOT_TOKEN not set in environment variables! Exiting...");
}

const logchannel = process.env.LOG_CHANNEL;

function logCommand(ctx) {
  if (process.env.LOG_COMMANDS === "true") {
    const commandText = ctx.message.text;
    const chatTitle = ctx.chat.title;
    const userFirstName = ctx.from.first_name;
    const userLastName = ctx.from.last_name || "";
    const username = ctx.from.username || "";

    const logMessage = `Command: <code>${commandText}</code>\n\nGroup: <code>${chatTitle}</code>\n\nUser: ${userFirstName} ${userLastName} (@${username})`;

    ctx.api.sendMessage(logchannel, logMessage, {
      parse_mode: "HTML",
      chat_id: logchannel,
    });
  }
}

const bot = new Bot(process.env.BOT_TOKEN);
bot.use(autoQuote);

const commandFilesDir = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandFilesDir)
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(path.join(commandFilesDir, file));
  bot.command(command.name, (ctx) => {
    logCommand(ctx);
    command.handler(ctx);
  });
  if (command.alias) {
    for (const alias of command.alias) {
      bot.command(alias, (ctx) => {
        logCommand(ctx);
        command.handler(ctx);
      });
    }
  }
}

bot.command("start", (ctx) =>
  ctx.reply(
    "Hi! I'm CannyBot!\n\n" + "Run the /help command to see what I can do!"
  )
);

bot.catch((err) => {
  const ctx = err.ctx;
  console.log(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  const commandText = ctx.message.text;
  const chatTitle = ctx.chat.title;
  const errorMessage = `Command: <code>${commandText}</code>\n\nGroup: <code>${chatTitle}</code>\n\nUser: ${ctx.from.first_name} ${ctx.from.last_name || ""} (@${ctx.from.username || ""})\n\nError: <code>${e}</code>`;

  if (e instanceof GrammyError) {
    ctx.api.sendMessage(logchannel, `Error in request:\n\n${errorMessage}`, {
      parse_mode: "HTML",
      chat_id: logchannel,
    });
    ctx.reply("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    ctx.api.sendMessage(
      logchannel,
      `Could not contact Telegram:\n\n${errorMessage}`,
      { parse_mode: "HTML", chat_id: logchannel }
    );
    ctx.reply("Could not contact Telegram:", e);
  } else {
    ctx.reply(`Oh no, an error occurred!\n\n${errorMessage}`, {
      parse_mode: "HTML",
      chat_id: logchannel,
    });
    ctx.reply("Oh no, an error occurred! 😢");
  }
});

process.on("uncaughtException", (err) => {
  console.error(err);
});

process.on("unhandledRejection", (err) => {
  console.error(err);
});

process.on("SIGINT", () => {
  console.log("Stopping CannyBot...");
  bot.stop();
  process.exit(0);
});

require("./webserver");

console.log("Starting CannyBot...");
bot.start();
