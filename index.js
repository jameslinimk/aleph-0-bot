// Must have discord.js and random-puppy package.json and package-lock.json preinstalled. **This is just the code**

const Discord = require('discord.js');
const bot = new Discord.Client();
const randomPuppy = require('random-puppy');

const token = 'NzI2MDY1NDUzNTkxNTYwMjYy.XvYbvw.pOIWVlC-QNw7fqPdxqVyG2GGe0g';

// Server specific vars
var prefix = {};
var defaultPrefix = 's!';

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
    if (!dmHelpCommand[guild.id] || dmHelpCommand[guild.id] == null) dmHelpCommand[guild.id] = true;
    if (!dmHelpReminder[guild.id] || dmHelpReminder[guild.id] == null) dmHelpReminder[guild.id] = true;
    if (!prefix[guild.id] || prefix[guild.id] == null) prefix[guild.id] = defaultPrefix;
    if (!removeBotMessages[guild.id] || removeBotMessages[guild.id] == null) removeBotMessages[guild.id] = true;
    if (!removeBotMessagesTime[guild.id] || removeBotMessagesTime[guild.id] == null) removeBotMessagesTime[guild.id] = 10;
    
    const newEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Sphinx help command')
        .setURL('https://docs.google.com/document/d/1dKc7qeDap2HtE-KJLnESepEl_nVgJhSyM0LEqNrBBJo/edit?usp=sharing')
        .setAuthor(`${bot.name}`, bot.user.displayAvatarURL(), 'https://docs.google.com/document/d/1dKc7qeDap2HtE-KJLnESepEl_nVgJhSyM0LEqNrBBJo/edit?usp=sharing')
        .setDescription(`Preifx: **${prefix[guild.id]}**`)
        .addFields(
            { name: 'Main commands', value: `Thanks for adding me to **${guild.name}**! Use **.tutorial** or **.help** to get started!`},
        )
        .addField('Inline field title', 'Some value here', true)
        .setTimestamp()
        .setFooter('Some footer text here', bot.user.displayAvatarURL());
    guild.owner.user.send(newEmbed);
});

