export type APIResponse<T> = {
  success: boolean
  results: T
  status: number
}
