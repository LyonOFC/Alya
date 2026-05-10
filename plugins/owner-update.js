import { execSync } from 'child_process'

let handler = async (m, { conn, args, isOwner }) => {
  if (!isOwner) {
    return conn.reply(m.chat, '❌ 𝙎𝙤𝙡𝙤 𝙚𝙡 𝙙𝙪𝙚𝙣̃𝙤 𝙥𝙪𝙚𝙙𝙚 𝙪𝙨𝙖𝙧 𝙚𝙨𝙩𝙤', m)
  }

  const imagenURL = 'https://files.catbox.moe/jg0te7.jpeg'

  try {
    await conn.reply(m.chat, '⏳ 𝘼𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙣𝙙𝙤 𝘼𝙡𝙮𝙖 𝙎𝙪𝙗... 𝙋𝙤𝙧 𝙛𝙖𝙫𝙤𝙧 𝙚𝙨𝙥𝙚𝙧𝙖', m)

    const output = execSync('git pull' + (args.length ? ' ' + args.join(' ') : '')).toString()
    const isUpdated = output.includes('Already up to date')

    let texto = `
  ☄️ 𝘼𝙇𝙔𝘼 𝙎𝙐𝘽

  𝘼𝘾𝙏𝙐𝘼𝙇𝙄𝙕𝘼𝘾𝙄𝙊́𝙉

${isUpdated ? '✅ 𝙔𝙖 𝙚𝙨𝙩𝙖𝙗𝙖 𝙖𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙙𝙖' : '✅ 𝘼𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙘𝙞𝙤́𝙣 𝙖𝙥𝙡𝙞𝙘𝙖𝙙𝙖'}

${isUpdated ? '' : '📦 𝘾𝙖𝙢𝙗𝙞𝙤𝙨:\n' + output.slice(0, 300)}

  ✦ 𝘾𝙧𝙚𝙖𝙙𝙤 𝙥𝙤𝙧 𝙇𝙮𝙤𝙣𝙣
  𝘼𝙡𝙮𝙖 𝙎𝙪𝙗
`.trim()

    await conn.sendMessage(m.chat, {
      image: { url: imagenURL },
      caption: texto,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363407253203904@newsletter",
          newsletterName: "𝘼𝙡𝙮𝙖 𝘾𝙝𝙖𝙣𝙚𝙡",
          serverMessageId: 1
        }
      }
    }, { quoted: m })

  } catch (error) {
    let conflictMsg = '❌ 𝙀𝙧𝙧𝙤𝙧 𝙖𝙡 𝙖𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙧'

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
          conflictMsg = `⚠️ 𝘾𝙤𝙣𝙛𝙡𝙞𝙘𝙩𝙤𝙨 𝙚𝙣:\n\n${conflictedFiles.map(f => `✦ ${f}`).join('\n')}\n\n🔧 𝙍𝙚𝙞𝙣𝙨𝙩𝙖𝙡𝙖 𝙤 𝙧𝙚𝙨𝙪𝙚𝙡𝙫𝙚 𝙢𝙖𝙣𝙪𝙖𝙡𝙢𝙚𝙣𝙩𝙚`
        }
      }
    } catch (statusError) {
      console.error(statusError)
    }

    let textoError = `
  ☄️ 𝘼𝙇𝙔𝘼 𝙎𝙐𝘽

  𝙀𝙍𝙍𝙊𝙍

${conflictMsg}

  ✦ 𝘾𝙧𝙚𝙖𝙙𝙤 𝙥𝙤𝙧 𝙇𝙮𝙤𝙣𝙣
  𝘼𝙡𝙮𝙖 𝙎𝙪𝙗
`.trim()

    await conn.sendMessage(m.chat, {
      image: { url: imagenURL },
      caption: textoError,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363407253203904@newsletter",
          newsletterName: "𝘼𝙡𝙮𝙖 𝘾𝙝𝙖𝙣𝙚𝙡",
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
handler.desc = '𝘼𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙧 𝘼𝙡𝙮𝙖 𝙎𝙪𝙗 𝙙𝙚𝙨𝙙𝙚 𝙂𝙞𝙩𝙃𝙪𝙗'
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