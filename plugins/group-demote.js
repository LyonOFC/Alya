let handler = async (m, { conn, isAdmin, isOwner, isROwner, isBotAdmin, text }) => {
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

  let user = null

  if (m.quoted) {
    user = m.quoted.sender
  } else if (m.mentionedJid && m.mentionedJid[0]) {
    user = m.mentionedJid[0]
  } else if (text) {
    let numeros = text.match(/\d+/g)
    if (numeros) {
      user = numeros[0] + '@s.whatsapp.net'
    }
  }

  if (!user) return m.reply(`
ㅤ    ꒰  ㅤ 📝 ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ υѕσ 木 cσrrєctσ ㅤ 性

> ₊· ⫏⫏ ㅤ *Usa:* #demote @usuario
> ₊· ⫏⫏ ㅤ *Usa:* Responde al mensaje con #demote
`.trim())

  if (user === conn.user.jid) return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 вσт ㅤ 性

> ₊· ⫏⫏ ㅤ Nσ ρυє∂σ ∂ємσтєαямє α мι мιѕмα
`.trim())

  let grupo = await conn.groupMetadata(m.chat)
  let userIsAdmin = grupo.participants.find(v => v.id === user)?.admin === 'admin' || grupo.participants.find(v => v.id === user)?.admin === 'superadmin'
  
  if (!userIsAdmin) return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 ησ єѕ α∂мιη ㅤ 性

> ₊· ⫏⫏ ㅤ Eℓ υѕυαяισ ησ єѕ α∂мιηιѕтяα∂σя
`.trim())

  let nombre = user.split('@')[0]

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
    await conn.sendMessage(m.chat, {
      text: `
ㅤ    ꒰  ㅤ 👑 ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ ∂ємσтє 木 нє¢нσ ㅤ 性

> ₊· ⫏⫏ ㅤ *Usuario:* ${nombre}
> ₊· ⫏⫏ ㅤ *Accion:* 𝐘𝐀 𝐍𝐎 𝐄𝐒 𝐀𝐃𝐌𝐈𝐍𝐈𝐒𝐓𝐑𝐀𝐃𝐎𝐑

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏ ꒱
      `.trim(),
      mentions: [user],
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
  } catch (e) {
    await m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 ∂ємσтє ㅤ 性

> ₊· ⫏⫏ ㅤ *Error:* ${e.message}
    `.trim())
  }
}

handler.help = ['demote']
handler.tags = ['group']
handler.command = ['demote', 'quitar']
handler.desc = 'ǫᴜɪᴛᴀ ʟᴏꜱ ᴘʀɪᴠɪʟᴇɢɪᴏꜱ ᴀ ᴀᴅᴍɪɴɪꜱᴛʀᴀᴅᴏʀ'
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler