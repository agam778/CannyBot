const axios = require('axios')
const { InlineKeyboard } = require('grammy')

module.exports = {
  name: 'steam',
  description: 'Get information about a Steam game',
  alias: ['game'],
  usage: '/steam <game>',
  example: '/steam Counter-Strike: Global Offensive',
  category: 'Utilities',
  handler: async (ctx) => {
    const { message } = ctx
    const { text } = message

    if (!text.includes(' ')) {
      await ctx.reply('Please provide a game')
      return
    }

    const game = text.substring(text.indexOf(' ') + 1)
    const url = `https://api.steampowered.com/ISteamApps/GetAppList/v2/`

    try {
      const response = await axios.get(url)

      if (
        !response ||
        !response.data ||
        !response.data.applist ||
        !response.data.applist.apps
      ) {
        await ctx.reply('Failed to fetch game data from Steam.')
        return
      }

      const games = response.data.applist.apps

      const matchingGames = games.filter((gameObj) =>
        gameObj.name.toLowerCase().includes(game.toLowerCase())
      )

      if (matchingGames.length === 0) {
        await ctx.reply('Game not found on Steam.')
        return
      }

      const matchingGame = matchingGames[0]
      const gameName = matchingGame.name
      const gameAppID = matchingGame.appid

      const gameDetailsUrl = `https://store.steampowered.com/api/appdetails/?appids=${gameAppID}`
      const gameDetailsResponse = await axios.get(gameDetailsUrl)

      if (
        !gameDetailsResponse ||
        !gameDetailsResponse.data ||
        !gameDetailsResponse.data[gameAppID] ||
        !gameDetailsResponse.data[gameAppID].data
      ) {
        await ctx.reply('Failed to fetch additional game details from Steam.')
        return
      }

      const gameDetails = gameDetailsResponse.data[gameAppID].data
      const gameDescription =
        gameDetails.short_description || 'No description available.'
      const gameImage = gameDetails.header_image || null
      const gamePrice = gameDetails.price_overview
        ? `${gameDetails.price_overview.final_formatted} (${gameDetails.price_overview.discount_percent}% off)`
        : 'Price not available'
      const gameReleaseDate = gameDetails.release_date
        ? new Date(gameDetails.release_date.date).toDateString()
        : 'Release date not available'

      const inlineKeyboard = new InlineKeyboard()
      inlineKeyboard.url(
        'View on Steam',
        `https://store.steampowered.com/app/${gameAppID}`
      )

      if (gameImage !== null) {
        await ctx.replyWithPhoto(gameImage, {
          caption: `<b>${gameName}</b>\n${gameDescription}\n\n<b>Price:</b> ${gamePrice}\n<b>Release Date:</b> ${gameReleaseDate}`,
          parse_mode: 'HTML',
          reply_markup: inlineKeyboard,
        })
      } else {
        await ctx.reply(
          `<b>${gameName}</b>\n${gameDescription}\n\n<b>Price:</b> ${gamePrice}\n<b>Release Date:</b> ${gameReleaseDate}`,
          {
            reply_markup: inlineKeyboard,
            parse_mode: 'HTML',
          }
        )
      }
    } catch (error) {
      console.error('Error fetching game data from Steam:', error.message)
      await ctx.reply('An error occurred while fetching game data from Steam.')
    }
  },
}
