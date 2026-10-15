import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { PokemonModule } from './pokemon/pokemon.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedModule } from './seed/seed.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration.js';
import { EnvConfig, validate } from './config/configuration.validation.js'


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      load: [configuration]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(import.meta.dirname, '..', 'public'),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<EnvConfig>) => ({
        uri: configService.get<string>('MONGO_DB'),
        dbName: 'pokemonsdb'
      })
    }),
    PokemonModule,
    // MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'),
    SeedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    // get an environment variable
    // console.log(this.configService.get<string>('MONGO_DB'));
  }
}
