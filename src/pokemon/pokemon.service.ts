

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto.js';
import { UpdatePokemonDto } from './dto/update-pokemon.dto.js';
import { Pokemon } from './entities/pokemon.entity.js';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')!;
    // console.log(defaultLimit)
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    const createdPokemon = await this.pokemonModel.create(createPokemonDto);
    return createdPokemon;

  }

  findAll(paginationDto: PaginationDto) {

    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokemonModel.find().limit(limit).skip(offset).sort({ no: 1 }).select("-__v");
  }

  async findOne(term: string) {

    let pokemon: Pokemon | null = null;

    // es un numero
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: Number(term) });
    }

    // MongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // Nombre de pokemon
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
    }

    //No fue encontrado
    if (!pokemon) throw new NotFoundException(`Pokemon with id, no or name ${term} not found`)

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);

    if (updatePokemonDto?.name) updatePokemonDto.name = updatePokemonDto?.name.toLowerCase().trim();

    await pokemon.updateOne(updatePokemonDto, { new: true });

    return { ...pokemon.toJSON(), ...updatePokemonDto };

  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // const result = await this.pokemonModel.findByIdAndDelete(id);
    // await pokemon.deleteOne();

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with Id ${id} not found`)
    }


    return;
  }
}
