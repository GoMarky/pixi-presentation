import * as PIXI from 'pixi.js';
import { PixiCoreApp } from '@/code/base-core';

import bunny from '@/assets/bunny.png';
import { getRandomColor } from '@/utils/get-random-color';

export class PixiTextureExample extends PixiCoreApp {
  private readonly container: PIXI.Container;

  constructor() {
    super();

    this.container = new PIXI.Container();

    this.core.stage.addChild(this.container);
  }

  private drawGraphicsAsTexture(): void {
    // Опять рисуем стандартную геометрию.
    const circle = new PIXI.Graphics();
    circle
      .beginFill(getRandomColor())
      .drawCircle(100, 250, 150)
      .endFill();

    // generateTexture принимает на вход также параметр region,
    // Благодаря которому, мы можем превращать в текстуру не весь объект, а лишь его часть.
    // Это может быть удобным, если мы например что-то вырезаем из объекта. (один из вариантов)
    const texture = this.core.renderer.generateTexture(circle, {
      resolution: 1,
      scaleMode: PIXI.SCALE_MODES.LINEAR,
      multisample: PIXI.MSAA_QUALITY.NONE // Даже не передается цвет, а только лишь позиции пикселей, если хотим хорошо сохранить текстуру, то PIXI.MSAA_QUALITY.HIGH
    });
    const sprite = new PIXI.Sprite(texture);

    this.container.addChild(sprite);
  }

  private drawBunnies(): void {
    const container = new PIXI.Container();
    const texture = PIXI.Texture.from(bunny);

    for (let i = 0; i < 25; i++) {
      const bunny = new PIXI.Sprite(texture);
      bunny.x = (i % 5) * 30;
      bunny.y = Math.floor(i / 5) * 30;
      bunny.rotation = Math.random() * (Math.PI * 2);
      container.addChild(bunny);
    }

    // Создаем базовую текстуру, без явного указания что в ней будет
    // Пока указываем лишь размеры, разрешение текстуры, и непосредственно алгоритм сжатия / разжатия текстуры
    const brt = new PIXI.BaseRenderTexture({
      width: 300,
      height: 300,
      scaleMode: PIXI.SCALE_MODES.LINEAR,
      resolution: 1
    });

    // Это класс текстуры, куда будут складывается данные, при рендере объектов унаследованных от PIXI.DisplayObject (например PIXI.Sprite)
    const rt = new PIXI.RenderTexture(brt);
    // Связаемый наш спрайт - и текстуру. Теперь любое изменение текстуры const rt, будет увидено спрайтом. А тот сообщит об этом своему родителю, и заставит перенредериться.
    const sprite = new PIXI.Sprite(rt);

    sprite.x = 450;
    sprite.y = 60;
    this.core.stage.addChild(sprite);

    container.x = 100;
    container.y = 60;
    this.core.stage.addChild(container);

    // Важный момент render - это метод, который не вызывает рендер всей сцены
    // Этот метод берет графические объекты, и рендерит их либо в canvas, либо в RenderTexture (если указать, так как параметр опционален.)
    this.core.renderer.render(container, { renderTexture: rt });

    // В следствие чего, получается магия.
    // Вместо того чтобы рендерить 50 кроликов, и мучаться с их позиционированием
    // Мы отрендерили 25 кроликов на сцену, сделали из них текстуру - и добавили их точную копию на сцену.

    this.container.addChild(container);
  }

  public async init(): Promise<void> {
    this.drawBunnies();
    this.drawGraphicsAsTexture();
  }
}
