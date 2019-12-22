import { Transform, Readable } from 'stream'
import ffmpeg from 'fluent-ffmpeg'

export class AudioSlicer {
  private _audioStream: Readable

  constructor(input: Readable) {
    this._audioStream = input
  }

  public async slice(from: number, to: number): Promise<Transform> {
    return new Promise((resolve, reject) => {
      const sliceStream = new Transform()

      ffmpeg(this._audioStream)
        .seek(from)
        .duration(to-from)
        .pipe(sliceStream)
        .on('end', () => resolve(sliceStream))
        .on('error', err => reject(err.message))
    })
  }
}
