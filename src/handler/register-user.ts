import { APIGatewayEvent, ProxyResult, Handler, Context } from 'aws-lambda'
import { UserGateway } from '../entity-gateway/user-gateway'

const registerUser: Function = async (name: string, id: string): Promise<void> => {
  const userTable = new UserGateway()
  await userTable.putUser(name, id)
}

const generateOKResponse: Function = (): ProxyResult => {
  const response: ProxyResult = {
    statusCode: 200,
    body: '',
  }

  return response
}

const register: Handler = async (_event: APIGatewayEvent, _context: Context) => {
  await registerUser('test', 'testId')
  const response = generateOKResponse()
  return response
}

export { register }
