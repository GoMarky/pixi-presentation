import * as PIXI from 'pixi.js';
import { PixiCoreApp } from '@/code/base-core';

import bunny from '@/assets/bunny.png';
import { getRandomColor } from '@/utils/get-random-color';

export class PixiContainerExample extends PixiCoreApp {
  constructor() {
    super();
  }

  public async init() {
    const container = new PIXI.Container();
    const texture = PIXI.Texture.from(bunny);

    const filter = new PIXI.filters.ColorMatrixFilter();

    for (let i = 0; i < 25; i++) {
      // Одну текстуру мы можем переиспользовать сколько угодно раз.
      // Текстуры нужно воспринимать как базовый материал любой элемента.
      // Берете текстуру - и уже меняете ее там. как вам хочется.
      const bunny = new PIXI.Sprite(texture);

      bunny.anchor.set(0.5);
      bunny.x = (i % 5) * 40;
      bunny.y = Math.floor(i / 5) * 40;
      // Мы можем сколько угодно добавлять фильтров на объекты.
      // В данном случае, один фильтр - работает сразу на всех кроликов.
      bunny.filters = [filter];
      container.addChild(bunny);
    }

    container.x = this.core.screen.width / 2;
    container.y = this.core.screen.height / 2;

    // pivot, это условная точка "середины" у контейнера
    // Устанавливаем ее по середине
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;

    /**
     * PIXI.Graphics это унаследованный от PIXI.Container объект, который имеет собственные методы для отрисовки. О нем подробнеее в pixi-graphics.ts
     *
     */
    const rect = new PIXI.Graphics();
    rect.interactive = true;
    rect.buttonMode = true;

    let interval = 1000;

    rect.on('click', () => {
      interval -= 200;
    });

    rect.on('rightclick', () => {
      interval += 200;
    });

    const drawRectangle = () => {
      window.setTimeout(() => {
        // Здесь как обычно все, рисуем как на родном canvas.
        // Если Мы ТУТ НЕ делаем очищение через rect.clear()
        // Это приведет неизбежно к крешу, так как оперативки со временем хватать не будет.

        // Важно понимать, что pixi.js после отрисовки хранится все uvs и вершины и аттрибуты
        // в webgl (и они так и висят там в памяти)
        // При удаление / очищение объектов в pixi.js, тот сразу подчищает эти вершины в webgl, можете быть в этом уверены.

        rect
          .clear()
          .beginFill(getRandomColor())
          .drawRect(0, 0, this.core.screen.width, this.core.screen.height)
          .endFill();

        drawRectangle();
      }, interval);
    };

    // Даже есть rightclick, но нет doubleclick (к сожалению с ним не все так просто)

    drawRectangle();

    let count = 0;

    this.core.stage.addChild(rect);
    this.core.ticker.add((delta) => {
      container.rotation -= 0.01 * delta;

      const { matrix } = filter;

      count += 0.1;

      // Изменяем матрицу цветов
      matrix[1] = Math.sin(count) * 3;
      matrix[2] = Math.cos(count);
      matrix[3] = Math.cos(count) * 1.5;
      matrix[4] = Math.sin(count / 3) * 2;
      matrix[5] = Math.sin(count / 2);
      matrix[6] = Math.sin(count / 4);
    });

    this.core.stage.addChild(container);
  }
}
