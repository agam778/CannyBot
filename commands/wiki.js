const wiki = require('wikipedia')
const { InlineKeyboard } = require('grammy')

module.exports = {
  name: 'wiki',
  description: 'Search Wikipedia',
  usage: '/wiki <query>',
  example: '/wiki Arch Linux',
  category: 'Utilities',
  handler: async (ctx) => {
    const { message } = ctx
    const { text } = message

    if (!text.includes(' ')) {
      await ctx.reply('Please provide a query')
      return
    }

    const query = text.substring(text.indexOf(' ') + 1)

    try {
      const page = await wiki.page(query)

      if (!page.title) {
        await ctx.reply('Page not found on Wikipedia.')
        return
      }

      const pageTitle = page.title
      const pageUrl = page.fullurl

      const pageSummary = await page.summary()
      const pageExtract = pageSummary.extract

      const keyboard = new InlineKeyboard()
      keyboard.url('View on Wikipedia', pageUrl)

      await ctx.reply(`<b>Wikipedia: ${pageTitle}</b>\n\n${pageExtract}`, {
        parse_mode: 'HTML',
        reply_markup: keyboard,
      })
    } catch (error) {
      await ctx.reply('An error occurred while searching Wikipedia.')
    }
  },
}
