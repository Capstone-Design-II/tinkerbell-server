import { TranscribeService } from 'aws-sdk'

export class Transcribe {
  private _client: TranscribeService
  private _languageCode: string
  private _outputBucket: string

  constructor() {
    const {
      S3_TRANSCRIPTS_BUCKET_NAME,
    } = process.env

    this._client = new TranscribeService()
    this._languageCode = 'ko-KR'
    this._outputBucket = S3_TRANSCRIPTS_BUCKET_NAME!
  }

  public async startTranscription(uuid: string, s3Uri: string): Promise<void> {
    const param = {
      LanguageCode: this._languageCode,
      Media: {
        MediaFileUri: s3Uri,
      },
      TranscriptionJobName: uuid,
      OutputBucketName: this._outputBucket,
      Settings: {
        ShowSpeakerLabels: true,
        MaxSpeakerLabels: 10,
      },
    }

    await this._client.startTranscriptionJob(param).promise()
  }
}
