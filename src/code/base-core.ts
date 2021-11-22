import * as PIXI from 'pixi.js';

export class PixiCoreApp {
  private readonly _core: PIXI.Application;

  constructor() {
    this._core = new PIXI.Application();
  }

  public get core() {
    return this._core;
  }
}
