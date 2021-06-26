import express from 'express'
import cors from 'cors'
import ytdl from 'ytdl-core'
import { AudioService } from './services/audio/AudioService'

require('dotenv').config()
const app = express()

const isDevelopment = process.env.NODE_ENV === 'dev'

const corsOptions = {
    origin: isDevelopment ? '*' : 'https://waaw.space'
}

app.use(cors(corsOptions))

app.get('/', (req, res) => {
    const videoId = req.query.videoId

    let stream;
    if (process.env.FFMPEG_ENABLED) {
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
        thumbnail: infos.videoDetails.thumbnails.pop()?.url
    })
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Youtube server listening on port ${port}`))