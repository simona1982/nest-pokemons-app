import { Injectable } from '@nestjs/common';
import { HttpClient } from '@nestjs/http-client';
import { PokemonResponse } from './interfaces/pokemon-response.interface.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from '../pokemon/entities/pokemon.entity.js';


@Injectable()
export class SeedService {

  constructor(
    private readonly http: HttpClient,
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }


  async executeSeed() {

    await this.pokemonModel.deleteMany({}); // delete * from pokemons

    const { data } = await this.http.get<PokemonResponse>('/pokemon?limit=650');

    const insertPromisesArray: Promise<Pokemon>[] = [];
    // console.log(data.results);

    data.results.forEach(({ name, url }) => {
      const no = Number(url.split('/').at(-2));

      insertPromisesArray.push(
        this.pokemonModel.create({ no: no, name: name })
      );

      // const createdPokemon = await this.pokemonModel.create({ no: no, name: name });

      // console.log({ no: no, name: name })
    });

    const newArray = await Promise.all(insertPromisesArray);

    return 'Seed executed';
  }

}
