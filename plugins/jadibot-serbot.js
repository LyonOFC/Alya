const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion} = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import * as ws from 'ws'
const { exec } = await import('child_process')
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

let rtx = `
  🌊 𝘼𝙇𝙔𝘼 𝙎𝙐𝘽

  𝙑𝙄𝙉𝘾𝙐𝙇𝘼𝘾𝙄𝙊́𝙉 𝙋𝙊𝙍 𝙌𝙍

  📱 𝙋𝙖𝙨𝙤𝙨:
  1️⃣ 𝘼𝙗𝙧𝙚 𝙒𝙝𝙖𝙩𝙨𝘼𝙥𝙥
  2️⃣ 𝙋𝙪𝙡𝙨𝙖 ⋮ → 𝘿𝙞𝙨𝙥𝙤𝙨𝙞𝙩𝙞𝙫𝙤𝙨 𝙫𝙞𝙣𝙘𝙪𝙡𝙖𝙙𝙤𝙨
  3️⃣ 𝙋𝙧𝙚𝙨𝙞𝙤𝙣𝙖 "𝙑𝙞𝙣𝙘𝙪𝙡𝙖𝙧 𝙪𝙣 𝙙𝙞𝙨𝙥𝙤𝙨𝙞𝙩𝙞𝙫𝙤"
  4️⃣ 𝙀𝙨𝙘𝙖𝙣𝙚𝙖 𝙚𝙡 𝙘𝙤́𝙙𝙞𝙜𝙤 𝙌𝙍

  ✦ 𝘾𝙧𝙚𝙖𝙙𝙤 𝙥𝙤𝙧 𝙇𝙮𝙤𝙣𝙣
  𝘼𝙡𝙮𝙖 𝙎𝙪𝙗
`.trim()

let rtx2 = `
  🌊 𝘼𝙇𝙔𝘼 𝙎𝙐𝘽

  𝙑𝙄𝙉𝘾𝙐𝙇𝘼𝘾𝙄𝙊́𝙉 𝙋𝙊𝙍 𝘾𝙊́𝘿𝙄𝙂𝙊

  📱 𝙋𝙖𝙨𝙤𝙨:
  1️⃣ 𝘼𝙗𝙧𝙚 𝙒𝙝𝙖𝙩𝙨𝘼𝙥𝙥
  2️⃣ 𝙋𝙪𝙡𝙨𝙖 ⋮ → 𝘿𝙞𝙨𝙥𝙤𝙨𝙞𝙩𝙞𝙫𝙤𝙨 𝙫𝙞𝙣𝙘𝙪𝙡𝙖𝙙𝙤𝙨
  3️⃣ 𝙋𝙧𝙚𝙨𝙞𝙤𝙣𝙖 "𝙑𝙞𝙣𝙘𝙪𝙡𝙖𝙧 𝙪𝙣 𝙙𝙞𝙨𝙥𝙤𝙨𝙞𝙩𝙞𝙫𝙤"
  4️⃣ 𝙎𝙚𝙡𝙚𝙘𝙘𝙞𝙤𝙣𝙖 "𝘾𝙤𝙣 𝙣𝙪́𝙢𝙚𝙧𝙤" 𝙚 𝙞𝙣𝙜𝙧𝙚𝙨𝙖 𝙚𝙡 𝙘𝙤́𝙙𝙞𝙜𝙤

  ✦ 𝘾𝙧𝙚𝙖𝙙𝙤 𝙥𝙤𝙧 𝙇𝙮𝙤𝙣𝙣
  𝘼𝙡𝙮𝙖 𝙎𝙪𝙗
`.trim()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const jadi = 'JadiBots'
const yukiJBOptions = {}

if (!global.conns) global.conns = []

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])]
  const subBotsCount = subBots.length
  
  if (subBotsCount >= 30) {
    return m.reply(`❌ 𝙉𝙤 𝙝𝙖𝙮 𝙚𝙨𝙥𝙖𝙘𝙞𝙤𝙨 𝙥𝙖𝙧𝙖 𝙨𝙪𝙗-𝙗𝙤𝙩𝙨`)
  }

  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let id = `${who.split('@')[0]}`
  let pathYukiJadiBot = path.join(`./${jadi}/`, id)
  
  if (!fs.existsSync(pathYukiJadiBot)) {
    fs.mkdirSync(pathYukiJadiBot, { recursive: true })
  }
  
  yukiJBOptions.pathYukiJadiBot = pathYukiJadiBot
  yukiJBOptions.m = m
  yukiJBOptions.conn = conn
  yukiJBOptions.args = args
  yukiJBOptions.usedPrefix = usedPrefix
  yukiJBOptions.command = command
  yukiJBOptions.fromCommand = true
  yukiJadiBot(yukiJBOptions)
} 

handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']
handler.desc = '𝙑𝙞𝙣𝙘𝙪𝙡𝙖𝙧 𝙪𝙣 𝙨𝙪𝙗-𝙗𝙤𝙩'

export default handler 

