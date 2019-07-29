<template>
  <div class="page-container">
    <md-app>
      <md-app-toolbar id="toolbar" class="md-primary">
        <md-button class="md-icon-button" @click="toggleMenu">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">Tumble GUI</span>
        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button">
            <md-icon>refresh</md-icon>
          </md-button>
          <md-button class="md-icon-button">
            <md-icon>more_vert</md-icon>
          </md-button>
        </div>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible" md-persistent="full">
        <md-tabs>
          <md-tab md-label="Tumbleweeds" md-icon="brightness_low">
            <Tumbleweed_List/>
          </md-tab>
          <md-tab md-label="Tumblebases" md-icon="router">
            <Tumblebase_List/>
          </md-tab>
          <md-tab md-label="Command Types" md-icon="call_made">
          <CommandType_List/>
          </md-tab>
        </md-tabs>
      </md-app-drawer>

      <md-app-content>
        <Content />
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Content from './components/Content.vue'
import Tumbleweed_List from './components/Tumbleweed_List.vue'
import Tumblebase_List from './components/Tumblebase_List.vue'
import CommandType_List from './components/CommandType_List.vue'

export default {
  name: 'app',
  components: {
    Content,
    Tumbleweed_List,
    Tumblebase_List,
    CommandType_List,
  },
  data: () => ({
    menuVisible: false,
  }),
  methods: {
    toggleMenu () {
      this.menuVisible = !this.menuVisible
    },
  },
}
</script>

<style lang="scss">

.md-app {
  --md-theme-default-primary: #606060;
  --md-theme-default-accent: #d69760;
  --md-theme-default-theme: "light";
  --md-theme-default-primary-on-background: #d69760;
  --md-theme-default-text-primary-on-primary: #d69760;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 10px;
}

html, body, template, .page-container, .md-app {
  height: 100%
}

.md-app {
  border: 1px solid rgba(#000, .12);
}

.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}

.md-tabs {
    margin-bottom: 24px;
  }
#toolbar{
      position:sticky;
      top:1px;
}
</style>
