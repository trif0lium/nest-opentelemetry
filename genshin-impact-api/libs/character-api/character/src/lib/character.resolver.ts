import { Resolver, Query } from '@nestjs/graphql'
import { Character } from '@genshin-impact-api/model'

@Resolver(() => Character)
export class CharacterResolver {
  @Query(() => [Character])
  characters(): Character[] {
    return []
  }
}
