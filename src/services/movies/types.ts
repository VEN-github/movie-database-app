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
