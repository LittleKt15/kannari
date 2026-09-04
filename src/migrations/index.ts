import * as migration_20260904_070515_initial from './20260904_070515_initial'
import * as migration_20260904_073410_media_prefix from './20260904_073410_media_prefix'

export const migrations = [
  {
    up: migration_20260904_070515_initial.up,
    down: migration_20260904_070515_initial.down,
    name: '20260904_070515_initial',
  },
  {
    up: migration_20260904_073410_media_prefix.up,
    down: migration_20260904_073410_media_prefix.down,
    name: '20260904_073410_media_prefix',
  },
]
