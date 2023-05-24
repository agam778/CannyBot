const axios = require("axios");
const fs = require("fs");
const { InlineKeyboard, InputFile } = require("grammy");
const randomstring = require("randomstring");

module.exports = {
  name: "ghuser",
  description: "Get info about a GitHub user",
  category: "Git Utilities",
  handler: async (ctx) => {
    const { message } = ctx;
    const { text } = message;

    if (!text.includes(" ")) {
      await reply("Please provide a username");
      return;
    }

    const randomchar = randomstring.generate({
      length: 5,
      charset: "alphabetic",
    });

    const username = text.substring(8);

    try {
      const { data } = await axios.get(
        `https://api.github.com/users/${username}`
      );
      const path = `${__dirname}/../downloads/${randomchar}.png`;

      const avatarResponse = await axios({
        method: "get",
        url: data.avatar_url,
        responseType: "stream",
      });

      const writer = fs.createWriteStream(path);
      avatarResponse.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      await ctx.replyWithPhoto(new InputFile(path), {
        caption: `<b>Username:</b> <code>${data.login}</code>\n<b>Name:</b> ${data.name}\n<b>Location:</b> ${data.location}\n<b>Followers:</b> ${data.followers}\n<b>Following:</b> ${data.following}\n<b>Public Repos:</b> ${data.public_repos}\n<b>Public Gists:</b> ${data.public_gists}\n<b>Twitter:</b> ${data.twitter_username}\n<b>Website:</b> ${data.blog}`,
        reply_markup: new InlineKeyboard().url("View on GitHub", data.html_url),
        disable_web_page_preview: true,
        parse_mode: "HTML",
      });

      setTimeout(() => {
        fs.unlinkSync(path);
      }, 10000);
    } catch (error) {
      await reply(
        "Oops, an error occurred!\n\nPossible reasons:\n• User not found\n• Rate limit exceeded"
      );
    }
  },
};
