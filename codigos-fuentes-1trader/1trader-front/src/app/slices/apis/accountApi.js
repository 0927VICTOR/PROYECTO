import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const pokemonApi = createApi({
    reducerPath: 'account',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
    endpoints: (builder) => ({
        getPokemonByName: builder.query < any > ({
            query: (name) => `pokemon/${name}`,
        }),
    }),
})

export const { useGetPokemonByNameQuery } = pokemonApi