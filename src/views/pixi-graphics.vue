<template>
  <div>
    <h1>
      PIXI GRAPHICS
    </h1>
    <template>
      <div ref="canvas" class="canvas">
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { PixiGraphicsExample } from '@/code/pixi-graphics';

export default Vue.extend({
  name: 'PixiGraphics',
  async mounted() {
    const app = new PixiGraphicsExample();

    await this.$nextTick();
    const canvasWrapperElement = this.$refs.canvas as HTMLElement;

    app.core.resizeTo = canvasWrapperElement;

    await app.init();

    canvasWrapperElement.appendChild(app.core.view);
  }
});
</script>
