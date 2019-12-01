import { APIGatewayEvent, ProxyResult, Handler, Context } from 'aws-lambda'

const generateOKResponse: Function = (): ProxyResult => {
  const response: ProxyResult = {
    statusCode: 200,
    body: '',
  }

  return response
}

const register: Handler = async (_event: APIGatewayEvent, _context: Context) => {
  const response = generateOKResponse()
  return response
}

export { register }
