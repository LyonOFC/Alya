let handler = async (m, { conn, isAdmin, args, usedPrefix }) => {
  if (!m.isGroup) {
    return conn.sendMessage(m.chat, { text: '❌ Este comando solo funciona en grupos' }, { quoted: m })
  }
  
  if (!isAdmin) {
    return conn.sendMessage(m.chat, { text: '❌ Solo administradores pueden usar este comando' }, { quoted: m })
  }

  if (!global.db.data.welcome) global.db.data.welcome = {}
  if (!global.db.data.welcome[m.chat]) global.db.data.welcome[m.chat] = {}

  const type = args[0]?.toLowerCase()

  if (!type || (type !== 'on' && type !== 'off')) {
    const status = global.db.data.welcome[m.chat].welcome ? '✅ Activada' : '❌ Desactivada'
    return conn.sendMessage(m.chat, { text: `📌 Bienvenida: ${status}\n\nUso: ${usedPrefix}welcome on / off` }, { quoted: m })
  }

  const isEnable = type === 'on'
  global.db.data.welcome[m.chat].welcome = isEnable
  global.markDatabaseModified()
  
  await conn.sendMessage(m.chat, { text: isEnable ? '✅ Bienvenida activada' : '❌ Bienvenida desactivada' }, { quoted: m })
}

handler.help = ['welcome']
handler.tags = ['group']
handler.command = ['welcome']
handler.desc = 'Activa o desactiva el mensaje de bienvenida en el grupo'
handler.group = true
handler.admin = true

export default handler