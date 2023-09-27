const axios = require('axios')
const { InlineKeyboard } = require('grammy')

module.exports = {
  name: 'meme',
  description: 'Sends a random meme from Reddit',
  usage: '/meme',
  example: '/meme',
  category: 'Fun',
  handler: async (ctx) => {
    await ctx.api.sendChatAction(ctx.chat.id, 'typing')

    const response = await axios.get('https://meme-api.com/gimme')
    const { title, postLink, subreddit, url } = response.data

    const inlineKeyboard = new InlineKeyboard().url('View on Reddit', postLink)

    await ctx.replyWithPhoto(url, {
      caption: `${title}\n\nPosted on r/${subreddit}`,
      reply_markup: inlineKeyboard,
    })
  },
}
