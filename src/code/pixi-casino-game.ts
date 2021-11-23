import { PixiCoreApp } from '@/code/base-core';
import { timeout } from '@/utils/timeout';
import * as PIXI from 'pixi.js';
import * as PIXISound from '@pixi/sound';

// Поскольку у нас тут vue-cli, чтобы получить правильный путь для картинки (так как настоящий путь (в статике) будет отличаться от путей в проекте)
import casinoGuy from '@/assets/casino-guy.jpeg';
import casinoWallpaper from '@/assets/casino-wallpaper.jpeg';
import redNine from '@/assets/red_nine.jpeg';
import redSix from '@/assets/red_six.png';
import redTus from '@/assets/red_tus.jpeg';
import backgroundSound from '@/assets/sounds/background_music_sound.mp3';
import bredishSound from '@/assets/sounds/casino_bredish_sound.mp3';
import colodaSound from '@/assets/sounds/casino_coloda_sound.mp3';
import exitSound from '@/assets/sounds/casino_exit_sound.mp3';
import fuckYourBullshitSound from '@/assets/sounds/casino_fuck_your_bullshit_sound.mp3';
import huipiSound from '@/assets/sounds/casino_huipi_sound.mp3';
import introSound from '@/assets/sounds/casino_intro_sound.mp3';
import chtoGovorishSound from '@/assets/sounds/casino_ponimaesh_4to_govorish_sound.mp3';

const redCardsResources = [
  {
    name: 'redNine',
    path: redNine
  },
  {
    name: 'redSix',
    path: redSix
  },
  {
    name: 'redTus',
    path: redTus
  }
];

type ResourceName = 'casinoGuy' | 'casinoBackgroundWallpaper' | 'redNine' | 'redSix' | 'redTus' | string;

export class PixiCasinoGame extends PixiCoreApp {
  private resources: Record<ResourceName, PIXI.LoaderResource> = {};

  constructor() {
    super();
  }

  /**
   *
   * Ассеты грузятся ассинхронно (текстуры, картинки)
   *
   * @returns {Promise<void>}
   */
  public async init() {
    // Отправляем наши ассеты в лоадер, чтобы pixi.js начал их подгружать.
    // Грузить можно с любой схемой, можно локальные ассеты, можно через: `file://, https://, либо даже просто скормить base64 строку туда`
    this.core.loader.add('casinoGuy', casinoGuy);

    // Грузим картинку побольше.
    this.core.loader.add('casinoBackgroundWallpaper', casinoWallpaper);

    // Подгружаем карточки
    for (const card of redCardsResources) {
      this.core.loader.add(card.name, card.path);
    }

    this.core.loader.add('backgroundSound', backgroundSound);

    // Этот ресурс не загрузится (не будет валидным), так как на ytimg.com стоит cors настройка.
    this.core.loader.add('casinoBackgroundWallpaperError', 'https://i.ytimg.com/vi/stqmakuZxB4/maxresdefault.jpg');

    // Мы также можем получать текущий прогресс загрузки ресурсов (например, чтобы красиво выводить его юзеру)
    this.core.loader.onProgress.add((data) => {
      const currentPercentProgress = data.progress;

      console.log(`Current progress: ${currentPercentProgress}% .`);
    });

    /**
     * Важно также отметить, что все загруженные текстуры помещаются в глобальный объект PIXI.Texture.Cache.
     *
     * Это позволяет PIXI.JS не грузить текстуру повторно, если такой объект (с таким именем, и ссылкой) уже ранее загружались.
     *
     * Это значит, что если вы дважде вызовете:
     *
     * this.core.loader.add('casinoBackgroundWallpaper', casinoWallpaper);
     * this.core.loader.add('casinoBackgroundWallpaper', casinoWallpaper);
     *
     * то второй вызов не отработает (если только первый успел выполниться).
     *
     * Если текстуру из кеша нужно убрать (например пользователь ушел со страницы игры)
     * то чтобы сэкономить ресурсы, можно вызвать метод PIXI.Texture.removeFromCache();
     *
     * Также вы можете руками добавлять текстуры в кеш PIXI.Texture.addToCache();
     */

    // Loader.load принимает на вход callback, для удобства превратим его в Promise
    return new Promise<void>((resolve) => {
      //
      this.core.loader.load(async (loader, resources) => {
        // Добавим немного псевдо-времени для "как-будто" долгой загрузки ассетов.
        await timeout(1000);
        // Ок, загрузились - теперь нас ничто не остановит чтобы начать рисовать!
        this.doInit(resources);
        resolve();
      });
    });
  }

