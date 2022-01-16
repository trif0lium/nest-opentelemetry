import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType()
export class Character {
  @Field()
  name: string

  @Field()
  vision: string

  @Field()
  weapon: string

  @Field()
  nation: string

  @Field()
  affiliation: string

  @Field(type => Int)
  rarity: number

  @Field()
  constellation: string

  @Field()
  birthday: string

  @Field()
  description: string
}
