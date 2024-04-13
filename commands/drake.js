const pop = require('popcat-wrapper')
const { InputFile } = require('grammy')
const fs = require('fs')

module.exports = {
  name: 'drake',
  description: 'Generate a drake meme',
  usage: '/drake <text1> | <text2>',
  example: '/drake X | Twitter',
  category: 'Fun',
  handler: async (ctx) => {
    const { message } = ctx
    const { text } = message

    if (!text.includes(' | ')) {
      await ctx.reply('Please provide 2 texts separated by `|`')
      return
    }

    const input = text.substring(text.indexOf(' ') + 1).split(' | ')

    const image = await pop.drake(input[0], input[1])

    await ctx.replyWithPhoto(image)
  },
}
