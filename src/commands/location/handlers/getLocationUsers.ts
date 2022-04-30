import { CommandInteraction } from 'discord.js'

import { db } from '../../../utils/firebase/clients.js'
import { getStateById } from '../../../utils/state-country/queries.js'

export default async function getLocationUsers(
  interaction: CommandInteraction,
) {
  // `value` is not guaranteed to be a valid autocomplete option
  const value = interaction.options.getString('location')
  const stateQueryResult = getStateById(value)

  if (stateQueryResult.length !== 1)
    await interaction.reply({
      content: 'Please pick a state/region from autocomplete.',
      ephemeral: true,
    })
  else {
    await interaction.deferReply({ ephemeral: true })

    const stateData = stateQueryResult[0]
    const ref = db.collection(interaction.guildId)
    const query = ref.where('id', '==', stateData.id)
    const queryData = await query.get()

    if (queryData.empty) {
      await interaction.reply({
        content: `There are no users in ${stateData.name}, ${stateData.countryName}.`,
        ephemeral: true,
      })
    } else {
      await interaction.reply({
        content: `There ${queryData.size === 1 ? 'is' : 'are'} ${
          queryData.size
        } user${queryData.size > 1 ? 's' : ''} in ${stateData.name}, ${
          stateData.countryName
        }.`,
        ephemeral: true,
      })
    }
  }
}
