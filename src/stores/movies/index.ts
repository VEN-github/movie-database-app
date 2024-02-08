import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API } from '@/services'
import type { Movie, Genre, Video } from '@/services/movies/types'
import { BACKDROP_URL, POSTER_URL } from '@/constants/image'
import type { AxiosError } from 'axios'
import { handleApiError } from '@/composables/handleApiError'

export const useMovieStore = defineStore('movie', () => {
  const movies = ref<Movie[]>([])
  const trendingMovies = ref<Movie[]>([])
  const genres = ref<Genre[]>([])
  const video = ref<Video | null>(null)

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
      await getGenres()
      const { data } = await API.movies.getMovies()
      initMovies(data.results)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  async function getTrendingMovies(): Promise<void> {
    try {
      await getGenres()
      const { data } = await API.movies.getTrendingMovies()
      initTrendingMovies(data.results)
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

  function initGenres(data: Genre[]): void {
    genres.value = data
  }

  function initMovies(data: Movie[]): void {
    const results = data.map((item: Movie) => {
      return {
        id: item.id,
        title: item.title,
        overview: item.overview,
        release_date: item.release_date,
        vote_average: item.vote_average,
        poster_path: `${POSTER_URL.medium}${item.poster_path}`,
        backdrop_path: `${BACKDROP_URL.original}${item.backdrop_path}`,
        genre_ids: item.genre_ids
      }
    })

    movies.value = results
  }

  function initTrendingMovies(data: Movie[]): void {
    const results = data.map((item: Movie) => {
      return {
        id: item.id,
        title: item.title,
        overview: item.overview,
        release_date: item.release_date,
        vote_average: item.vote_average,
        poster_path: `${POSTER_URL.medium}${item.poster_path}`,
        backdrop_path: `${BACKDROP_URL.original}${item.backdrop_path}`,
        genre_ids: item.genre_ids
      }
    })

    trendingMovies.value = results
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

  return {
    movies,
    trendingMovies,
    genres,
    video,
    getGenres,
    getMovies,
    getTrendingMovies,
    getVideos
  }
})
