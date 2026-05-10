let handler = async (m, { conn, usedPrefix }) => {
  let user = global.db.data.users[m.sender]
  
  if (!user.registered) {
    return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 ѕιη яєgιѕтяσ ㅤ ✿

> ₊· ⫏⫏ ㅤ No estás registrado
> ₊· ⫏⫏ ㅤ Usa ${usedPrefix}reg

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏ ꒱
    `.trim())
  }
  
  let nombre = user.name
  let edad = user.age
  
  let fotoPerfil = 'https://files.catbox.moe/jg0te7.jpeg'
  try {
    let pp = await conn.profilePictureUrl(m.sender, 'image')
    if (pp) fotoPerfil = pp
  } catch (e) {}
  
  user.name = ''
  user.age = -1
  user.registered = false
  user.regTime = -1
  
  await conn.sendMessage(m.chat, {
    image: { url: fotoPerfil },
    caption: `
ㅤ    ꒰  ㅤ ✅ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ συт 木 ѕιѕтємα ㅤ ✿

> ₊· ⫏⫏ ㅤ *Usuario:* ${nombre}
> ₊· ⫏⫏ ㅤ *Edad:* ${edad}
> ₊· ⫏⫏ ㅤ Registro eliminado

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏ ꒱
    `.trim()
  }, { quoted: m })
}

handler.help = ['unregister']
handler.tags = ['main']
handler.command = ['unreg', 'unregister', 'desregistrar']
handler.desc = 'ᴇʟɪᴍɪɴᴀʀ ᴇʟ ʀᴇɢɪꜱᴛʀᴏ'

export default handler