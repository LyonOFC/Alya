import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [
  ['59177474230', 'Lyonn', true],
  ['59177474230'],
  ['156981591593126'],
  ['880077330554979']
]

global.mods = []
global.prems = []

global.namebot = 'αℓуα ѕυв'
global.packname = 'αℓуα ѕυв'
global.author = 'ℓүσηη'
global.moneda = '¢σιηѕ'

global.libreria = 'вαιℓєуѕ'
global.baileys = 'ν 6.7.16'
global.vs = '2.2.0'
global.sessions = 'ѕєѕѕισηѕ'
global.jadi = 'נα∂ιвσтѕ'
global.yukiJadibts = true

global.namecanal = 'αℓуα ¢нαηηєℓ'
global.idcanal = '120363407253203904@newsletter'
global.idcanal2 = '120363407253203904@newsletter'
global.canal = 'https://whatsapp.com/channel/0029VbCOTaJ9RZAQPdiZ4J1K'
global.canalreg = '120363407253203904@newsletter'

global.ch = {
  ch1: '120363407253203904@newsletter'
}

global.multiplier = 69
global.maxwarn = 2

global.APIs = {
  adonix: { url: "https://api-adonix.ultraplus.click", key: "Yuki-WaBot" },
  vreden: { url: "https://api.vreden.web.id", key: null },
  nekolabs: { url: "https://api.nekolabs.web.id", key: null },
  siputzx: { url: "https://api.siputzx.my.id", key: null },
  delirius: { url: "https://api.delirius.store", key: null },
  ootaizumi: { url: "https://api.ootaizumi.web.id", key: null },
  stellar: { url: "https://api.stellarwa.xyz", key: "YukiWaBot", key2: '1bcd4698ce6c75217275c9607f01fd99' },
  apifaa: { url: "https://api-faa.my.id", key: null },
  xyro: { url: "https://api.xyro.site", key: null },
  yupra: { url: "https://api.yupra.my.id", key: null }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("☄️ ѕє α¢тυαℓιzσ '¢σηƒιg.נѕ'"))
  import(`file://${file}?update=${Date.now()}`)
})