  private drawScene(): void {
    const wallpaperTexture = this.resources['casinoBackgroundWallpaper'].texture;

    // OOPS! Напрямую текстуру в canvas добавлять нельзя, ее нужно сначала обернуть в контейнер, так как текстура это просто набор данных.
    // Для этих целей нужно использовать PIXI.Sprite.

    // Создаем Sprite, опционально он принимает на вход текстуру, которую нужно отрисовать.
    // Sprite по умолчанию устанавливает свои width / height относительно текстуры
    const wallpaperSprite = new PIXI.Sprite(wallpaperTexture);

    this.core.stage.addChild(wallpaperSprite);

    // Теперь добавляем наши текстуры карт.
    const redNineTexture = this.resources['redNine'];
    const redSixTexture = this.resources['redSix'];
    const redTusTexture = this.resources['redTus'];

    const cardTextures = [
      redSixTexture,
      redNineTexture,
      redTusTexture
    ] as PIXI.LoaderResource[];

    const sound = new CasinoSound();
    sound.intro.play({ loop: false, volume: 0.2 });

    const cardBlock = new CasinoCards(cardTextures, sound);

    const onShuffle = () => {
      cardBlock.shuffle();
    };

    const onExit = async () => {
      sound.chtoGovorish.play();

      await timeout(3000);
      const result = window.confirm('Do you want to exit?');

      if (result) {
        sound.exit.play();

        // Останавливаем сцену
        // this.core.stop();

        this.core.stage.interactive = false;

        // PIXI.Ticker, это просто синтакстически сахар (обертка) для requestAnimationFrame.
        // Позволяет более гибко управлять анимациями, коллбеками.
        // Делаем плввное затухание
        this.core.ticker.add((data) => {
          this.core.stage.alpha -= 0.01;

          if (this.core.stage.alpha <= 0) {
            this.core.destroy(true, true);
          }
        });
      } else {
        sound.huipi.play();
      }
    };

    const controls = new CasinoControls(onShuffle, onExit);

    this.core.stage.addChild(controls.container);
    this.core.stage.addChild(cardBlock.container);
  }

  private doInit(resourcesDict: Record<string, PIXI.LoaderResource | undefined>): void {
    Object.values(resourcesDict)
      .forEach((resource) => {
        if (!resource) {
          return;
        }

        // Если какой-то из ресурсов не загрузился, то мы можем посмотреть какой именно, и почему.
        // По хорошему надо бы об этом сообщить юзеру, так как текстуры для на всегда критичны.
        if (resource.error) {
          console.log(`${resource.name} wasn't loaded due error: ${resource.error.message}`);
        }

        if (!resource.error) {
          this.resources[resource.name] = resource;
        }
      });

    // Все текстуры загрузились, давайте рисовать.
    this.drawScene();
  }
}

class CasinoCards {
  public readonly container: PIXI.Container;
  public readonly cards: CasinoCard[] = [];

  constructor(textures: PIXI.LoaderResource[], public readonly sound: CasinoSound) {
    this.container = new PIXI.Container();

    this.container.x = 450;
    this.container.y = 550;

    this.init(textures);
  }

  public shuffle(): void {
    if (this.sound.coloda.isPlaying) {
      this.sound.coloda.stop();
    }

    this.sound.coloda.play();

    // Думаю, в пояснение не нуждается.
    this.container.removeChildren();

    for (const card of this.cards) {
      const index = Math.floor(Math.random() * this.cards.length);
      const temp = this.cards[index];

      this.container.addChild(temp.sprite);
    }
  }

  private init(textures: PIXI.LoaderResource[]): void {
    for (const [index, cardResource] of textures.entries()) {
      const casinoCard = new CasinoCard(cardResource.texture!, cardResource.name, this.sound);
      this.cards.push(casinoCard);
      this.container.addChild(casinoCard.sprite);
      casinoCard.sprite.x = index * 150;
    }
  }
}

class CasinoCard {
  public readonly sprite: PIXI.Sprite;

  constructor(
    private readonly texture: PIXI.Texture,
    public readonly name: ResourceName,
    public readonly sound: CasinoSound
  ) {
    const sprite = new PIXI.Sprite(texture);
    // Устанавливаем ширину / высота спрайта.
    // Считается хорошей практикой хранить текстуры в оригинальном виде, а уже в спрайтах их трансформацию туда, куда вам нужно.
    sprite.width = 175 / 1.5;
    sprite.height = 250 / 1.5;

    // Устанавливаем центр спрайта, который нам понадобится дальше для более удобного перетаскивания карточки.
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;

    // Специальное свойство, которое позволит этому объекту реагировать на интерактивные объекты.
    sprite.interactive = true;

    // Небольшой хинт, чтобы курсор менял на pointer при наведение.
    sprite.buttonMode = true;

    this.sprite = sprite;

    this.registerListeners();
  }

  private registerListeners(): void {
    const onPointerDown = (event: PIXI.InteractionEvent) => {
      if (this.name === 'redNine') {
        this.sound.bredish.play();
      } else if (this.name === 'redSix') {
        this.sound.chtoGovorish.play();
      } else if (this.name === 'redTus') {
        this.sound.fuckYouBullshit.play();
      }
    };

    this.sprite.on('pointerdown', onPointerDown);

    this.sprite.on('pointerover', () => {
      this.sprite.alpha = 0.5;
    });

    this.sprite.on('pointerout', () => {
      this.sprite.alpha = 1;
    });
  }
}

class CasinoControls {
  public readonly container: PIXI.Container;

  constructor(public readonly onShuffle: () => void, public readonly onExit: () => void) {
    this.container = new PIXI.Container();

    this.container.y = 650;
    this.container.x = 550;

    this.init();
  }

  private init(): void {
    // PIXI.TextStyle являвется по сутим обычным типизированны объектом, без магии внутри.
    const style = new PIXI.TextStyle();
    style.fill = 0xffffff;

    // PIXI.Text внутри работает примерно как PIXI.Sprite. Это по сути Bitmap.
    const shuffleText = new PIXI.Text('Shuffle cards', style);
    const exitText = new PIXI.Text('Exit', style);

    // Если просто повесить listener, без interactive=true, то клик отрабатывать не будет.
    shuffleText.on('pointerdown', this.onShuffle);
    exitText.on('pointerdown', this.onExit);
    exitText.x = 200;

    shuffleText.interactive = true;
    exitText.interactive = true;

    // Добавляем работу интерактивности.
    this.container.interactive = true;
    this.container.buttonMode = true;

    // HitArea у this.container НЕ меняется, после добавление туда shuffleText.
    // Надо PIXI.Text воспринимать как PIXI.Sprite, так как понятие "текст" в WebGL не существует.
    // И вообще работать с текстом с точки зрения производительности - это очень дорого. Текст (именно изменение текста, отрисовка) должен быть статичным.
    // Трансформировать сам блок мы можем как угодно.
    this.container.addChild(shuffleText);
    this.container.addChild(exitText);
  }
}

/**
 * Для работы с звуком возьмем библиотеку @pixijs/sound (разработаную авторами pixi.js)
 * Не входит в стандартный набор pixi.js
 * Мы здесь поступаем довольно опасно, так как from метод работает также, как мы подгружали текстуры.
 * То есть, у нас нет уверенности что мы успеем загрузить все звуки к тому их проигрывания.
 * В нашем случае звуки небольшие - от 30-50 кбайт, и они загружаются быстро.
 * Если собираетесь грузить целые песни - лучше это грузить также через static PIXI.Loader.shared готовый лоадер для загрузки ресурсов. (не является часть PIXI.Application)
 * Можно в целом и обычные картинки грузить также, через PIXI.Loader.shared. Но он является глобальным объектом, чем безусловно может вызвать проблемы при работе с большим объемом
 * данных. Либо использовать стандартный core.loader.load
 */
class CasinoSound {
  public loop: PIXISound.Sound;
  public bredish: PIXISound.Sound;
  public exit: PIXISound.Sound;
  public fuckYouBullshit: PIXISound.Sound;
  public huipi: PIXISound.Sound;
  public intro: PIXISound.Sound;
  public chtoGovorish: PIXISound.Sound;
  public coloda: PIXISound.Sound;

  constructor() {
    this.loop = PIXISound.Sound.from(backgroundSound);
    this.loop.autoPlay = false;
    this.bredish = PIXISound.Sound.from(bredishSound);
    this.exit = PIXISound.Sound.from(exitSound);
    this.fuckYouBullshit = PIXISound.Sound.from(fuckYourBullshitSound);
    this.huipi = PIXISound.Sound.from(huipiSound);
    this.intro = PIXISound.Sound.from(introSound);
    this.chtoGovorish = PIXISound.Sound.from(chtoGovorishSound);
    this.coloda = PIXISound.Sound.from(colodaSound);
  }
}
