import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/texture',
      name: 'PixiTexture',
      component: () => import(/* webpackChunkName: "texture" */ './views/pixi-texture.vue')
    },
    {
      path: '/container',
      name: 'PixiContainer',
      component: () => import(/* webpackChunkName: "container" */ './views/pixi-container.vue')
    },
    {
      path: '/graphics',
      name: 'PixiGraphics',
      component: () => import(/* webpackChunkName: "graphics" */ './views/pixi-graphics.vue')
    },
    {
      path: '/sprite',
      name: 'PixiSprite',
      component: () => import(/* webpackChunkName: "sprite" */ './views/pixi-sprite.vue')
    },
    {
      path: '/casino-game',
      name: 'PixiCasinoGame',
      component: () => import(/* webpackChunkName: "casino-game" */ './views/pixi-casino-game.vue')
    },
    {
      path: '/base-64',
      name: 'PixiBase64',
      component: () => import(/* webpackChunkName: "base64" */ './views/pixi-base64.vue')
    }
  ]
})