export async function yukiJadiBot(options) {
  let { pathYukiJadiBot, m, conn, args, usedPrefix, command } = options
  
  if (command === 'code') {
    command = 'qr'
    args.unshift('code')
  }
  
  const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
  let txtCode, codeBot, txtQR
  
  if (mcode) {
    args[0] = args[0]?.replace(/^--code$|^code$/, "").trim()
    if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
    if (args[0] == "") args[0] = undefined
  }
  
  const pathCreds = path.join(pathYukiJadiBot, "creds.json")
  
  if (!fs.existsSync(pathYukiJadiBot)) {
    fs.mkdirSync(pathYukiJadiBot, { recursive: true })
  }
  
  try {
    if (args[0] && args[0] != undefined) {
      fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t'))
    }
  } catch {
    conn.reply(m.chat, `❌ 𝙐𝙨𝙖: ${usedPrefix + command} code`, m)
    return
  }

  let { version } = await fetchLatestBaileysVersion()
  const msgRetryMap = (MessageRetryMap) => { }
  const msgRetryCache = new NodeCache()
  const { state, saveCreds } = await useMultiFileAuthState(pathYukiJadiBot)

  const connectionOptions = {
    logger: pino({ level: "fatal" }),
    printQRInTerminal: false,
    auth: { 
      creds: state.creds, 
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) 
    },
    msgRetry: msgRetryMap,
    msgRetryCache,
    browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['Alya Sub', 'Chrome', '2.0.0'],
    version: version,
    generateHighQualityLinkPreview: true
  }

  let sock = makeWASocket(connectionOptions)
  sock.isInit = false
  let isInit = true

  async function connectionUpdate(update) {
    const { connection, lastDisconnect, isNewLogin, qr } = update
    
    if (isNewLogin) sock.isInit = false
    
    if (qr && !mcode) {
      if (m?.chat) {
        txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx }, { quoted: m })
      } else {
        return
      }
      if (txtQR && txtQR.key) {
        setTimeout(() => { conn.sendMessage(m.chat, { delete: txtQR.key }) }, 30000)
      }
      return
    }
    
    if (qr && mcode) {
      let secret = await sock.requestPairingCode(m.sender.split('@')[0])
      secret = secret.match(/.{1,4}/g)?.join("-") || secret
      
      txtCode = await conn.sendMessage(m.chat, { text: rtx2 }, { quoted: m })
      codeBot = await m.reply(secret)
    }
    
    if (txtCode && txtCode.key) {
      setTimeout(() => { conn.sendMessage(m.chat, { delete: txtCode.key }) }, 30000)
    }
    if (codeBot && codeBot.key) {
      setTimeout(() => { conn.sendMessage(m.chat, { delete: codeBot.key }) }, 30000)
    }

    const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
    
    if (connection === 'close') {
      if (reason == 405 || reason == 401) {
        console.log(chalk.bold.yellow(`❌ Sesion cerrada: ${path.basename(pathYukiJadiBot)}`))
        fs.rmSync(pathYukiJadiBot, { recursive: true, force: true })
      }
    }
    
    if (connection === 'open') {
      let userName = sock.authState.creds.me.name || 'Anónimo'
      console.log(chalk.bold.green(`✅ Sub-bot conectado: ${userName}`))
      sock.isInit = true
      global.conns.push(sock)
      await joinChannels(sock)
    }
  }

  setInterval(async () => {
    if (!sock.user) {
      try { sock.ws.close() } catch (e) {}
      sock.ev.removeAllListeners()
      let i = global.conns.indexOf(sock)
      if (i < 0) return
      delete global.conns[i]
      global.conns.splice(i, 1)
    }
  }, 60000)

  let handlerModule = await import('../handler.js')
  
  let creloadHandler = async function (restatConn) {
    try {
      const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
      if (Object.keys(Handler || {}).length) handlerModule = Handler
    } catch (e) {
      console.error('Nuevo error: ', e)
    }
    
    if (restatConn) {
      try { sock.ws.close() } catch {}
      sock.ev.removeAllListeners()
      sock = makeWASocket(connectionOptions)
      isInit = true
    }
    
    if (!isInit) {
      sock.ev.off("messages.upsert", sock.handler)
      sock.ev.off("connection.update", sock.connectionUpdate)
      sock.ev.off('creds.update', sock.credsUpdate)
    }
    
    sock.handler = handlerModule.handler.bind(sock)
    sock.connectionUpdate = connectionUpdate.bind(sock)
    sock.credsUpdate = saveCreds.bind(sock, true)
    
    sock.ev.on("messages.upsert", sock.handler)
    sock.ev.on("connection.update", sock.connectionUpdate)
    sock.ev.on("creds.update", sock.credsUpdate)
    
    isInit = false
    return true
  }
  
  creloadHandler(false)
}

async function joinChannels(conn) {
  try {
    await conn.newsletterFollow("120363407253203904@newsletter").catch(() => {})
  } catch (e) {
    console.error('Error al seguir newsletter:', e)
  }
}