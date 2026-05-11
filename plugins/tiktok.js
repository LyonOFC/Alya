import fetch from 'node-fetch'
import {
  generateWAMessageFromContent,
  proto
} from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`
ㅤ    ꒰  ㅤ 🎵 ㅤ *αℓуα - тιктσк* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ υѕσ 木 cσrrєctσ ㅤ 性

> ₊· ⫏⫏ ㅤ *Uѕσ 1 (вúsqυє∂α):* ${usedPrefix}${command} <тєхтσ>
> ₊· ⫏⫏ ㅤ *📌 Ejemplo:* ${usedPrefix}${command} Goku Black

> ₊· ⫏⫏ ㅤ *Uѕσ 2 (ℓιηк ∂ιяєcтσ):* ${usedPrefix}${command} <υяℓ>
> ₊· ⫏⫏ ㅤ *📌 Ejemplo:* ${usedPrefix}${command} https://www.tiktok.com/@usuario/video/123456789

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
  `.trim())

  await m.react('🎵')

  try {
    let resultados = []
    let videoUrl = null
    let titulo = ''
    let autor = ''
    let likes = 0
    let comentarios = 0
    let vistas = 0

    if (text.includes('tiktok.com')) {
      const downloadApiUrl = `https://dvlyonn.onrender.com/download/tiktok?url=${encodeURIComponent(text)}`
      const res = await fetch(downloadApiUrl)
      const data = await res.json()

      if (!data.status || !data.result?.video) throw new Error('No se pudo obtener el video')

      videoUrl = data.result.video
      titulo = data.result.title || 'Sin título'
      autor = data.result.author?.nickname || data.result.author?.name || 'Usuario'
      likes = data.result.likes || 0
      comentarios = data.result.comments || 0
      vistas = data.result.views || 0

      const caption = `
ㅤ    ꒰  ㅤ 🎵 ㅤ *αℓуα - тιктσк* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єη αíяє 木 🎶 ㅤ 性

> ₊· ⫏⫏ ㅤ *τíτυℓσ:* ${titulo.substring(0, 60)}${titulo.length > 60 ? '...' : ''}
> ₊· ⫏⫏ ㅤ *¢яєα∂σя:* ${autor}
> ₊· ⫏⫏ ㅤ *❤️ ℓιкєѕ:* ${likes.toLocaleString()}
> ₊· ⫏⫏ ㅤ *💬 ¢σмєηтαяισѕ:* ${comentarios.toLocaleString()}
> ₊· ⫏⫏ ㅤ *👁️ νιѕтαѕ:* ${vistas.toLocaleString()}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
      `.trim()

      await conn.sendMessage(m.chat, {
        video: { url: videoUrl },
        caption: caption,
        mimetype: 'video/mp4',
        contextInfo: {
          mentionedJid: [m.sender],
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363407253203904@newsletter",
            newsletterName: "αℓуα - ¢нαηηєℓ",
            serverMessageId: 1
          }
        }
      }, { quoted: m })

      await m.react('✅')
      return
    }

    const searchApiUrl = `https://dvlyonn.onrender.com/search/tiktok?query=${encodeURIComponent(text)}`
    const res = await fetch(searchApiUrl)
    const data = await res.json()

    if (!data.status || !data.result?.length) throw new Error('No se encontraron resultados')

    resultados = data.result.slice(0, 5)

    const rows = resultados.map((video, i) => ({
      header: `🎬 ${video.author?.nickname || 'Usuario'}`,
      title: video.title?.substring(0, 35) || 'Sin título',
      description: `❤️ ${video.stats?.likes?.toLocaleString() || 0} | 👁️ ${video.stats?.plays?.toLocaleString() || 0}`,
      id: `tiktok_${i}_${Buffer.from(video.url).toString('base64')}`
    }))

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: {
        title: 'αℓуα - тιктσк',
        subtitle: 'Selecciona un video',
        hasMediaAttachment: false
      },
      body: {
        text: `🎵 *${text}*\n\nSe encontraron ${resultados.length} resultados. Selecciona uno:`
      },
      footer: {
        text: '⫏⫏ αℓуα - вσт ✿'
      },
      nativeFlowMessage: {
        buttons: [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '🎵 VER RESULTADOS',
            sections: [{
              title: '📋 SELECCIONA UN VIDEO',
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
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 тιктσк ㅤ 性

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
    if (!id || !id.startsWith('tiktok_')) return false

    await m.react('⏳')

    const parts = id.split('_')
    const index = parseInt(parts[1])
    const urlBase64 = parts.slice(2).join('_')
    const videoUrl = Buffer.from(urlBase64, 'base64').toString()

    await conn.sendMessage(m.chat, { text: `⏳ Descargando video...` }, { quoted: m })

    const downloadApiUrl = `https://dvlyonn.onrender.com/download/tiktok?url=${encodeURIComponent(videoUrl)}`
    const res = await fetch(downloadApiUrl)
    const data = await res.json()

    if (!data.status || !data.result?.video) throw new Error('No se pudo obtener el video')

    const video = data.result
    const titulo = video.title || 'Sin título'
    const autor = video.author?.nickname || video.author?.name || 'Usuario'
    const likes = video.likes || 0
    const comentarios = video.comments || 0
    const vistas = video.views || 0

    const caption = `
ㅤ    ꒰  ㅤ 🎵 ㅤ *αℓуα - тιктσк* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єη αíяє 木 🎶 ㅤ 性

> ₊· ⫏⫏ ㅤ *τíτυℓσ:* ${titulo.substring(0, 60)}${titulo.length > 60 ? '...' : ''}
> ₊· ⫏⫏ ㅤ *¢яєα∂σя:* ${autor}
> ₊· ⫏⫏ ㅤ *❤️ ℓιкєѕ:* ${likes.toLocaleString()}
> ₊· ⫏⫏ ㅤ *💬 ¢σмєηтαяισѕ:* ${comentarios.toLocaleString()}
> ₊· ⫏⫏ ㅤ *👁️ νιѕтαѕ:* ${vistas.toLocaleString()}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
    `.trim()

    await conn.sendMessage(m.chat, {
      video: { url: video.video },
      caption: caption,
      mimetype: 'video/mp4',
      contextInfo: {
        mentionedJid: [m.sender],
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363407253203904@newsletter",
          newsletterName: "αℓуα - ¢нαηηєℓ",
          serverMessageId: 1
        }
      }
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

handler.help = ['tiktok']
handler.tags = ['downloader']
handler.command = ['tiktok', 'tt', 'tk']

export default handler