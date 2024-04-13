const { InlineKeyboard } = require('grammy')
const axios = require('axios')

module.exports = {
  name: 'weather',
  description: 'Get weather information',
  usage: '/weather <location>',
  example: '/weather New York',
  category: 'Utilities',
  handler: async (ctx) => {
    const { message } = ctx
    const { text } = message

    if (text.split(' ').length < 2) {
      await ctx.reply('Please provide a location')
      return
    }

    const location = text.substring(text.indexOf(' ') + 1) // The query can contain spaces, that's why no .split(' ')
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`

    const response = await axios.get(url).catch((err) => {
      if (err.response.status === 404) {
        ctx.reply('Location not found')
        return
      }
    })

    if (!response) return

    const { data } = response

    const { name, sys, weather, main, wind } = data
    const { country } = sys
    const { temp, feels_like, temp_min, temp_max, humidity } = main
    const { speed } = wind
    const { main: weatherMain, description } = weather[0]

    const keyboard = new InlineKeyboard().url(
      'OpenWeatherMap',
      `https://openweathermap.org/city/${data.id}`
    )

    await ctx.reply(
      `Weather in ${name}, ${country}\n\n` +
        `🌡️ Temperature: ${temp}°C\n` +
        `🌡️ Feels like: ${feels_like}°C\n` +
        `🌡️ Min: ${temp_min}°C\n` +
        `🌡️ Max: ${temp_max}°C\n` +
        `💧 Humidity: ${humidity}%\n` +
        `💨 Wind speed: ${speed} m/s\n` +
        `🌤️ Weather: ${weatherMain} (${description})`,
      {
        reply_markup: keyboard,
      }
    )
  },
}
