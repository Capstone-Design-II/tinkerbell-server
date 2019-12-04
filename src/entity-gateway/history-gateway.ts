import { DataMapper } from '@aws/dynamodb-data-mapper'
import { DynamoDB } from 'aws-sdk'
import { History } from '../entity/history'

export class HistoryGateway {
  private _mapper: DataMapper

  constructor() {
    this._mapper = new DataMapper({
      client: new DynamoDB(),
    })
  }

  public async putHistory(
    uuid: string,
  ): Promise<void> {
    const newHistory = Object.assign(new History, { uuid })
    await this._mapper.put(newHistory)
  }

  public async updateParticipants(
    uuid: string,
    participants: string[],
  ): Promise<void> {
    const history = await this._mapper.get(Object.assign(
      new History,
      { uuid }
    ))
    history.participants = participants
    history.updatedAt = new Date()
    await this._mapper.update(history)
  }

  public async updateS3key(
    uuid: string,
    s3key: string,
  ): Promise<void> {
    const history = await this._mapper.get(Object.assign(
      new History,
      { uuid }
    ))
    history.s3key = s3key
    history.updatedAt = new Date()
    await this._mapper.update(history)
  }

  public async updateNote(
    uuid: string,
    note: string,
  ): Promise<void> {
    const history = await this._mapper.get(Object.assign(
      new History,
      { uuid }
    ))
    history.generatedNote = note
    history.updatedAt = new Date()
    await this._mapper.update(history)
  }

  public async getHistory(
    uuid: string,
  ): Promise<History> {
    const history = await this._mapper.get(Object.assign(
      new History,
      { uuid }
    ))
    return history
  }
}
