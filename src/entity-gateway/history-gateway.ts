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
    const status = `PENDING`
    const newHistory = Object.assign(new History, { uuid, status })
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
    history.note = note
    history.updatedAt = new Date()
    await this._mapper.update(history)
  }

  public async updateStatus(
    uuid: string,
    status: string,
  ): Promise<void> {
    const history = await this._mapper.get(Object.assign(
      new History,
      { uuid }
    ))
    history.status = status
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

  public async getHistoryList(): Promise<History[]> {
    let historyList =[]
    for await (const history of this._mapper.scan(History)) {
      historyList.push(history)
    }

    return historyList
  }
}
