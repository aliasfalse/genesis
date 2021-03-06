'use strict';

const Command = require('../../models/Command.js');

class ResetGuild extends Command {
  constructor(bot) {
    super(bot, 'core.reset', 'reset', 'Reset the settings for this guild', 'BOT_MGMT');
    this.requiresAuth = true;
    this.allowDM = false;
  }

  async run(message) {
    try {
      const { guild } = message;
      await this.settings.removeGuild(guild);
      await Promise.all(guild.channels.cache.map(channel => this.settings.stopTracking(channel)));
    } catch (e) {
      this.logger.error(e.message);
      return this.messageManager.statuses.FAILURE;
    }
    return this.messageManager.statuses.SUCCESS;
  }
}

module.exports = ResetGuild;
