const responses = [
  'Well, unfortunately, yes',
  'HA HA HA HA HAAAA, yes',
  "Yes, that's for sure",
  'Provided no one notices, yes.',
  'Fuck yes',
  'SOMEHOW, yes.',
  'Yes, for real 👍',
  'Nope',
  'Your mom said no',
  'My reply is no',
  'My sources say no',
  'Outlook not so good',
  'Very doubtful',
  'Ew, no',
]

module.exports = {
  name: '8ball',
  description: 'Ask the magic 8-ball a question',
  usage: '/8ball <question>',
  example: '/8ball Is this bot awesome?',
  category: 'Fun',
  handler: async (ctx) => {
    const { message } = ctx
    const { text } = message

    if (text.split(' ').length < 2) {
      await ctx.reply('At least ask a question...')
      return
    }

    const response = responses[Math.floor(Math.random() * responses.length)]

    await ctx.reply(response)
  },
}
