export type Movie = {
  readonly id: number
  title: string
  overview: string
  release_date: string
  vote_average: number
  poster_path: string
  backdrop_path: string
  genre_ids: number[]
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
