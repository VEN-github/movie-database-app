export type TV = {
  readonly id: number
  name: string
  overview: string
  first_air_date: string
  vote_average: number
  poster_path: string
  backdrop_path: string
  genre_ids?: number[]
  genres?: Genre[]
  episode_run_time?: number[]
}

export type Genre = {
  readonly id: number
  name: string
}

export type Video = {
  readonly id: string
  name: string
  key: string
  type: string
  site: string
}
