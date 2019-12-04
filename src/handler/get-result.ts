import { APIGatewayEvent, ProxyResult, Handler, Context } from 'aws-lambda'
import { HistoryGateway } from '../entity-gateway/history-gateway'
import { History } from '../entity/history'

const getHistory: Function = async (uuid: string): Promise<History> => {
  const historyTable = new HistoryGateway()
  const history = await historyTable.getHistory(uuid)

  return history
}

const generateOKResponse: Function = (history: History): ProxyResult => {
  const response: ProxyResult = {
    statusCode: 200,
    body: JSON.stringify(history),
  }

  return response
}

const getResult: Handler = async (event: APIGatewayEvent, _context: Context) => {
  const { uuid } = event.pathParameters!
  const history = await getHistory(uuid)

  const response = generateOKResponse(history)
  return response
}

export { getResult }
