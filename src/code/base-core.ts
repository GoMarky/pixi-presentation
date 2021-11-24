import * as PIXI from 'pixi.js';

export abstract class PixiCoreApp {
  private readonly _core: PIXI.Application;

  protected constructor() {
    // Выставляем разрешение сцены (берем текущее значение ретины)
    // И включаем сглаживание, к черту эти лесенки.
    this._core = new PIXI.Application({ resolution: 1, antialias: true, backgroundColor: 0xcecece });
  }

  public get core() {
    return this._core;
  }

  public abstract init(): Promise<void>;
}
