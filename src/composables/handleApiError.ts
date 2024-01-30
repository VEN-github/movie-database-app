export function handleApiError(status: number | undefined): void {
  if (status && status === 401) {
    throw new Error('Invalid email address or password.')
  } else {
    throw new Error('Something went wrong. Please try again.')
  }
}
