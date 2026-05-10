let handler = async (m, { conn }) => {
  let isGroup = m.chat.endsWith('@g.us')

  if (!isGroup) return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 ɢяυρσ ㅤ 性

> ₊· ⫏⫏ ㅤ Sσℓσ єη gяυρσѕ
`.trim())

  let grupo = await conn.groupMetadata(m.chat)
  let participantes = grupo.participants
  let admins = participantes.filter(v => v.admin === 'admin' || v.admin === 'superadmin').map(v => v.id)
  let ownerGroup = grupo.owner || (admins.length > 0 ? admins[0] : null)
  let fechaCreacion = grupo.creation ? new Date(grupo.creation * 1000).toLocaleDateString() : 'No disponible'
  let descripcion = grupo.desc || 'Sin descripcion'
  let memberCount = participantes.length
  let adminCount = admins.length
  let nombreGrupo = grupo.subject

  let mentions = []
  let ownerMention = ''
  let adminsMention = ''

  if (ownerGroup && ownerGroup !== 'No disponible') {
    mentions.push(ownerGroup)
    ownerMention = `@${ownerGroup.split('@')[0]}`
  } else {
    ownerMention = 'No disponible'
  }

  for (let admin of admins) {
    mentions.push(admin)
    adminsMention += `✦ @${admin.split('@')[0]}\n`
  }

  let texto = `
ㅤ    ꒰  ㅤ 📊 ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ ιηƒσ 木 gяυρσ ㅤ 性

> ₊· ⫏⫏ ㅤ *Nombre:* ${nombreGrupo}
> ₊· ⫏⫏ ㅤ *ID:* ${m.chat}
> ₊· ⫏⫏ ㅤ *Creado:* ${fechaCreacion}
> ₊· ⫏⫏ ㅤ *Dueño:* ${ownerMention}
> ₊· ⫏⫏ ㅤ *Miembros:* ${memberCount}
> ₊· ⫏⫏ ㅤ *Admins:* ${adminCount}

${adminsMention ? '> ₊· ⫏⫏ ㅤ *Lista Admins:*\n' + adminsMention : ''}
> ₊· ⫏⫏ ㅤ *Descripcion:*
> ₊· ⫏⫏ ㅤ ${descripcion}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏ ꒱
  `.trim()

  await conn.sendMessage(m.chat, {
    text: texto,
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

handler.help = ['infogrupo']
handler.tags = ['group']
handler.command = ['infogrupo', 'groupinfo', 'gp']
handler.desc = 'ᴍᴜᴇꜱᴛʀᴀ ʟᴀ ɪɴꜰᴏʀᴍᴀᴄɪᴏ́ɴ ᴅᴇʟ ɢʀᴜᴘᴏ'

export default handler