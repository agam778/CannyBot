const axios = require('axios')
const { InlineKeyboard } = require('grammy')

module.exports = {
  name: 'pip',
  description: 'Get info about a pip package',
  usage: '/pip <package>',
  example: '/pip requests',
  category: 'Utilities',
  handler: async (ctx) => {
    const { message } = ctx
    const { text } = message

    if (!text.includes(' ')) {
      await ctx.reply('Please provide a package name')
      return
    }

    const packageName = text.substring(5)
    try {
      const response = await axios.get(
        `https://pypi.org/pypi/${packageName}/json`
      )
      const packageInfo = response.data.info

      const buttons = new InlineKeyboard().url(
        'View on PyPI',
        `https://pypi.org/project/${packageName}`
      )

      await ctx.reply(
        `<b>Package name:</b> <code>${packageInfo.name}</code>\n<b>Version:</b> <code>${packageInfo.version}</code>\n<b>Author:</b> <code>${packageInfo.author}</code>\n<b>Author email:</b> <code>${packageInfo.author_email}</code>\n<b>Home page:</b> ${packageInfo.home_page}\n<b>License:</b> <code>${packageInfo.license}</code>\n<b>Summary:</b> <code>${packageInfo.summary}</code>`,
        {
          reply_markup: buttons,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }
      )
    } catch (error) {
      if (error.response && error.response.status === 404) {
        await ctx.reply(`Package <code>${packageName}</code> not found`, {
          parse_mode: 'HTML',
        })
      } else {
        await ctx.reply(
          `An error occurred while fetching package <code>${packageName}</code> information`,
          { parse_mode: 'HTML' }
        )
      }
    }
  },
}
