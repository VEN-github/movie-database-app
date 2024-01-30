import api from '@/services/api'
import type { APIResponse } from '@/services/types'
import type { Movie } from './types'

async function getMovies() {
  return await api.get<APIResponse<Movie[]>>('/discover/movie')
}

export default { getMovies }
