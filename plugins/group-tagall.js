let handler = async (m, { conn, isAdmin, isOwner, text }) => {
  if (!m.isGroup) return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 ɢяυρσ ㅤ 性

> ₊· ⫏⫏ ㅤ Sσℓσ єη gяυρσѕ

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
  `.trim())

  if (!isAdmin && !isOwner) return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ α∂мιη 木 яєqυєяι∂σ ㅤ 性

> ₊· ⫏⫏ ㅤ Nєcєѕιтαѕ ѕєя α∂мιη

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
  `.trim())

  let grupo = await conn.groupMetadata(m.chat)
  let participantes = grupo.participants.filter(p => p.id.endsWith('@s.whatsapp.net'))
  let mensaje = text || '📢 *Atención* 📢'

  let listaMenciones = []
  let numeros = ''

  for (let i = 0; i < participantes.length; i++) {
    let user = participantes[i].id
    let numero = user.split('@')[0]
    listaMenciones.push(user)
    numeros += `> ${i + 1}. @${numero}\n`
  }

  let caption = `
ㅤ    ꒰  ㅤ 📢 ㅤ *αℓуα - TΛGΛLL* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ мєη¢ισи 木 gяυρσ ㅤ 性

> ₊· ⫏⫏ ㅤ *📝 Mensaje:* ${mensaje}
> ₊· ⫏⫏ ㅤ *👥 Miembros:* ${participantes.length}

${numeros}
ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
  `.trim()

  await conn.sendMessage(m.chat, {
    text: caption,
    mentions: listaMenciones,
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

  await m.react('📢')
}

handler.help = ['tagall']
handler.tags = ['group']
handler.command = ['tagall', 'todos', 'mencionar']
handler.desc = 'ᴍᴇɴᴄɪᴏɴᴀ ᴀ ᴛᴏᴅᴏꜱ ʟᴏꜱ ᴍɪᴇᴍʙʀᴏꜱ ᴅᴇʟ ɢʀᴜᴘᴏ'
handler.group = true
handler.admin = true

export default handler