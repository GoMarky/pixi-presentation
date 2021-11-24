<template>
  <div>
    <h1>
      PIXI CASINO
    </h1>
    <template>
      <template v-if="isStarted">
        <div v-if="isLoading">
          Loading assets...
        </div>
        <div v-else ref="canvas" class="canvas">

        </div>
      </template>
      <template v-else>
        <button type="button" @click="startGame()">
          Click to start
        </button>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { PixiCasinoGame } from '@/code/pixi-casino-game';

export default Vue.extend({
  name: 'PixiCasino',
  data: () => ({
    isLoading: true,
    isError: false,
    isStarted: false
  }),
  methods: {
    async startGame() {
      if (this.isStarted) {
        return;
      }

      this.isStarted = true;

      const app = new PixiCasinoGame();

      // Если корневой элемент удаляется, то значит сцены больше нет.
      // Подпишемся на это событие, чтобы иметь возможность добавить сцену заново.
      app.core.stage.on('destroyed', () => {
        this.isStarted = false;
        this.isLoading = true;
      });

      try {
        await app.init();

        // start делать не обязательно (по умолчанию autoStart=true), но для наглядности вызовем.
        app.core.start();

        // Вызов stop запрещает ререндер любых объектов на сцене. Актуально например при использование паузы в игре.
        // app.core.stop();

        this.isLoading = false;

        await this.$nextTick();
        const canvasWrapperElement = this.$refs.canvas as HTMLElement;

        // Сделаем наш canvas по размерам как родительский блок.
        app.core.resizeTo = canvasWrapperElement;

        // ВАЖНЫЙ МОМЕНТ
        // Мы добавляем все canvas только после того как закончили работу с текстурами, спрайтами.
        // Тут все примерно как в DOM дереве. Сначало делаем все манипуляции с данными, объектами, и только после этого
        // передаем на отрисовку браузера. Экономим ресурсы.

        // PIXI.Application по умолчанию самостоятельно создает view (HTMLCanvasElement), если аргумент { view } пустой.
        // Мы можем его самостоятельно прокидывать, если он уже есть на странице, через параметр { view: canvasElement }
        // Либо использовать тот, который создает PIXI.
        canvasWrapperElement.appendChild(app.core.view);

        app.core.view.oncontextmenu = () => false;
      } catch (error) {
        this.isLoading = false;
        this.isError = true;
      }
    }
  }
});
</script>

