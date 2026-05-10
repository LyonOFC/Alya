let handler = async (m, { conn, isAdmin, args, usedPrefix }) => {
  let isGroup = m.chat.endsWith('@g.us')
  
  if (!isGroup) {
    return conn.sendMessage(m.chat, { text: '❌ Este comando solo funciona en grupos' }, { quoted: m })
  }
  
  let groupAdmins = await conn.groupMetadata(m.chat).then(res => res.participants.filter(v => v.admin).map(v => v.id))
  let isAdmin = groupAdmins.includes(m.sender)
  
  if (!isAdmin) {
    return conn.sendMessage(m.chat, { text: '❌ Solo administradores pueden usar este comando' }, { quoted: m })
  }

  if (!global.db.data.welcome) global.db.data.welcome = {}
  if (!global.db.data.welcome[m.chat]) global.db.data.welcome[m.chat] = {}

  const action = args[0]?.toLowerCase()
  const type = args[1]?.toLowerCase()

  if (!action || !type) {
    const welcomeStatus = global.db.data.welcome[m.chat].welcome ? '✅ Activada' : '❌ Desactivada'
    const goodbyeStatus = global.db.data.welcome[m.chat].goodbye ? '✅ Activada' : '❌ Desactivada'
    
    return conn.sendMessage(m.chat, { text: `▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
☄️ ALYA SUB - CONFIGURACION
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

Bienvenida: ${welcomeStatus}
Despedida: ${goodbyeStatus}

▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
Uso:
${usedPrefix}config welcome on
${usedPrefix}config welcome off
${usedPrefix}config goodbye on
${usedPrefix}config goodbye off
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
Alya Sub - La mejor botsita` }, { quoted: m })
  }

  if (type !== 'on' && type !== 'off') {
    return conn.sendMessage(m.chat, { text: '❌ Usa: on o off' }, { quoted: m })
  }

  const isEnable = type === 'on'

  if (action === 'welcome') {
    global.db.data.welcome[m.chat].welcome = isEnable
    global.markDatabaseModified()
    await conn.sendMessage(m.chat, { text: isEnable ? '✅ Bienvenida activada' : '❌ Bienvenida desactivada' }, { quoted: m })
  }
  else if (action === 'goodbye') {
    global.db.data.welcome[m.chat].goodbye = isEnable
    global.markDatabaseModified()
    await conn.sendMessage(m.chat, { text: isEnable ? '✅ Despedida activada' : '❌ Despedida desactivada' }, { quoted: m })
  }
  else {
    return conn.sendMessage(m.chat, { text: '❌ Usa: config welcome on/off o config goodbye on/off' }, { quoted: m })
  }
}

handler.help = ['config']
handler.tags = ['group']
handler.command = ['config', 'conf', 'setting']
handler.desc = 'Activa o desactiva la bienvenida y despedida en el grupo'

export default handler