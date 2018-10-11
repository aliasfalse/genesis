'use strict';

const Command = require('../../models/Command.js');
const EarthCycleEmbed = require('../../embeds/EarthCycleEmbed.js');
const MakeSimpleImage = require('../Image/MakeSimpleImage.js')

/**
 * Displays the current stage in Earth's cycle
 */
class EarthCycle extends Command {
  /**
   * Constructs a callable command
   * @param {Genesis} bot  The bot object
   */
  constructor(bot) {
    super(bot, 'warframe.misc.cycle', 'cycle', 'Current and remaining time in cycle of Earth or Cetus rotations.');
    this.regex = new RegExp(`^${this.call}\\s?(earth)?`, 'i');
    this.usages = [
      {
        description: 'Display Cetus\'s current cycle progress',
        parameters: [],
      },
      {
        description: 'Display Earth\'s current cycle progress',
        parameters: ['earth'],
      },
    ];
  }

  /**
   * Run the command
   * @param {Message} message Message with a command to handle, reply to,
   *                          or perform an action based on parameters.
   * @param {Object} ctx      Context object with common command parameters
   * @returns {string} success status
   */
  async run(message, ctx) {
    let cycleData;
    const earth = (/earth/ig).test(message.strippedContent);
    const image = (/-i/ig).test(message.strippedContent);
    const ws = await this.bot.worldStates[ctx.platform.toLowerCase()].getData();
    if (image) {

      if (earth) {

        cycleData = ws.earthCycle;
        
        new MakeSimpleImage(
          cycleData.isDay,                             // data
          '././src/resources/earthdayModel.png',     // readFile0
          '././src/resources/earthnightModel.png',   // readFile1
          cycleData.timeLeft,                          // text
          '././src/resources/CDfontSize40wnumber.fnt', // font
          '././src/resources/cycleEarth.png',          // sendFileCD
          message                                      
          ).run()
          
          
      } else {
        cycleData = ws.cetusCycle;
  
        new MakeSimpleImage(
          cycleData.isDay,                             // data
          '././src/resources/cetusdayModel.png',     // readFile0
          '././src/resources/cetusnightModel.png',   // readFile1
          cycleData.timeLeft,                          // text
          '././src/resources/CDfontSize40wnumber.fnt', // font
          '././src/resources/cycleCetus.png',          // sendFileCD
          message                                      
          ).run()
        }

        return this.messageManager.statuses.SUCCESS;
        
    } else {
      if (earth) {
        cycleData = ws.earthCycle;
      } else {
        cycleData = ws.cetusCycle;
        const ostrons = ws.syndicateMissions.filter(mission => mission.syndicate === 'Ostrons')[0];
        if (ostrons) {
          cycleData.bountyExpiry = ostrons.expiry;
        }
      }
      const embed = new EarthCycleEmbed(this.bot, cycleData);
      await this.messageManager.embed(message, embed, true, true);
      return this.messageManager.statuses.SUCCESS;
    }
  }
}

module.exports = EarthCycle;
