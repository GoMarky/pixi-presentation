import * as PIXI from 'pixi.js';
import { PixiCoreApp } from '@/code/base-core';
import { getRandomColor } from '@/utils/get-random-color';

export class PixiGraphicsExample extends PixiCoreApp {
  private readonly container: PIXI.Container;

  constructor() {
    super();

    this.container = new PIXI.Container();
  }

  public async init(): Promise<void> {
    const rect = this.drawRect();
    const polygon = this.drawPoly();

    this.activateTicker();
  }

  private drawRect(): void {
    /**
     * PIXI.Rectangle - это не графическая фигура, в классическом понимание. Через нее нельзя что-то нарисовать.
     * Это по сути типизированный объект с свойствами и методами, который внутри содержит только информацию
     * о вершинах геометрии, плюс немного методов которые позволяют взаимодействовать с этими данными, и получать информацию о них.
     */
    const area = new PIXI.Rectangle(100, 100, 200, 200);

    /**
     * PIXI.Graphics это унаследованный от PIXI.Container объект, который имеет собственные методы для отрисовки.
     *
     */
    const rect = new PIXI.Graphics();

    // Здесь как обычно все, рисуем как на родном canvas.
    rect
      .beginFill(getRandomColor())
      .drawRect(area.left, area.top, area.width, area.height)
      .endFill();

    rect.interactive = true;
    rect.buttonMode = true;

    const drawRectangle = () => {
      // Очищаем фигуру (Внимание: очищается только фигура, а не весь Canvas)
      rect.clear();
      rect
        .beginFill(getRandomColor())
        .drawRect(area.left, area.top, area.width, area.height)
        .endFill();
    };

    rect.on('pointerdown', drawRectangle);

    this.container.addChild(rect);
    this.core.stage.addChild(this.container);
  }

  private drawPoly(): void {
    // Аналог PIXI.Rectangle
    const area = new PIXI.Polygon(100, 100, 200, 200, 300, 300, 350, 370, 450, 321, 332, 678);

    /**
     * PIXI.Graphics это унаследованный от PIXI.Container объект, который имеет собственные методы для отрисовки.
     *
     */
    const poly = new PIXI.Graphics();

    // Здесь как обычно все, рисуем как на родном canvas.
    poly
      .beginFill(getRandomColor())
      .drawPolygon(area)
      .endFill();

    poly.interactive = true;
    poly.buttonMode = true;

    const drawPoly = () => {
      // Очищаем фигуру (Внимание: очищается только фигура, а не весь Canvas)
      poly.clear();
      poly
        .beginFill(getRandomColor())
        .drawPolygon(area)
        .endFill();
    };

    poly.on('pointerdown', drawPoly);

    this.container.addChild(poly);
    this.core.stage.addChild(this.container);
  }

  private activateTicker(): void {
    //
  }
}
