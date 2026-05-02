const responses = [
  'CAACAgUAAxkBAAFImWhp9iBPd08fmiDulhDTGa38AAHl-GEAAh4ZAAKXGcFVvIZs17ynVP07BA',
  'CAACAgUAAxkBAAFImWxp9iBg_zjPHWyINAhz3izw4zxxnAAClBwAAjnKwFV7dqSpYesP9jsE',
  'CAACAgUAAxkBAAFImW5p9iBxm5ERedOq6_h5gMijidtywgACKxkAAnTEyFVh8F4k_O7GqjsE',
  'CAACAgUAAxkBAAFImXBp9iB8K8lRNb9qYyp9SwbqbT1qEgACYBwAAta5yFWkbMdwbGs_2TsE',
  'CAACAgUAAxkBAAFImXRp9iCHLo3_REcDdlJjR0rlzS7qpAACSxoAAmayyFWW9sMYo3Ts6TsE',
  'CAACAgUAAxkBAAFImXhp9iCR-_GeDVt9J2RS7JRyp78BAgACBRsAAvdsyVUeeTmibwK3HjsE',
  'CAACAgUAAxkBAAFImXpp9iCmoCTEcuBC6A-C1nhilq-poQACcCIAAmx4-VUVqw8-Fpsf4DsE',
  'CAACAgUAAxkBAAFImXxp9iC4WaTk8Mf3SGnhH4As-hCMSgACQhwAAt8ICVbOobMgOLifAzsE',
  'CAACAgUAAxkBAAFImX5p9iDFj-S8LF9mgaoZpzuje-XIiQAC9hkAAvBwCFaeJ_GesNNSxzsE',
  'CAACAgUAAxkBAAFImYBp9iDbSP0OVvxnKECcC9uZk-T_CwACfCEAAq16QVY_UZWiEkT-JjsE',
  'CAACAgUAAxkBAAFImYJp9iDq_KqMl8UeUd_iWUdsJOyAcQACwRkAAmquSVb-PDbkEB-JfTsE',
  'CAACAgQAAxkBAAFImYRp9iEAAceiv9JKUBx2sTj5DC8ju6kAAjgAAxse3B6_O5NPb2xE3zsE',
  'CAACAgQAAxkBAAFImYlp9iEixCPbwUSNIYQxG64uXtFFdgACUAADt9LPHr2Y3yS-j5ttOwQ',
  'CAACAgQAAxkBAAFImY1p9iEyS2kaUVsve7YGfN8KIu69nwACygwAAmcI6FFMlv3sTlIGlDsE',
  'CAACAgQAAxkBAAFImY9p9iFGHQkl6S5NG3GlQfHpwn6CYAACJhIAAi0-iVK7xv4I4e5s6TsE',
  'CAACAgQAAxkBAAFImZlp9iFTOj6o0UH6rspv7NCGAAEzxWAAAjcNAAL6S7BSIZDelKqGHjg7BA',
  'CAACAgQAAxkBAAFImZtp9iFeIXfvPS-W_s1rpqS0YhVi1AACqAoAArcYgVPvqy7CA27I-TsE',
  'CAACAgUAAxkBAAFImZ1p9iF5vIKdyVaJ6bPzuhsYGj-d3wACFwEAAlB3whj4m4hoH-DwtjsE',
  'CAACAgUAAxkBAAFImZ9p9iGFwJtXkr0HyZsivQjEe2WfagACTwEAAlB3whjqkef58z9ayzsE',
  'CAACAgIAAxkBAAFImaNp9iGuoxJqW4Lk9D-uq3AgOa52lwACjTwAAi_ugEoQiydsd8et_DsE',
  'CAACAgIAAxkBAAFImaVp9iG-xgyIBWIiYtfS8zaaGfdr7gACDUUAAgLU-ElF04EFKFeK1zsE',
  'CAACAgIAAxkBAAFImadp9iHIyHqnjJpXqVuy412X3zI8pQAC4UEAAvQWAAFKQq5Wcm8K3DY7BA',
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

    await ctx.replyWithSticker(response)
  },
}
