import type {
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from '@discordjs/builders'
import type { AutocompleteInteraction, CommandInteraction } from 'discord.js'

export interface Command {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder
  execute: (interaction: CommandInteraction) => Promise<void>
  executeAutocomplete?: (interaction: AutocompleteInteraction) => Promise<void>
}
