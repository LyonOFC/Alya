import os from 'os'

const handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    const start = Date.now()

    await conn.sendMessage(m.chat, {
      react: { text: '⏳', key: m.key }
    })

    const latency = Date.now() - start
    const uptime = clockString(process.uptime() * 1000)
    const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
    const ramTotal = (os.totalmem() / 1024 / 1024).toFixed(2)
    const ramPct = ((process.memoryUsage().heapUsed / os.totalmem()) * 100).toFixed(1)

    const texto = `
ㅤ    ꒰  ㅤ 🏓 ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ ριηg 木 ѕтαтυѕ ㅤ 性

> ₊· 🏓 ριηg: *${latency} мѕ*
> ₊· ⏱️ υρтιмє: *${uptime}*
> ₊· 🧠 яαм: *${ramUsed} мв / ${ramTotal} мв* (${ramPct}%)
> ₊· 💻 ρℓαтƒσям: *${os.platform()} ${os.arch()}*
> ₊· ⚙️ ησ∂є: *${process.version}*

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
> ₊· ⫏⫏ ㅤ ✿ 木 性 ㅤ αℓуα
    `.trim()

    await conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/jg0te7.jpeg' },
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

    await conn.sendMessage(m.chat, {
      react: { text: '🏓', key: m.key }
    })

  } catch (e) {
    console.error('Error en ping:', e)
    await m.reply(`❌ Error: ${e.message}`)
  }
}

handler.help = ['ping']
handler.tags = ['main']
handler.command = ['ping', 'speed', 'velocidad']
handler.register = false

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}