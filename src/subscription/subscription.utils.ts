import { IAnimeEpisodes } from '../telegram/interface/anime-episodes.interface';
import * as chrono from 'chrono-node';
import { JSDOM } from 'jsdom';

export const parseAnimeSeason = async (url: string) => {
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
};

export const getAnimeUrl = async (name: string) => {
  const requestUrl = `https://animego.org/search/anime?q=${name}`;

  const html = await fetch(requestUrl);
  const page = new JSDOM(await html.text()).window.document;
  const animeItems = Array.from(page.getElementsByClassName('card-title'));

  const urls = animeItems.map((el: HTMLDivElement) => {
    const linkElement = el.getElementsByTagName('a')[0];
    const url = linkElement.href;
    const name = linkElement.title;

    return { url, name };
  });

  return urls;
};
