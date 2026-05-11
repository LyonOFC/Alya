const handler = async (m, { conn }) => {
  if (!m.isGroup) return m.reply('> ₊· ⫏⫏ ㅤ *єѕтє ¢σмαη∂σ ѕσℓσ ƒυη¢ισηα єη gяυρσѕ*')

  const groupMetadata = await conn.groupMetadata(m.chat)
  const participants = groupMetadata.participants
  const botId = conn.user.jid
  const botAdmin = participants.find(p => p.id === botId)?.admin
  const senderAdmin = participants.find(p => p.id === m.sender)?.admin

  if (!senderAdmin) return m.reply('> ₊· ⫏⫏ ㅤ *ѕσℓσ α∂мιηѕ ρυє∂єη υѕαя єѕтє ¢σмαη∂σ*')
  if (!botAdmin) return m.reply('> ₊· ⫏⫏ ㅤ *єℓ вσт ηє¢єѕιтα ѕєя α∂мιη*')

  await conn.groupSettingUpdate(m.chat, 'not_announcement')

  await m.reply(`
ㅤ    ꒰  ㅤ 🔓 ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ gяυρσ 木 αвιєятσ ㅤ 性

> ₊· ⫏⫏ ㅤ єℓ gяυρσ нα ѕι∂σ *αвιєятσ*
> ₊· ⫏⫏ ㅤ тσ∂σѕ ρυє∂єη єѕ¢яιвιя

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ 性 ㅤ ѕιѕтємα єנє¢υтα∂σ ㅤ ✿

ㅤ    ꒰  ㅤ 🕸️ ㅤ *ℓүσηη* ㅤ ⫏⫏  ꒱
> ₊· ⫏⫏ ㅤ ✿ 木 性 ㅤ αℓуα
  `.trim())

  await m.react('🔓')
}

handler.help = ['open']
handler.tags = ['group']
handler.command = ['open', 'abrir']
handler.desc = 'ᴀʙʀɪʀ ᴇʟ ɢʀᴜᴘᴏ ᴘᴀʀᴀ ᴛᴏᴅᴏꜱ'
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler