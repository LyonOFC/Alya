// 🌊✨ ALYA SUB - MAIN BOT ✨🌊
import fs from 'fs'
import path, { join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { platform } from 'process';
import * as ws from 'ws';
import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, mkdirSync, rmSync } from 'fs';
import yargs from 'yargs';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import { tmpdir } from 'os';
import { format } from 'util';
import pino from 'pino';
import { Boom } from '@hapi/boom';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import lodash from 'lodash';
import readline from 'readline';
import NodeCache from 'node-cache';
import qrcode from 'qrcode-terminal';
import { spawn } from 'child_process';
import { setInterval } from 'timers';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
process.env.TMPDIR = path.join(process.cwd(), 'tmp');

if (!fs.existsSync(process.env.TMPDIR)) {
  fs.mkdirSync(process.env.TMPDIR, { recursive: true });
  console.log(chalk.green('✅ Directorio temporal creado'));
}

import './config.js';
import { createRequire } from 'module';

const { proto } = (await import('@whiskeysockets/baileys')).default;
const {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  Browsers,
  makeCacheableSignalKeyStore,
  jidNormalizedUser,
} = await import('@whiskeysockets/baileys');

const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;

protoType();
serialize();

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};
global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true));
};
global.__require = function require(dir = import.meta.url) {
  return createRequire(dir);
};

global.API = (name, path = '/', query = {}, apikeyqueryname) =>
  (name in global.APIs ? global.APIs[name] : name) +
  path +
  (query || apikeyqueryname
    ? '?' +
      new URLSearchParams(
        Object.entries({
          ...query,
          ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}),
        })
      )
    : '');

global.timestamp = { start: new Date() };

const __dirname = global.__dirname(import.meta.url);

console.log(chalk.bold.cyan('\n' + '▰'.repeat(60)));
console.log(chalk.bold.yellow('   🌊 𝘼𝙇𝙔𝘼 𝙎𝙐𝘽 - 𝙎𝙄𝙎𝙏𝙀𝙈𝘼 𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝙊 🌊'));
console.log(chalk.bold.cyan('▰'.repeat(60)));
console.log(chalk.magenta('   「 𝙋𝙤𝙩𝙚𝙣𝙘𝙞𝙖 𝙮 𝙚𝙨𝙩𝙞𝙡𝙤 𝙚𝙣 𝙘𝙖𝙙𝙖 𝙢𝙚𝙣𝙨𝙖𝙟𝙚 」'));
console.log(chalk.bold.cyan('▰'.repeat(60) + '\n'));

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.prefix = new RegExp(
  '^[' +
    (opts['prefix'] || '‎z/#$%.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') +
    ']'
);

global.db = new Low(new JSONFile(`storage/databases/database.json`));

global.isDatabaseModified = false;
global.markDatabaseModified = () => {
  global.isDatabaseModified = true;
};

global.DATABASE = global.db;
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ)
    return new Promise((resolve) =>
      setInterval(async function () {
        if (!global.db.READ) {
          clearInterval(this);
          resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
        }
      }, 1 * 1000)
    );
  if (global.db.data !== null) return;
  global.db.READ = true;
  await global.db.read().catch(console.error);
  global.db.READ = null;
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    welcome: {},
    ...(global.db.data || {}),
  };
  global.db.chain = lodash.chain(global.db.data);

  const originalSet = global.db.chain.set.bind(global.db.chain);
  global.db.chain.set = (...args) => {
    const result = originalSet(...args);
    global.markDatabaseModified();
    return result;
  };
};

global.authFile = `sessions`;
const { state, saveCreds } = await useMultiFileAuthState(global.authFile);

const { version } = await fetchLatestBaileysVersion();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver));

const logger = pino({
  timestamp: () => `,"time":"${new Date().toJSON()}"`,
}).child({ class: 'client' });
logger.level = 'fatal';

const connectionOptions = {
  version: version,
  logger,
  printQRInTerminal: false,
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, logger),
  },
  browser: Browsers.ubuntu('Chrome'),
  markOnlineOnclientect: false,
  generateHighQualityLinkPreview: true,
  syncFullHistory: true,
  retryRequestDelayMs: 10,
  transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 10 },
  maxMsgRetryCount: 15,
  appStateMacVerification: {
    patch: false,
    snapshot: false,
  },
  getMessage: async (key) => {
    const jid = jidNormalizedUser(key.remoteJid);
    return '';
  },
};

