import { SlashCommandBuilder } from '@discordjs/builders'

import type { Command } from '../../types/commands'
import {
  handleCountryAutocompleteInteraction,
  handleDeleteLocationInteraction,
  handleGetLocationUsersInteraction,
  handleGetUserLocationInteraction,
  handleRegionAutocompleteInteraction,
  handleSetCountryLocationInteraction,
  handleSetRegionLocationInteraction,
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
            .setDescription(
              'Gets a list of users in a location (selecting a region will supersede a country selection)',
            )
            .addStringOption((option) =>
              option
                .setName('region')
                .setDescription('Region or state')
                .setRequired(false)
                .setAutocomplete(true),
            )
            .addStringOption((option) =>
              option
                .setName('country')
                .setDescription('Country')
                .setRequired(false)
                .setAutocomplete(true),
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription(
          'Sets your location (selecting a region will supersede a country selection)',
        )
        .addStringOption((option) =>
          option
            .setName('region')
            .setDescription('Region or state')
            .setRequired(false)
            .setAutocomplete(true),
        )
        .addStringOption((option) =>
          option
            .setName('country')
            .setDescription('Country')
            .setRequired(false)
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
              if (
                interaction.options.getString('region') ||
                interaction.options.getString('country')
              ) {
                await handleGetLocationUsersInteraction(interaction)
              } else {
                await interaction.reply({
                  content: 'Please specify a country or region.',
                  ephemeral: true,
                })
              }
              break
            }
            case 'user': {
              await handleGetUserLocationInteraction(interaction)
              break
            }
          }
          break
        }
      }
    } else {
      switch (interaction.options.getSubcommand()) {
        case 'set': {
          if (interaction.options.getString('region')) {
            await handleSetRegionLocationInteraction(interaction)
          } else if (interaction.options.getString('country')) {
            await handleSetCountryLocationInteraction(interaction)
          } else {
            await interaction.reply({
              content: 'Please specify a country or region.',
              ephemeral: true,
            })
          }
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
    if (interaction.options.getSubcommandGroup(false)) {
      switch (interaction.options.getSubcommandGroup()) {
        case 'get': {
          switch (interaction.options.getSubcommand()) {
            case 'location': {
              switch (interaction.options.getFocused(true).name) {
                case 'region': {
                  await handleRegionAutocompleteInteraction(interaction)
                  break
                }
                case 'country': {
                  await handleCountryAutocompleteInteraction(interaction)
                  break
                }
              }
              break
            }
          }
          break
        }
      }
    } else {
      switch (interaction.options.getSubcommand()) {
        case 'set': {
          switch (interaction.options.getFocused(true).name) {
            case 'region': {
              await handleRegionAutocompleteInteraction(interaction)
              break
            }
            case 'country': {
              await handleCountryAutocompleteInteraction(interaction)
              break
            }
          }
          break
        }
      }
    }
  },
}

export default locationCommand
