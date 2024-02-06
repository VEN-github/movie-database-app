export type TV = {
  readonly id: number
  name: string
  overview: string
  first_air_date: string
  vote_average: number
  poster_path: string
  backdrop_path: string
  genre_ids: number[]
}

export type Genre = {
  readonly id: number
  name: string
}
