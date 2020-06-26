// Must have discord.js, package.json and package-lock.json preinstalled. **This is just the code**

const Discord = require('discord.js');
const bot = new Discord.Client();

const token = 'Insert token here';

// Change this if you want
const PREFIX = 's.';

// Server specific vars
var dmHelpCommand = {};
var dmHelpReminder = {};
var removeBotMessages = {};
var removeBotMessagesTime = {};


bot.on('ready', () =>{
    console.log('=======================');
    console.log('')
    var currentdate = new Date(); 
    var datetime = "Date Time: " + currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/" 
        + currentdate.getFullYear() + " @ "  
        + currentdate.getHours() + ":"  
        + currentdate.getMinutes() + ":" 
        + currentdate.getSeconds();
    console.log(datetime);
    console.log('Sphinx bot launched...');
    console.log('');
    console.log('=======================');
    bot.user.setStatus('dnd');
    bot.user.setActivity('pink lives matter | @me for help', { type: 'PLAYING' })
    .catch(console.error);

});

bot.on('guildCreate', guild => {
    guild.owner.send(`Thanks for adding me to **${msg.guild.name}**! Use **.tutorial** or **.help** to get started!`);
});

bot.on('message', msg => {

    let lmsg = msg.content.toLowerCase();

    if (msg.author.bot) return;

    if (msg.channel.type == "dm" && !lmsg.startsWith(PREFIX)) {
        var botReplies = [
            '... im a bot',
            'beep boop yes me real human.... bruh',
            '*angry noises*',
            '*sleeping',
            'Stop DMing me',
            'should i know you?',
            'k',
            'kk',
            'i would have to go with yes',
            '01100010 01100101 01100101 01110000 00100000 01100010 01101111 01101111 01110000 00101110 00101110 00101110',
            'would you look at the time',
            'no can do',
            'am confused',
            'is confused',
            'Not funny; didnt laugh',
            'ok',
            'who are u',
            '...said the moron',
            'bup',
            'bruh',
            'Ssshh! The government can hear us!',
            'no, this is connectbot',
            'Error stupidity meter is off the charts!',
            '...',
            'tempting...',
            'how did you get this number?',
            'are you really that sad?',
            '**:(** <- you',
            'ok boomer.',
            ':warning: You require an IQ of **200 or higher** to talk to me',
            'Dont talk to me untill i have my coffee!',
            '*blushes',
            'i agree',
            'Wheres the exit?',
            `Stop DMing me **${msg.author}**.`,
            `${msg.author}, what a weird name amirite?`,
            'Im telling mommy',
            `Teacher! ${msg.author} is DMing me`,
            'Im telling my dad.',
            '@here, we have a new winner for the **most stupid person ever**!',
            'I know who you are...... **Karen**',
            'I know who you are...... **the government**',
            'If id have to choose, id pick **no**',
            'If id have to choose, id pick yes!',
            'owo',
            'uwu',
            'Yes daddy, please more DMs!',
            'VaCcinES CAUSE AUtISm! I read iT ONce On TotaLyLEGITnEWs.SCAm!',
            `Imagine your discord name being ${msg.author.username}... what a stupid name amirite?`,
            `if i were to choose the dumbest discord name, ${msg.author.username} would be on top.`,
            `99% of people agree that ${msg.author.username} is the worst name on the planet!`,
            'Go find some friends.',
            'talk to your friends, oh wait you have none. :sunglasses:',
            `talk to your friends, ${msg.author.username}, oh wait you have none. :sunglasses:`,
            'Connect bot accepted your friend request. Then he relized you were a moron',
            `- ${msg.author.username}, 2020.`
        ];
        var botRepliesRN = Math.floor(Math.random()*botReplies.length);
        
        msg.author.send(botReplies[botRepliesRN]);
        return;
    } 
    if (lmsg.startsWith(PREFIX) || msg.mentions.has(bot.user)){
        const largs = msg.content.split(" ");
    
        let lcommand = msg.content.toLowerCase().split(" ")[0];
        lcommand = lcommand.slice(PREFIX.length);

        if (lcommand === 'test'){
            msg.author.send('test to you!');
        }
        return;
    }

    if (!msg.content.startsWith(PREFIX)) return;

    const args = msg.content.split(" ");
    
    let command = msg.content.toLowerCase().split(" ")[0];
    command = command.slice(PREFIX.length);

    // Default options
    if (!dmHelpCommand[msg.guild.id]) dmHelpCommand[msg.guild.id] = true;
    if (!dmHelpReminder[msg.guild.id]) dmHelpReminder[msg.guild.id] = true;
    if (!removeBotMessages[msg.guild.id]) removeBotMessages[msg.guild.id] = true;
    if (!removeBotMessagesTime[msg.guild.id]) removeBotMessagesTime[msg.guild.id] = 10;

    // Functions
    function mReply(m){
        if (removeBotMessages[msg.guild.id]){
            msg.channel.send(m)
            .then(msg => {
                msg.delete({ timeout: removeBotMessagesTime * 1000 });
            });
        } else {
            msg.channel.send(m);
        };
    };

    // Commands
    if (command === 'help' || msg.mentions.has(bot.user)){
        const helpEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Sphinx help command')
            .setURL('https://docs.google.com/document/d/1dKc7qeDap2HtE-KJLnESepEl_nVgJhSyM0LEqNrBBJo/edit?usp=sharing')
            .setAuthor('Some name', 'https://cdn.discordapp.com/app-icons/726065453591560262/8f1f0617d88e2608736f92aa8aa8fafa.png?size=64', 'https://docs.google.com/document/d/1dKc7qeDap2HtE-KJLnESepEl_nVgJhSyM0LEqNrBBJo/edit?usp=sharing')
            .setDescription(`Preifx: **s.**`)
            .addFields(
                { name: 'Main commands', value: `\`s.help [<page 1-10>]\`: Shows a certain help page. (Page 1 by default)
                \`s.tutorial\`: Shows you the basics of the bot
                \`s.settings\`: Edits the current server settings. (Prefix, etc)
                \`s.Info\`: Shows bot info. (Version, desc, website, etc)
                \`s.Invite\`: Shows the bot invite link.
                \`s.Permslist\`: Lists all of the permissions for each command.
                \`s.Perms <@user or @role> [<perm>]\`: Gives (or lists) a user / role a permission node(s). (Only owner and users / groups with perm)`},
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .addField('Inline field title', 'Some value here', true)
            .setTimestamp()
            .setFooter('Some footer text here', 'https://cdn.discordapp.com/app-icons/726065453591560262/8f1f0617d88e2608736f92aa8aa8fafa.png?size=64');
        
        if (dmHelpCommand[msg.guild.id]){
            msg.author.send(helpEmbed);
            if (removeBotMessages[msg.guild.id]){

                mReply('You have mail! :mailbox:');

            }
            if (dmHelpReminder[msg.guild.id]){
                msg.author.send('*If you want it to send it in chat other than DM, change it in settings.');
                msg.author.send('You can also disable these messages in the settings.');
                msg.author.send('P.S. Did you know you can execute commands here in the DMs?*');
            }
        } else {
            msg.channel.send(helpEmbed);
        };
    } else if (command === 'settings'){

    } else if (command === 'test'){
        msg.author.send('test');
    } else if (command === 'search'){
        if (!args[1]){
            msg.channel.send('... Search what?')
            .then(msg => {
                msg.delete({ timeout: 10000 });
            });
            return;
        } else{
            var gsearch = lmsg.replace('.search ', '')
            const searchembed = new Discord.MessageEmbed()
            .setColor("#7289DA")
            .setAuthor("Connect Bot", bot.user.displayAvatarURL())
            .setURL(`https://www.google.com/search?q=${gsearch.replace(new RegExp(" ", "g"), '+')}`)
            .setTitle(`__**${msg.author.username}'s Google search**__`)
            .setTimestamp()
            .setFooter('Some footer text here', 'https://cdn.discordapp.com/app-icons/726065453591560262/8f1f0617d88e2608736f92aa8aa8fafa.png?size=64');
            msg.channel.send(searchembed);
        }
    } else if (command === 'ytsearch'){
        if (!args[1]){
            msg.channel.send('... Search what?')
            .then(msg => {
                msg.delete({ timeout: 10000 });
            });
            return;
        } else{
            var gsearch = lmsg.replace('.ytsearch ', '')
            const searchembed = new Discord.MessageEmbed()
            .setColor("#7289DA")
            .setAuthor("Connect Bot", bot.user.displayAvatarURL())
            .setURL(`https://www.youtube.com/search?q=${gsearch.replace(new RegExp(" ", "g"), '+')}`)
            .setTitle(`__**${msg.author.username}'s Youtube search**__`)
            .setTimestamp()
            .setFooter('Some footer text here', 'https://cdn.discordapp.com/app-icons/726065453591560262/8f1f0617d88e2608736f92aa8aa8fafa.png?size=64');
            msg.channel.send(searchembed);
        }
    } else {
        msg.channel.send('Invalid command! Do `s.help` for a list of valid commands!')
    }
});


bot.login(token);
