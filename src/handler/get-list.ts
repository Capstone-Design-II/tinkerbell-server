import { APIGatewayEvent, ProxyResult, Handler, Context } from 'aws-lambda'
import { HistoryGateway } from '../entity-gateway/history-gateway'
import { History } from '../entity/history'

const getHistoryList: Function = async (): Promise<History[]> => {
  const historyTable = new HistoryGateway()
  const historyList = await historyTable.getHistoryList()

  return historyList
}

const generateOKResponse: Function = (historyList: History[]): ProxyResult => {
  const response: ProxyResult = {
    statusCode: 200,
    body: JSON.stringify(historyList),
  }

  return response
}

const getList: Handler = async (_event: APIGatewayEvent, _context: Context) => {
  const historyList = await getHistoryList()

  const response = generateOKResponse(historyList)
  return response
}

export { getList }
