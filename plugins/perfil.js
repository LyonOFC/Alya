let handler = async (m, { conn, usedPrefix }) => {
  let user = global.db.data.users[m.sender]
  
  if (!user.registered) {
    let fotoPerfil = 'https://files.catbox.moe/jg0te7.jpeg'
    try {
      let pp = await conn.profilePictureUrl(m.sender, 'image')
      if (pp) fotoPerfil = pp
    } catch (e) {}
    
    return await conn.sendMessage(m.chat, {
      image: { url: fotoPerfil },
      caption: `
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ яєgιѕтяσ 木 ηє¢єѕαяισ ㅤ ✿

> ₊· ⫏⫏ ㅤ *Debes registrarte primero*
> ₊· ⫏⫏ ㅤ Usa: ${usedPrefix}reg Lyonn.14

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏ ꒱
      `.trim()
    }, { quoted: m })
  }
  
  let fotoPerfil = 'https://files.catbox.moe/jg0te7.jpeg'
  try {
    let pp = await conn.profilePictureUrl(m.sender, 'image')
    if (pp) fotoPerfil = pp
  } catch (e) {}
  
  let rol = user.role || 'Nuv'
  let premium = user.premium ? '✅ Si' : '❌ No'
  let ban = user.banned ? '✅ Si' : '❌ No'
  
  let caption = `
ㅤ    ꒰  ㅤ 👤 ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ ρєяƒιℓ 木 υѕυαяισ ㅤ 性

> ₊· ⫏⫏ ㅤ *Nombre:* ${user.name}
> ₊· ⫏⫏ ㅤ *Edad:* ${user.age}
> ₊· ⫏⫏ ㅤ *Rol:* ${rol}
> ₊· ⫏⫏ ㅤ *Nivel:* ${user.level || 0}
> ₊· ⫏⫏ ㅤ *Exp:* ${user.exp || 0}
> ₊· ⫏⫏ ㅤ *Premium:* ${premium}
> ₊· ⫏⫏ ㅤ *Baneado:* ${ban}
> ₊· ⫏⫏ ㅤ *Registrado:* ${new Date(user.regTime).toLocaleDateString()}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏ ꒱
  `.trim()
  
  await conn.sendMessage(m.chat, {
    image: { url: fotoPerfil },
    caption: caption,
    mentions: [m.sender],
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

handler.help = ['perfil']
handler.tags = ['main']
handler.command = ['perfil', 'profile', 'pf']
handler.desc = 'ᴠᴇʀ ᴛᴜ ᴘᴇʀꜰɪʟ ᴅᴇ ᴜꜱᴜᴀʀɪᴏ'

export default handler