import { Client } from 'discord.js'
import type { Collection } from 'discord.js'

import type { Command } from '../../types/commands'

export default class extends Client {
  commands: Collection<string, Command>
}
