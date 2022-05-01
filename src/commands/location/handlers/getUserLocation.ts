import { CommandInteraction } from 'discord.js'

import { db } from '../../../utils/firebase/clients.js'

export default async function getUserLocation(interaction: CommandInteraction) {
  const value = interaction.options.getUser('user')

  let userId
  if (!value) userId = interaction.user.id
  else userId = value.id
  const user = await interaction.client.users.fetch(userId)

  if (user.bot) {
    await interaction.reply({
      content: `${user} is inside your walls.`,
      ephemeral: true,
    })
  } else {
    const userLocationRef = db.collection(interaction.guildId).doc(userId)
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
        content: `${value ? `${user} is` : 'You are'} located in ${
          data.name
        }, ${data.countryName}.`,
        ephemeral: true,
      })
    }
  }
}
