let handler = async (m, { conn, isAdmin, isOwner, isROwner, isBotAdmin }) => {
  if (!m.chat.endsWith('@g.us')) return m.reply(`
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

  await conn.groupSettingUpdate(m.chat, 'not_announcement')

  await conn.sendMessage(m.chat, {
    text: `
ㅤ    ꒰  ㅤ 🔓 ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ gяυρσ 木 αвιєятσ ㅤ 性

> ₊· ⫏⫏ ㅤ єℓ gяυρσ нα ѕι∂σ *αвιєятσ*
> ₊· ⫏⫏ ㅤ тσ∂σѕ ρυє∂єη єѕ¢яιвιя

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ 性 ㅤ ѕιѕтємα єנє¢υтα∂σ ㅤ ✿

ㅤ    ꒰  ㅤ 🕸️ ㅤ *ℓүσηη* ㅤ ⫏⫏  ꒱
> ₊· ⫏⫏ ㅤ ✿ 木 性 ㅤ αℓуα
    `.trim(),
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

  await m.react('🔓')
}

handler.help = ['open']
handler.tags = ['group']
handler.command = ['open', 'abrir']
handler.desc = 'ᴀʙʀɪʀ ᴇʟ ɢʀᴜᴘᴏ ᴘᴀʀᴀ ᴛᴏᴅᴏꜱ'
handler.group = true

export default handler