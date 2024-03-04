import api from '@/services/api'
import type { APIResponse } from '@/services/types'
import type { Movie, Video } from './types'

async function getMovies() {
  return await api.get<APIResponse<Movie[]>>('/discover/movie')
}

async function getMovie(id: number) {
  return await api.get<Movie>(`/movie/${id}?language=en-US`)
}

async function getPopularMovies() {
  return await api.get<APIResponse<Movie[]>>('/movie/popular?language=en-US')
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

async function getCasts(id: number) {
  return await api.get(`/movie/${id}/credits?language=en-US`)
}

export default {
  getMovies,
  getMovie,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
  getGenres,
  getVideos,
  getCasts
}
