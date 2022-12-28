import { Injectable } from '@nestjs/common';
import { UserTeamQueries } from './user-team.queries';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { PokemonData } from '../models/Pokemon.model';

@Resolver()
export class UserTeamResolver {
  constructor(private readonly userTeamQueries: UserTeamQueries) {}

  @Query()
  //TODO AUTHENTICATION
  async getTeamFromUserID(
    @Args('user_id') user_id: number,
  ): Promise<PokemonData[]> {
    const pokemonsTeam = await this.userTeamQueries.getTeam(user_id);
    return pokemonsTeam;
  }
}
