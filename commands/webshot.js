const axios = require('axios')
const fs = require('fs')
const { InputFile } = require('grammy')
const randomstring = require('randomstring')

function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '#': '%23',
    '?': '%3F',
    '*': '%2A',
    $: '%24',
    '@': '%40',
    '^': '%5E',
  }

  return text.replace(/[&<>"'#?*$@^]/g, function (m) {
    return map[m]
  })
}

module.exports = {
  name: 'webshot',
  description: 'Take a screenshot of a website',
  category: 'Utilities',
  handler: async (ctx) => {
    const { message } = ctx
    const { text } = message

    if (!text.includes('http')) {
      await ctx.reply(
        'Please provide a valid URL starting with http:// or https://'
      )
      return
    }

    await ctx.api.sendChatAction(ctx.chat.id, 'typing')

    const randomchar = randomstring.generate({
      length: 5,
      charset: 'alphabetic',
    })

    const url = encodeURI(text.substring(9))
    const url2 = escapeHtml(url)
    const ssurl = `https://api.apiflash.com/v1/urltoimage?access_key=${process.env.APIFLASHKEY}&url=${url2}&width=1920&height=1080`
    const path = __dirname + `/../downloads/${randomchar}.png`

    try {
      const response = await axios({
        method: 'get',
        url: ssurl,
        responseType: 'stream',
      })
      const writer = fs.createWriteStream(path)
      response.data.pipe(writer)

      writer.on('finish', async () => {
        await ctx.replyWithPhoto(new InputFile(path), {
          caption:
            "Here's your screenshot!" +
            '\n' +
            'Requested by @' +
            ctx.from.username,
        })
        setTimeout(() => {
          fs.unlinkSync(path)
        }, 10000)
      })
    } catch (err) {
      await ctx.reply(
        'Oops! An error occurred.\n\nPossible reasons:\n• The website is not accessible\n• The website is not responding\n• Something else went wrong'
      )
    }
  },
}
