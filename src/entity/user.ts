import {
  attribute,
  hashKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations'

@table('tinkerbell-users')
export class User {
  @hashKey()
  identificationProfileId!: string

  @attribute()
  name!: string

  @attribute()
  id!: string

  @attribute({ defaultProvider: () => new Date() })
  createdAt?: Date
}
