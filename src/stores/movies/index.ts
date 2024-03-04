import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API } from '@/services'
import type { Movie, Genre, Video, Cast, Photo } from '@/services/movies/types'
import { BACKDROP_URL, POSTER_URL, DEFAULT_POSTER_URL, PROFILE_URL } from '@/constants/image'
import type { AxiosError } from 'axios'
import { handleApiError } from '@/composables/handleApiError'

export const useMovieStore = defineStore('movie', () => {
  const movies = ref<Movie[]>([])
  const movie = ref<Movie | null>(null)
  const popularMovies = ref<Movie[]>([])
  const trendingMovies = ref<Movie[]>([])
  const topRatedMovies = ref<Movie[]>([])
  const genres = ref<Genre[]>([])
  const video = ref<Video | null>(null)
  const casts = ref<Cast<Photo>[]>([])
  const photos = ref<Photo[]>([])
  const similarMovies = ref<Movie[]>([])

  async function getGenres(): Promise<void> {
    try {
      const { data } = await API.movies.getGenres()
      initGenres(data.genres)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  async function getMovies(): Promise<void> {
    try {
      const { data } = await API.movies.getMovies()
      movies.value = initMovies(data.results)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  async function getMovie(id: number): Promise<void> {
    try {
      const { data } = await API.movies.getMovie(id)
      movie.value = initMovie(data)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  async function getPopularMovies(): Promise<void> {
    try {
      const { data } = await API.movies.getPopularMovies()
      popularMovies.value = initMovies(data.results)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  async function getTopRatedMovies(): Promise<void> {
    try {
      await getGenres()
      const { data } = await API.movies.getTopRatedMovies()
      topRatedMovies.value = initMovies(data.results)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  async function getTrendingMovies(): Promise<void> {
    try {
      const { data } = await API.movies.getTrendingMovies()
      trendingMovies.value = initMovies(data.results)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  async function getVideos(id: number): Promise<void> {
    try {
      const { data } = await API.movies.getVideos(id)
      initVideo(data.results)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  async function getCasts(id: number): Promise<void> {
    try {
      const { data } = await API.movies.getCasts(id)
      casts.value = initCast(data.cast)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  async function getMoviePhotos(id: number): Promise<void> {
    try {
      const { data } = await API.movies.getMoviePhotos(id)
      photos.value = data.backdrops.map(({ file_path }: { file_path: string }) => {
        return {
          small: `${BACKDROP_URL.small}${file_path}`,
          original: `${BACKDROP_URL.original}${file_path}`
        }
      })
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  async function getSimilarMovies(id: number): Promise<void> {
    try {
      const { data } = await API.movies.getSimilarMovies(id)
      similarMovies.value = initMovies(data.results)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  function initGenres(data: Genre[]): void {
    genres.value = data
  }

  function initMovies(data: Movie[]): Movie[] {
    const results = data.map((item: Movie) => {
      return {
        id: item.id,
        title: item.title,
        overview: item.overview,
        release_date: item.release_date,
        vote_average: item.vote_average,
        poster_path: item.poster_path
          ? `${POSTER_URL.large}${item.poster_path}`
          : DEFAULT_POSTER_URL.large,
        backdrop_path: `${BACKDROP_URL.original}${item.backdrop_path}`,
        genre_ids: item.genre_ids
      }
    })

    return results
  }

  function initMovie(data: Movie): Movie {
    return {
      id: data.id,
      title: data.title,
      overview: data.overview,
      release_date: data.release_date,
      vote_average: data.vote_average,
      poster_path: data.poster_path
        ? `${POSTER_URL.large}${data.poster_path}`
        : DEFAULT_POSTER_URL.large,
      backdrop_path: `${BACKDROP_URL.original}${data.backdrop_path}`,
      genres: data.genres,
      runtime: data.runtime
    }
  }

  function initVideo(data: Video[]): void {
    const result = data
      .filter(
        (video: Video) =>
          video.site === 'YouTube' &&
          video.type === 'Trailer' &&
          video.name.includes('Trailer') &&
          !video.name.includes('Teaser')
      )
      .reverse()[0]

    if (!result) {
      video.value = null
      return
    }

    const { id, name, key, type, site } = result
    video.value = { id, name, key, type, site }
  }

  function initCast(data: Cast<Photo>[]): Cast<Photo>[] {
    const results = data.map((item: Cast<Photo>) => {
      return {
        id: item.id,
        name: item.name,
        character: item.character,
        profile_path: item.profile_path
          ? {
              medium: `${PROFILE_URL.medium}${item.profile_path}`,
              large: `${PROFILE_URL.large}${item.profile_path}`
            }
          : {
              medium: DEFAULT_POSTER_URL.medium,
              large: DEFAULT_POSTER_URL.large
            }
      }
    })

    return results
  }

  return {
    movies,
    movie,
    popularMovies,
    topRatedMovies,
    trendingMovies,
    genres,
    video,
    casts,
    photos,
    similarMovies,
    getGenres,
    getMovies,
    getMovie,
    getPopularMovies,
    getTopRatedMovies,
    getTrendingMovies,
    getVideos,
    getCasts,
    getMoviePhotos,
    getSimilarMovies
  }
})
