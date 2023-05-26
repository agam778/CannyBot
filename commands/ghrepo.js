const axios = require('axios')
const { InlineKeyboard } = require('grammy')

module.exports = {
  name: 'ghrepo',
  description: 'Get info about a GitHub repository',
  category: 'Git Utilities',
  handler: async (ctx) => {
    const { message } = ctx
    const { text } = message

    if (!text.includes(' ')) {
      await ctx.reply('Please provide a name for the repository')
      return
    }

    const repo = text.substring(text.indexOf(' ') + 1)

    try {
      const response = await axios(
        `https://api.github.com/search/repositories?q=${repo}`
      )

      const data = response.data.items[0]

      await ctx.reply(
        `<b>Repository:</b> <code>${data.name}</code>\n<b>Description:</b> ${data.description}\n<b>Language:</b> ${data.language}\n<b>Stars:</b> ${data.stargazers_count}\n<b>Forks:</b> ${data.forks_count}\n<b>Open Issues:</b> ${data.open_issues_count}\n<b>License:</b> ${data.license.name}\n<b>Owner:</b> ${data.owner.login}`,
        {
          reply_markup: new InlineKeyboard().url(
            'View on GitHub',
            data.html_url
          ),
          disable_web_page_preview: true,
          parse_mode: 'HTML',
        }
      )
    } catch (error) {
      await ctx.reply(
        'Oops, an error occurred!\n\nPossible reasons:\n• User not found\n• Rate limit exceeded'
      )
    }
  },
}
