export class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
    this.hasError = true
  }
}

export const errorHandle = (errorCode, err, res) => {
  const statusCode = errorCode || 500
  const message = (err.message ? err.message : err) || 'Something went wrong'
  return {
    hasError: true,
    statusCode,
    message,
  }
}