bot.on('message', msg => {
    // Options
    if (!dmHelpCommand[msg.guild.id] || dmHelpCommand[msg.guild.id] == null) dmHelpCommand[msg.guild.id] = true;
    if (!dmHelpReminder[msg.guild.id] || dmHelpReminder[msg.guild.id] == null) dmHelpReminder[msg.guild.id] = true;
    if (!prefix[msg.guild.id] || prefix[msg.guild.id] == null) prefix[msg.guild.id] = defaultPrefix;
    if (!removeBotMessages[msg.guild.id] || removeBotMessages[msg.guild.id] == null) removeBotMessages[msg.guild.id] = true;
    if (!removeBotMessagesTime[msg.guild.id] || removeBotMessagesTime[msg.guild.id] == null) removeBotMessagesTime[msg.guild.id] = 10;
    let PREFIX = prefix[msg.guild.id];

    // Misc
    if (msg.channel.type == "dm") return;
    if (msg.author.bot) return;
    let lmsg = msg.content.toLowerCase();
    if (!msg.content.startsWith(PREFIX)){
        if (msg.mentions.has(bot.user)) msg.channel.send(`My prefix is \`${prefix[msg.guild.id]}\``);
    };
    const args = msg.content.split(" ");
    let command = msg.content.toLowerCase().split(" ")[0];
    command = command.slice(PREFIX.length);

    // Functions
    function mReply(m){
        if (removeBotMessages[msg.guild.id]){
            msg.channel.send(m)
            .then(msg => {
                msg.delete({ timeout: removeBotMessagesTime[msg.guild.id] * 1000 });
            });
        } else msg.channel.send(m);
    };

    // Commands
    if (command === 'help'){
        const helpEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Sphinx help command')
            .setURL('https://docs.google.com/document/d/1dKc7qeDap2HtE-KJLnESepEl_nVgJhSyM0LEqNrBBJo/edit?usp=sharing')
            .setAuthor(`${bot.name}`, bot.user.displayAvatarURL(), 'https://docs.google.com/document/d/1dKc7qeDap2HtE-KJLnESepEl_nVgJhSyM0LEqNrBBJo/edit?usp=sharing')
            .setDescription(`Preifx: **${prefix[msg.guild.id]}**`)
            .addFields(
                { name: 'Main commands', value: `\`s.help [<page 1-10>]\`: Shows a certain help page. (Page 1 by default)
                \\**\`${prefix[msg.guild.id]}tutorial\`\**\: Shows you the basics of the bot
                \`${prefix[msg.guild.id]}settings\`: Edits the current server settings. (Prefix, etc)
                \`${prefix[msg.guild.id]}Info\`: Shows bot info. (Version, desc, website, etc)
                \`${prefix[msg.guild.id]}Invite\`: Shows the bot invite link.
                \`${prefix[msg.guild.id]}Permslist\`: Lists all of the permissions for each command.
                \`${prefix[msg.guild.id]}Perms <@user or @role> [<perm>]\`: Gives (or lists) a user / role a permission node(s). (Only owner and users / groups with perm)`},
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .addField('Inline field title', 'Some value here', true)
            .setTimestamp()
            .setFooter('Some footer text here', bot.user.displayAvatarURL());
        
        if (dmHelpCommand[msg.guild.id]){
            msg.author.send(helpEmbed);
            mReply('You have mail! :mailbox:');
            if (dmHelpReminder[msg.guild.id]){
                msg.author.send('*If you want it to send it in chat other than DM, change it in settings.');
                msg.author.send('You can also disable these messages in the settings.');
            }
        } else {
            msg.channel.send(helpEmbed);
        };
    } else if (command === 'settings'){
        if (!args[1]){
            const settingsEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${msg.guild.name}s settings.`)
                .setURL('https://docs.google.com/document/d/1dKc7qeDap2HtE-KJLnESepEl_nVgJhSyM0LEqNrBBJo/edit?usp=sharing')
                .setAuthor(`${bot.name}`, bot.user.displayAvatarURL(), 'https://docs.google.com/document/d/1dKc7qeDap2HtE-KJLnESepEl_nVgJhSyM0LEqNrBBJo/edit?usp=sharing')
                .setDescription(`How to change settings: \`${prefix[msg.guild.id]}setting <setting> <new value>\``)
                .addFields(
                    { name: 'Main commands', value: `\`dmHelpCommand\`: Will the bot DM help commands? (True / False)`},
                )
                .addField('Inline field title', 'Some value here', true)
                .setTimestamp()
                .setFooter('Some footer text here', bot.user.displayAvatarURL());
            msg.channel.send(settingsEmbed);
        } else if (args[1] != 'dmHelpComamnd'){
            
        }
    } else if (command === 'reddit'){
        if (!args[1]){
            mReply('.... what subreddit');
            return;
        }
        if (args[2]){
            mReply('One word only pls!');
            return;
        }
        randomPuppy(args[1])
        .then(url => {
            mUrl = url.replace(`${url.split('.')[2]}`,'gif');
            const randomPuppy = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Random r/${args[1]} post!`)
                .setURL(`${url}`)
                .setImage(mUrl)
            msg.channel.send(randomPuppy);
        });
    } else if (command === 'memes' || command === 'meme'){
        randomPuppy('memes')
        .then(url => {
            mUrl = url.replace(`${url.split('.')[2]}`,'gif');
            const randomPuppy = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Random meme!`)
                .setURL(`${url}`)
                .setImage(mUrl)
            msg.channel.send(randomPuppy);
        });
    } else if (command === 'cats' || command === 'cat'){
        randomPuppy('cats')
        .then(url => {
            mUrl = url.replace(`${url.split('.')[2]}`,'gif');
            const randomPuppy = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Random cat!`)
                .setURL(`${url}`)
                .setImage(mUrl)
            msg.channel.send(randomPuppy);
        });
    } else if (command === 'puppy'){
        randomPuppy()
        .then(url => {
            mUrl = url.replace(`${url.split('.')[2]}`,'gif');
            const randomPuppy = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Random puppy!`)
                .setURL(`${url}`)
                .setImage(mUrl)
            msg.channel.send(randomPuppy);
        });
    } else if (command === 'search'){
        if (!args[1]){
            mReply('... Search what?');
            return;
        } else{
            var gsearch = lmsg.replace('.search ', '')
            const searchembed = new Discord.MessageEmbed()
                .setColor("#7289DA")
                .setAuthor(`${bot.name}`, bot.user.displayAvatarURL())
                .setURL(`https://www.google.com/search?q=${gsearch.replace(new RegExp(" ", "g"), '+')}`)
                .setTitle(`__**${msg.author.username}'s Google search**__`)
                .setTimestamp()
                .setFooter('Some footer text here', bot.user.displayAvatarURL());
            msg.channel.send(searchembed);
        }
    } else if (command === 'ytsearch'){
        if (!args[1]){
            mReply('... Search what?');
            return;
        } else{
            var gsearch = lmsg.replace('.ytsearch ', '')
            const searchembed = new Discord.MessageEmbed()
                .setColor("#7289DA")
                .setAuthor(`${bot.name}`, bot.user.displayAvatarURL())
                .setURL(`https://www.youtube.com/search?q=${gsearch.replace(new RegExp(" ", "g"), '+')}`)
                .setTitle(`__**${msg.author.username}'s Youtube search**__`)
                .setTimestamp()
                .setFooter('Some footer text here', bot.user.displayAvatarURL());
            msg.channel.send(searchembed);
        };
    };
});


bot.login(token);
