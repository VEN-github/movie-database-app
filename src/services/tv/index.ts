import api from '@/services/api'
import type { APIResponse } from '@/services/types'
import type { TV, Video } from './types'

async function getTrendingTVShows() {
  return await api.get<APIResponse<TV[]>>('/trending/tv/day?language=en-US')
}

async function getGenres() {
  return await api.get('/genre/tv/list?language=en-us')
}

async function getVideos(id: number) {
  return await api.get<APIResponse<Video[]>>(`/tv/${id}/videos?language=en-US`)
}

export default { getTrendingTVShows, getGenres, getVideos }
