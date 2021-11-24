<template>
  <div>
    <h1>
      PIXI TEXTURE
    </h1>
    <template>
      <div ref="canvas" class="canvas">
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { PixiTextureExample } from '@/code/pixi-texture-example';

export default Vue.extend({
  name: 'PixiTexture',
  async mounted() {
    const app = new PixiTextureExample();

    const canvasWrapperElement = this.$refs.canvas as HTMLElement;
    app.core.resizeTo = canvasWrapperElement;

    await app.init();

    app.core.view.oncontextmenu = () => false;
    canvasWrapperElement.appendChild(app.core.view);
  }
});
</script>
