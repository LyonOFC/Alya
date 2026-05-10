let handler = async (m, { conn, isAdmin, isOwner, text }) => {
  let isGroup = m.chat.endsWith('@g.us')

  if (!isGroup) return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 ɢяυρσ ㅤ 性

> ₊· ⫏⫏ ㅤ Sσℓσ єη gяυρσѕ
`.trim())

  if (!isAdmin && !isOwner) return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ α∂мιη 木 яєqυєяι∂σ ㅤ 性

> ₊· ⫏⫏ ㅤ Nєcєѕιтαѕ ѕєя α∂мιη
`.trim())

  let grupo = await conn.groupMetadata(m.chat)
  let participantes = grupo.participants
  let mensaje = text || '📢 Atencion'

  let listaMenciones = []
  let numeros = ''

  for (let i = 0; i < participantes.length; i++) {
    let user = participantes[i].id
    if (user === conn.user.jid) continue
    listaMenciones.push(user)
    numeros += `> ${i + 1}. @${user.split('@')[0]}\n`
  }

  let caption = `
ㅤ    ꒰  ㅤ 📢 ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ тαgαℓℓ 木 мєη¢ιση ㅤ 性

> ₊· ⫏⫏ ㅤ *Mensaje:* ${mensaje}
> ₊· ⫏⫏ ㅤ *Miembros:* ${participantes.length}

${numeros}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏ ꒱
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
}

handler.help = ['tagall']
handler.tags = ['group']
handler.command = ['tagall', 'todos', 'mencionar']
handler.desc = 'ᴍᴇɴᴄɪᴏɴᴀ ᴀ ᴛᴏᴅᴏꜱ ʟᴏꜱ ᴍɪᴇᴍʙʀᴏꜱ ᴅᴇʟ ɢʀᴜᴘᴏ'
handler.group = true
handler.admin = true

export default handler