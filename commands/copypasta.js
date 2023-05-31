const axios = require('axios')

module.exports = {
  name: 'copypasta',
  description:
    'Get a random copypasta. Note: Might spam if the copypasta is too long',
  category: 'Fun',
  handler: async (ctx) => {
    const response = await axios.get(
      'https://api.github.com/repos/ios7jbpro/ratio-database/contents'
    )
    const files = response.data

    if (!files || files.length === 0) {
      await ctx.reply('No copypastas found')
    }

    const randomIndex = Math.floor(Math.random() * files.length)
    const randomFile = files[randomIndex]
    const downloadUrl = randomFile.download_url

    if (!downloadUrl) {
      await ctx.reply(
        'Oops! Something went wrong while retrieving the copypasta. Please try again later.'
      )
    }

    const copypastaResponse = await axios.get(downloadUrl)
    let copypasta = copypastaResponse.data

    if (copypasta.length > 2000) {
      copypasta = copypasta.substring(0, 2000)
    }

    await ctx.reply(copypasta)

    if (copypastaResponse.data.length > 2000) {
      let remainingCopypasta = copypastaResponse.data.substring(2000)

      while (remainingCopypasta.length > 0) {
        const chunk = remainingCopypasta.substring(0, 2000)
        remainingCopypasta = remainingCopypasta.substring(2000)

        await ctx.reply(chunk)
      }
    }
  },
}
