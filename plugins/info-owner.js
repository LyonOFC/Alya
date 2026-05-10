let handler = async (m, { conn }) => {
  let nomor = '59177474230'
  let nombre = 'Lyonn'
  let rol = 'Creador'
  
  let vcard = `BEGIN:VCARD
VERSION:3.0
FN:${nombre}
ORG:Alya Sub
TITLE:${rol}
TEL;waid=${nomor}:${nomor}
END:VCARD`

  let fotoPerfil = 'https://files.catbox.moe/jg0te7.jpeg'
  try {
    let pp = await conn.profilePictureUrl(nomor + '@s.whatsapp.net', 'image')
    if (pp) fotoPerfil = pp
  } catch (e) {}
  
  let caption = `
ㅤ    ꒰  ㅤ 👑 ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ σωηєя 木 ¢αя∂ ㅤ 性

> ₊· ⫏⫏ ㅤ *🎭 ℓүσηη*
> ₊· ⫏⫏ ㅤ *Rol:* ${rol}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏ ꒱
> ₊· ⫏⫏ ㅤ 🔖 Creado por ${nombre}
  `.trim()
  
  await conn.sendMessage(m.chat, {
    image: { url: fotoPerfil },
    caption: caption,
    contacts: { displayName: nombre, vcard },
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

handler.help = ['owner']
handler.tags = ['info']
handler.command = ['owner', 'creador', 'dueño']
handler.desc = 'ᴍᴜᴇꜱᴛʀᴀ ʟᴀ ɪɴꜰᴏʀᴍᴀᴄɪᴏ́ɴ ᴅᴇʟ ᴄʀᴇᴀᴅᴏʀ'

export default handler