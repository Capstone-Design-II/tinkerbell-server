import { S3Event, Handler, Context } from 'aws-lambda'
import { SQS } from 'aws-sdk'
import { basename } from 'path'

const sendMessage: Function = async (
  bucket: string,
  key: string,
  uuid: string,
): Promise<void> => {
  const {
    SQS_TRANSCRIPT_RESULT_QUEUE_URL,
  } = process.env

  const sqs = new SQS()
  const body = { uuid, bucket, key }
  const sendMessageParam = {
    QueueUrl: SQS_TRANSCRIPT_RESULT_QUEUE_URL,
    MessageBody: JSON.stringify(body),
    MessageGroupId: uuid,
    MessageDeduplicationId: uuid,
  }

  await sqs.sendMessage(
    sendMessageParam as SQS.Types.SendMessageRequest
  ).promise()
}

const getUuidFromKey: Function = (key: string): string => {
  const uuid = basename(key, '.json')
  return uuid
}

const enqueue: Handler = async (event: S3Event, _context: Context) => {
  const { Records: records } = event
  const sendMessages = records.map(async record => {
    const { s3 } = record
    const uuid = getUuidFromKey(s3.object.key)
    console.log(`${s3.bucket.name} ${s3.object.key} ${uuid}`)
    await sendMessage(s3.bucket.name, s3.object.key, uuid)
  })

  await Promise.all(sendMessages)
}

export { enqueue }
