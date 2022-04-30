import { CommandInteraction } from 'discord.js'

import { db } from '../../../utils/firebase/clients.js'

export default async function deleteLocation(interaction: CommandInteraction) {
  const userLocationRef = db
    .collection(interaction.guildId)
    .doc(interaction.user.id)
  const userLocationDoc = await userLocationRef.get()
  if (!userLocationDoc.exists) {
    await interaction.reply({
      content: "You haven't added a location yet.",
      ephemeral: true,
    })
  } else {
    await userLocationRef.delete()
    await interaction.reply({
      content: 'Your location has been deleted.',
      ephemeral: true,
    })
  }
}
