// Must have discord.js, package.json and package-lock.json preinstalled. **This is just the code**a



const Discord = require('discord.js');

const bot = new Discord.Client();

const token = '// Your token here';


// Custom prefixes; remove if wanted.
var PREFIX = {};
var defaultPREFIX = ".";

bot.on("ready", function(){
    var allGuilds = bot.guilds.array();

    allGuilds.forEach(element => {
        if (!prefix[element]){
            prefix[element] = defaultPrefix;
        }
    });
});


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
    bot.user.setActivity(' | @me for help', { type: 'PLAYING' })
    .catch(console.error);
});

bot.on('message', msg => {

    let lmsg = msg.content.toLowerCase();

    if (msg.author.bot) return;

    if (msg.channel.type == "dm") {
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
            '1, 2, 3, 4, who the fu** are you?',
            'Roses are red, violets are blue, just tell me, who the fu** are you?',
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
            '@here , we have a new winner for the **most stupid person ever**!',
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

    if (lmsg === ",setprofile"){
        msg.delete();
    };
    
    if (lmsg.startsWith("?warn") || lmsg.startsWith("-warn")){
        msg.reply('do you mean **r!warn**?')
        .then(msg => {
            msg.delete({ timeout: 10000 });
        });
    };

    if (lmsg.startsWith("?kick") || lmsg.startsWith("r!kick")){
        msg.reply('do you mean **-kick**?')
        .then(msg => {
            msg.delete({ timeout: 10000 });
        });
    };

    if (lmsg.startsWith("?ban") || lmsg.startsWith("r!ban")){
        msg.reply('do you mean **-ban**?')
        .then(msg => {
            msg.delete({ timeout: 10000 });
        });
    };

    if (lmsg.startsWith("?mute") || lmsg.startsWith("r!mute")){
        msg.reply('do you mean **-mute**?')
        .then(msg => {
            msg.delete({ timeout: 10000 });
        });
    };

    if (lmsg === "i need help"){
        msg.reply('to ask basic questions, ping a staff member. Or, create a ticket.')
        .then(msg => {
            msg.delete({ timeout: 10000 });
        });
    };

    if (!msg.content.startsWith(PREFIX)) return;

    const args = msg.content.split(" ");

    let command = msg.content.toLowerCase().split(" ")[0];
    command = command.slice(PREFIX.length);

    // Commands
    if (command === 'prefix'){
        if (args[1] === 'update'){
            if (autoPrefixUpdater === false){
                msg.channel.send('Starting auto prefix updater....')
                .then(msg => {
                    msg.delete({ timeout: 10000 });
                });
                autoPrefixUpdater = true;
                setInterval(() => {
                    var gMembers = msg.guild.members.cache;
                    gMembers.forEach(element => {
                        // Prefixes

                        if (element.roles.cache.has('724387463983792228')){
                            if (element.user.username.startsWith('✦')) return;
                            element.setNickname(`✦ ${element.user.username}`)
                            .catch(error => {
                                console.log(`Error cant change nickname of ${element.user.username}`);
                            });
                        };

                        if (element.roles.cache.has('724387588353556612')){
                            if (element.user.username.startsWith('✾')) return;
                            element.setNickname(`✾ ${element.user.username}`)
                            .catch(error => {
                                console.log(`Error cant change nickname of ${element.user.username}`);
                            });
                        };

                        if (element.roles.cache.has('724387500310790156')){
                            if (element.user.username.startsWith('★')) return;
                            if (element.roles.cache.has('724387588353556612')) return;
                            element.setNickname(`★ ${element.user.username}`)
                            .catch(error => {
                                console.log(`Error cant change nickname of ${element.user.username}`);
                            });
                        };

                        if (element.roles.cache.has('724387524755193938')){
                            if (element.user.username.startsWith('☆')) return;
                            if (element.roles.cache.has('724387588353556612')) return;
                            if (element.roles.cache.has('724387500310790156')) return;
                            element.setNickname(`☆ ${element.user.username}`)
                            .catch(error => {
                                console.log(`Error cant change nickname of ${element.user.username}`);
                            });
                        };

                        // If-roles

                        if (element.roles.cache.has('724387588353556612')){
                            if (!element.roles.cache.has('724387500310790156')){
                                let role = msg.guild.roles.cache.get('724387500310790156');
                                element.roles.add(role);
                            };
                            if (!element.roles.cache.has('724387524755193938')){
                                let role = msg.guild.roles.cache.get('724387524755193938');
                                element.roles.add(role);
                            };
                        };
                        if (element.roles.cache.has('724387500310790156')){
                            if (!element.roles.cache.has('724387524755193938')){
                                let role = msg.guild.roles.cache.get('724387524755193938');
                                element.roles.add(role);
                            };
                        }
                    });
                }, 10 * 1000)
            } else if (autoPrefixUpdater === true){
                msg.channel.send('Auto prefix updater is already active!')
                .then(msg => {
                    msg.delete({ timeout: 10000 });
                });
                return;
            };
        } else if (args[1] === 'list'){
            const prefixembed = new Discord.MessageEmbed()
            .setColor("#7289DA")
            .setAuthor("Connect Bot", bot.user.displayAvatarURL())
            .setDescription(`
__**Prefix List**__
> \`Owner:\` ♕
> \`Admin:\` ✾
> \`Mod:\` ★
> \`Helper:\` ☆`)
            .setFooter("©️ 2020 JameslinimkYT", "https://app.zealcord.xyz/assets/Logo.png");
            msg.channel.send(prefixembed);
        } else if (args[1] === 'help'){
            const helplistembed = new Discord.MessageEmbed()
            .setColor("#7289DA")
            .setAuthor("Connect Bot", bot.user.displayAvatarURL())
            .setDescription(`
__**Commands List**__
> \`.prefix list\` > \`Lists all of the prefixes.\`
> \`.prefix update\` > \`Updates prefixes and if roles.\``)
            .setFooter("©️ 2020 JameslinimkYT", "https://app.zealcord.xyz/assets/Logo.png");
            msg.channel.send(helplistembed);
        } else{
            msg.channel.send('Wrong args! Use `.prefix help` for more info.')
            .then(msg => {
                msg.delete({ timeout: 10000 });
            });
        }
    };
    if (command === 'search'){
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
            .setFooter("©️ 2020 JameslinimkYT", "https://app.zealcord.xyz/assets/Logo.png");
            msg.channel.send(searchembed);
        }
    }
    if (command === 'ytsearch'){
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
            .setFooter("©️ 2020 JameslinimkYT", "https://app.zealcord.xyz/assets/Logo.png");
            msg.channel.send(searchembed);
        }
    }
});


bot.login(token);
