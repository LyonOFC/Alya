import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import util from 'util'
import {
  generateWAMessageFromContent,
  proto
} from '@whiskeysockets/baileys'

const execPromise = util.promisify(exec)

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`
ㅤ    ꒰  ㅤ 📹 ㅤ *αℓуα - νι∂єσ* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ υѕσ 木 cσrrєctσ ㅤ 性

> ₊· ⫏⫏ ㅤ *Uѕσ:* ${usedPrefix}${command} <cαnción σ νι∂єσ>
> ₊· ⫏⫏ ㅤ *Ejeмρℓσ:* ${usedPrefix}${command} Acento

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
  `.trim())

  await m.react('📹')

  try {
    const searchUrl = `https://dvlyonn.onrender.com/search/youtube?q=${encodeURIComponent(text)}`
    const busqueda = await fetch(searchUrl)
    const searchData = await busqueda.json()

    if (!searchData.status || !searchData.result?.length) {
      throw new Error('No se encontraron resultados')
    }

    const resultados = searchData.result.slice(0, 5)

    const rows = resultados.map((video, i) => ({
      header: `📹 ${video.channel || 'Desconocido'}`,
      title: video.title.substring(0, 35),
      description: `⏱️ ${video.duration || '?'} | 👁️ ${video.views || '?'}`,
      id: `video_${i}_${Buffer.from(video.url).toString('base64')}_${Buffer.from(video.title).toString('base64')}`
    }))

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: {
        title: 'αℓуα - νι∂єσ',
        subtitle: 'Selecciona un video',
        hasMediaAttachment: false
      },
      body: {
        text: `📹 *${text}*\n\nSe encontraron ${resultados.length} resultados. Selecciona uno:`
      },
      footer: {
        text: '⫏⫏ αℓуα - вσт ✿'
      },
      nativeFlowMessage: {
        buttons: [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '📹 VER RESULTADOS',
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
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 вúsqυє∂α ㅤ 性

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
    if (!id || !id.startsWith('video_')) return false

    await m.react('⏳')

    const tmpDir = path.join(process.cwd(), 'tmp')
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

    const parts = id.split('_')
    const urlBase64 = parts[2]
    const titleBase64 = parts[3]
    const videoUrl = Buffer.from(urlBase64, 'base64').toString()
    const videoTitle = Buffer.from(titleBase64, 'base64').toString()

    await conn.sendMessage(m.chat, { text: `⏳ Descargando video: *${videoTitle.substring(0, 40)}*...` }, { quoted: m })

    const downloadUrl = `https://dvlyonn.onrender.com/download/ytvideo?url=${encodeURIComponent(videoUrl)}`
    const response = await fetch(downloadUrl)
    const json = await response.json()

    if (!json.status || !json.result?.download_url) {
      throw new Error('No se pudo obtener el video')
    }

    const video = json.result

    const videoResponse = await fetch(video.download_url)
    const videoBuffer = await videoResponse.buffer()
    const inputPath = path.join(tmpDir, `input_${Date.now()}.mp4`)
    const outputPath = path.join(tmpDir, `output_${Date.now()}.mp4`)

    fs.writeFileSync(inputPath, videoBuffer)

    await execPromise(`ffmpeg -i "${inputPath}" -c:v libx264 -c:a aac -movflags +faststart "${outputPath}"`)

    const convertedBuffer = fs.readFileSync(outputPath)

    const duracion = video.duration || 0
    const minutos = Math.floor(duracion / 60)
    const segundos = duracion % 60
    const duracionTexto = `${minutos}:${segundos.toString().padStart(2, '0')}`

    const caption = `
ㅤ    ꒰  ㅤ 📹 ㅤ *αℓуα - νι∂єσ* ㅤ ⫏⫏  ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єท αíяє 木 🎬 ㅤ 性

> ₊· ⫏⫏ ㅤ *τíτυℓσ:* ${video.title || videoTitle}
> ₊· ⫏⫏ ㅤ *∂υяα¢ιón:* ${duracionTexto}
> ₊· ⫏⫏ ㅤ *¢αℓι∂α∂:* ${video.quality || '360p'}

ㅤ    ꒰  ㅤ ✿ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
    `.trim()

    if (video.thumbnail) {
      await conn.sendMessage(m.chat, {
        image: { url: video.thumbnail },
        caption: caption
      }, { quoted: m })
    } else {
      await m.reply(caption)
    }

    await conn.sendMessage(m.chat, {
      video: convertedBuffer,
      mimetype: 'video/mp4',
      fileName: `${video.title || videoTitle}.mp4`
    }, { quoted: m })

    fs.unlinkSync(inputPath)
    fs.unlinkSync(outputPath)

    await m.react('✅')
    return true

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { text: `❌ Error: ${e.message}` }, { quoted: m })
    await m.react('❌')
    return true
  }
}

handler.help = ['video']
handler.tags = ['downloader']
handler.command = ['video', 'ytvideo', 'descargarvideo']

export default handler