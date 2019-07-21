<template>
  <md-list>
    <md-button @click.stop="to_add_commandType()" class="md-fab-top-center md-primary">
      <md-icon>add</md-icon>
    </md-button>
      <md-list-item v-for="commandType in commandTypes" :key="commandType.id" @click.stop="to_commandType();set_commandType(commandType);">
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
  computed: mapState({
    commandTypes: state => state.commandType_list
  }),
  data: () => ({
  }),
  methods: {
    async fetchCommandTypes () {
      const { data } = await TWRepository.get_commandTypes()
      this.set_commandType_list(data)
    },
    ...mapMutations(['to_commandType', 'set_commandType', 'set_commandType_list', 'to_add_commandType'])
  },
  beforeMount(){
    this.fetchCommandTypes();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
