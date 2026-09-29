import { app } from './app'
import { env } from './config/env'
import { db } from './config/db'
import { logger } from './utils/logger'

const server = app.listen(env.PORT, () => logger.info(`API listening on port ${env.PORT}`))

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => server.close(async () => {
    await db.$disconnect()
    process.exit(0)
  }))
}