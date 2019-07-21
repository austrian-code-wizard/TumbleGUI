<template>
  <md-list>
    <md-button @click.stop="to_add_tumblebase" class="md-fab-top-center md-primary">
      <md-icon>add</md-icon>
    </md-button>
      <md-list-item v-for="tumblebase in tumblebases" :key="tumblebase.id" @click.stop="to_tumblebase();set_tumblebase(tumblebase);">
        <md-icon>whatshot</md-icon>
        <span class="md-list-item-text">
          {{tumblebase.name}}
        </span>
      </md-list-item>
  </md-list>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { RepositoryFactory } from './../apiRepositories/repositoryFactory'
const TWRepository = RepositoryFactory.get('tumbleWeb')

export default {
  name: 'Tumblebase_List',
  data: () => ({
  }),
  computed: mapState({
    tumblebases: state => state.tumblebase_list
  }),
  methods: {
    async fetchTumblebases () {
      const { data } = await TWRepository.get_tumblebases()
      this.set_tumblebase_list(data)
    },
    ...mapMutations(['to_tumblebase', 'set_tumblebase', 'set_tumblebase_list', 'to_add_tumblebase'])
  },
  beforeMount(){
    this.fetchTumblebases();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
