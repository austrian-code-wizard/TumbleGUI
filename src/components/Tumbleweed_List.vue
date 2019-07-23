<template>
  <md-list :md-expand-single="true">
    <md-button @click.stop="to_add_tumbleweed" class="md-fab-top-center md-primary">
    <md-icon>add</md-icon>
    </md-button>
        <md-list-item md-expand v-for="tumbleweed in tumbleweeds" :key="tumbleweed.id" @click.stop="fetchSubSystems(tumbleweed.id);to_tumbleweed();set_tumbleweed(tumbleweed);">
          <md-icon>label</md-icon>
          <span class="md-list-item-text">{{tumbleweed.name}}</span>
          <md-list slot="md-expand" :md-expand-single="true">
            <md-button @click.stop="to_add_subsystem" class="md-fab-top-center md-primary">
              <md-icon>add</md-icon>
            </md-button>
            <md-list-item md-expand class="md-inset" v-for="subsystem in subsystems" :key="subsystem.id" @click.stop="fetchDataSources(subsystem.id);to_subSystem();set_subsystem(subsystem);">
              <md-icon>trending_flat</md-icon>
              <span class="md-list-item-text">{{subsystem.name}}</span>
              <md-list slot="md-expand">
                <md-button @click.stop="to_add_datasource" class="md-fab-top-center md-primary">
        <md-icon>add</md-icon>
      </md-button>
                <md-list-item class="md-inset" v-for="datasource in datasources" :key="datasource.id" @click.stop="to_dataSource();set_datasource(datasource);">
                  <md-icon>keyboard_arrow_right</md-icon>
                  <span class="md-list-item-text">{{datasource.name}}</span>
                </md-list-item>
              </md-list>
            </md-list-item>
          </md-list>
        </md-list-item>
  </md-list>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { RepositoryFactory } from './../apiRepositories/repositoryFactory'
const TWRepository = RepositoryFactory.get('tumbleWeb')

export default {
  name: 'Tumbleweed_List',
  computed: mapState({
    tumbleweeds: state => state.tumbleweed_list,
    subsystems: state => state.subsystem_list,
    datasources: state => state.datasource_list
  }),
  methods: {
    async fetchTumbleweeds () {
      const { data } = await TWRepository.get_tumbleweeds()
      this.set_tumbleweed_list(data)
    },
    async fetchSubSystems (id) {
      const { data } = await TWRepository.get_subsystems_by_tumbleweed_id(id)
      this.set_subsystem_list(data);
    },
    async fetchDataSources (id) {
      const { data } = await TWRepository.get_datasources_by_subsystem_id(id)
      this.set_datasource_list(data)
    },
    ...mapMutations(['to_tumbleweed', 'to_subSystem', 'to_dataSource',
    'to_add_tumbleweed', 'to_add_subsystem', 'to_add_datasource', 'set_tumbleweed',
    'set_subsystem', 'set_datasource','set_tumbleweed_list', 'set_datasource_list',
    'set_subsystem_list', 'to_welcome'])
  },
  beforeMount(){
    this.fetchTumbleweeds();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
