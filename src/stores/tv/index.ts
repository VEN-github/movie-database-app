import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API } from '@/services'
import type { TV, Genre, Video, Cast, Photo } from '@/services/tv/types'
import { BACKDROP_URL, POSTER_URL, DEFAULT_POSTER_URL, PROFILE_URL } from '@/constants/image'
import type { AxiosError } from 'axios'
import { handleApiError } from '@/composables/handleApiError'

export const useTVStore = defineStore('tv', () => {
  const tvShows = ref<TV[]>([])
  const tvShow = ref<TV | null>(null)
  const popularTVShows = ref<TV[]>([])
  const topRatedTVShows = ref<TV[]>([])
  const trendingTVShows = ref<TV[]>([])
  const genres = ref<Genre[]>([])
  const video = ref<Video | null>(null)
  const casts = ref<Cast<Photo>[]>([])
  const photos = ref<Photo[]>([])
  const similarTVShows = ref<TV[]>([])

  async function getGenres(): Promise<void> {
    try {
      const { data } = await API.tv.getGenres()
      initGenres(data.genres)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  async function getTVShows(page: number): Promise<void> {
    try {
      const { data } = await API.tv.getTVShows(page)
      tvShows.value = initTVShows(data.results)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  async function getTVShow(id: number): Promise<void> {
    try {
      const { data } = await API.tv.getTVShow(id)
      tvShow.value = initTVShow(data)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  async function getPopularTVShows(page: number): Promise<void> {
    try {
      const { data } = await API.tv.getPopularTVShows(page)
      popularTVShows.value = initTVShows(data.results)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  async function getTopRatedTVShows(page: number): Promise<void> {
    try {
      await getGenres()
      const { data } = await API.tv.getTopRatedTVShows(page)
      topRatedTVShows.value = initTVShows(data.results)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  async function getTrendingTVShows(): Promise<void> {
    try {
      const { data } = await API.tv.getTrendingTVShows()
      trendingTVShows.value = initTVShows(data.results)
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

  async function getCasts(id: number): Promise<void> {
    try {
      const { data } = await API.tv.getCasts(id)
      casts.value = initCast(data.cast)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  async function getTVShowPhotos(id: number): Promise<void> {
    try {
      const { data } = await API.tv.getTVShowPhotos(id)
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

  async function getSimilarTVShows(id: number): Promise<void> {
    try {
      const { data } = await API.tv.getSimilarTVShows(id)
      similarTVShows.value = initTVShows(data.results)
    } catch (error) {
      const _error = error as AxiosError<string>
      handleApiError(_error.response?.status)
    }
  }

  function initGenres(data: Genre[]): void {
    genres.value = data
  }

  function initTVShows(data: TV[]): TV[] {
    const results = data.map((item: TV) => {
      return {
        id: item.id,
        name: item.name,
        overview: item.overview,
        first_air_date: item.first_air_date,
        vote_average: item.vote_average,
        poster_path: item.poster_path
          ? `${POSTER_URL.large}${item.poster_path}`
          : DEFAULT_POSTER_URL.large,
        backdrop_path: {
          small: `${BACKDROP_URL.small}${item.backdrop_path}`,
          medium: `${BACKDROP_URL.medium}${item.backdrop_path}`,
          large: `${BACKDROP_URL.large}${item.backdrop_path}`,
          original: `${BACKDROP_URL.original}${item.backdrop_path}`
        },
        genre_ids: item.genre_ids
      }
    })

    return results
  }

  function initTVShow(data: TV): TV {
    return {
      id: data.id,
      name: data.name,
      overview: data.overview,
      first_air_date: data.first_air_date,
      vote_average: data.vote_average,
      poster_path: data.poster_path
        ? `${POSTER_URL.large}${data.poster_path}`
        : DEFAULT_POSTER_URL.large,
      backdrop_path: {
        small: `${BACKDROP_URL.small}${data.backdrop_path}`,
        medium: `${BACKDROP_URL.medium}${data.backdrop_path}`,
        large: `${BACKDROP_URL.large}${data.backdrop_path}`,
        original: `${BACKDROP_URL.original}${data.backdrop_path}`
      },
      genres: data.genres,
      episode_run_time: data.episode_run_time
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
    tvShows,
    tvShow,
    popularTVShows,
    topRatedTVShows,
    trendingTVShows,
    genres,
    video,
    casts,
    photos,
    similarTVShows,
    getGenres,
    getTVShows,
    getTVShow,
    getPopularTVShows,
    getTopRatedTVShows,
    getTrendingTVShows,
    getVideos,
    getCasts,
    getTVShowPhotos,
    getSimilarTVShows
  }
})
