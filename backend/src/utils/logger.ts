export const logger = {
  info: (message: string, details?: unknown) => console.info(JSON.stringify({ level: 'info', message, details, at: new Date().toISOString() })),
  error: (message: string, details?: unknown) => console.error(JSON.stringify({ level: 'error', message, details, at: new Date().toISOString() })),
}