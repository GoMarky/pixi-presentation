<template>
  <div>
    <h1>
      PIXI CONTAINER
    </h1>
    <template>
      <div ref="canvas" class="canvas">
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { PixiContainerExample } from '@/code/pixi-container-example';

export default Vue.extend({
  name: 'PixiContainer',
  async mounted() {
    const app = new PixiContainerExample();

    await this.$nextTick();
    const canvasWrapperElement = this.$refs.canvas as HTMLElement;

    app.core.resizeTo = canvasWrapperElement;

    await app.init();

    app.core.view.oncontextmenu = () => false;
    canvasWrapperElement.appendChild(app.core.view);
  }
});
</script>
