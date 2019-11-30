import { AzureFunction, Context, HttpRequest } from '@azure/functions'

const register: AzureFunction = async (context: Context, _req: HttpRequest): Promise<void> => {
  context.res = {
    body: 'sample hanlder',
  }

  context.done()
}

export { register }
