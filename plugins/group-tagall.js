let handler = async (m, { conn, text, isAdmin, isOwner, isROwner, isBotAdmin }) => {
  let isGroup = m.chat.endsWith('@g.us')

  if (!isGroup) return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 ɢяυρσ ㅤ 性

> ₊· ⫏⫏ ㅤ Sσℓσ єη gяυρσѕ
`.trim())

  if (!isAdmin && !isOwner && !isROwner) return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ α∂мιη 木 яєqυєяι∂σ ㅤ 性

> ₊· ⫏⫏ ㅤ Nєcєѕιтαѕ ѕєя α∂мιη
`.trim())

  if (!isBotAdmin) return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ вσт 木 ѕιη α∂мιη ㅤ 性

> ₊· ⫏⫏ ㅤ Eℓ вσт ηє¢єѕιтα ѕєя α∂мιη
`.trim())

  let groupMetadata = await conn.groupMetadata(m.chat)
  let participants = groupMetadata.participants
  let memberCount = participants.length
  let mensaje = text ? text : '📢 @everyone'

  let mentions = []
  let tagAllText = `ㅤ    ꒰  ㅤ 📢 ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ тαgαℓℓ 木 мєη¢ιση ㅤ 性

> ₊· ⫏⫏ ㅤ *Mensaje:* ${mensaje}
> ₊· ⫏⫏ ㅤ *Miembros:* ${memberCount}

`

  for (let i = 0; i < participants.length; i++) {
    let user = participants[i].id
    if (user === conn.user.jid) continue
    tagAllText += `✦ ${user.split('@')[0]}\n`
    mentions.push(user)
  }

  tagAllText += `
ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏ ꒱
`

  await conn.sendMessage(m.chat, {
    text: tagAllText,
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
}

handler.help = ['tagall']
handler.tags = ['group']
handler.command = ['tagall', 'todos', 'everyone']
handler.desc = 'ᴍᴇɴᴄɪᴏɴᴀ ᴀ ᴛᴏᴅᴏs ʟᴏs ᴍɪᴇᴍʙʀᴏs ᴅᴇʟ ɢʀᴜᴘᴏ'
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler