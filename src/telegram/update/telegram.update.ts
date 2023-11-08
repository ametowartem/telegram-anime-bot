import { Action, Ctx, Start, Update } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

type Context = Scenes.SceneContext;
@Update()
export class TelegramUpdate {
  @Start()
  async start(@Ctx() ctx: Context) {
    const menu = Markup.inlineKeyboard([
      [Markup.button.callback('подписаться на анимешку', 'subscribeAnime')],
    ]);
    await ctx.reply(
      'Здарова я ищу когда вышли анимешки, кидай названия :))',
      menu,
    );
  }

  @Action('subscribeAnime')
  async subscribeAnime(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('subscribeAnime');
  }
}
