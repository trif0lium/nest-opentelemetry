import { Test } from '@nestjs/testing';
import { CharacterApiCharacterService } from './character-api-character.service';

describe('CharacterApiCharacterService', () => {
  let service: CharacterApiCharacterService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CharacterApiCharacterService],
    }).compile();

    service = module.get(CharacterApiCharacterService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
