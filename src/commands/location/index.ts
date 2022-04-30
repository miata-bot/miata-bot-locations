import { SlashCommandBuilder } from '@discordjs/builders'
import {
  ApplicationCommandOptionChoice,
  AutocompleteInteraction,
  CommandInteraction,
  User,
} from 'discord.js'
import { applicationDefault, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import stateCountry from 'state-country'

import type { Command } from '../../types/commands'
import { getStateById } from '../../utils/state-country/queries.js'

initializeApp({
  credential: applicationDefault(),
})

const db = getFirestore()

function getLocationAutocompleteOptions(searchValue: string) {
  const results = stateCountry.searchStates(searchValue).slice(0, 25)

  return results.map(
    (result): ApplicationCommandOptionChoice => ({
      name: `${result.name}, ${result.countryName}`,
      value: result.id,
    }),
  )
}

async function handleGetLocationInteraction(interaction: CommandInteraction) {
  const value = interaction.options.getUser('user')
  let user: User
  if (!value) user = interaction.user
  else user = value

  const userLocationRef = db.collection(interaction.guildId).doc(user.id)
  const userLocationDoc = await userLocationRef.get()
  if (!userLocationDoc.exists) {
    await interaction.reply({
      content: `${
        value ? "This user hasn't" : "You haven't"
      } added a location yet.`,
      ephemeral: true,
    })
  } else {
    const data = userLocationDoc.data()
    await interaction.reply({
      content: `${
        value ? `${user.username}#${user.discriminator} is` : 'You are'
      } located in ${data.name}, ${data.countryName}.`,
    })
  }
}

async function handleSetLocationAutocompleteInteraction(
  interaction: AutocompleteInteraction,
) {
  await interaction.respond(
    getLocationAutocompleteOptions(interaction.options.getString('location')),
  )
}

async function handleSetLocationInteraction(interaction: CommandInteraction) {
  // `value` is not guaranteed to be a valid autocomplete option
  const value = interaction.options.getString('location')
  const stateQueryResult = getStateById(value)

  if (stateQueryResult.length !== 1)
    await interaction.reply({
      content: 'Please pick a state/region from autocomplete.',
      ephemeral: true,
    })
  else {
    await db
      .collection(interaction.guildId)
      .doc(interaction.member.user.id)
      .set(stateQueryResult[0])
    await interaction.reply({
      content: `Your location has been set to ${stateQueryResult[0].name}, ${stateQueryResult[0].countryName}`,
    })
  }
}

const locationCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('location')
    .setDescription('Get or set locations for a user')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('get')
        .setDescription("Gets a user's location")
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription("Which user's location to get (defaults to self)"),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription('Sets your location')
        .addStringOption((option) =>
          option
            .setName('location')
            .setDescription('Region or state')
            .setRequired(true)
            .setAutocomplete(true),
        ),
    ),
  async execute(interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'get': {
        await handleGetLocationInteraction(interaction)
        break
      }
      case 'set': {
        await handleSetLocationInteraction(interaction)
        break
      }
    }
  },
  async executeAutocomplete(interaction) {
    await handleSetLocationAutocompleteInteraction(interaction)
  },
}

export default locationCommand
