let handler = async (m, { conn, isAdmin, isGroup, mentionJid, args, isOwner, isBotAdmin }) => {
  if (!isGroup) return conn.reply(m.chat, 'ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱\nㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 性 ㅤ ✿\n\n> ₊· ⫏⫏ ㅤ єѕтє ¢σмαη∂σ ѕσℓσ ƒυη¢ισηα єη gяυρσѕ', m)
  if (!isAdmin) return conn.reply(m.chat, 'ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱\nㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 性 ㅤ ✿\n\n> ₊· ⫏⫏ ㅤ ѕσℓσ α∂мιηιѕтяα∂σяєѕ ρυє∂єη υѕαя єѕтσ', m)
  if (!isBotAdmin) return conn.reply(m.chat, 'ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱\nㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 性 ㅤ ✿\n\n> ₊· ⫏⫏ ㅤ ℓα вσт ∂євє ѕєя α∂мιη', m)

  let user = mentionJid && mentionJid[0] ? mentionJid[0] : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false
  if (!user) return conn.reply(m.chat, 'ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱\nㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 性 ㅤ ✿\n\n> ₊· ⫏⫏ ㅤ мєη¢ισηα αℓ υѕυαяισ', m)

  if (isOwner && user === conn.user.jid) {
    return conn.reply(m.chat, 'ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱\nㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 性 ㅤ ✿\n\n> ₊· ⫏⫏ ㅤ ησ ρυє∂єѕ єχρυℓѕαя αℓ ∂υєñσ ∂є ℓα вσт', m)
  }

  let groupMetadata = await conn.groupMetadata(m.chat)
  let isUserAdmin = groupMetadata.participants.find(v => v.id === user)?.admin === 'admin' || groupMetadata.participants.find(v => v.id === user)?.admin === 'superadmin'
  if (isUserAdmin) return conn.reply(m.chat, 'ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱\nㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 性 ㅤ ✿\n\n> ₊· ⫏⫏ ㅤ ησ ρυє∂єѕ єχρυℓѕαя α υη α∂мιηιѕтяα∂σя', m)

  let userName = await conn.getName(user)

  await conn.reply(m.chat, `ㅤ    ꒰  ㅤ ⏳ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱\nㅤ    ⿻ ㅤ ✿ ㅤ єχρυℓѕαη∂σ 木 性 ㅤ ✿\n\n> ₊· ⫏⫏ ㅤ ${userName}`, m)
  await conn.groupParticipantsUpdate(m.chat, [user], 'remove')

  let texto = `
ㅤ    ꒰  ㅤ 🕸️ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єχρυℓѕα∂σ 木 性 ㅤ ✿

> ₊· ⫏⫏ ㅤ υѕυαяι@: ${userName}
> ₊· ⫏⫏ ㅤ α¢¢ιση: єχρυℓѕα∂@

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ 性 ㅤ ѕιѕтємα єנє¢υтα∂σ ㅤ ✿
`.trim()

  await conn.sendMessage(m.chat, { text: texto, mentions: [user], contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363407253203904@newsletter",
      newsletterName: "αℓуα - ¢нαηηєℓ",
      serverMessageId: 1
    }
  } }, { quoted: m })
}

handler.help = ['kick']
handler.tags = ['group']
handler.command = ['kick', 'expulsar']
handler.desc = 'ᴇxᴘᴜʟꜱᴀʀ ᴀ ᴜɴ ᴜꜱᴜᴀʀɪᴏ'
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler