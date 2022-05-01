import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

import location from './commands/location/index.js'

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN)

const commands = [location.data.toJSON()]

if (process.env.NODE_ENV !== 'production') {
  console.log(
    `Registering application guild commands for ${process.env.DEVELOPMENT_GUILD_ID}:`,
  )

  commands.forEach((command) => {
    rest
      .post(
        Routes.applicationGuildCommands(
          process.env.APPLICATION_ID,
          process.env.DEVELOPMENT_GUILD_ID,
        ),
        { body: command },
      )
      .then(() =>
        console.log(
          `Successfully registered application guild command "${command.name}".`,
        ),
      )
      .catch(console.error)
  })
} else {
  console.log(
    `Registering application commands for application ${process.env.APPLICATION_ID}:`,
  )

  commands.forEach((command) => {
    rest
      .post(Routes.applicationCommands(process.env.APPLICATION_ID), {
        body: command,
      })
      .then(() =>
        console.log(
          `Successfully registered application command "${command.name}".`,
        ),
      )
      .catch(console.error)
  })
}
