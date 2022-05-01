import { SlashCommandBuilder } from '@discordjs/builders'

import type { Command } from '../../types/commands'
import {
  handleDeleteLocationInteraction,
  handleGetLocationUsersInteraction,
  handleGetUserLocationInteraction,
  handleSetLocationAutocompleteInteraction,
  handleSetLocationInteraction,
} from './handlers/index.js'

const locationCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('location')
    .setDescription('Get or set locations for a user')
    .addSubcommandGroup((subcommandgroup) =>
      subcommandgroup
        .setName('get')
        .setDescription('Get data for a location or user')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('user')
            .setDescription("Gets a user's location")
            .addUserOption((option) =>
              option
                .setName('user')
                .setDescription(
                  "Which user's location to get (defaults to self)",
                ),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('location')
            .setDescription('Gets a list of users in a location')
            .addStringOption((option) =>
              option
                .setName('location')
                .setDescription('Region or state')
                .setRequired(true)
                .setAutocomplete(true),
            ),
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
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('delete').setDescription('Deletes your location'),
    ),
  async execute(interaction) {
    if (!interaction.inGuild())
      throw new Error('Command must be run in a guild.')

    if (interaction.options.getSubcommandGroup(false)) {
      switch (interaction.options.getSubcommandGroup()) {
        case 'get': {
          switch (interaction.options.getSubcommand()) {
            case 'location': {
              await handleGetLocationUsersInteraction(interaction)
              break
            }
            case 'user': {
              await handleGetUserLocationInteraction(interaction)
              break
            }
          }
        }
      }
    } else {
      switch (interaction.options.getSubcommand()) {
        case 'set': {
          await handleSetLocationInteraction(interaction)
          break
        }
        case 'delete': {
          await handleDeleteLocationInteraction(interaction)
          break
        }
      }
    }
  },
  async executeAutocomplete(interaction) {
    await handleSetLocationAutocompleteInteraction(interaction)
  },
}

export default locationCommand
