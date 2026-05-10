let handler = async (m, { conn }) => {
  let isGroup = m.chat.endsWith('@g.us')

  if (!isGroup) return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα - ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 ɢяυρσ ㅤ 性

> ₊· ⫏⫏ ㅤ Sσℓσ єη gяυρσѕ

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - ѕυв* ㅤ ⫏⫏ ꒱
  `.trim())

  await m.react('📊')

  try {
    let groupMetadata = await conn.groupMetadata(m.chat)
    let participants = groupMetadata.participants
    let botNumber = conn.user.jid
    
    let userStats = []
    
    for (let member of participants) {
      let userId = member.id
      if (userId === botNumber) continue
      
      if (!global.db.data.users[userId]) {
        global.db.data.users[userId] = {}
        global.db.data.users[userId].messageCount = 0
      }
      
      let userData = global.db.data.users[userId]
      let messageCount = userData.messageCount || 0
      
      if (userId.includes('@s.whatsapp.net')) {
        userStats.push({
          id: userId,
          name: member.name || userId.split('@')[0],
          count: messageCount
        })
      }
    }
    
    userStats.sort((a, b) => a.count - b.count)
    let topInactivos = userStats.slice(0, 5)
    
    let mensajes = ''
    let razones = ['modo fantasma', 'solo para leer', 'modo ahorro de bateria', 'desconectado de la realidad', 'se fue a vivir al campo']
    
    if (topInactivos.length === 0) {
      mensajes = '> No hay miembros en el grupo'
    } else {
      for (let i = 0; i < topInactivos.length; i++) {
        let user = topInactivos[i]
        let motivo = ''
        if (user.count === 0) motivo = razones[0]
        else if (user.count < 3) motivo = razones[1]
        else if (user.count < 8) motivo = razones[2]
        else motivo = razones[3]
        
        mensajes += `> ${i + 1}. @${user.id.split('@')[0]} → ${user.count} msj (${motivo})\n`
      }
    }
    
    let caption = `
ㅤ    ꒰  ㅤ 📊 ㅤ *αℓуα - ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ тσρ 木 ιηα¢тινσѕ ㅤ 性

> ₊· ⫏⫏ ㅤ *Top 5 inactivos:*

${mensajes}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - ѕυв* ㅤ ⫏⫏ ꒱
    `.trim()

    let mentions = topInactivos.map(v => v.id)

    await conn.sendMessage(m.chat, {
      text: caption,
      mentions: mentions,
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
    
    await m.react('✅')
    
  } catch (error) {
    console.error(error)
    await m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα - ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 тσρ ㅤ 性

> ₊· ⫏⫏ ㅤ *Error:* ${error.message}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - ѕυв* ㅤ ⫏⫏ ꒱
    `.trim())
    await m.react('❌')
  }
}

handler.help = ['topinactivos']
handler.tags = ['group']
handler.command = ['topinactivos', 'inactivos', 'topinactive']
handler.desc = 'ᴍᴜᴇꜱᴛʀᴀ ʟᴏꜱ ᴍɪᴇᴍʙʀᴏꜱ ᴍᴀ́ꜱ ɪɴᴀᴄᴛɪᴠᴏꜱ ᴅᴇʟ ɢʀᴜᴘᴏ'
handler.group = true

export default handler