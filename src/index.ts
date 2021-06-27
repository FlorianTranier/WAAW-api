import express from 'express'
import cors from 'cors'
import ytdl from 'ytdl-core'
import { AudioService } from './services/audio/AudioService'
import os from 'os-utils'

require('dotenv').config()
const app = express()

const isDevelopment = process.env.NODE_ENV === 'dev'

const corsOptions = {
    origin: isDevelopment ? '*' : 'https://waaw.space'
}

app.use(cors(corsOptions))

let cpuUsage: number = 0

setInterval(() => {
    os.cpuUsage(p => cpuUsage = p)
}, 1000)

app.get('/', (req, res) => {
    const videoId = req.query.videoId

    let stream;
    if (process.env.FFMPEG_ENABLED && cpuUsage < 0.40) {
        const youtubeVideoStream = ytdl(`https://youtube.com/watch?v=${videoId}`, {
            quality: 'highestvideo',
            filter: format => ['tiny', 'small', 'medium', 'large', 'hd720', 'hd1080'].includes(format.quality)
        })

        const youtubeAudioStream = ytdl(`https://youtube.com/watch?v=${videoId}`, {
            quality: 'highestaudio',
            filter: 'audioonly'
        })

        stream = AudioService.combineVideoAndAudioStream(youtubeVideoStream, youtubeAudioStream)
    } else {
        stream = ytdl(`https://youtube.com/watch?v=${videoId}`, {
            quality: 'highest',
            filter: 'audioandvideo'
        })
    }
    
    try {
        stream.pipe(res)
    } catch (e) {
        res.status(500).send(e)
    }
    
})

app.get('/info', async (req, res) => {
    const videoId = req.query.videoId

    const infos = await ytdl.getBasicInfo(`https://youtube.com/watch?v=${videoId}`)

    res.status(200).send({
        duration: infos.videoDetails.lengthSeconds,
        title: infos.videoDetails.title,
        thumbnail: infos.videoDetails.thumbnails.pop()?.url,
        nextVideo: infos.related_videos[0].id
    })
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Youtube server listening on port ${port}`))