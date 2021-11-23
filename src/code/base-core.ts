import * as PIXI from 'pixi.js';

export abstract class PixiCoreApp {
  private readonly _core: PIXI.Application;

  protected constructor() {
    this._core = new PIXI.Application();
  }

  public get core() {
    return this._core;
  }

  public abstract init(): Promise<void>;
}