global.conn = makeWASocket(connectionOptions);
global.conns = global.conns || [];

let handler;
try {
  const handlerModule = await import('./handler.js');
  handler = handlerModule.handler;
  console.log(chalk.green('✅ Handler cargado correctamente'));
} catch (e) {
  console.error(chalk.red('[ERROR] No se pudo cargar el handler principal:'), e);
  process.exit(1);
}

async function reconnectSubBot(botPath) {
  console.log(chalk.yellow(`🌀 [ALYA SUB] Iniciando sub-bot en: ${path.basename(botPath)}`));
  try {
    const { state: subBotState, saveCreds: saveSubBotCreds } = await useMultiFileAuthState(botPath);

    if (!subBotState.creds.registered) {
      console.warn(chalk.yellow(`⚠️ [ALYA SUB] Sub-bot en ${path.basename(botPath)} no está registrado`));
      return;
    }

    const subBotConn = makeWASocket({
      version: version,
      logger,
      printQRInTerminal: false,
      auth: {
        creds: subBotState.creds,
        keys: makeCacheableSignalKeyStore(subBotState.keys, logger),
      },
      browser: Browsers.ubuntu('Chrome'),
      markOnlineOnclientect: false,
      generateHighQualityLinkPreview: true,
      syncFullHistory: true,
      retryRequestDelayMs: 10,
      transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 10 },
      maxMsgRetryCount: 15,
      appStateMacVerification: {
        patch: false,
        snapshot: false,
      },
      getMessage: async (key) => '',
    });

    subBotConn.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === 'open') {
        console.log(chalk.green(`✨ [ALYA SUB] Sub-bot iniciado: ${path.basename(botPath)}`));
        const yaExiste = global.conns.some(c => c.user?.jid === subBotConn.user?.jid);
        if (!yaExiste) {
          global.conns.push(subBotConn);
          console.log(chalk.green(`⚡ [ALYA SUB] Sub-bot conectado: ${subBotConn.user?.jid}`));
        }
      } else if (connection === 'close') {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        console.error(chalk.red(`💥 [ALYA SUB] Sub-bot cerrado en ${path.basename(botPath)}. Razón: ${reason}`));

        if (reason === DisconnectReason.loggedOut || reason === 401) {
          console.log(chalk.red(`❌ [ALYA SUB] Desconexión permanente. Eliminando sub-bot en ${path.basename(botPath)}.`));
          global.conns = global.conns.filter(conn => conn.user?.jid !== subBotConn.user?.jid);
          try {
            rmSync(botPath, { recursive: true, force: true });
            console.log(chalk.green(`✅ [ALYA SUB] Sub-bot eliminado: ${botPath}`));
          } catch (e) {
            console.error(chalk.red(`❌ [ERROR] No se pudo eliminar sub-bot ${botPath}: ${e}`));
          }
        }
      }
    });

    subBotConn.ev.on('creds.update', saveSubBotCreds);
    subBotConn.handler = handler.bind(subBotConn);
    subBotConn.ev.on('messages.upsert', subBotConn.handler);
    console.log(chalk.blue(`🌀 [ALYA SUB] Manejador asignado a sub-bot: ${path.basename(botPath)}`));

    if (!global.subBots) {
      global.subBots = {};
    }
    global.subBots[path.basename(botPath)] = subBotConn;

  } catch (e) {
    console.error(chalk.red(`💥 [ERROR ALYA SUB] Error al iniciar sub-bot en ${path.basename(botPath)}:`), e);
  }
}

