let handler = async (m, { conn, isOwner, usedPrefix }) => {
  if (!isOwner) {
    return conn.reply(m.chat, '❌ Solo el dueño del bot puede usar este comando', m)
  }

  const imagenURL = 'https://files.catbox.moe/jg0te7.jpeg'
  
  let subBotsList = ''
  let totalSubBots = 0
  
  if (global.conns && global.conns.length > 0) {
    totalSubBots = global.conns.length
    subBotsList = global.conns.map((bot, i) => {
      let status = bot.user ? '✅ Conectado' : '❌ Desconectado'
      let nombre = bot.user?.name || 'Sin hombre'
      let numero = bot.user?.id?.split(':')[0] || 'Desconocido'
      return `✦ Bot ${i + 1}\n   └─› Nombre: ${nombre}\n   └─› Número: ${numero}\n   └─› Estado: ${status}`
    }).join('\n\n')
  } else {
    subBotsList = '✦ No hay sub-bots vinculados'
  }

  const texto = `▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
🌊 ALYA SUB - BOTS VINCULADOS
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

📊 Total: ${totalSubBots} sub-bot(s)

${subBotsList}

▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
Alya Sub - Potencia en cada mensaje`

  await conn.sendMessage(m.chat, {
    image: { url: imagenURL },
    caption: texto,
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363407253203904@newsletter",
        newsletterName: "Alya Chanel",
        serverMessageId: 1
      }
    }
  }, { quoted: m })
}

handler.help = ['bots']
handler.tags = ['owner']
handler.command = ['bots', 'subbots', 'listbots']
handler.desc = 'Muestra la lista de bots vinculados al bot principal'
handler.owner = true

export default handler