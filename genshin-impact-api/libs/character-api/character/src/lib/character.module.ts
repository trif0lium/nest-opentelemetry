import { Module } from '@nestjs/common';
import { CharacterService } from './character-api-character.service';

@Module({
  controllers: [],
  providers: [CharacterService],
  exports: [CharacterService],
})
export class CharacterModule {}
