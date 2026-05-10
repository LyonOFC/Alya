let handler = async (m, { conn, isAdmin, args, usedPrefix }) => {
  const type = args[0]?.toLowerCase()

  if (!type || (type !== 'on' && type !== 'off')) {
    const status = global.db.data.chats[m.chat]?.welcome ? '✅ Activada' : '❌ Desactivada'
    return conn.reply(m.chat, `📌 *Bienvenida:* ${status}\n\nUso: ${usedPrefix}welcome on / off`, m)
  }

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  
  const isEnable = type === 'on'
  global.db.data.chats[m.chat].welcome = isEnable
  
  conn.reply(m.chat, isEnable ? '✅ *Bienvenida activada*' : '❌ *Bienvenida desactivada*', m)
}

handler.help = ['welcome']
handler.tags = ['group']
handler.command = ['welcome']
handler.desc = 'Activa o desactiva el mensaje de bienvenida en el grupo'
handler.group = true
handler.admin = true

export default handler