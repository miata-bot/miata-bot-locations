import { CommandInteraction } from 'discord.js'

import { db } from '../../../utils/firebase/clients.js'
import { getStateById } from '../../../utils/state-country/queries.js'

export default async function setLocation(interaction: CommandInteraction) {
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
      content: `Your location has been set to ${stateQueryResult[0].name}, ${stateQueryResult[0].countryName}.`,
    })
  }
}
