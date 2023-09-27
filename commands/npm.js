const axios = require('axios')
const { InlineKeyboard } = require('grammy')

module.exports = {
  name: 'npm',
  alias: ['yarn'],
  description: 'Get info about a npm/yarn package',
  usage: '/npm <package>',
  example: '/npm grammy',
  category: 'Utilities',
  handler: async (ctx) => {
    const { message } = ctx
    const { text } = message

    if (!text.includes(' ')) {
      await ctx.reply('Please provide a package name')
      return
    }

    const package = text.substring(5)

    const response = await axios(
      `https://api.npms.io/v2/package/${package}`
    ).catch((err) => {
      if (err.response.status === 404) {
        ctx.reply('Package not found')
        return
      }
    })

    if (!response) {
      return
    }

    const data = response.data.collected.metadata

    const buttons = new InlineKeyboard()
      .url('View on npm', `https://www.npmjs.com/package/${package}`)
      .url('View on yarn', `https://yarnpkg.com/package/${package}`)

    await ctx.reply(
      `<b>Package name: </b><code>${data.name}</code>\n<b>Version: </b><code>${data.version}</code>\n<b>Author: </b><code>${data.author.name}</code>\n<b>Author email: </b><code>${data.author.email}</code>\n<b>Home page: </b>${data.links.homepage}\n<b>License: </b><code>${data.license}</code>\n<b>Summary: </b><code>${data.description}</code>`,
      {
        reply_markup: buttons,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }
    )
  },
}
