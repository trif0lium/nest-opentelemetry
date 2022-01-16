import { Injectable } from '@nestjs/common';
import { Span } from '@genshin-impact-api/tracing'
import { Character } from '@genshin-impact-api/model';

@Injectable()
export class CharacterService {
  @Span()
  getCharacters(): Character[] {
    return []
  }
}
