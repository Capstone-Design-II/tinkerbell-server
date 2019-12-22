import { SQSEvent, Handler, Context } from 'aws-lambda'
import { Transcribe } from '../aws/transcribe'
import { InvokeTranscribeParameter } from 'tinkerbell'

const formS3Uri: Function = (key: string): string => {
  const {
    AWS_REGION_INFO,
    S3_MEETING_RECORDS_BUCKET_NAME,
  } = process.env
  const baseUri = `https://s3.${AWS_REGION_INFO}.amazonaws.com`
  const uri = `${baseUri}/${S3_MEETING_RECORDS_BUCKET_NAME}/${key}`
  return uri
}

const invokeTranscriptions: Function = async (
  params: InvokeTranscribeParameter[],
): Promise<void> => {
  const transcribeClient = new Transcribe()
  const invokes = params.map(async param => {
    const { uuid, s3Uri } = param
    await transcribeClient.startTranscription(uuid, s3Uri)
  })

  await Promise.all(invokes)
}

const invoke: Handler = async (event: SQSEvent, _context: Context) => {
  const { Records: records } = event

  const invokeParams = records.map(record => {
    const { body } = record
    const requestBody = JSON.parse(body!)
    const { uuid, key } = requestBody
    const s3Uri = formS3Uri(key)

    return { uuid, s3Uri }
  })

  await invokeTranscriptions(invokeParams)
}

export { invoke }
