import {
  ApplicationCommandOptionChoice,
  AutocompleteInteraction,
} from 'discord.js'
import stateCountry from 'state-country'

function getLocationAutocompleteOptions(searchValue: string) {
  const results = stateCountry.searchStates(searchValue).slice(0, 25)

  return results.map(
    (result): ApplicationCommandOptionChoice => ({
      name: `${result.name}, ${result.countryName}`,
      value: result.id,
    }),
  )
}

export default async function setLocationAutocomplete(
  interaction: AutocompleteInteraction,
) {
  await interaction.respond(
    getLocationAutocompleteOptions(interaction.options.getString('location')),
  )
}
