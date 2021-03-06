'use strict';

const BaseEmbed = require('./BaseEmbed.js');
const { assetBase } = require('../CommonFunctions');

const corpus = `${assetBase}/img/corpus.png`;

function shieldCalc(baseShields, baseLevel, currentLevel) {
  return (parseFloat(baseShields)
    + (((parseFloat(currentLevel) - parseFloat(baseLevel)) ** 2)
    * 0.0075 * parseFloat(baseShields))).toFixed(2);
}

function shieldString(shields, level) {
  return `At level ${parseFloat(level).toFixed(0)}, your enemy would have ${shields} Shields.`;
}

/**
 * Generates enemy embeds
 */
class ShieldEmbed extends BaseEmbed {
  /**
   * @param {Genesis} bot - An instance of Genesis
   * @param {Array<string>} params - array of string parameters
   */
  constructor(bot, params) {
    super();
    this.color = params && params.length > 3 ? 0x00ff00 : 0xff0000;
    this.title = 'Warframe - Shields';
    this.url = 'https://warframe.com';
    this.thumbnail = {
      url: corpus,
    };
    this.fields = [
      {
        name: '\u200B',
        value: '',
      },
    ];

    if (params && params.length > 3) {
      const shields = params[1];
      const baseLevel = params[2];
      const currentLevel = params[3];
      const calc = shieldCalc(shields, baseLevel, currentLevel);
      this.fields[0].name = 'Shield calculation';
      this.fields[0].value = shieldString(calc, currentLevel);
    } else {
      this.fields[0].value = '`shields (Base Shelds) (Base Level) (Current Level)` - calculate shields and stats.';
      this.fields[0].name = 'Possible uses include:';
    }
  }
}

module.exports = ShieldEmbed;
