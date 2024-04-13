const { InlineKeyboard } = require('grammy')
const axios = require('axios')

module.exports = {
  name: 'device',
  description: 'Get codename and name of given Android device',
  usage: '/device <codename or name>',
  example: '/device RMX3370',
  category: 'Utilities',
  handler: async (ctx) => {
    const { message } = ctx
    const { text } = message

    if (text.split(' ').length < 2) {
      await ctx.reply('Please provide a device codename or name')
      return
    }

    const deviceQuery = text.substring(text.indexOf(' ') + 1) // The query can contain spaces, that's why no .split(' ')
    const url = `https://raw.githubusercontent.com/ejbtrd/android_selected_certified_devices/main/devices.json`

    const data = await axios.get(url)
    const responseData = data.data

    if (!responseData) {
      await ctx.reply('Oops, something went wrong')
      return
    }

    const result = responseData.filter(
      (device) =>
        device.name.toLowerCase().includes(deviceQuery.toLowerCase()) ||
        device.codename.toLowerCase().includes(deviceQuery.toLowerCase()) ||
        device.model.toLowerCase().includes(deviceQuery.toLowerCase())
    )
    if (result.length === 0) {
      await ctx.reply('No device found')
      return
    }
    if (JSON.stringify(result).length > 2048) {
      let reply = 'Too many devices found, please be more specific:\n\n'

      result.slice(0, 10).forEach((foundDevice) => {
        reply += `${foundDevice.name}: \`${foundDevice.codename}\`\n`
      })

      await ctx.reply(reply, {
        parse_mode: 'Markdown',
      })
      return
    }

    let reply = 'Devices found for query `' + deviceQuery + '`:\n\n'

    result.forEach((foundDevice) => {
      reply += `${foundDevice.name}: \`${foundDevice.codename}\`\n`
    })

    await ctx.reply(reply, {
      parse_mode: 'Markdown',
    })
  },
}