async function startSubBots() {
  const rutaJadiBot = join(__dirname, './JadiBots');

  if (!existsSync(rutaJadiBot)) {
    mkdirSync(rutaJadiBot, { recursive: true });
    console.log(chalk.bold.cyan(`📁 [ALYA SUB] Carpeta de sub-bots creada: ${rutaJadiBot}`));
  } else {
    console.log(chalk.bold.cyan(`📁 [ALYA SUB] Carpeta de sub-bots detectada: ${rutaJadiBot}`));
  }

  const readRutaJadiBot = readdirSync(rutaJadiBot);
  if (readRutaJadiBot.length > 0) {
    const credsFile = 'creds.json';
    console.log(chalk.magenta(`🌀 [ALYA SUB] Buscando sub-bots... Total: ${readRutaJadiBot.length}`));

    for (const subBotDir of readRutaJadiBot) {
      const botPath = join(rutaJadiBot, subBotDir);
      if (statSync(botPath).isDirectory()) {
        const readBotPath = readdirSync(botPath);
        if (readBotPath.includes(credsFile)) {
          console.log(chalk.magenta(`⚡ [ALYA SUB] Sub-bot detectado en ${subBotDir}. Iniciando...`));
          await reconnectSubBot(botPath);
        } else {
          console.log(chalk.yellow(`⚠️ [ALYA SUB] Sub-bot sin creds.json en ${subBotDir}`));
        }
      }
    }
    console.log(chalk.magenta(`✅ [ALYA SUB] Inicio de sub-bots completado.`));
  } else {
    console.log(chalk.gray(`🌙 [ALYA SUB] No hay sub-bots para iniciar.`));
  }
}

await startSubBots();

async function handleLogin() {
  if (conn.authState.creds.registered) {
    console.log(chalk.green('✅ [ALYA SUB] Bot principal ya registrado.'));
    return;
  }

  let loginMethod = await question(
    chalk.green(`\n` +
    `▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰\n` +
    `     🌊 𝘼𝙇𝙔𝘼 𝙎𝙐𝘽 𝙈𝙊𝘿𝙀 🌊\n` +
    `▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰\n` +
    ` ¿Cómo deseas activar el bot?\n` +
    `\n` +
    ` 📱 Escribir "code" para código\n` +
    `    de emparejamiento\n` +
    `\n` +
    ` 🔳 Presionar Enter para QR\n` +
    `▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰\n` +
    `\n` +
    `> `
  ));

  loginMethod = loginMethod.toLowerCase().trim();

  if (loginMethod === 'code') {
    let phoneNumber = await question(chalk.cyan('📱 Ingresa el número de WhatsApp (con código país, ej: 5215551234567):\n> '));
    phoneNumber = phoneNumber.replace(/\D/g, '');

    if (phoneNumber.startsWith('52') && phoneNumber.length === 12) {
      phoneNumber = `521${phoneNumber.slice(2)}`;
    } else if (phoneNumber.startsWith('52') && phoneNumber.length === 10) {
      phoneNumber = `521${phoneNumber}`;
    } else if (phoneNumber.startsWith('0')) {
      phoneNumber = phoneNumber.replace(/^0/, '');
    }

    if (typeof conn.requestPairingCode === 'function') {
      try {
        if (conn.ws.readyState === ws.OPEN) {
          console.log(chalk.yellow('🌀 Generando código de emparejamiento...'));
          let code = await conn.requestPairingCode(phoneNumber);
          code = code?.match(/.{1,4}/g)?.join('-') || code;
          console.log(chalk.bold.green('\n▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰'));
          console.log(chalk.bold.yellow(`   🔐 𝘾𝙊𝘿𝙄𝙂𝙊 𝘿𝙀 𝙀𝙈𝙋𝘼𝙍𝙀𝙅𝘼𝙈𝙄𝙀𝙉𝙏𝙊:`));
          console.log(chalk.bold.cyan(`      ${code}`));
          console.log(chalk.bold.green('▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰\n'));
        } else {
          console.log(chalk.red('❌ La conexión principal no está abierta. Intenta nuevamente.'));
        }
      } catch (e) {
        console.log(chalk.red('❌ Error al solicitar código de emparejamiento:'), e.message || e);
      }
    } else {
      console.log(chalk.red('❌ Tu versión de Baileys no soporta emparejamiento por código.'));
    }
  } else {
    console.log(chalk.yellow('🔳 Generando código QR, escanéalo con tu WhatsApp...\n'));
    conn.ev.on('connection.update', ({ qr }) => {
      if (qr) {
        console.log(chalk.green('📱 ESCANEA ESTE CÓDIGO QR:'));
        qrcode.generate(qr, { small: true });
        console.log(chalk.yellow('\n⏳ Esperando escaneo...\n'));
      }
    });
  }
}

