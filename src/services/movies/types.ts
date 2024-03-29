export type Movie = {
  readonly id: number
  title: string
  overview: string
  release_date: string
  vote_average: number
  poster_path: string
  backdrop_path: Photo
  genre_ids?: number[]
  genres?: Genre[]
  runtime?: number
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

export type Cast<T> = {
  readonly id: string
  name: string
  character: string
  profile_path: T
}

export type Photo = {
  small?: string
  medium?: string
  large?: string
  original?: string
}
