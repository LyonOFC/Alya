import {
  generateWAMessageFromContent,
  proto
} from '@whiskeysockets/baileys'

let games = {}

const checkWinner = (board) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]
  for (let line of lines) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  return null
}

const isBoardFull = (board) => {
  return board.every(cell => cell !== null)
}

const getBestMove = (board, botSymbol, playerSymbol) => {
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = botSymbol
      if (checkWinner(board) === botSymbol) {
        board[i] = null
        return i
      }
      board[i] = null
    }
  }
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = playerSymbol
      if (checkWinner(board) === playerSymbol) {
        board[i] = null
        return i
      }
      board[i] = null
    }
  }
  const corners = [0, 2, 6, 8]
  for (let corner of corners) {
    if (!board[corner]) return corner
  }
  if (!board[4]) return 4
  const edges = [1, 3, 5, 7]
  for (let edge of edges) {
    if (!board[edge]) return edge
  }
  return null
}

const renderBoard = (board) => {
  const symbols = { X: '❌', O: '⭕', null: '⬜' }
  let displayBoard = ''
  for (let i = 0; i < 9; i++) {
    displayBoard += symbols[board[i]] || '⬜'
    if ((i + 1) % 3 === 0) displayBoard += '\n'
  }
  return displayBoard
}

const createBoardButtons = (gameId, board) => {
  const rows = []
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      rows.push({
        header: `Posición ${i + 1}`,
        title: `🎮 ${i + 1}`,
        description: `Marca aquí`,
        id: `ttt_${gameId}_${i}`
      })
    }
  }
  return rows
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

  games[gameId] = {
    board: Array(9).fill(null),
    currentTurn: 'X',
    player: m.sender,
    playerSymbol: 'X',
    botSymbol: 'O',
    lastMove: Date.now(),
    timeout: setTimeout(() => {
      if (games[gameId]) {
        conn.sendMessage(m.chat, { text: `⏰ Partida cerrada por inactividad (30 segundos)` })
        delete games[gameId]
      }
    }, 30000)
  }

  const buttons = {
    name: 'single_select',
    buttonParamsJson: JSON.stringify({
      title: '🎮 TABLERO',
      sections: [{
        title: 'Selecciona una casilla',
        rows: createBoardButtons(gameId, games[gameId].board)
      }]
    })
  }

  const interactiveMessage = proto.Message.InteractiveMessage.create({
    header: { title: 'αℓуα - τres εη яαуα', subtitle: 'Contra la Bot', hasMediaAttachment: false },
    body: { text: `🎮 *Tres en Raya*\n\n${renderBoard(games[gameId].board)}\n\nTu turno ❌` },
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
    if (!id || !id.startsWith('ttt_')) return false

    const parts = id.split('_')
    const gameId = parts[1]
    const movePosition = parseInt(parts[2])

    const game = games[gameId]
    if (!game) {
      await conn.sendMessage(m.chat, { text: `❌ La partida ya terminó. Usa *ttt* para iniciar una nueva.` }, { quoted: m })
      return true
    }

    if (m.sender !== game.player) {
      await conn.sendMessage(m.chat, { text: `❌ Solo el jugador que inició la partida puede jugar.` }, { quoted: m })
      return true
    }

    if (game.currentTurn !== 'X') {
      await conn.sendMessage(m.chat, { text: `❌ Espera a que la bot haga su movimiento.` }, { quoted: m })
      return true
    }

    if (game.board[movePosition] !== null) {
      await conn.sendMessage(m.chat, { text: `❌ Esa casilla ya está ocupada.` }, { quoted: m })
      return true
    }

    clearTimeout(game.timeout)
    game.board[movePosition] = 'X'
    game.lastMove = Date.now()
    game.timeout = setTimeout(() => {
      if (games[gameId]) {
        conn.sendMessage(gameId, { text: `⏰ Partida cerrada por inactividad (30 segundos)` })
        delete games[gameId]
      }
    }, 30000)

    let winner = checkWinner(game.board)
    if (winner === 'X') {
      await conn.sendMessage(m.chat, {
        text: `🏆 *Ganaste!* 🏆\n\n${renderBoard(game.board)}\n\nPartida finalizada.`,
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

    if (isBoardFull(game.board)) {
      await conn.sendMessage(m.chat, {
        text: `🤝 *Empate!*\n\n${renderBoard(game.board)}\n\nPartida finalizada.`,
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

    game.currentTurn = 'O'

    const botMove = getBestMove(game.board, 'O', 'X')
    if (botMove !== null) {
      game.board[botMove] = 'O'
      game.lastMove = Date.now()
      clearTimeout(game.timeout)
      game.timeout = setTimeout(() => {
        if (games[gameId]) {
          conn.sendMessage(gameId, { text: `⏰ Partida cerrada por inactividad (30 segundos)` })
          delete games[gameId]
        }
      }, 30000)

      winner = checkWinner(game.board)
      if (winner === 'O') {
        await conn.sendMessage(m.chat, {
          text: `🏆 *Ganó la Bot!* 🏆\n\n${renderBoard(game.board)}\n\nPartida finalizada.`,
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

      if (isBoardFull(game.board)) {
        await conn.sendMessage(m.chat, {
          text: `🤝 *Empate!*\n\n${renderBoard(game.board)}\n\nPartida finalizada.`,
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
    }

    game.currentTurn = 'X'

    const buttons = {
      name: 'single_select',
      buttonParamsJson: JSON.stringify({
        title: '🎮 TABLERO',
        sections: [{
          title: 'Selecciona una casilla',
          rows: createBoardButtons(gameId, game.board)
        }]
      })
    }

    const interactiveMessage = proto.Message.InteractiveMessage.create({
      header: { title: 'αℓуα - τres εη яαуα', subtitle: 'Contra la Bot', hasMediaAttachment: false },
      body: { text: `🎮 *Tres en Raya*\n\n${renderBoard(game.board)}\n\nTu turno ❌` },
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

handler.help = ['ttt']
handler.tags = ['game']
handler.command = ['ttt', 'tresenraya']

export default handler