await handleLogin();

conn.isInit = false;
conn.well = false;

if (!opts['test']) {
  if (global.db) {
    setInterval(async () => {
      if (global.db.data && global.isDatabaseModified) {
        await global.db.write();
        global.isDatabaseModified = false;
        console.log(chalk.gray('💾 [ALYA SUB] Base de datos guardada'));
      }
      if (opts['autocleartmp']) {
        const tmp = [tmpdir(), 'tmp', 'serbot'];
        tmp.forEach((filename) => {
          spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete']);
        });
      }
    }, 30 * 1000);
  }
}

function clearTmp() {
  const tmp = [join(__dirname, './tmp')];
  const filename = [];
  tmp.forEach((dirname) => readdirSync(dirname).forEach((file) => filename.push(join(dirname, file))));
  return filename.map((file) => {
    const stats = statSync(file);
    if (stats.isFile() && Date.now() - stats.mtimeMs >= 1000 * 60 * 1) return unlinkSync(file);
    return false;
  });
}

setInterval(() => {
  if (global.stopped === 'close' || !conn || !conn.user) return;
  clearTmp();
  console.log(chalk.gray('🧹 [ALYA SUB] Limpieza temporal completada'));
}, 180000);

if (typeof global.gc === 'function') {
  setInterval(() => {
    console.log(chalk.gray(`🧠 [ALYA SUB] Optimizando memoria...`));
    global.gc();
  }, 180000);
} else {
  console.log(chalk.yellow(`⚠️ [ALYA SUB] Para optimizar memoria, ejecuta con --expose-gc`));
}

// ==================== SISTEMA DE BIENVENIDA Y DESPEDIDA ====================

function getWelcomeSettings() {
  if (!global.db.data.welcome) {
    global.db.data.welcome = {}
    global.markDatabaseModified()
  }
  return global.db.data.welcome
}

function isWelcomeEnabled(groupId) {
  const settings = getWelcomeSettings()
  return settings[groupId]?.welcome === true
}

function isGoodbyeEnabled(groupId) {
  const settings = getWelcomeSettings()
  return settings[groupId]?.goodbye === true
}

async function connectionUpdate(update) {
  const { connection, lastDisconnect, isNewLogin } = update;
  global.stopped = connection;

  if (isNewLogin) {
    conn.isInit = true;
    console.log(chalk.green('✅ [ALYA SUB] Nuevo login detectado'));
  }

  const code =
    lastDisconnect?.error?.output?.statusCode ||
    lastDisconnect?.error?.output?.payload?.statusCode;

  if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
    await global.reloadHandler(true).catch(console.error);
    global.timestamp.connect = new Date();
  }

  if (global.db.data == null) await loadDatabase();

  if (connection === 'open') {
    console.log(chalk.bold.green('\n▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰'));
    console.log(chalk.bold.yellow('   🌊 𝘼𝙇𝙔𝘼 𝙎𝙐𝘽 𝙃𝘼 𝙄𝙉𝙄𝘾𝙄𝘼𝘿𝙊 🌊'));
    console.log(chalk.bold.cyan(`   👤 𝙐𝙨𝙪𝙖𝙧𝙞𝙤: ${conn.user?.name || 'Alya'}`));
    console.log(chalk.bold.cyan(`   📱 𝙉𝙪𝙢𝙚𝙧𝙤: ${conn.user?.id?.split(':')[0] || 'Desconocido'}`));
    console.log(chalk.bold.green('▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰\n'));
  }

  const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

  if (reason === 405) {
    if (existsSync('./sessions/creds.json')) unlinkSync('./sessions/creds.json');
    console.log(
      chalk.bold.redBright(
        `⚠️ Conexión reemplazada, reiniciando...`
      )
    );
    process.send('reset');
  }

  if (connection === 'close') {
    switch (reason) {
      case DisconnectReason.badSession:
        conn.logger.error(`❌ Sesión incorrecta, elimina la carpeta ${global.authFile}`);
        break;
      case DisconnectReason.connectionClosed:
      case DisconnectReason.connectionLost:
      case DisconnectReason.timedOut:
        conn.logger.warn(`⚠️ Conexión perdida, reconectando...`);
        await global.reloadHandler(true).catch(console.error);
        break;
      case DisconnectReason.connectionReplaced:
        conn.logger.error(`⚠️ Conexión reemplazada, se abrió otra sesión`);
        break;
      case DisconnectReason.loggedOut:
        conn.logger.error(`❌ Sesión cerrada, elimina la carpeta ${global.authFile}`);
        break;
      case DisconnectReason.restartRequired:
        conn.logger.info(`🔄 Reinicio necesario`);
        await global.reloadHandler(true).catch(console.error);
        break;
      default:
        conn.logger.warn(`❓ Desconexión desconocida: ${reason || ''}`);
        await global.reloadHandler(true).catch(console.error);
        break;
    }
  }
}

