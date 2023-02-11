import { SlashCommandBuilder } from '@discordjs/builders';
const pingCommand = new SlashCommandBuilder().setName('ping').setDescription('Check if this interaction is responsive');
export default pingCommand.toJSON();