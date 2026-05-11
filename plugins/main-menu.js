import fs from 'fs'
import path, { join } from 'path'
import fetch from 'node-fetch'
import util from 'util'
import { exec } from 'child_process'
import { xpRange } from '../lib/levelling.js'

const execPromise = util.promisify(exec)

const tags = {
  main: 'ρяιη¢ιραℓ',
  group: 'ɢяυρσѕ',
  economy: 'є¢σησму',
  game: 'gαмє',
  serbot: 'ѕєявσт',
  owner: 'σωηєя'
}

const defaultMenu = {
  before: `
ㅤ    ꒰ 🕸️ *αℓуα - вσт* ⫏⫏ ꒱
ㅤ    ⿻ ✿ ιηƒσ 木 αтт 性

> ₊· нσℓα *%name*
> ₊· ηινєℓ: %level
> ₊· єχρ: %exp / %maxexp
> ₊· υѕυαяισѕ: %totalreg

%readmore
`,
  header: '\nㅤ    ꒰ ✿ *%category* ⫏⫏ ꒱\n',
  body: '> ⫏⫏ %cmd',
  footer: '',
  after: `

ㅤ    ꒰ ✿ *αℓуα - вσт* ⫏⫏ ꒱
ㅤ    ⿻ 性 ѕιѕтємα єנє¢υтα∂σ ✿
`
}

async function descargarYConvertirAudio(url, outputPath) {
  const tmpDir = path.join(process.cwd(), 'tmp')

  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true })
  }

  const tempPath = path.join(tmpDir, `temp_${Date.now()}.mp3`)

  const res = await fetch(url)
  const buffer = await res.buffer()

  fs.writeFileSync(tempPath, buffer)

  await execPromise(
    `ffmpeg -y -i "${tempPath}" -c:a libopus -b:a 24k -vbr on -compression_level 10 -f ogg "${outputPath}"`
  )

  fs.unlinkSync(tempPath)

  return outputPath
}

const handler = async (m, { conn, usedPrefix: _p }) => {

  try {

    let user = global.db.data.users[m.sender]

    if (!user.registered) {

      let fotoPerfil = 'https://cdn.dev-ander.xyz/file/xwrz29.jpg'

      try {
        let pp = await conn.profilePictureUrl(m.sender, 'image')
        if (pp) fotoPerfil = pp
      } catch {}

      return await conn.sendMessage(m.chat, {
        image: { url: fotoPerfil },
        caption: `
ㅤ    ꒰ ❌ *αℓуα - вσт* ⫏⫏ ꒱

> Debes registrarte primero
> Usa: ${_p}reg Lyonn.14
`.trim()
      }, { quoted: m })
    }

    const { exp, level } = user
    const { min, xp } = xpRange(level, global.multiplier)
    const name = await conn.getName(m.sender)

    const help = Object.values(global.plugins)
      .filter(p => !p.disabled)
      .map(p => ({
        help: Array.isArray(p.help) ? p.help : [p.help],
        tags: Array.isArray(p.tags) ? p.tags : [p.tags],
        prefix: 'customPrefix' in p,
        desc: ''
      }))

    let bannerFinal = 'https://cdn.dev-ander.xyz/file/xwrz29.jpg'
    let audioURL = 'https://files.catbox.moe/i427hk.mp3'

    let textoMenu = defaultMenu.before

    for (let tag of Object.keys(tags)) {

      const cmds = help
        .filter(menu => menu.tags?.includes(tag))
        .map(menu => menu.help.map(h =>
          defaultMenu.body
            .replace(/%cmd/g, menu.prefix ? h : `${_p}${h}`)
        ).join('\n')).join('\n')

      if (cmds) {
        textoMenu += defaultMenu.header.replace(/%category/g, tags[tag])
        textoMenu += '\n' + cmds
        textoMenu += '\n' + defaultMenu.footer
      }
    }

    textoMenu += defaultMenu.after

    const replace = {
      name,
      level,
      exp: exp - min,
      maxexp: xp,
      totalreg: Object.keys(global.db.data.users).length,
      readmore: readMore
    }

    let texto = textoMenu

    for (let key of Object.keys(replace)) {
      texto = texto.replace(
        new RegExp(`%${key}`, 'g'),
        replace[key]
      )
    }

    const {
      generateWAMessageFromContent,
      prepareWAMessageMedia,
      proto
    } = await import('@whiskeysockets/baileys')

    const media = await prepareWAMessageMedia(
      {
        image: {
          url: bannerFinal
        }
      },
      {
        upload: conn.waUploadToServer
      }
    )

    const interactiveMessage = proto.Message.InteractiveMessage.create({

      header: {
        title: 'αℓуα - вσт',
        subtitle: 'Menú Principal',
        hasMediaAttachment: true,
        imageMessage: media.imageMessage
      },

      body: {
        text: texto.trim()
      },

      footer: {
        text: '⫏⫏ αℓуα - вσт ✿'
      },

      nativeFlowMessage: {
        buttons: [
          {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
              title: '📡 COMANDOS',
              sections: [
                {
                  title: '✨ SISTEMA',
                  rows: [
                    {
                      header: 'Estado',
                      title: '📡 PING',
                      description: 'Velocidad del bot',
                      id: `${_p}ping`
                    }
                  ]
                }
              ]
            })
          }
        ]
      }
    })

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: {},
            interactiveMessage
          }
        }
      },
      {
        quoted: m
      }
    )

    await conn.relayMessage(
      m.chat,
      msg.message,
      {
        messageId: msg.key.id
      }
    )

    try {

      const audioPath = join(
        process.cwd(),
        'tmp',
        `menu_audio_${Date.now()}.ogg`
      )

      await descargarYConvertirAudio(
        audioURL,
        audioPath
      )

      const audioBuffer = fs.readFileSync(audioPath)

      await conn.sendMessage(m.chat, {
        audio: audioBuffer,
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363407253203904@newsletter",
            newsletterName: "αℓуα - ¢нαηηєℓ",
            serverMessageId: 1
          }
        }
      }, {
        quoted: m
      })

      fs.unlinkSync(audioPath)

    } catch (audioErr) {
      console.log(audioErr)
    }

    await m.react('🕸️')

  } catch (e) {

    console.log(e)

    await conn.sendMessage(m.chat, {
      text: `❌ Error:\n${e}`
    }, {
      quoted: m
    })
  }
}

handler.before = async (m, { conn }) => {

  const nativeFlow =
    m.message?.interactiveResponseMessage?.nativeFlowResponseMessage

  if (!nativeFlow) return false

  try {

    const data = JSON.parse(nativeFlow.paramsJson || '{}')

    const id =
      data.id ||
      data.selectedId ||
      data.selectedRowId ||
      null

    if (!id) return false

    m.text = id
    m.body = id

  } catch (e) {
    console.log(e)
  }

  return false
}

handler.help = ['menu', 'menú', 'help']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']
handler.register = false

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)