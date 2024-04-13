const { InlineKeyboard } = require('grammy')

const google = 'https://google.com/search?q='
const bing = 'https://www.bing.com/search?q='
const yahoo = 'https://search.yahoo.com/search?p='
const duckduckgo = 'https://duckduckgo.com/?q='
const startpage = 'https://www.startpage.com/do/dsearch?query='
const searxng = 'https://searx.work/search?q='
const yandex = 'https://yandex.com/search/?text='

module.exports = {
  name: 'search',
  description: 'Search for a query in multiple search engines',
  usage: '/search <query>',
  example: '/search Who is agam778?',
  category: 'Utilities',
  handler: async (ctx) => {
    const { message } = ctx
    const { text } = message

    if (text.split(' ').length < 2) {
      ctx.reply('Please specify a query to search for')
      return
    } else {
      const query = escapeHtml(text.substring(text.indexOf(' ') + 1)) // The query can contain spaces, that's why no .split(' ')
      const keyboard = new InlineKeyboard()
        .url('Google', google + query)
        .url('Bing', bing + query)
        .url('Yahoo', yahoo + query)
        .row()
        .url('DuckDuckGo', duckduckgo + query)
        .url('Startpage', startpage + query)
        .row()
        .url('searXNG', searxng + query)
        .url('Yandex', yandex + query)
      await ctx.reply(
        `Search results for <code>${text.substring(
          text.indexOf(' ') + 1
        )}</code>:`,
        {
          parse_mode: 'HTML',
          reply_markup: keyboard,
        }
      )
    }
  },
}

function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '%27',
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
