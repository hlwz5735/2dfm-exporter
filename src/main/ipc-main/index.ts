import { ipcMain } from 'electron'
import { read2DFMPlayerFile } from '@/util/2dfm-player-file-reader'

ipcMain.on('read-2dfm-player-file', async (e, path: string) => {
    const player = await read2DFMPlayerFile(path)
    e.reply('read-2dfm-player-file-complete', player)
})
