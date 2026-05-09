import fs from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'

const defaultMenu = {
  before: `
╭━━━━━━━━━━━━━━━╮
┃  ☄️ ALYA SUB ☄️
┃  Versión 1.0.0
┃  Usuario: %name
┃  Nivel: %level
╰━━━━━━━━━━━━━━━╯

%readmore

▸ COMANDOS DISPONIBLES ◂

`,
  header: '\n▸ %category ◂\n',
  body: '   ✦ %cmd\n      → %desc',
  footer: '',
  after: `

▸ INFORMACIÓN ◂
   ✦ Tiempo activo: %muptime
   ✦ Usuarios: %totalreg

╭━━━━━━━━━━━━━━━╮
┃  CREADO POR LYONN
┃  Alya Sub - ☄️
╰━━━━━━━━━━━━━━━╯
`
}

const handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    const { exp, level } = global.db.data.users[m.sender]
    const { min, xp } = xpRange(level, global.multiplier)
    const name = await conn.getName(m.sender)

    const help = Object.values(global.plugins)
      .filter(p => !p.disabled)
      .map(p => ({
        help: Array.isArray(p.help) ? p.help : [p.help],
        tags: Array.isArray(p.tags) ? p.tags : [p.tags],
        prefix: 'customPrefix' in p,
        desc: p.desc || 'Sin descripción'
      }))

    let bannerFinal = 'https://files.catbox.moe/jg0te7.jpeg'

    // Definir solo las categorías que quieres mostrar
    const categoriasMostrar = {
      owner: 'OWNER',
      group: 'GRUPOS'
    }

    const textoMenu = [
      defaultMenu.before,
      ...Object.keys(categoriasMostrar).map(tag => {
        const cmds = help
          .filter(menu => menu.tags?.includes(tag))
          .map(menu => menu.help.map(h => 
            defaultMenu.body
              .replace(/%cmd/g, menu.prefix ? h : `${_p}${h}`)
              .replace(/%desc/g, menu.desc)
          ).join('\n')).join('\n')
        return cmds ? [
          defaultMenu.header.replace(/%category/g, categoriasMostrar[tag]),
          cmds,
          defaultMenu.footer
        ].join('\n') : ''
      }).filter(Boolean),
      defaultMenu.after
    ].join('\n')

    const replace = {
      name: name,
      level: level,
      exp: exp - min,
      maxexp: xp,
      totalreg: Object.keys(global.db.data.users).length,
      muptime: clockString(process.uptime() * 1000),
      readmore: readMore,
    }

    const texto = textoMenu.replace(new RegExp(`%(${Object.keys(replace).join('|')})`, 'g'), (_, name) => String(replace[name]))

    await conn.sendMessage(m.chat, {
      image: { url: bannerFinal },
      caption: texto.trim(),
      mentions: [m.sender],
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363407253203904@newsletter",
          newsletterName: "Alya Chanel",
          serverMessageId: 1
        }
      }
    }, { quoted: m })

    await m.react('📡')

  } catch (e) {
    console.error('Error en el menú:', e)
    await m.reply(`❌ Error: ${e.message}`)
  }
}

handler.help = ['menu', 'menú', 'help', 'ayuda']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help', 'ayuda']
handler.register = false

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
  }
