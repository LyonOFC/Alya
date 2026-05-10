let handler = async (m, { conn }) => {
  if (!m.isGroup) return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 ɢяυρσ ㅤ 性

> ₊· ⫏⫏ ㅤ Sσℓσ єη gяυρσѕ
`.trim())

  await m.react('📊')

  try {
    let groupMetadata = await conn.groupMetadata(m.chat)
    let participants = groupMetadata.participants
    let botNumber = conn.user.jid
    
    let admins = []
    let regulars = []
    let botIsAdmin = false
    
    for (let member of participants) {
      if (member.admin === 'admin' || member.admin === 'superadmin') {
        admins.push(member.id)
        if (member.id === botNumber) botIsAdmin = true
      } else {
        regulars.push(member.id)
      }
    }
    
    let totalMiembros = participants.length
    let totalAdmins = admins.length
    let totalRegulares = regulars.length
    
    let groupIcon = 'https://files.catbox.moe/jg0te7.jpeg'
    try {
      let icon = await conn.profilePictureUrl(m.chat, 'image')
      if (icon) groupIcon = icon
    } catch (e) {}
    
    let descripcion = groupMetadata.desc || 'Sin descripcion'
    let fechaCreacion = groupMetadata.creation ? new Date(groupMetadata.creation * 1000).toLocaleDateString() : 'Desconocida'
    let esRestringido = groupMetadata.announce ? '🔒 Cerrado' : '🔓 Abierto'
    
    let caption = `
ㅤ    ꒰  ㅤ 📊 ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ ιηƒσ 木 gяυρσ ㅤ 性

> ₊· ⫏⫏ ㅤ *Nombre:* ${groupMetadata.subject}
> ₊· ⫏⫏ ㅤ *ID:* ${m.chat}
> ₊· ⫏⫏ ㅤ *Creado:* ${fechaCreacion}
> ₊· ⫏⫏ ㅤ *Miembros:* ${totalMiembros}
> ₊· ⫏⫏ ㅤ *Admins:* ${totalAdmins}
> ₊· ⫏⫏ ㅤ *Modo:* ${esRestringido}
> ₊· ⫏⫏ ㅤ *Bot Admin:* ${botIsAdmin ? '✅ Si' : '❌ No'}

> ₊· ⫏⫏ ㅤ *Descripcion:*
> ₊· ⫏⫏ ㅤ ${descripcion}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏ ꒱
    `.trim()

    await conn.sendMessage(m.chat, {
      image: { url: groupIcon },
      caption: caption,
      mentions: admins,
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
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 ιηƒσ ㅤ 性

> ₊· ⫏⫏ ㅤ *Error:* ${error.message}
    `.trim())
    await m.react('❌')
  }
}

handler.help = ['infogrupo']
handler.tags = ['group']
handler.command = ['infogrupo', 'groupinfo', 'gpinfo']
handler.desc = 'ᴍᴜᴇꜱᴛʀᴀ ʟᴀ ɪɴꜰᴏʀᴍᴀᴄɪᴏ́ɴ ᴅᴇʟ ɢʀᴜᴘᴏ'
handler.group = true

export default handler