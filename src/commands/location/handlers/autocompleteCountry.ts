import {
  ApplicationCommandOptionChoice,
  AutocompleteInteraction,
} from 'discord.js'
import stateCountry from 'state-country'

function getCountryLocationAutocompleteOptions(searchValue: string) {
  const results = stateCountry.searchCountries(searchValue).slice(0, 25)

  return results.map(
    (result): ApplicationCommandOptionChoice => ({
      name: `${result.name}`,
      value: result.id,
    }),
  )
}

export default async function autocompleteCountry(
  interaction: AutocompleteInteraction,
) {
  await interaction.respond(
    getCountryLocationAutocompleteOptions(
      interaction.options.getString('country'),
    ),
  )
}
