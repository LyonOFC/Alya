let handler = async (m, { conn, isAdmin, args, usedPrefix }) => {
  const type = args[0]?.toLowerCase()

  if (!type || (type !== 'on' && type !== 'off')) {
    const status = global.db.data.chats[m.chat]?.goodbye ? '✅ Activada' : '❌ Desactivada'
    return conn.reply(m.chat, `📌 *Despedida:* ${status}\n\nUso: ${usedPrefix}goodbye on / off`, m)
  }

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  
  const isEnable = type === 'on'
  global.db.data.chats[m.chat].goodbye = isEnable
  
  conn.reply(m.chat, isEnable ? '✅ *Despedida activada*' : '❌ *Despedida desactivada*', m)
}

handler.help = ['goodbye']
handler.tags = ['group']
handler.command = ['goodbye']
handler.desc = 'Activa o desactiva el mensaje de despedida en el grupo'
handler.group = true
handler.admin = true

export default handler