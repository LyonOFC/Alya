let handler = async (m, { conn, text, usedPrefix }) => {
  let user = global.db.data.users[m.sender]
  
  if (user.registered === true) {
    let fotoPerfil = 'https://files.catbox.moe/jg0te7.jpeg'
    try {
      let pp = await conn.profilePictureUrl(m.sender, 'image')
      if (pp) fotoPerfil = pp
    } catch (e) {}
    
    return await conn.sendMessage(m.chat, {
      image: { url: fotoPerfil },
      caption: `
ㅤ    ꒰  ㅤ ✅ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ яєgιѕтяα∂σ 木 性 ㅤ ✿

> ₊· ⫏⫏ ㅤ *Nombre:* ${user.name}
> ₊· ⫏⫏ ㅤ *Edad:* ${user.age}
      `.trim()
    }, { quoted: m })
  }
  
  let [nombre, edad] = text.split('.')
  
  if (!nombre || !edad) {
    return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 ѕιηтαχιѕ ㅤ ✿

> ₊· ⫏⫏ ㅤ *Uso:* ${usedPrefix}reg Lyonn.14

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏ ꒱
    `.trim())
  }
  
  edad = parseInt(edad)
  
  if (edad < 10 || edad > 99) {
    return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 є∂α∂ ㅤ ✿

> ₊· ⫏⫏ ㅤ Debe ser entre 10 y 99 años

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏ ꒱
    `.trim())
  }
  
  if (nombre.length < 3 || nombre.length > 20) {
    return m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 ησмвяє ㅤ ✿

> ₊· ⫏⫏ ㅤ Debe tener entre 3 y 20 caracteres

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏ ꒱
    `.trim())
  }
  
  user.name = nombre
  user.age = edad
  user.registered = true
  user.regTime = Date.now()
  
  let fotoPerfil = 'https://files.catbox.moe/jg0te7.jpeg'
  try {
    let pp = await conn.profilePictureUrl(m.sender, 'image')
    if (pp) fotoPerfil = pp
  } catch (e) {}
  
  await conn.sendMessage(m.chat, {
    image: { url: fotoPerfil },
    caption: `
ㅤ    ꒰  ㅤ ✅ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ яєgιѕтяσ 木 єχιтσѕσ ㅤ ✿

> ₊· ⫏⫏ ㅤ *Bienvenido:* ${nombre}
> ₊· ⫏⫏ ㅤ *Edad:* ${edad}
> ₊· ⫏⫏ ㅤ Usa ${usedPrefix}menu

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏ ꒱
    `.trim()
  }, { quoted: m })
}

handler.help = ['register']
handler.tags = ['main']
handler.command = ['reg', 'register', 'registrar']
handler.desc = 'ʀᴇɢɪꜱᴛʀᴀʀꜱᴇ ᴇɴ ᴀʟʏᴀ ꜱᴜʙ'

export default handler