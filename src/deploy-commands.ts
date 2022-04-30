import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'

import location from './commands/location/index.js'

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN)

const commands = [location.data.toJSON()]

if (process.env.NODE_ENV !== 'production') {
  rest
    .put(
      Routes.applicationGuildCommands(
        process.env.APPLICATION_ID,
        process.env.DEVELOPMENT_GUILD_ID,
      ),
      { body: commands },
    )
    .then(() =>
      console.log('Successfully registered guild application commands.'),
    )
    .catch(console.error)
}
