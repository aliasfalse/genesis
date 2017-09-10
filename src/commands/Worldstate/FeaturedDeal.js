'use strict';

const Command = require('../../Command.js');
const SalesEmbed = require('../../embeds/SalesEmbed.js');

/**
 * Displays current featured deals
 */
class FeaturedDeal extends Command {
  /**
   * Constructs a callable command
   * @param {Genesis} bot  The bot object
   */
  constructor(bot) {
    super(bot, 'warframe.worldstate.featureddeal', 'featureddeal', 'Displays current featured deals');
    this.regex = new RegExp('^featured\\s?deals?(?:\\s+on\\s+([pcsxb14]{2,3}))?$', 'i');
  }

  /**
   * Run the command
   * @param {Message} message Message with a command to handle, reply to,
   *                          or perform an action based on parameters.
   */
  async run(message) {
    const platformParam = message.strippedContent.match(this.regex)[1];
    const platform = platformParam || await this.bot.settings.getChannelPlatform(message.channel);
    const ws = await this.bot.caches[platform].getDataJson();
    const sales = ws.flashSales.filter(popularItem => popularItem.isFeatured);
    await this.messageManager.embed(message,
      new SalesEmbed(this.bot, sales), true, false);
  }
}

module.exports = FeaturedDeal;
