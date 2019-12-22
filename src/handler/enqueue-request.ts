import { APIGatewayEvent, ProxyResult, Handler, Context } from 'aws-lambda'
import { SQS } from 'aws-sdk'
import { HistoryGateway } from '../entity-gateway/history-gateway'
import { v4 as uuid } from 'uuid'

const generateUuid: Function = (): string => {
  return uuid()
}

const putHistory: Function = async (uuid: string): Promise<void> => {
  const historyTable = new HistoryGateway()
  await historyTable.putHistory(uuid)
}

const sendMessage: Function = async (
  uuid: string,
  key: string
): Promise<void> => {
  const {
    SQS_TRANSCRIPT_QUEUE_URL
  } = process.env

  const sqs = new SQS()
  const body = { uuid, key }
  const sendMessageParam = {
    QueueUrl: SQS_TRANSCRIPT_QUEUE_URL,
    MessageBody: JSON.stringify(body),
    MessageGroupId: uuid,
    MessageDeduplicationId: uuid,
  }

  await sqs.sendMessage(
    sendMessageParam as SQS.Types.SendMessageRequest
  ).promise()
}

const generateOKResponse: Function = (uuid: string): ProxyResult => {
  const response: ProxyResult = {
    statusCode: 200,
    body: JSON.stringify({ uuid }),
  }

  return response
}

const enqueue: Handler = async (event: APIGatewayEvent, _context: Context) => {
  const { body } = event
  const requestBody = JSON.parse(body!)

  const uuid = generateUuid()
  await putHistory(uuid)

  const { key } = requestBody
  await sendMessage(uuid, key)

  const response = generateOKResponse(uuid)
  return response
}

export { enqueue }
