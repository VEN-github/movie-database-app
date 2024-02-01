import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API } from '@/services'
import type { Movie } from '@/services/movies/types'
import type { AxiosError } from 'axios'
import { handleApiError } from '@/composables/handleApiError'

export const useMovieStore = defineStore('movie', () => {
  const movies = ref<Movie[]>([])

  async function getMovies(): Promise<void> {
    try {
      const { data } = await API.movies.getMovies()
      initMovies(data.results)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  function initMovies(data: Movie[]): void {
    const results = data.map((item: Movie) => {
      return {
        id: item.id,
        title: item.title,
        overview: item.overview,
        release_date: item.release_date,
        vote_average: item.vote_average,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        genre_ids: item.genre_ids
      }
    })

    movies.value = results
  }

  return { movies, getMovies }
})
