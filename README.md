# CannyBot

CannyBot is an Open Source Telegram bot written in [grammY](http://grammy.dev). It's just a fun bot with some cool features. <b>IT IS NOT</b> a moderation bot.

# Commands

<b>Utilities:</b>

- /aur, /pacman - Get info about an AUR/pacman package
- /help - Show a list of commands
- /magisk - Get the latest Magisk releases
- /npm, /yarn - Get info about a npm/yarn package
- /pip - Get info about a pip package
- /webshot - Take a screenshot of a website

<b>Git Utilities:</b>

- /ghrepo - Get info about a GitHub repository
- /ghuser - Get info about a GitHub user

<b>Fun:</b>

- /meme - Sends a random meme from Reddit

More commands will be added soon!

# Add it to your group

To add this bot in your group, invite "[@thecannybot](https://t.me/thecannybot)" to your group

# Other Information

## About the envrionment variables:

The environment variables are present in `sample.env`, rename it to `.env` and fill in the values if you're self hosting it.

- BOT_TOKEN: The token of your bot, get it from @BotFather
- LOG_CHANNEL: The ID of the channel/group where the logs will be sent if an error occurs when a command is executed
- LOG_COMMANDS: Set it to `true` if you want to log every command that is executed
- SITE_SHOT_API_KEY: Needed by the webshot command, get it from [here](https://site-shot.com/)

## Self host:

Install Dependencies: Run `yarn; yarn install`<br>
Run the Bot: Run `yarn start`

# License

CannyBot is licensed under the GPL 3.0 license. See the [`LICENSE`](./LICENSE) file for more information.
If you are using the customized version of this bot/using any command in the bot for your own purposes, I would be grateful to have credits in any form.
