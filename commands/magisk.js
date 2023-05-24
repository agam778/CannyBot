const axios = require("axios");
const { InlineKeyboard } = require("grammy");

module.exports = {
  name: "magisk",
  description: "Get the latest Magisk releases",
  category: "Utilities",
  handler: async (ctx) => {
    try {
      const [magiskstable, magiskbeta, magiskcanary] = await Promise.all([
        axios.get("https://api.github.com/repos/topjohnwu/Magisk/releases/latest"),
        axios.get("https://raw.githubusercontent.com/topjohnwu/magisk-files/master/beta.json"),
        axios.get("https://raw.githubusercontent.com/topjohnwu/magisk-files/master/canary.json"),
      ]);

      const stableVersion = magiskstable.data.tag_name;
      const betaVersion = magiskbeta.data.magisk.version;
      const canaryVersion = magiskcanary.data.magisk.version;

      const inlineKeyboard = new InlineKeyboard()
        .url("Stable", magiskstable.data.html_url)
        .url("Beta", magiskbeta.data.magisk.link)
        .url("Canary", magiskcanary.data.magisk.link);

      const { message } = ctx;
      const { text } = message;

      let replyText = "";
      if (text.includes("stable")) {
        replyText = `Latest stable Magisk release: ${stableVersion}`;
      } else if (text.includes("beta")) {
        replyText = `Latest beta Magisk release: v${betaVersion}`;
      } else if (text.includes("canary")) {
        replyText = `Latest canary Magisk release: v${canaryVersion}`;
      } else {
        replyText = `Latest Magisk releases:\n\nStable: <code>${stableVersion}</code>\nBeta: <code>v${betaVersion}</code>\nCanary: <code>v${canaryVersion}</code>`;
      }

      await ctx.reply(replyText, {
        reply_markup: inlineKeyboard,
        parse_mode: "HTML",
      });
    } catch (error) {
      console.error("Error retrieving Magisk releases:", error);
      await ctx.reply("Oops, an error occurred while fetching Magisk releases. Please try again later.");
    }
  },
};
