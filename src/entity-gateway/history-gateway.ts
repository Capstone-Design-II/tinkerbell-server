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
    s3Key: string,
  ): Promise<void> {
    const status = `PENDING`
    const newHistory = Object.assign(new History, { uuid, status, s3Key })
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
