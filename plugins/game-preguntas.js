import fs from 'fs'
import {
  generateWAMessageFromContent,
  proto
} from '@whiskeysockets/baileys'

let games = {}
let preguntas = []

try {
  const preguntasJson = fs.readFileSync('./preguntas.json', 'utf8')
  preguntas = JSON.parse(preguntasJson)
} catch (e) {
  console.log('Error al cargar preguntas.json:', e)
}

const getRandomQuestion = () => {
  if (!preguntas.length) return null
  const randomIndex = Math.floor(Math.random() * preguntas.length)
  const q = preguntas[randomIndex]
  const opciones = [...q.options]
  for (let i = opciones.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[opciones[i], opciones[j]] = [opciones[j], opciones[i]]
  }
  return {
    question: q.question,
    options: opciones,
    correct: q.correct
  }
}

let handler = async (m, { conn, usedPrefix }) => {
  let isGroup = m.chat.endsWith('@g.us')
  
  if (!isGroup) return m.reply(`
ㅤ    ꒰ ㅤ ❌ ㅤ *αℓуα - вσт* ㅤ ⫏⫏ ꒱
ㅤ    ⿻ ㅤ ✿ ㅤ єяяσя 木 ɢяυρσ ㅤ 性

> ₊· ⫏⫏ ㅤ Sσℓσ єη gяυρσѕ
`.trim())

  const gameId = m.chat
  if (games[gameId]) {
    return m.reply(`❌ Ya hay una partida en curso. Espera a que termine.`)
  }

  const firstQuestion = getRandomQuestion()
  if (!firstQuestion) {
    return m.reply(`❌ Error al cargar las preguntas. Asegúrate de que el archivo preguntas.json existe.`)
  }

  games[gameId] = {
    player: m.sender,
    currentQuestion: firstQuestion,
    score: 0,
    round: 1,
    lastMove: Date.now(),
    timeout: setTimeout(() => {
      if (games[gameId]) {
        conn.sendMessage(m.chat, { text: `⏰ Partida cerrada por inactividad (30 segundos)` })
        delete games[gameId]
      }
    }, 30000)
  }

  const rows = firstQuestion.options.map((opt, i) => ({
    header: `Opción ${String.fromCharCode(65 + i)}`,
    title: opt.length > 35 ? opt.substring(0, 32) + '...' : opt,
    description: `Selecciona esta respuesta`,
    id: `quiz_${gameId}_${i}`
  }))

  const buttons = {
    name: 'single_select',
    buttonParamsJson: JSON.stringify({
      title: '❓ PREGUNTA 1/3',
      sections: [{
        title: 'Selecciona una respuesta',
        rows: rows
      }]
    })
  }

  const interactiveMessage = proto.Message.InteractiveMessage.create({
    header: { title: 'αℓуα - ρяєgυηтα∂αѕ', subtitle: 'Ronda 1/3', hasMediaAttachment: false },
    body: { text: `📚 *${firstQuestion.question}*` },
    footer: { text: '⫏⫏ αℓуα - вσт ✿' },
    nativeFlowMessage: { buttons: [buttons] }
  })

  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } }
  }, { quoted: m })

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.before = async (m, { conn }) => {
  const nativeFlow = m.message?.interactiveResponseMessage?.nativeFlowResponseMessage
  if (!nativeFlow) return false

  try {
    const data = JSON.parse(nativeFlow.paramsJson || '{}')
    const id = data.id || data.selectedId || data.selectedRowId || null
    if (!id || !id.startsWith('quiz_')) return false

    const parts = id.split('_')
    const gameId = parts[1]
    const selectedIndex = parseInt(parts[2])

    const game = games[gameId]
    if (!game) {
      await conn.sendMessage(m.chat, { text: `❌ La partida ya terminó. Usa *preguntados* para iniciar una nueva.` }, { quoted: m })
      return true
    }

    if (m.sender !== game.player) {
      await conn.sendMessage(m.chat, { text: `❌ Solo el jugador que inició la partida puede responder.` }, { quoted: m })
      return true
    }

    clearTimeout(game.timeout)

    const selectedAnswer = game.currentQuestion.options[selectedIndex]
    const isCorrect = selectedAnswer === game.currentQuestion.correct

    if (isCorrect) {
      game.score++
      await conn.sendMessage(m.chat, {
        text: `✅ *Correcto!*\n\nRespuesta: ${game.currentQuestion.correct}\nPuntos: ${game.score}`,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363407253203904@newsletter",
            newsletterName: "αℓуα - ¢нαηηєℓ",
            serverMessageId: 1
          }
        }
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        text: `❌ *Incorrecto!*\n\nRespuesta correcta: ${game.currentQuestion.correct}\nPuntos: ${game.score}`,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363407253203904@newsletter",
            newsletterName: "αℓуα - ¢нαηηєℓ",
            serverMessageId: 1
          }
        }
      }, { quoted: m })
    }

    if (game.round >= 3) {
      await conn.sendMessage(m.chat, {
        text: `🏆 *Partida finalizada!*\n\nPuntaje final: ${game.score}/3\n${game.score >= 2 ? '🎉 Felicidades!' : '😞 Sigue practicando'}`,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363407253203904@newsletter",
            newsletterName: "αℓуα - ¢нαηηєℓ",
            serverMessageId: 1
          }
        }
      }, { quoted: m })
      delete games[gameId]
      return true
    }

    const nextQuestion = getRandomQuestion()
    if (!nextQuestion) {
      await conn.sendMessage(m.chat, { text: `❌ Error al cargar siguiente pregunta.` }, { quoted: m })
      delete games[gameId]
      return true
    }

    game.currentQuestion = nextQuestion
    game.round++
    game.lastMove = Date.now()
    game.timeout = setTimeout(() => {
      if (games[gameId]) {
        conn.sendMessage(gameId, { text: `⏰ Partida cerrada por inactividad (30 segundos)` })
        delete games[gameId]
      }
    }, 30000)

    const rows = nextQuestion.options.map((opt, i) => ({
      header: `Opción ${String.fromCharCode(65 + i)}`,
      title: opt.length > 35 ? opt.substring(0, 32) + '...' : opt,
      description: `Selecciona esta respuesta`,
      id: `quiz_${gameId}_${i}`
    }))

    const buttons = {
      name: 'single_select',
      buttonParamsJson: JSON.stringify({
        title: `❓ PREGUNTA ${game.round}/3`,
        sections: [{
          title: 'Selecciona una respuesta',
          rows: rows
        }]
      })
    }

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: { title: 'αℓуα - ρяєgυηтα∂αѕ', subtitle: `Ronda ${game.round}/3`, hasMediaAttachment: false },
      body: { text: `📚 *${nextQuestion.question}*\n\nPuntos: ${game.score}` },
      footer: { text: '⫏⫏ αℓуα - вσт ✿' },
      nativeFlowMessage: { buttons: [buttons] }
    })

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } }
    }, { quoted: m })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    return true

  } catch (e) {
    console.error(e)
    return true
  }
}

handler.help = ['preguntas']
handler.tags = ['game']
handler.command = ['preguntas', 'quiz', 'trivia']

export default handler