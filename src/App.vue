<template>
  <div id="app">
    <div id="nav">
      <router-link :to="{ name: 'PixiCasinoGame' }"> CASINO GAME </router-link> |
      <router-link :to="{ name: 'PixiContainer' }"> CONTAINER </router-link> |
      <router-link :to="{ name: 'PixiGraphics' }"> GRAPHICS </router-link> |
      <router-link :to="{ name: 'PixiTexture' }"> TEXTURE </router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.canvas {
  width: 1280px;
  height: 720px;
  margin: 0 auto;
}

canvas {
  width: 1280px;
  height: 720px;
}
</style>
