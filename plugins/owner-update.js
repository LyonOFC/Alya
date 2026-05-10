import { execSync } from 'child_process'

let handler = async (m, { conn, args, isOwner }) => {
  if (!isOwner) {
    return conn.reply(m.chat, 'ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱\nㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 性 ㅤ ✿\n\n> ₊· ⫏⫏ ㅤ ѕσℓσ єℓ ∂υєñσ ρυє∂є υѕαя єѕтσ', m)
  }

  const imagenURL = 'https://files.catbox.moe/jg0te7.jpeg'

  try {
    await conn.reply(m.chat, 'ㅤ    ꒰  ㅤ ⏳ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱\nㅤ    ⿻ ㅤ ✿ ㅤ α¢тυαℓιzαη∂σ 木 性 ㅤ ✿\n\n> ₊· ⫏⫏ ㅤ ρσя ƒανσя єѕρєяα...', m)

    const output = execSync('git pull' + (args.length ? ' ' + args.join(' ') : '')).toString()
    const isUpdated = output.includes('Already up to date')

    let texto = `
ㅤ    ꒰  ㅤ 🕸️ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ α¢тυαℓιzα¢ισ́η 木 性 ㅤ ✿

> ₊· ⫏⫏ ㅤ єѕтα∂σ: ${isUpdated ? '✅ уα єѕтαвα α¢тυαℓιzα∂α' : '✅ α¢тυαℓιzα¢ιση αρℓι¢α∂α'}
${isUpdated ? '' : '\n> ₊· ⫏⫏ ㅤ ¢αмвισѕ:\n> ₊· ' + output.slice(0, 300)}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ 性 ㅤ ѕιѕтємα єנє¢υтα∂σ ㅤ ✿

ㅤ    ꒰  ㅤ 🕸️ ㅤ *ℓүσηη* ㅤ ⫏⫏  ꒱
> ₊· ⫏⫏ ㅤ ✿ 木 性 ㅤ αℓуα
`.trim()

    await conn.sendMessage(m.chat, {
      image: { url: imagenURL },
      caption: texto,
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

  } catch (error) {
    let conflictMsg = '❌ єяяσя αℓ α¢тυαℓιzαя'

    try {
      const status = execSync('git status --porcelain').toString().trim()

      if (status) {
        const conflictedFiles = status
          .split('\n')
          .map(line => line.slice(3))
          .filter(file =>
            !file.startsWith('.npm/') &&
            !file.startsWith('Sessions/Principal/') &&
            !file.startsWith('node_modules/') &&
            !file.startsWith('package-lock.json') &&
            !file.startsWith('database.json') &&
            !file.startsWith('.cache/') &&
            !file.startsWith('tmp/')
          )

        if (conflictedFiles.length > 0) {
          conflictMsg = `⚠️ ¢σηƒℓι¢тσѕ єη:\n\n${conflictedFiles.map(f => `> ₊· ${f}`).join('\n')}\n\n> ₊· яєιηѕтαℓα σ яєѕυєℓνє мαηυαℓмєηтє`
        }
      }
    } catch (statusError) {
      console.error(statusError)
    }

    let textoError = `
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 性 ㅤ ✿

> ₊· ⫏⫏ ㅤ ${conflictMsg}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ 性 ㅤ ѕιѕтємα єנє¢υтα∂σ ㅤ ✿

ㅤ    ꒰  ㅤ 🕸️ ㅤ *ℓүσηη* ㅤ ⫏⫏  ꒱
> ₊· ⫏⫏ ㅤ ✿ 木 性 ㅤ αℓуα
`.trim()

    await conn.sendMessage(m.chat, {
      image: { url: imagenURL },
      caption: textoError,
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
}

const keywords = ['update', 'up', 'fix']

handler.help = ['update']
handler.tags = ['owner']
handler.command = ['update', 'up', 'fix']
handler.desc = 'ᴀᴄᴛᴜᴀʟɪᴢᴀʀ ᴀʟʏᴀ sᴜʙ'
handler.owner = true

handler.all = async function (m) {
  if (!m.text || typeof m.text !== 'string') return

  const input = m.text.trim().toLowerCase()

  for (const keyword of keywords) {
    if (input === keyword) {
      return handler(m, { conn: this, args: [], isOwner: true })
    }
  }
}

export default handler