import { Readable, Writable } from 'stream'
import ffmpeg from 'ffmpeg-static'
import cp from 'child_process'

export class AudioService {

    static combineVideoAndAudioStream(video: Readable, audio: Readable): Readable {

        const ffmpegProcess = cp.spawn(ffmpeg, [

            '-i', 'pipe:3',
            '-i', 'pipe:4',
            '-map', '0:a',
            '-map', '1:v',
            '-c:v', 'copy',
            '-movflags', 'frag_keyframe',
            '-f', 'mp4',
            'pipe:1'
        ], {
            windowsHide: true,
            stdio: [
                'inherit', 'pipe', 'inherit', 'pipe', 'pipe'
            ]
        })

        audio.pipe(<Writable>ffmpegProcess.stdio[3])
        video.pipe(<Writable>ffmpegProcess.stdio[4])

        return <Readable>ffmpegProcess.stdio[1]

    }

}