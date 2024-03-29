import api from '@/services/api'
import type { APIResponse } from '@/services/types'
import type { TV, Video } from './types'

async function getTVShows(page: number) {
  return await api.get<APIResponse<TV[]>>(`/discover/tv?page=${page}`)
}

async function getTVShow(id: number) {
  return await api.get<TV>(`/tv/${id}?language=en-US`)
}

async function getPopularTVShows(page: number) {
  return await api.get<APIResponse<TV[]>>(`/tv/popular?language=en-US&page=${page}`)
}

async function getTopRatedTVShows(page: number) {
  return await api.get<APIResponse<TV[]>>(`/tv/top_rated?language=en-US&page=${page}`)
}

async function getTrendingTVShows() {
  return await api.get<APIResponse<TV[]>>('/trending/tv/day?language=en-US')
}

async function getGenres() {
  return await api.get('/genre/tv/list?language=en-us')
}

async function getVideos(id: number) {
  return await api.get<APIResponse<Video[]>>(`/tv/${id}/videos?language=en-US`)
}

async function getCasts(id: number) {
  return await api.get(`/tv/${id}/credits?language=en-US`)
}

async function getTVShowPhotos(id: number) {
  return await api.get(`/tv/${id}/images`)
}

async function getSimilarTVShows(id: number) {
  return await api.get<APIResponse<TV[]>>(`/tv/${id}/recommendations?language=en-US`)
}

export default {
  getTVShows,
  getTVShow,
  getPopularTVShows,
  getTopRatedTVShows,
  getTrendingTVShows,
  getGenres,
  getVideos,
  getCasts,
  getTVShowPhotos,
  getSimilarTVShows
}
