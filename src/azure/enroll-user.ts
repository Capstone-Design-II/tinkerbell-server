import { S3 } from 'aws-sdk'
import { Stream } from 'stream'
import { AzureIdentificationProfile } from './identification-profile'

const getAudioFile: Function = async (s3Key: string): Promise<Stream> => {
  const {
    S3_CUSTOMER_VOICES_BUCKET_NAME,
  } = process.env

  const s3 = new S3()
  const headObjectParam = {
    Bucket: S3_CUSTOMER_VOICES_BUCKET_NAME,
    Key: s3Key,
  }
  const meta = await s3.headObject(
    headObjectParam as S3.Types.HeadObjectRequest
  ).promise()
  const { ContentType: ResponseContentEncoding } = meta

  const getObjectParam = {
    ...headObjectParam,
    ResponseContentEncoding,
  }
  const audioStream = await s3.getObject(
    getObjectParam as S3.Types.GetObjectRequest
  ).createReadStream()

  return audioStream
}

const enroll: Function = async (
  identificationProfileId: string,
  audio: Stream,
): Promise<void> => {
  const identificationClient = new AzureIdentificationProfile()
  audio.on('end', async () => {
    await identificationClient.enroll(identificationProfileId, audio)
  })
}

const enrollUser: Function = async (
  identificationProfileId: string,
  s3Key: string,
): Promise<void> => {
  const audio = await getAudioFile(s3Key)

  await enroll(identificationProfileId, audio)
}

export { enrollUser }
