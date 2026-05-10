let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) {
    return conn.reply(m.chat, '❌ 𝙎𝙤𝙡𝙤 𝙚𝙡 𝙙𝙪𝙚𝙣̃𝙤 𝙥𝙪𝙚𝙙𝙚 𝙪𝙨𝙖𝙧 𝙚𝙨𝙩𝙤', m)
  }

  const imagenURL = 'https://files.catbox.moe/jg0te7.jpeg'
  
  let subBotsList = ''
  let totalSubBots = 0
  
  if (global.conns && global.conns.length > 0) {
    totalSubBots = global.conns.length
    subBotsList = global.conns.map((bot, i) => {
      let status = bot.user ? '✅ 𝘾𝙤𝙣𝙚𝙘𝙩𝙖𝙙𝙤' : '❌ 𝘿𝙚𝙨𝙘𝙤𝙣𝙚𝙘𝙩𝙖𝙙𝙤'
      let nombre = bot.user?.name || '𝙎𝙞𝙣 𝙣𝙤𝙢𝙗𝙧𝙚'
      let numero = bot.user?.id?.split(':')[0] || '𝘿𝙚𝙨𝙘𝙤𝙣𝙤𝙘𝙞𝙙𝙤'
      return `✦ 𝘽𝙤𝙩 ${i + 1}\n   ➥ 𝙉𝙤𝙢𝙗𝙧𝙚: ${nombre}\n   ➥ 𝙉𝙪𝙢𝙚𝙧𝙤: ${numero}\n   ➥ 𝙀𝙨𝙩𝙖𝙙𝙤: ${status}`
    }).join('\n\n')
  } else {
    subBotsList = '✦ 𝙉𝙤 𝙝𝙖𝙮 𝙨𝙪𝙗-𝙗𝙤𝙩𝙨 𝙫𝙞𝙣𝙘𝙪𝙡𝙖𝙙𝙤𝙨'
  }

  const texto = `

  🌊 𝘼𝙇𝙔𝘼 𝙎𝙐𝘽

  𝘽𝙊𝙏𝙎 𝙑𝙄𝙉𝘾𝙐𝙇𝘼𝘿𝙊𝙎

  📊 𝙏𝙤𝙩𝙖𝙡: ${totalSubBots} 𝙨𝙪𝙗-𝙗𝙤𝙩(𝙨)

${subBotsList}

  ✦ 𝘾𝙧𝙚𝙖𝙙𝙤 𝙥𝙤𝙧 𝙇𝙮𝙤𝙣𝙣
  𝘼𝙡𝙮𝙖 𝙎𝙪𝙗

`.trim()

  await conn.sendMessage(m.chat, {
    image: { url: imagenURL },
    caption: texto,
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363407253203904@newsletter",
        newsletterName: "𝘼𝙡𝙮𝙖 𝘾𝙝𝙖𝙣𝙚𝙡",
        serverMessageId: 1
      }
    }
  }, { quoted: m })
}

handler.help = ['bots']
handler.tags = ['owner']
handler.command = ['bots', 'subbots']
handler.desc = '𝙑𝙚𝙧 𝙡𝙤𝙨 𝙗𝙤𝙩𝙨 𝙫𝙞𝙣𝙘𝙪𝙡𝙖𝙙𝙤𝙨'
handler.owner = true

export default handler