import {
  attribute,
  hashKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations'

@table('tinkerbell-histories')
export class History {
  @hashKey()
  uuid!: string

  @attribute()
  participants?: Array<string>

  @attribute()
  s3key?: string

  @attribute()
  note?: string

  @attribute({ defaultProvider: () => new Date() })
  createdAt?: Date

  @attribute({ defaultProvider: () => new Date() })
  updatedAt?: Date
}
