import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API } from '@/services'
import type { TV, Genre, Video } from '@/services/tv/types'
import { BACKDROP_URL, POSTER_URL } from '@/constants/image'
import type { AxiosError } from 'axios'
import { handleApiError } from '@/composables/handleApiError'

export const useTVStore = defineStore('tv', () => {
  const trendingTVShows = ref<TV[]>([])
  const genres = ref<Genre[]>([])
  const video = ref<Video | null>(null)

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

  async function getVideos(id: number): Promise<void> {
    try {
      const { data } = await API.tv.getVideos(id)
      initVideo(data.results)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  function initGenres(data: Genre[]): void {
    genres.value = data
  }

  function initTrendingTVShows(data: TV[]): void {
    const results = data.map((item: TV) => {
      return {
        id: item.id,
        name: item.name,
        overview: item.overview,
        first_air_date: item.first_air_date,
        vote_average: item.vote_average,
        poster_path: `${POSTER_URL.medium}${item.poster_path}`,
        backdrop_path: `${BACKDROP_URL.original}${item.backdrop_path}`,
        genre_ids: item.genre_ids
      }
    })

    trendingTVShows.value = results
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

  return { trendingTVShows, genres, video, getGenres, getTrendingTVShows, getVideos }
})
