import { APIGatewayEvent, ProxyResult, Handler, Context } from 'aws-lambda'
import { HistoryGateway } from '../entity-gateway/history-gateway'
import { v4 as uuid } from 'uuid'

const generateUuid: Function = (): string => {
  return uuid()
}

const putHistory: Function = async (uuid: string): Promise<void> => {
  const historyTable = new HistoryGateway()
  await historyTable.putHistory(uuid)
}

const generateOKResponse: Function = (uuid: string): ProxyResult => {
  const response: ProxyResult = {
    statusCode: 200,
    body: JSON.stringify({ uuid }),
  }

  return response
}

const enqueue: Handler = async (_event: APIGatewayEvent, _context: Context) => {
  // const { body } = event
  // const requestBody = JSON.parse(body!)

  const uuid = generateUuid()
  await putHistory(uuid)

  // TODO: start transcript
  const response = generateOKResponse(uuid)
  return response
}

export { enqueue }
