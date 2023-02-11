import { config } from 'dotenv';
import { Client, GatewayIntentBits, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, EmbedBuilder } from 'discord.js';
import { REST } from '@discordjs/rest';
import google from 'googlethis';
import mc from "minecraft-server-status-simple";
import pingCommand from './commands/ping.js';
import serverstatus from './commands/mcserver.js';
const delay = ms => new Promise(res => setTimeout(res, ms));


config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;


client.on('ready', () => { console.log(`${client.user.tag}` + ' has logged in'); })


async function main() {
  const commands = [pingCommand, serverstatus];
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands, });


    client.login(process.env.BOT_TOKEN);
  } catch (err) { console.log(err); }
}


main();


client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  //-------------------------------------------
  if (interaction.commandName === 'ping') {
    /*await interaction.reply({
        content: `🏓Latency is ${Math.round(client.ws.ping)}ms`,

    });*/
    await interaction.reply(`🏓Latency is ${Math.round(client.ws.ping)}ms`)

  }
  //-------------------------------------------

  //-------------------------------------------
  if (interaction.commandName === 'imagesearch') {
    try {
      if (!interaction.options.getBoolean('safe') && !interaction.channel.nsfw) { interaction.reply('Safe Mode cannot be disabled on sfw channels'); return; }
      const images = await google.image(interaction.options.get('content').value, { safe: interaction.options.getBoolean('safe') });
      const m = Math.floor(Math.random() * images.length) + 1;
      const image = images[m].url
      if (!(image === '')) { await interaction.reply(image) } else { await interaction.reply('No image found') };
      console.log(images.length)
      console.log(m)

    } catch (error) {
      { await interaction.reply('❌' + error) };
      console.log(error)
    }

  }
  //-------------------------------------------

  //-------------------------------------------
  if (interaction.commandName === 'trackserver') {
    await interaction.deferReply();
    var a;

    var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
    const regexExpPort = /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/gi;
    const opt = interaction.options;
    const ip = opt.getString('ip')
    const port = opt.getInteger('port')
    const title = opt.getString('title')
    const details = opt.getBoolean('details')
    const version = opt.getString('version')
    const validurl = urlPattern.test(ip);
    const validport = regexExpPort.test(port);

    console.log(validurl)
    console.log(validport)

    if (validurl && validport) {
      await mc[version]({ ip: ip, port: port })
        .then((res) => {
          a = res

        }).catch((err) => console.log(err));
      console.log(a)
      try {
        var exampleEmbed = new EmbedBuilder()
          .setColor(Math.floor(Math.random() * 16777215).toString(16))
          .setTitle(title)
          .setURL('https://mcsrvstat.us/server/' + ip + ':' + port.toString())
          /*.setAuthor({ name:'Minecraft Server', iconURL: 'https://cdn.discordapp.com/attachments/1073639175456313415/1073639190283157594/minecraft_logo_icon_168974.png'})*/
          .setDescription(a.motd.clean.toString())
          .addFields({ name: 'Server is online', "value": "\u200B", })
          .setTimestamp()
          .setFooter({ text: 'Last Update: ' });
        if (details) {
          exampleEmbed.addFields(
            {
              name: 'Details', "value": 'IP Address: ' + a.ip + ':' + a.port + '\n' + 'Players: ' + a.players.online + '\n' + 'Version: ' + a.version
            }
          )
        }


        await interaction.editReply({ embeds: [exampleEmbed] });
        const msg = await interaction.fetchReply();


        var x = 0;
        while (true) {

          try {
            await delay(60000)
            x = x + 1
            console.log(x)
            await mc[version]({ ip: ip, port: port })
              .then((res) => {
                a = res

              }).catch((err) => console.log(err));
            var exampleEmbed = new EmbedBuilder()
              .setColor(Math.floor(Math.random() * 16777215).toString(16))
              .setTitle(title)
              .setURL('https://mcsrvstat.us/server/' + ip + ':' + port.toString())
              /*.setAuthor({ name:'Minecraft Server', iconURL: 'https://cdn.discordapp.com/attachments/1073639175456313415/1073639190283157594/minecraft_logo_icon_168974.png'})*/
              .setDescription(a.motd.clean.toString())
              .addFields({ name: 'Server is online', "value": "\u200B", })
              .setTimestamp()
              .setFooter({ text: 'Last Update: ' });
            if (details) {
              exampleEmbed.addFields(
                {
                  name: 'Details', "value": 'IP Address: ' + a.ip + ':' + a.port + '\n' + 'Players: ' + a.players.online + '\n' + 'Version: ' + a.version
                }
              )
            }
            await msg.edit({ embeds: [exampleEmbed] });
          }
          catch (updaterror) {
            if (updaterror.code = 10008) break;
            var offlineEmbed = new EmbedBuilder()
              .setColor(0xff4336)
              .setTitle(title)
              .setURL('https://mcsrvstat.us/server/' + ip + ':' + port.toString())
              .addFields({ name: 'Server is offline', "value": "\u200B", })
              .setTimestamp()
              .setFooter({ text: 'Last Update: ' });
            await msg.edit({ embeds: [offlineEmbed] });

          }
        }

      } catch (embederror) { /*console.log(embederror),*/ await interaction.editReply('Could not get response from server. Please make sure that server is online and try again.') }
    } else {
      var message;
      if (!validurl) { message = 'Error : Invalid Address' }
      if (!validport) { message = 'Error : Invalid Port' }
      if (!validport && !validurl) { message = 'Error : Invalid Port & Address' }
      await interaction.editReply(message)
    }
  }
  //-------------------------------------------
});
































/*{
    name: 'ping1',
    description: 'Replies with Pong!',
  },
  {
      name: 'imagesearch',
      description: 'Searches for image',
      options: [
          {
          name: 'content',
          description: 'What you want to search for',
          type : 3,
          required : true
          },
          {
              name: 'safemode',
              description: 'If true, will not show nsfw images',
              type : 5,
              required : true
          }
  ],
  },
  {
      name: 'serverstatus',
      description: "Get a minecraft server's status",
      options: [
          {
              name: 'version',
              description: "a",
              type : 3,
              required: true,
              choices: [
                  {name: 'Java', value : 'isJava'}, {name: 'Bedrock', value: 'isBedrock'}
              ]
          }

      ]
  }*/