import { defineStore } from 'pinia'
import { API } from '@/services'
// import { type APIResponse } from '@/services/types'
import { type Movie } from '@/services/movies/types'

interface State {
  movies: Movie[]
}

export const useMovieStore = defineStore('movie', {
  state: (): State => {
    return {
      movies: []
    }
  },
  actions: {
    async getMovies(): Promise<void> {
      try {
        const { data } = await API.movies.getMovies()
        this.movies = data.results
        console.log(this.movies)
      } catch (error) {
        console.log(error)
      }
    }
  }
})
