const responses = [
  'Are you kidding? Absolutely not, and you should know better.',
  'Outlook not so good, just like your chances.',
  "My sources say 'You're wasting your time.'",
  "Reply hazy, try again... or don't, I couldn't care less.",
  'Better not tell you now. Ignorance is bliss, they say.',
  "Don't count on it. Counting on you is like counting on a broken calculator.",
  "My psychic powers say 'LOL, as if.'",
  'Very doubtful, like your taste in jokes.',
  'Without a doubt! Just kidding, doubt is all there is.',
  "You may rely on it... or not. Frankly, I don't give a damn.",
  "Cannot predict now. And honestly, I don't want to.",
  'It is decidedly so... not worth my time to explain.',
  'As I see it, yes! Just kidding, I see nothing but disappointment.',
  'Outlook is about as sunny as a raincloud over your parade.',
  "Don't hold your breath. You'll turn blue and pass out, and I won't care.",
  "Yes, definitely! Just kidding, I couldn't care less about your question.",
  "Ask again later, when I'm in the mood to entertain your nonsense.",
  "Signs point to 'Who gives a damn? Go bother someone else.'",
  "My reply is no, and frankly, you're lucky I even bothered to respond.",
  'It is certain...ly not worth my effort to validate your curiosity.',
  'You rather kys (keep yourself safe) than ask me that question.',
  "Concentrate and ask again... or don't, I'm not your mom.",
  'Hell naw bro 💀💀💀💀💀💀💀💀💀💀💀💀',
  'For real 👍',
]

module.exports = {
  name: '8ball',
  description: 'Ask the magic 8-ball a question',
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
