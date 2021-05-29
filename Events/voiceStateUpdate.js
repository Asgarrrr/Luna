// ██████ Integrations █████████████████████████████████████████████████████████

// —— Base structure
const Event = require( "../Structures/Event" );

// ██████ | █████████████████████████████████████████████████████████████████████

class voiceStateUpdate extends Event {

    constructor( client ) {
        super( client );
    }

    async run( oldState, newState ) {

        // —— If there is nobody left in the channel, return
        if ( oldState.channelID !==  oldState.guild.me.voice.channelID || newState.channel )
            return;

        // —— Check how many people are in the channel now
        if ( !oldState.channel.members.size - 1 ) {
            // —— If there is nobody left ( except Luna ;3 ), wait 5 minutes
            setTimeout( () => {
                // —— If after 5 minutes, there is still no one, reset the player and leave the channel
                if ( !oldState.channel.members.size - 1 ) {

                    oldState.guild.player.reset();
                    oldState.channel.leave();

                }

            }, 300000 );
        }

    }

}

module.exports = voiceStateUpdate;