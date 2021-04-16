import express from 'express'
import cors from 'cors'
import ytdl from 'ytdl-core'

const app = express()

const isDevelopment = process.env.NODE_ENV === 'dev'

const corsOptions = {
    origin: isDevelopment ? 'http://localhost:3000' : 'https://waaw.space'
}

app.use(cors(corsOptions))

app.get('/', (req, res) => {
    const videoId = req.query.videoId

    const stream = ytdl(`https://youtube.com/watch?v=${videoId}`, {
        quality: 'highestaudio'
    })

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
        thumbnail: infos.videoDetails.thumbnail.thumbnails[0]?.url
    })
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Youtube server listening on port ${port}`))