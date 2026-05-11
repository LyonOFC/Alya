import fs from 'fs'
import path from 'path'

const handler = async (m, { conn, args, usedPrefix: _p }) => {
  const imagenURL = 'https://files.catbox.moe/jg0te7.jpeg'

  if (!args[0]) {
    const categorias = {}

    Object.entries(global.plugins)
      .filter(([, p]) => !p.disabled && p.help && p.tags)
      .forEach(([filename, p]) => {
        const tags = Array.isArray(p.tags) ? p.tags : [p.tags]
        const help = Array.isArray(p.help) ? p.help : [p.help]
        const desc = p.desc || 'ѕιη ∂єѕ¢яιρ¢ιση'
        const file = path.basename(filename)
        tags.forEach(tag => {
          if (!categorias[tag]) categorias[tag] = []
          categorias[tag].push({ file, help, desc })
        })
      })

    const lista = Object.entries(categorias).map(([tag, plugins]) => {
      const cmds = plugins.map(p =>
        `   ➥ 📄 *${p.file}*\n       ¢м∂: ${p.help.map(h => `${_p}${h}`).join(', ')}\n       ∂єѕ¢: ${p.desc}`
      ).join('\n\n')
      return `✦ *${tag}* (${plugins.length})\n\n${cmds}`
    }).join('\n\n━━━━━━━━━━━━━━━\n\n')

    const texto = `
ㅤ    ꒰  ㅤ 🕸️ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ gєтρℓυgιη 木 ℓιѕтα ㅤ 性

> ₊· ⫏⫏ ㅤ υѕσ: ${_p}getplugin <ησмвяє.נѕ>

${lista}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ 性 ㅤ ѕιѕтємα єנє¢υтα∂σ ㅤ ✿

ㅤ    ꒰  ㅤ 🕸️ ㅤ *ℓүσηη* ㅤ ⫏⫏  ꒱
> ₊· ⫏⫏ ㅤ ✿ 木 性 ㅤ αℓуα
    `.trim()

    return await conn.sendMessage(m.chat, {
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
  }

  const pluginName = args[0].endsWith('.js') ? args[0] : `${args[0]}.js`

  const posiblesPaths = [
    path.join(process.cwd(), 'plugins', pluginName),
    path.join(process.cwd(), 'plugins', 'owner', pluginName),
    path.join(process.cwd(), 'plugins', 'main', pluginName),
    path.join(process.cwd(), 'plugins', 'group', pluginName),
    path.join(process.cwd(), 'plugins', 'economy', pluginName),
    path.join(process.cwd(), 'plugins', 'serbot', pluginName),
  ]

  let archivoPath = null
  for (const p of posiblesPaths) {
    if (fs.existsSync(p)) {
      archivoPath = p
      break
    }
  }

  if (!archivoPath) {
    return await conn.sendMessage(m.chat, {
      image: { url: imagenURL },
      caption: `
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 ηση ƒσυη∂ ㅤ 性

> ₊· ⫏⫏ ㅤ *ησ ѕє єη¢σηтяσ єℓ αя¢нινσ:*
> ₊· ⫏⫏ ㅤ ${pluginName}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
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
  }

  let codigo = fs.readFileSync(archivoPath, 'utf-8')

  codigo = codigo
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\s*\/\/[^'"]*$/gm, '')
    .replace(/^\s*[\r\n]/gm, '')
    .trim()

  const buffer = Buffer.from(codigo, 'utf-8')

  await conn.sendMessage(m.chat, {
    image: { url: imagenURL },
    caption: `
ㅤ    ꒰  ㅤ 🕸️ ㅤ *αℓуα ѕυв* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ gєтρℓυgιη 木 ¢σ∂ιgσ ㅤ 性

> ₊· ⫏⫏ ㅤ αя¢нινσ: *${pluginName}*
> ₊· ⫏⫏ ㅤ тαмαñσ: *${(buffer.length / 1024).toFixed(2)} кв*
> ₊· ⫏⫏ ㅤ ℓιηєαѕ: *${codigo.split('\n').length}*

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

  await conn.sendMessage(m.chat, {
    document: buffer,
    mimetype: 'application/javascript',
    fileName: pluginName,
    caption: ''
  }, { quoted: m })

  await m.react('🕸️')
}

handler.help = ['getplugin']
handler.tags = ['owner']
handler.command = ['getplugin']
handler.desc = 'ᴏʙᴛᴇɴᴇʀ ᴇʟ ᴄóᴅɪɢᴏ ᴅᴇ ᴜɴ ᴘʟᴜɢɪɴ'
handler.owner = true

export default handler