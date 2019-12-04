import {
  attribute,
  hashKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations'

@table('tinkerbell-history')
export class History {
  @hashKey()
  uuid!: string

  @attribute()
  participants?: Array<string>

  @attribute()
  s3key?: string

  @attribute()
  generatedNote?: string

  @attribute({ defaultProvider: () => new Date() })
  createdAt?: Date

  @attribute({ defaultProvider: () => new Date() })
  updatedAt?: Date
}
