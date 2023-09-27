const responses = [
  'Fuck you, go away. Why do you think this piece of floating plastic has the answers you are looking for?',
  'Well, unfortunately, yes',
  'Nah that can\'t be real',
  'Nah bro istg',
  'HA HA HA HA HAAAA, yes',
  'not you again..ugh',
  'Yes, that\'s for sure',
  'Idts that\'s wrong',
  'Get a life bro',
  'Your mom said no',
  'Fuck around and find out!',
  'Only if you believe',
  'Provided no one notices, yes.',
  'Fuck yes',
  'SOMEHOW, yes.',
  'Oh, that\'s awful! How can you even ask that? But yeah, depressingly.',
  'Hell naw bro 💀💀💀💀💀💀💀💀💀💀💀💀',
  'For real 👍',
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

    if (!text.includes(' ')) {
      await ctx.reply('At least ask a question...')
      return
    }

    const response = responses[Math.floor(Math.random() * responses.length)]

    await ctx.reply(response)
  },
}