// ==================== EVENTO DE BIENVENIDA Y DESPEDIDA ====================

conn.ev.on('group-participants-update', async (update) => {
  try {
    const { id, participants, action } = update
    const groupId = id
    const botNumber = conn.user.jid.split(':')[0] + '@s.whatsapp.net'
    
    if (action === 'add') {
      if (!isWelcomeEnabled(groupId)) return
      
      for (let user of participants) {
        if (user.includes(botNumber)) continue
        
        try {
          let groupMetadata = await conn.groupMetadata(groupId)
          let groupName = groupMetadata.subject
          let groupDesc = groupMetadata.desc || '𝙎𝙞𝙣 𝙙𝙚𝙨𝙘𝙧𝙞𝙥𝙘𝙞𝙤́𝙣'
          let memberCount = groupMetadata.participants.length
          let userName = await conn.getName(user)
          let groupPic
          
          try {
            groupPic = await conn.profilePictureUrl(groupId, 'image')
          } catch {
            groupPic = 'https://files.catbox.moe/jg0te7.jpeg'
          }
          
          let welcomeText = `▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
☄️ 𝘼𝙇𝙔𝘼 𝙎𝙐𝘽 - 𝘽𝙄𝙀𝙉𝙑𝙀𝙉𝙄𝘿𝘼 ☄️
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

✨ 𝙉𝙤𝙢𝙗𝙧𝙚: ${userName}
👥 𝙂𝙧𝙪𝙥𝙤: ${groupName}
📊 𝙈𝙞𝙚𝙢𝙗𝙧𝙤𝙨: ${memberCount}

📝 𝘿𝙚𝙨𝙘𝙧𝙞𝙥𝙘𝙞𝙤́𝙣:
${groupDesc}

▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
☄️ 𝘼𝙡𝙮𝙖 𝙎𝙪𝙗 ☄️
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`

          await conn.sendMessage(groupId, {
            image: { url: groupPic },
            caption: welcomeText,
            mentions: [user]
          })
          
        } catch (err) {
          console.error('Error en bienvenida:', err)
        }
      }
    }
    
    if (action === 'remove') {
      if (!isGoodbyeEnabled(groupId)) return
      
      for (let user of participants) {
        if (user.includes(botNumber)) continue
        
        try {
          let groupMetadata = await conn.groupMetadata(groupId)
          let groupName = groupMetadata.subject
          let memberCount = groupMetadata.participants.length
          let userName = await conn.getName(user)
          let groupPic
          
          try {
            groupPic = await conn.profilePictureUrl(groupId, 'image')
          } catch {
            groupPic = 'https://files.catbox.moe/jg0te7.jpeg'
          }
          
          let goodbyeText = `▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
☄️ 𝘼𝙇𝙔𝘼 𝙎𝙐𝘽 - 𝙃𝘼𝙎𝙏𝘼 𝙇𝙐𝙀𝙂𝙊 ☄️
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

👋 𝙉𝙤𝙢𝙗𝙧𝙚: ${userName}
👥 𝙂𝙧𝙪𝙥𝙤: ${groupName}
📊 𝙈𝙞𝙚𝙢𝙗𝙧𝙤𝙨 𝙧𝙚𝙨𝙩𝙖𝙣𝙩𝙚𝙨: ${memberCount}

▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
☄️ 𝘼𝙡𝙮𝙖 𝙎𝙪𝙗 ☄️
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰`

          await conn.sendMessage(groupId, {
            image: { url: groupPic },
            caption: goodbyeText,
            mentions: [user]
          })
          
        } catch (err) {
          console.error('Error en despedida:', err)
        }
      }
    }
  } catch (err) {
    console.error('Error en evento group-participants-update:', err)
  }
})

