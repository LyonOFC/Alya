import fetch from 'node-fetch'
import {
  generateWAMessageFromContent,
  proto
} from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`
ㅤ    ꒰  ㅤ 📌 ㅤ *αℓуα - ριηтєяєѕт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ υѕσ 木 cσrrєctσ ㅤ 性

> ₊· ⫏⫏ ㅤ *Uѕσ:* ${usedPrefix}${command} <вúsqυє∂α>
> ₊· ⫏⫏ ㅤ *Ejeмρℓσ:* ${usedPrefix}${command} paisajes

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
  `.trim())

  await m.react('📌')

  try {
    const res = await fetch(`https://dvlyonn.onrender.com/pinterest?query=${encodeURIComponent(text)}&limit=10`)
    const data = await res.json()

    if (!data.status || !data.result?.length) {
      throw new Error('No se encontraron resultados')
    }

    const resultados = data.result.slice(0, 10)

    const rows = resultados.map((item, i) => ({
      header: `📌 ${i + 1}`,
      title: item.title?.substring(0, 35) || 'Sin título',
      description: `👤 ${item.author || 'Desconocido'}`,
      id: `pinterest_${i}_${Buffer.from(item.image).toString('base64')}_${Buffer.from(item.title || 'imagen').toString('base64')}`
    }))

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: {
        title: 'αℓуα - ριηтєяєѕт',
        subtitle: 'Selecciona una imagen',
        hasMediaAttachment: false
      },
      body: {
        text: `📌 *${text}*\n\nSe encontraron ${resultados.length} resultados. Selecciona una:`
      },
      footer: {
        text: '⫏⫏ αℓуα - вσт ✿'
      },
      nativeFlowMessage: {
        buttons: [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '📌 VER RESULTADOS',
            sections: [{
              title: '📋 SELECCIONA UNA IMAGEN',
              rows: rows
            }]
          })
        }]
      }
    })

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {},
          interactiveMessage
        }
      }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (error) {
    console.error(error)
    await m.reply(`
ㅤ    ꒰  ㅤ ❌ ㅤ *αℓуα - вσт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 ριηтєяєѕт ㅤ 性

> ₊· ⫏⫏ ㅤ *єяяσя:* ${error.message}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
    `.trim())
    await m.react('❌')
  }
}

handler.before = async (m, { conn }) => {
  const nativeFlow = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (!nativeFlow) return false

  try {
    const datos = JSON.parse(nativeFlow.paramsJson || '{}')
    const id = datos.id || datos.selectedId || datos.selectedRowId || null
    if (!id || !id.startsWith('pinterest_')) return false

    await m.react('⏳')

    const parts = id.split('_')
    const index = parseInt(parts[1])
    const urlBase64 = parts[2]
    const titleBase64 = parts[3]
    const imageUrl = Buffer.from(urlBase64, 'base64').toString()
    const imageTitle = Buffer.from(titleBase64, 'base64').toString()

    const caption = `
ㅤ    ꒰  ㅤ 📌 ㅤ *αℓуα - ριηтєяєѕт* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ ∂єѕ¢αяgα 木 ¢σмρℓєтα ㅤ 性

> ₊· ⫏⫏ ㅤ *τíτυℓσ:* ${imageTitle.substring(0, 60)}${imageTitle.length > 60 ? '...' : ''}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
    `.trim()

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: caption
    }, { quoted: m })

    await m.react('✅')
    return true

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { text: `❌ Error: ${e.message}` }, { quoted: m })
    await m.react('❌')
    return true
  }
}

handler.help = ['pinterest']
handler.tags = ['downloader']
handler.command = ['pinterest', 'pin']

export default handler