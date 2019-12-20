import { APIGatewayEvent, ProxyResult, Handler, Context } from 'aws-lambda'
import { UserGateway } from '../entity-gateway/user-gateway'
import { AzureIdentificationProfile } from '../azure/identification-profile'

const registerUser: Function = async (
  name: string,
  id: string,
  identificationProfileId: string
): Promise<void> => {
  const userTable = new UserGateway()
  await userTable.putUser(name, id, identificationProfileId)
}

const createIdentificationProfile: Function = async (): Promise<string> => {
  const identificationClient = new AzureIdentificationProfile()
  const identificationProfileId = await identificationClient.create()
  return identificationProfileId
}

const generateOKResponse: Function = (): ProxyResult => {
  const response: ProxyResult = {
    statusCode: 200,
    body: 'registered',
  }

  return response
}

const register: Handler = async (event: APIGatewayEvent, _context: Context) => {
  const { body } = event
  const requestBody = JSON.parse(body!)

  const { name, id } = requestBody
  const identificationProfileId = await createIdentificationProfile()
  await registerUser(name, id, identificationProfileId)

  const response = generateOKResponse()
  return response
}

export { register }
