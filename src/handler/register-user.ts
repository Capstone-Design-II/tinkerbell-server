import { APIGatewayEvent, ProxyResult, Handler, Context } from 'aws-lambda'
import { UserGateway } from '../entity-gateway/user-gateway'
import { AzureIdentificationProfile } from '../azure/identification-profile'
import { enrollUser } from '../azure/enroll-user'
import { hash } from 'bcryptjs'

const registerUser: Function = async (
  name: string,
  id: string,
  password: string,
  identificationProfileId: string,
): Promise<void> => {
  const userTable = new UserGateway()
  await userTable.putUser(name, id, password, identificationProfileId)
}

const createIdentificationProfile: Function = async (): Promise<string> => {
  const identificationClient = new AzureIdentificationProfile()
  const identificationProfileId = await identificationClient.create()
  return identificationProfileId
}

const hashPassword: Function = async (password: string): Promise<string> => {
  const hashed = await hash(password, 10)
  return hashed
}

const generateOKResponse: Function = (): ProxyResult => {
  const response: ProxyResult = {
    statusCode: 200,
    body: 'registered',
  }

  return response
}

const generateErrorResponse: Function = (
  statusCode: number,
  message: string,
): ProxyResult => {
    const response: ProxyResult = {
      statusCode,
      body: JSON.stringify({ message }),
      isBase64Encoded: false,
    }

    return response
}

const register: Handler = async (
  event: APIGatewayEvent,
  _context: Context,
) => {
  const { body } = event
  const requestBody = JSON.parse(body!)

  const { name, id, password, key } = requestBody
  const params = name || id || password || key
  if (!params) {
    const response = generateErrorResponse(400, 'Bad Request')
    return response
  }

  const identificationProfileId = await createIdentificationProfile()
  const hashedPassword = await hashPassword(password)
  await registerUser(name, id, hashedPassword, identificationProfileId)
  await enrollUser(identificationProfileId, key)

  const response = generateOKResponse()
  return response
}

export { register }
