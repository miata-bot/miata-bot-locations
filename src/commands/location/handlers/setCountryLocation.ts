import { CommandInteraction } from 'discord.js'

import { db } from '../../../utils/firebase/clients.js'
import { getCountryById } from '../../../utils/state-country/queries.js'

export default async function setCountryLocation(
  interaction: CommandInteraction,
) {
  // `value` is not guaranteed to be a valid autocomplete option
  const value = interaction.options.getString('country')
  const countryQueryResult = getCountryById(value)

  if (countryQueryResult.length !== 1)
    await interaction.reply({
      content: 'Please pick a country from autocomplete.',
      ephemeral: true,
    })
  else {
    await db
      .collection(interaction.guildId)
      .doc(interaction.member.user.id)
      .set({
        countryId: countryQueryResult[0].id,
        countryName: countryQueryResult[0].name,
      })
    await interaction.reply({
      content: `Your location has been set to ${countryQueryResult[0].name}.`,
      ephemeral: true,
    })
  }
}
