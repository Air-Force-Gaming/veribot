require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

const PREFIX = '!vb';

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

let user;
let role;

client.on('message', msg => {
    //  if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;

    //   const args = msg.content.slice(PREFIX.length).split(/ +/);
    //   const command = args.shift().toLowerCase();
/*
      if (msg.content === `verify`) {
           msg.channel.send('change this to adding verify role');
           const guild = msg.guild;
           const role = guild.roles.cache.find(role => role.name === 'testrole');
           const member = msg.mentions.members.first();
           //member.roles.add(role);
           member.addRole(role).catch(console.error);
           console.log(member);
       } else if (msg.content === `help`) {
           msg.channel.send('Placeholder for help context might not be necessary');
       } */
  
       if (msg.content === 'ping') {
        msg.reply('pong');
    } else {
        //assigns role when you say ping
        const guild = msg.guild;
        const role = guild.roles.cache.find(role => role.name === 'testrole');
        const member = msg.mentions.members.first();
        member.roles.add(role);
        console.log(member)

    }

});
client.login(process.env.DISCORD_API_TOKEN);















//Public functions
const test = () => {
    console.log('Connection to start.js solid!');

}

//module.exports = bot;
exports.test = test;