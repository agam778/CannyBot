const axios = require('axios')
const { InlineKeyboard } = require('grammy')

module.exports = {
  name: 'aur',
  alias: ['pacman'],
  description: 'Get info about an AUR/pacman package',
  usage: '/aur <package>',
  example: '/aur ms-365-electron-bin',
  category: 'Utilities',
  handler: async (ctx) => {
    const { message } = ctx
    const { text } = message

    if (!text.includes(' ')) {
      await ctx.reply('Please provide a package name')
      return
    }

    const package = text.substring(text.indexOf(' ') + 1)

    const response = await axios.get(
      `https://archlinux.org/packages/search/json/?q=${package}`
    )

    const packageData = response.data.results.find(
      (result) => result.pkgname === package
    )

    if (packageData) {
      await sendPackageInfo(ctx, packageData)
    } else {
      const aurResponse = await axios.get(
        `https://aur.archlinux.org/rpc/?v=5&type=search&arg=${package}`
      )
      const aurData = aurResponse.data.results[0]

      if (aurData) {
        await sendPackageInfo(ctx, aurData)
      } else {
        await ctx.reply(
          'Oops, an error occurred!\n\nPossible reasons:\n• Package not found\n• Rate limit exceeded'
        )
      }
    }
  },
}
async function sendPackageInfo(ctx, packageData) {
  const pkgname = packageData.pkgname || packageData.Name
  const pkgdesc = packageData.pkgdesc || packageData.Description
  const pkgver = packageData.pkgver || packageData.Version
  const maintainers = packageData.maintainers || packageData.Maintainer
  const url = packageData.url || packageData.URL

  await ctx.reply(
    `<b>Package:</b> <code>${pkgname}</code>\n<b>Description:</b> ${pkgdesc}\n<b>Version:</b> <code>${pkgver}</code>\n<b>Maintainer:</b> ${maintainers}\n<b>URL:</b> ${url}`,
    {
      parse_mode: 'HTML',
      reply_markup: new InlineKeyboard().url('View on archlinux.org', url),
      disable_web_page_preview: true,
    }
  )
}
