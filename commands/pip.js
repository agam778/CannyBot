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

    if (text.split(' ').length < 2) {
      await ctx.reply('Please provide a package name')
      return
    }

    const packageName = text.split(' ')[1]
    const response = await axios
      .get(`https://pypi.org/pypi/${packageName}/json`)
      .catch((err) => {
        if (err.response.status === 404) {
          ctx.reply('Package not found')
          return
        }
      })

    if (!response) return

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
  },
}
