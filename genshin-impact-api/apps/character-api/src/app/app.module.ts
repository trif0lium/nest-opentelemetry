import { Module } from '@nestjs/common';
import { TracingModule } from '@genshin-impact-api/tracing'
import { CharacterModule } from '@genshin-impact-api/character-api/character'

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLFederationModule } from '@nestjs/graphql';

@Module({
  imports: [
    TracingModule.register({
      serviceName: "character-api"
    }),
    GraphQLFederationModule.forRoot({
      autoSchemaFile: true
    }),
    CharacterModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
