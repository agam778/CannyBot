const axios = require('axios')
const { InlineKeyboard } = require('grammy')

module.exports = {
  name: 'meme',
  description: 'Sends a random meme from Reddit',
  usage: '/meme',
  example: '/meme',
  category: 'Fun',
  handler: async (ctx) => {
    try {
      await ctx.api.sendChatAction(ctx.chat.id, 'typing')

      const response = await axios.get('https://meme-api.com/gimme')
      const { title, postLink, subreddit, url } = response.data

      const inlineKeyboard = new InlineKeyboard().url(
        'View on Reddit',
        postLink
      )

      await ctx.replyWithPhoto(url, {
        caption: `${title}\n\nPosted on r/${subreddit}`,
        reply_markup: inlineKeyboard,
      })
    } catch (error) {
      console.error('Error fetching meme:', error)
      await ctx.reply('Oops! An error occurred while fetching the meme.')
    }
  },
}
