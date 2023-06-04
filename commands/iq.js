module.exports = {
  name: 'iq',
  description: "Check your/someone's IQ",
  category: 'Fun',
  handler: async (ctx) => {
    const { message } = ctx
    const { text, from } = message

    let iq = Math.floor(Math.random() * 301) - 100

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
        "\n\nHmmm... Looks like you'll have to get a new brain from AliExpress. 🤡"
    } else if (iq < 120) {
      response += "\n\nNot bad, but you're not a genius either. 👎"
    } else {
      response += '\n\nHmm! Looks like we have a nerd over here. 🤓'
    }

    await ctx.reply(response, { parse_mode: 'HTML' })
  },
}
