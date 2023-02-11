import { SlashCommandBuilder } from '@discordjs/builders';

const serverstatus = new SlashCommandBuilder()
    .setName('trackserver')
    .setDescription("Track a minecraft server's status")
    .addStringOption(option => option.setName('title')
        .setDescription('Title of tracker')
        .setRequired(true)
    )
    .addStringOption(option => option.setName('version')
        .setDescription('Java server or bedrock server')
        .setRequired(true)
        .addChoices(
            {name: 'Java', value : 'statusJava'}, {name : 'Bedrock', value : 'statusBedrock'}
        )
    )
    .addStringOption(option => option.setName('ip')
        .setDescription('Server Address')
        .setRequired(true)
    )
    .addIntegerOption(option => option.setName('port')
        .setDescription('Java Default : 25565, Bedrock Default : 19132')
        .setRequired(true)
    )
    .addBooleanOption(option => option.setName('details')
        .setDescription('Show details like debug info')
        .setRequired(true)
    )

export default serverstatus.toJSON();   
