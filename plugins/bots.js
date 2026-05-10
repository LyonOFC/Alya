let handler = async (m, { conn }) => {
  const imagenURL = 'https://files.catbox.moe/jg0te7.jpeg'

  let subBotsList = ''
  let totalSubBots = 0

  if (global.conns && global.conns.length > 0) {
    totalSubBots = global.conns.length
    subBotsList = global.conns.map((bot, i) => {
      let status = bot.user ? '✅ ¢σηє¢тα∂σ' : '❌ ∂єѕ¢σηє¢тα∂σ'
      let nombre = bot.user?.name || 'ѕιη ησмвяє'
      let numero = bot.user?.id?.split(':')[0] || '∂єѕ¢σησ¢ι∂σ'
      return `✦ вσт ${i + 1}\n   ➥ ησмвяє: ${nombre}\n   ➥ ηυмєяσ: ${numero}\n   ➥ єѕтα∂σ: ${status}`
    }).join('\n\n')
  } else {
    subBotsList = '✦ ησ нαу ѕυв-вσтѕ νιη¢υℓα∂σѕ'
  }

  const texto = `
ㅤ    ꒰  ㅤ 🕸️ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ вσтѕ νιη¢υℓα∂σѕ 木 性 ㅤ ✿

> ₊· ⫏⫏ ㅤ тσтαℓ: ${totalSubBots} ѕυв-вσт(ѕ)

${subBotsList}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ 性 ㅤ ѕιѕтємα єנє¢υтα∂σ ㅤ ✿

ㅤ    ꒰  ㅤ 🕸️ ㅤ *ℓүσηη* ㅤ ⫏⫏  ꒱
> ₊· ⫏⫏ ㅤ ✿ 木 性 ㅤ αℓуα
`.trim()

  await conn.sendMessage(m.chat, {
    image: { url: imagenURL },
    caption: texto,
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363407253203904@newsletter",
        newsletterName: "αℓуα - ¢нαηηєℓ",
        serverMessageId: 1
      }
    }
  }, { quoted: m })
}

handler.help = ['bots']
handler.tags = ['serbot']
handler.command = ['bots', 'subbots']
handler.desc = 'ᴠᴇʀ ʟᴏꜱ ʙᴏᴛꜱ ᴠɪɴᴄᴜʟᴀᴅᴏꜱ'

export default handler