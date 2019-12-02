import { APIGatewayEvent, ProxyResult, Handler, Context } from 'aws-lambda'
import { UserGateway } from '../entity-gateway/user-gateway'
import { AzureIdentificationProfile } from '../azure/identification-profile'

const registerUser: Function = async (name: string, id: string): Promise<void> => {
  const userTable = new UserGateway()
  await userTable.putUser(name, id)
}

const createIdentificationProfile: Function = async (): Promise<string> => {
  const identificationClient = new AzureIdentificationProfile()
  const identificationProfileId = await identificationClient.create()
  return identificationProfileId
}

const generateOKResponse: Function = (): ProxyResult => {
  const response: ProxyResult = {
    statusCode: 200,
    body: '',
  }

  return response
}

const register: Handler = async (event: APIGatewayEvent, _context: Context) => {
  const { body } = event
  const requestBody = JSON.parse(body!)

  const { name } = requestBody
  const identificationProfileId = await createIdentificationProfile()
  await registerUser(name, identificationProfileId) 

  const response = generateOKResponse()
  return response
}

export { register }
