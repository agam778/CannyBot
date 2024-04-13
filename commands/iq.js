const fs = require('fs')

let iqData = {}
let iqDataFile = __dirname + '/../downloads/iqData.json'

try {
  if (!fs.existsSync(iqDataFile)) {
    fs.writeFileSync(iqDataFile, '{}', 'utf-8')
  }

  const iqDataFileContents = fs.readFileSync(iqDataFile, 'utf-8')
  iqData = JSON.parse(iqDataFileContents)
} catch (error) {
  console.error('Error loading IQ data:', error)
}

module.exports = {
  name: 'iq',
  description: "Check your/someone's IQ",
  usage: '/iq OR /iq <name>',
  example: '/iq OR /iq agam778',
  category: 'Fun',
  handler: async (ctx) => {
    const { message } = ctx
    const { text, from } = message

    let username = text.split(' ')[1]
    if (username.includes('/iq')) username = from.id.toString()

    let iq = iqData[username]
    if (iq === undefined) {
      iq = Math.floor(Math.random() * 301) - 100
      iqData[username] = iq

      fs.writeFileSync(iqDataFile, JSON.stringify(iqData), 'utf-8')
    }

    let response = ''

    if (text.split(' ').length < 2) {
      response = `<b>Your (${from.first_name})</b> IQ is ${iq}`
    } else {
      const username = text.substring(text.indexOf(' ') + 1)
      response = `<b>${username}</b>'s IQ is ${iq}`
    }

    if (iq < 0) {
      response += '\n\nbro got no brain frfr 💯💯'
    } else if (iq < 80) {
      response +=
        '\n\nEh, consider getting a new brain from aliexpress or olx or something 👀'
    } else if (iq < 130) {
      response += "\n\nNot bad, but they're not a genius either 👎"
    } else {
      response += '\n\nHmm! Looks like we have a nerd over here 🤓'
    }

    await ctx.reply(response, { parse_mode: 'HTML' })
  },
}
