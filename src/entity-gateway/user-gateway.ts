import { DataMapper } from '@aws/dynamodb-data-mapper'
import { DynamoDB } from 'aws-sdk'
import { User } from '../entity/user'

export class UserGateway {
  private _mapper: DataMapper

  constructor() {
    this._mapper = new DataMapper({
      client: new DynamoDB(),
    })
  }

  public async putUser(
    name: string,
    id: string,
    password: string,
    identificationProfileId: string
  ): Promise<void> {
    const newUser = Object.assign(new User, {
      name,
      id,
      password,
      identificationProfileId
    })

    await this._mapper.put(newUser)
  }
}
