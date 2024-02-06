import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API } from '@/services'
import type { TV, Genre } from '@/services/tv/types'
import { BACKDROP_URL } from '@/constants/image'
import type { AxiosError } from 'axios'
import { handleApiError } from '@/composables/handleApiError'

export const useTVStore = defineStore('tv', () => {
  const trendingTVShows = ref<TV[]>([])
  const genres = ref<Genre[]>([])

  async function getGenres(): Promise<void> {
    try {
      const { data } = await API.tv.getGenres()
      initGenres(data.genres)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  async function getTrendingTVShows(): Promise<void> {
    try {
      await getGenres()
      const { data } = await API.tv.getTrendingTVShows()
      initTrendingTVShows(data.results)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  function initGenres(data: Genre[]): void {
    genres.value = data
  }

  function initTrendingTVShows(data: TV[]): void {
    const results = data.splice(0, 10).map((item: TV) => {
      return {
        id: item.id,
        name: item.name,
        overview: item.overview,
        first_air_date: item.first_air_date,
        vote_average: item.vote_average,
        poster_path: item.poster_path,
        backdrop_path: `${BACKDROP_URL.original}${item.backdrop_path}`,
        genre_ids: item.genre_ids
      }
    })

    trendingTVShows.value = results
  }

  return { trendingTVShows, genres, getGenres, getTrendingTVShows }
})
