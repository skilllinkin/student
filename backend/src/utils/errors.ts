export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message)
    this.name = 'AppError'
  }
}

export const notFound = (message = 'Resource not found') => new AppError(404, message)
export const forbidden = (message = 'You do not have access to this resource') => new AppError(403, message)
export const badRequest = (message: string) => new AppError(400, message)