<template>
  <div>
    PIXI CONTAINER
  </div>
</template>

<script lang="ts">
import { PixiContainerExample } from '@/code/pixi-container-example';

export default {
  name: 'PixiContainer',
  mounted() {
    const app = new PixiContainerExample();

    console.log(app.core.view);
  }
};
</script>
