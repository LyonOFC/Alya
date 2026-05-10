let handler = async (m, { conn, text }) => {
  let isGroup = m.chat.endsWith('@g.us')

  if (!isGroup) return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 ɢяυρσ ㅤ 性

> ₊· ⫏⫏ ㅤ Sσℓσ єη gяυρσѕ
`.trim())

  let usuario = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : false
  let mensajePersonalizado = text ? text.replace(/@\d+/g, '').trim() : false

  if (m.quoted && !usuario && !mensajePersonalizado) {
    let quotedUser = m.quoted.sender
    let quotedText = m.quoted.text || '👀'
    let nombre = await conn.getName(quotedUser)
    
    let caption = `
ㅤ    ꒰  ㅤ 📢 ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ тαg 木 мєη¢ιση ㅤ 性

> ₊· ⫏⫏ ㅤ ${quotedText}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏ ꒱
    `.trim()

    await conn.sendMessage(m.chat, { text: caption, mentions: [quotedUser] }, { quoted: m })
    return
  }

  if (usuario && mensajePersonalizado) {
    let nombre = await conn.getName(usuario)
    let caption = `
ㅤ    ꒰  ㅤ 📢 ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ тαg 木 мєη¢ιση ㅤ 性

> ₊· ⫏⫏ ㅤ ${mensajePersonalizado}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏ ꒱
    `.trim()

    await conn.sendMessage(m.chat, { text: caption, mentions: [usuario] }, { quoted: m })
    return
  }

  if (usuario && !mensajePersonalizado) {
    let nombre = await conn.getName(usuario)
    let caption = `
ㅤ    ꒰  ㅤ 📢 ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ тαg 木 мєη¢ιση ㅤ 性

> ₊· ⫏⫏ ㅤ @${usuario.split('@')[0]}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏ ꒱
    `.trim()

    await conn.sendMessage(m.chat, { text: caption, mentions: [usuario] }, { quoted: m })
    return
  }

  if (!usuario && mensajePersonalizado) {
    let caption = `
ㅤ    ꒰  ㅤ 📢 ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ тαg 木 мєη¢ιση ㅤ 性

> ₊· ⫏⫏ ㅤ ${mensajePersonalizado}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏ ꒱
    `.trim()

    await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
    return
  }

  await m.reply(`
ㅤ    ꒰  ㅤ 📝 ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ υѕσ 木 cσrrєctσ ㅤ 性

> ₊· ⫏⫏ ㅤ *Usa 1:* Responde a un mensaje con #tag
> ₊· ⫏⫏ ㅤ *Usa 2:* #tag @usuario Hola
> ₊· ⫏⫏ ㅤ *Usa 3:* #tag @usuario
> ₊· ⫏⫏ ㅤ *Usa 4:* #tag Hola a todos
`.trim())
}

handler.help = ['tag']
handler.tags = ['group']
handler.command = ['tag', 'mention']
handler.desc = 'ᴍᴇɴᴄɪᴏɴᴀ ᴀ ᴜɴ ᴜsᴜᴀʀɪᴏ ᴏ ʀᴇsᴘᴏɴᴅᴇ ᴀ ᴜɴ ᴍᴇɴsᴀᴊᴇ'

export default handler