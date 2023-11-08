import { Injectable, Logger } from '@nestjs/common';
import { SubscriptionEntity } from './subscription.entity';
import { SubscriptionRepository } from './subscription.repository';
import { Context } from 'telegraf';
import { IAnimeEpisodes } from '../telegram/interface/anime-episodes.interface';
import * as chrono from 'chrono-node';
import { JSDOM } from 'jsdom';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async save(subscription: SubscriptionEntity, ctx: Context) {
    try {
      await this.subscriptionRepository.save(subscription);
      await ctx.reply(
        `Успешно подписался на анимешку: ${subscription.animeName}`,
      );
    } catch (err) {
      await ctx.reply(`Подписка на это аниме уже оформлена`);
    }
  }

  async getSubscriptionsGroupByAnime(): Promise<SubscriptionEntity[]> {
    return this.subscriptionRepository.getSubscriptionsGroupByAnime();
  }

  async parseAnimeSeason(url: string) {
    const episodes = fetch(url).then(async (res) => {
      const page = new JSDOM(await res.text());
      const episodes = Array.from(
        page.window.document.getElementsByClassName(
          'col-12 released-episodes-item',
        ),
      );

      const parsedEpisodes: IAnimeEpisodes[] = [];

      episodes.map((el: HTMLDivElement) => {
        const div = el.getElementsByClassName('row m-0')[0];

        parsedEpisodes.push({
          id: div.firstChild.textContent,
          name: div.children[1].textContent.trim(),
          dateRU: chrono.ru.parseDate(div.children[2].firstChild.textContent),
        });
      });

      return parsedEpisodes;
    });

    return episodes;
  }

  async getUrl(name: string) {
    const requestUrl = `https://animego.org/search/all?type=small&q=${name}`;
    console.log(requestUrl);

    const url = fetch(requestUrl).then(async (res) => {
      const response = await res.json();
      const page = new JSDOM(response.content).window.document;

      const urlItem = page.getElementsByClassName('result-search-item-body');

      if (!urlItem.length) {
        return `Аниме ${name} не найдено :(`;
      }

      const url = urlItem[0].getElementsByTagName('a')[0].href;
      return `https://animego.org${url}`;
    });

    return url;
  }

  async getAnimeUrl(name: string) {
    const requestUrl = `https://animego.org/search/anime?q=${name}`;

    const html = await fetch(requestUrl);
    const page = new JSDOM(await html.text()).window.document;
    const animeItems = Array.from(page.getElementsByClassName('card-title'));

    const hrefs = animeItems.map((el: HTMLDivElement) => {
      const linkElement = el.getElementsByTagName('a')[0];
      const href = linkElement.href;
      const name = linkElement.title;

      return { href, name };
    });

    return hrefs;
  }
}
