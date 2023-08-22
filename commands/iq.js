const crypto = require('crypto')

module.exports = {
  name: 'iq',
  description: "Check your/someone's IQ",
  usage: '/iq OR /iq <name>',
  example: '/iq OR /iq agam778',
  category: 'Fun',
  handler: async (ctx) => {
    const { message } = ctx
    const { text, from } = message

    const query = text.substring(text.indexOf(' ') + 1)
    if (query === '') {
      var firstname = from.first_name
      var username = from.username
    } else {
      var firstname = query
      var username = query
    }

    const iq = calculateIQ(firstname, username)

    let response = ''

    if (!text.includes(' ')) {
      response = `<b>Your (${from.first_name})</b> IQ is ${iq}`
    } else {
      response = `<b>${query}'s</b> IQ is ${iq}`
    }

    if (iq < 80) {
      response += '\n\nGuess they gotta get a new brain from AliExpress 🤡'
    } else if (iq < 130) {
      response += "\n\nNot bad, but they're not a genius either 👎"
    } else {
      response += '\n\nLooks like we have a nerd over here 🤓'
    }

    await ctx.reply(response, { parse_mode: 'HTML' })
  },
}

function calculateIQ(firstname, username) {
  const sha = crypto.createHash('sha1').update(firstname).digest('hex')
  const md5 = crypto.createHash('md5').update(username).digest('hex')

  const shaDigits = sha.match(/\d{2}/)[0]
  const md5Digits = md5.match(/\d{2}/)[0]

  const num1 = parseInt(shaDigits) + parseInt(md5Digits)
  const num2 = Math.floor(Math.random() * 6)
  const f = num1 - num2
  let iq = 180 - f

  return iq
}
