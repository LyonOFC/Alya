import { execSync } from 'child_process'

const handler = async (m, { conn, args }) => {
    try {
        await conn.reply(m.chat, '⏳ *Actualizando Alya Sub...* Por favor espera.', m)

        const output = execSync('git pull' + (args.length ? ' ' + args.join(' ') : '')).toString()
        const isUpdated = output.includes('Already up to date')

        const updateMsg = isUpdated
            ? '✅ *Alya Sub ya está actualizado.*'
            : `✅ *Actualización aplicada correctamente:*\n\n${output}`

        await conn.reply(m.chat, updateMsg, m)

    } catch (error) {
        let conflictMsg = '❌ *Error al actualizar el bot.*'

        try {
            const status = execSync('git status --porcelain').toString().trim()

            if (status) {
                const conflictedFiles = status
                    .split('\n')
                    .map(line => line.slice(3))
                    .filter(file =>
                        !file.startsWith('.npm/') &&
                        !file.startsWith('Sessions/Principal/') &&
                        !file.startsWith('node_modules/') &&
                        !file.startsWith('package-lock.json') &&
                        !file.startsWith('database.json') &&
                        !file.startsWith('.cache/') &&
                        !file.startsWith('tmp/')
                    )

                if (conflictedFiles.length > 0) {
                    conflictMsg = `⚠️ *Conflictos detectados:*\n\n` +
                        conflictedFiles.map(f => `• ${f}`).join('\n') +
                        `\n\n🔧 *Solución:* Reinstala la bot o resuelve los conflictos manualmente.`
                }
            }
        } catch (statusError) {
            console.error(statusError)
        }

        await conn.reply(m.chat, conflictMsg, m)
    }
}

const keywords = ['update', 'up', 'fix']

handler.help = ['update']
handler.tags = ['owner']
handler.command = ['update', 'up', 'fix']
handler.desc = '> Actualiza la bot'
handler.rowner = true

handler.all = async function (m) {
    if (!m.text || typeof m.text !== 'string') return

    const input = m.text.trim().toLowerCase()

    for (const keyword of keywords) {
        if (input === keyword) {
            return handler(m, { conn: this, args: [] })
        }
    }
}

export default handler