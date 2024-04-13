const urban = require('urban')
const { InlineKeyboard } = require('grammy')

module.exports = {
  name: 'ud',
  description: 'Search for a term in Urban Dictionary',
  alias: ['urban'],
  usage: '/ud <term>',
  example: '/ud ratio',
  category: 'Utilities',
  handler: async (ctx) => {
    const { message } = ctx
    const { text } = message

    if (text.split(' ').length < 2) {
      ctx.reply('Please specify a term to search for')
      return
    } else {
      const query = text.substring(text.indexOf(' ') + 1) // The query can contain spaces, that's why no .split(' ')
      const result = urban(query)
      result.first((json) => {
        if (json === undefined) {
          ctx.reply('No results found')
          return
        }

        const definition = json.definition
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
        const example = json.example.replace(/</g, '&lt;').replace(/>/g, '&gt;')

        const keyboard = new InlineKeyboard()
          .url('View on Urban Dictionary', json.permalink)
          .row()
          .url('👍 ' + json.thumbs_up, json.permalink)
          .url('👎 ' + json.thumbs_down, json.permalink)
        ctx.reply(
          `<b>${json.word}</b>\n\n${definition}\n\n<b>Example:</b>\n${example}`,
          {
            parse_mode: 'HTML',
            reply_markup: keyboard,
          }
        )
      })
    }
  },
}
