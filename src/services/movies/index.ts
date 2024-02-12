import api from '@/services/api'
import type { APIResponse } from '@/services/types'
import type { Movie, Video } from './types'

async function getMovies() {
  return await api.get<APIResponse<Movie[]>>('/discover/movie')
}

async function getTopRatedMovies() {
  return await api.get<APIResponse<Movie[]>>('/movie/top_rated?language=en-US')
}

async function getTrendingMovies() {
  return await api.get<APIResponse<Movie[]>>('/trending/movie/day?language=en-US')
}

async function getGenres() {
  return await api.get('/genre/movie/list?language=en-us')
}

async function getVideos(id: number) {
  return await api.get<APIResponse<Video[]>>(`/movie/${id}/videos?language=en-US`)
}

export default { getMovies, getTopRatedMovies, getTrendingMovies, getGenres, getVideos }
