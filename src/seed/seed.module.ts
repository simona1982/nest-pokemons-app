import { Module } from '@nestjs/common';
import { SeedService } from './seed.service.js';
import { SeedController } from './seed.controller.js';
import { HttpClientModule } from '@nestjs/http-client';
import { PokemonModule } from '../pokemon/pokemon.module.js';

@Module({
  imports: [
    HttpClientModule.register({
      baseUrl: 'https://pokeapi.co/api/v2',
      timeout: '5s',
    }),
    PokemonModule
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule { }
