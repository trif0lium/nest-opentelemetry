import { Module } from '@nestjs/common';
import { CharacterApiCharacterService } from './character-api-character.service';

@Module({
  controllers: [],
  providers: [CharacterApiCharacterService],
  exports: [CharacterApiCharacterService],
})
export class CharacterApiCharacterModule {}
