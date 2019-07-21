<template>
  <md-list>
    <md-button class="md-fab-top-center md-primary">
      <md-icon>add</md-icon>
    </md-button>
      <md-list-item v-for="commandType in commandTypes" :key="commandType.id" @click.stop="to_commandType();set_active_object(commandType);">
        <md-icon>whatshot</md-icon>
        <span class="md-list-item-text">
          {{commandType.type}}
        </span>
      </md-list-item>
  </md-list>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { RepositoryFactory } from './../apiRepositories/repositoryFactory'
const TWRepository = RepositoryFactory.get('tumbleWeb')

export default {
  name: 'CommandType_List',
  data: () => ({
    commandTypes: []
  }),
  methods: {
    async fetchCommandTypes () {
      const { data } = await TWRepository.get_commandTypes()
      this.commandTypes = data
    },
    ...mapMutations(['to_commandType', 'set_active_object'])
  },
  beforeMount(){
    this.fetchCommandTypes();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
