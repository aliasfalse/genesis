'use strict';

const BaseEmbed = require('./BaseEmbed.js');

const { chunkify, markdinate } = require('../CommonFunctions');

const escapeReserved = str => str.replace(/(\(\)\?\+\.)/ig, '\\$1');

/**
 * Generates daily deal embeds
 */
class RSSEmbed extends BaseEmbed {
  /**
   * @param {Logger} bot.logger - Logger instance for this bot
   * @param {Object} feedItem - feed item
   * @param {Object} feed - Configured Feed details providing the key and defaults
   */
  constructor(feedItem, feed) {
    super();
    // clean up description, falling back to an empty string
    let strippedDesc = markdinate((feedItem.description || '\u200B')
      .replace(new RegExp(`<strong>${escapeReserved(feedItem.title)}</strong>`.replace(/(\(\)\+)/g, '\\$1'), 'gm'), ''));
    const firstLine = strippedDesc.split('\n')[0].replace(/\*\*/g, '');

    if (feedItem.title.includes(firstLine)) {
      const tokens = strippedDesc.split('\n');
      tokens.shift();
      strippedDesc = tokens.join('\n');
    }

    const chunks = chunkify({
      string: strippedDesc,
      maxLength: 1000,
      breakChar: '\n',
      checkTitle: true,
    });

    if (chunks) {
      [strippedDesc] = chunks;
      // strip the last title if it starts with a title
      if (strippedDesc.endsWith('**')) {
        strippedDesc = strippedDesc.replace(/\*\*(.*)\*\*$/g, '');
      }

      this.description = strippedDesc;
    }

    this.url = feedItem.link;
    this.timestamp = feedItem.pubdate;
    this.title = feedItem.title;

    this.color = 0x993333;
    this.footer.text = `${feedItem.meta.description} • Published`;

    this.thumbnail = { url: 'https://i.imgur.com/GGzVZPL.png', height: 50, width: 50 };

    if (feed.author) {
      this.author = feed.author;
    } else {
      this.author = {
        name: 'Warframe Forums',
        url: feedItem['rss:link']['#'],
        icon_url: 'https://i.imgur.com/hE2jdpv.png',
      };
    }

    if (!Object.keys(feedItem.image).length) {
      let first = ((feedItem.description || '').match(/<img.*src="(.*)".*>/i) || [])[1];
      if (first) {
        if (first.startsWith('//')) {
          first = first.replace('//', 'https://');
          this.image = {
            url: first,
          };
        }
      } else if (feed.defaultAttach) {
        this.image = {
          url: feed.defaultAttach,
        };
      }
    }
  }
}

module.exports = RSSEmbed;
