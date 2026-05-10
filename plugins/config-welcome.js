let handler = async (m, { conn, isGroup, isAdmin, args }) => {
  if (!isGroup) return conn.sendMessage(m.chat, { text: '❌ 𝙀𝙨𝙩𝙚 𝙘𝙤𝙢𝙖𝙣𝙙𝙤 𝙨𝙤𝙡𝙤 𝙛𝙪𝙣𝙘𝙞𝙤𝙣𝙖 𝙚𝙣 𝙜𝙧𝙪𝙥𝙤𝙨' }, { quoted: m })
  if (!isAdmin) return conn.sendMessage(m.chat, { text: '❌ 𝙎𝙤𝙡𝙤 𝙖𝙙𝙢𝙞𝙣𝙨 𝙥𝙪𝙚𝙙𝙚𝙣 𝙪𝙨𝙖𝙧 𝙚𝙨𝙩𝙚 𝙘𝙤𝙢𝙖𝙣𝙙𝙤' }, { quoted: m })

  if (!global.db.data.welcome) global.db.data.welcome = {}
  if (!global.db.data.welcome[m.chat]) global.db.data.welcome[m.chat] = {}

  const action = args[0]?.toLowerCase()
  const type = args[1]?.toLowerCase()

  if (!action || !type) {
    const welcomeStatus = global.db.data.welcome[m.chat].welcome ? '✅ 𝘼𝙘𝙩𝙞𝙫𝙖𝙙𝙖' : '❌ 𝘿𝙚𝙨𝙖𝙘𝙩𝙞𝙫𝙖𝙙𝙖'
    const goodbyeStatus = global.db.data.welcome[m.chat].goodbye ? '✅ 𝘼𝙘𝙩𝙞𝙫𝙖𝙙𝙖' : '❌ 𝘿𝙚𝙨𝙖𝙘𝙩𝙞𝙫𝙖𝙙𝙖'
    
    return conn.sendMessage(m.chat, { text: `▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
🌊 𝘼𝙇𝙔𝘼 𝙎𝙐𝘽 - 𝘾𝙊𝙉𝙁𝙄𝙂𝙐𝙍𝘼𝘾𝙄𝙊́𝙉
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

📌 𝘽𝙞𝙚𝙣𝙫𝙚𝙣𝙞𝙙𝙖: ${welcomeStatus}
📌 𝘿𝙚𝙨𝙥𝙚𝙙𝙞𝙙𝙖: ${goodbyeStatus}

▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
📖 𝙐𝙨𝙤:
✦ ${usedPrefix}config welcome on
✦ ${usedPrefix}config welcome off
✦ ${usedPrefix}config goodbye on
✦ ${usedPrefix}config goodbye off
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
🌊 𝘼𝙡𝙮𝙖 𝙎𝙪𝙗 - 𝙋𝙤𝙩𝙚𝙣𝙘𝙞𝙖 𝙚𝙣 𝙘𝙖𝙙𝙖 𝙢𝙚𝙣𝙨𝙖𝙟𝙚
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰` }, { quoted: m })
  }

  if (type !== 'on' && type !== 'off') {
    return conn.sendMessage(m.chat, { text: '❌ 𝙐𝙨𝙖: 𝙤𝙣 𝙤 𝙤𝙛𝙛' }, { quoted: m })
  }

  const isEnable = type === 'on'

  if (action === 'welcome') {
    global.db.data.welcome[m.chat].welcome = isEnable
    global.markDatabaseModified()
    await conn.sendMessage(m.chat, { text: isEnable ? '✅ 𝘽𝙞𝙚𝙣𝙫𝙚𝙣𝙞𝙙𝙖 𝙖𝙘𝙩𝙞𝙫𝙖𝙙𝙖' : '❌ 𝘽𝙞𝙚𝙣𝙫𝙚𝙣𝙞𝙙𝙖 𝙙𝙚𝙨𝙖𝙘𝙩𝙞𝙫𝙖𝙙𝙖' }, { quoted: m })
  }
  else if (action === 'goodbye') {
    global.db.data.welcome[m.chat].goodbye = isEnable
    global.markDatabaseModified()
    await conn.sendMessage(m.chat, { text: isEnable ? '✅ 𝘿𝙚𝙨𝙥𝙚𝙙𝙞𝙙𝙖 𝙖𝙘𝙩𝙞𝙫𝙖𝙙𝙖' : '❌ 𝘿𝙚𝙨𝙥𝙚𝙙𝙞𝙙𝙖 𝙙𝙚𝙨𝙖𝙘𝙩𝙞𝙫𝙖𝙙𝙖' }, { quoted: m })
  }
  else {
    return conn.sendMessage(m.chat, { text: '❌ 𝙐𝙨𝙖: 𝙘𝙤𝙣𝙛𝙞𝙜 𝙬𝙚𝙡𝙘𝙤𝙢𝙚 𝙤𝙣/𝙤𝙛𝙛 𝙤 𝙘𝙤𝙣𝙛𝙞𝙜 𝙜𝙤𝙤𝙙𝙗𝙮𝙚 𝙤𝙣/𝙤𝙛𝙛' }, { quoted: m })
  }
}

handler.help = ['config']
handler.tags = ['group']
handler.command = ['config', 'conf', 'setting']
handler.desc = '`activa o desactiva la bienvenida y despedida en el grupo`'
handler.group = true
handler.admin = true

export default handler