process.on('uncaughtException', (err) => {
  console.error(chalk.red('💥 [ALYA SUB] Error no capturado:'), err);
});

let isInit = true;

global.reloadHandler = async function (restartConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
    if (Handler && Handler.handler) handler = Handler.handler;
  } catch (e) {
    console.error(`[ERROR] Fallo al cargar handler.js: ${e}`);
  }

  if (restartConn) {
    try {
      if (global.conn.ws) global.conn.ws.close();
    } catch {}
    global.conn.ev.removeAllListeners();
    global.conn = makeWASocket(connectionOptions);
    isInit = true;
  }

  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler);
    conn.ev.off('connection.update', conn.connectionUpdate);
    conn.ev.off('creds.update', conn.credsUpdate);
  }

  conn.handler = handler.bind(global.conn);
  conn.connectionUpdate = connectionUpdate.bind(global.conn);
  conn.credsUpdate = saveCreds.bind(global.conn, true);

  conn.ev.on('messages.upsert', conn.handler);
  conn.ev.on('connection.update', conn.connectionUpdate);
  conn.ev.on('creds.update', conn.credsUpdate);

  isInit = false;
  return true;
};

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'));
const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};

async function filesInit() {
  console.log(chalk.blue('📂 [ALYA SUB] Cargando plugins...'));
  let loaded = 0;
  for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      const file = global.__filename(join(pluginFolder, filename));
      const module = await import(file);
      global.plugins[filename] = module.default || module;
      loaded++;
    } catch (e) {
      conn.logger.error(`Error al cargar el plugin '${filename}': ${e}`);
      delete global.plugins[filename];
    }
  }
  console.log(chalk.green(`✅ [ALYA SUB] ${loaded} plugins cargados correctamente`));
}

await filesInit();

global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    const dir = global.__filename(join(pluginFolder, filename), true);
    if (filename in global.plugins) {
      if (existsSync(dir)) conn.logger.info(`🔄 Plugin actualizado - '${filename}'`);
      else {
        conn.logger.warn(`🗑️ Plugin eliminado - '${filename}'`);
        return delete global.plugins[filename];
      }
    } else conn.logger.info(`✨ Nuevo plugin - '${filename}'`);

    const err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
    });
    if (err) conn.logger.error(`❌ Error de sintaxis en '${filename}':\n${format(err)}`);
    else {
      try {
        const module = await import(`${global.__filename(dir)}?update=${Date.now()}`);
        global.plugins[filename] = module.default || module;
      } catch (e) {
        conn.logger.error(`❌ Error al cargar plugin '${filename}':\n${format(e)}`);
      } finally {
        global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)));
      }
    }
  }
};
Object.freeze(global.reload);

watch(pluginFolder, global.reload);
await global.reloadHandler();

console.log(chalk.bold.magenta('\n' + '▰'.repeat(30)));
console.log(chalk.bold.yellow('   🌊 𝘼𝙇𝙔𝘼 𝙎𝙐𝘽 - 𝙇𝙄𝙎𝙏𝘼 𝙋𝘼𝙍𝘼 𝙏𝙍𝘼𝘽𝘼𝙅𝘼𝙍 🌊'));
console.log(chalk.bold.cyan('   「 𝙋𝙤𝙩𝙚𝙣𝙘𝙞𝙖 𝙚𝙣 𝙘𝙖𝙙𝙖 𝙢𝙚𝙣𝙨𝙖𝙟𝙚 」'));
console.log(chalk.bold.magenta('▰'.repeat(30) + '\n'));