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
  usage: '/webshot <url>',
  example: '/webshot https://google.com',
  category: 'Utilities',
  handler: async (ctx) => {
    const { message } = ctx
    const { text } = message
    const regex = '^(https?|http)://.*$'

    if (text.split(' ').length < 2) {
      ctx.reply('Please provide a link!')
      return
    }

    if (!regex.test(text)) {
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

    const url = encodeURI(text.substring(text.indexOf(' ') + 1)) // The query can contain spaces, that's why no .split(' ')
    const url2 = escapeHtml(url)
    const ssurl = `https://api.apiflash.com/v1/urltoimage?access_key=${process.env.APIFLASHKEY}&url=${url2}&width=1920&height=1080`
    const path = __dirname + `/../downloads/${randomchar}.png`

    const response = await axios({
      method: 'get',
      url: ssurl,
      responseType: 'stream',
    }).catch((err) => {
      if (err.response.status === 404) {
        ctx.reply('Failed to take screenshot.')
        return
      }
    })

    if (!response) return

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
  },
}
