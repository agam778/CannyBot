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
  category: 'Fun',
  handler: async (ctx) => {
    const { message } = ctx
    const { text, from } = message

    let username = text.substring(text.indexOf(' ') + 1)
    if (
      username.includes(
        '/iq' || username.includes(`/iq@${ctx.botInfo.username}`)
      )
    ) {
      username = from.id.toString()
    }

    let iq = iqData[username]
    if (iq === undefined) {
      iq = Math.floor(Math.random() * 301) - 100
      iqData[username] = iq

      fs.writeFileSync(iqDataFile, JSON.stringify(iqData), 'utf-8')
    }

    let response = ''

    if (!text.includes(' ')) {
      response = `<b>Your (${from.first_name})</b> IQ is ${iq}`
    } else {
      const username = text.substring(text.indexOf(' ') + 1)
      response = `<b>${username}</b>'s IQ is ${iq}`
    }

    if (iq < 0) {
      response += '\n\nOh my god! Blud got no brain 🧠❓❓❓'
    } else if (iq < 80) {
      response +=
        "\n\nHmmm... Looks like they'll have to get a new brain from AliExpress. 🤡"
    } else if (iq < 120) {
      response += "\n\nNot bad, but they're not a genius either. 👎"
    } else {
      response += '\n\nHmm! Looks like we have a nerd over here. 🤓'
    }

    await ctx.reply(response, { parse_mode: 'HTML' })
  },
}
