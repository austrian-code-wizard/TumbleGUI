<template>
    <div>
      <md-card>
        <md-card-header>
          <div id="card-type" class="md-body-1">Tumblebase</div>
          <div class="md-display-3">{{tumblebase.name}}</div>
        </md-card-header>
        <md-card-content>
          <md-table>
            <md-table-row>
              <md-table-cell>ID</md-table-cell>
              <md-table-cell>{{tumblebase.id}}</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Created at</md-table-cell>
              <md-table-cell>{{Date(tumblebase.created_at)}}</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Address</md-table-cell>
              <md-table-cell>{{tumblebase.address}}</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Host</md-table-cell>
              <md-table-cell>{{tumblebase.host}}</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Port</md-table-cell>
              <md-table-cell>{{tumblebase.port}}</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Command Route</md-table-cell>
              <md-table-cell>{{tumblebase.command_route}}</md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-content>
        <md-card-actions>
          <md-button @click="to_update_tumblebase">Edit</md-button>
          <md-button @click="delete_Tumblebase(tumblebase.id)">Delete</md-button>
        </md-card-actions>
      </md-card>
      <md-snackbar :md-duration=3000 :md-active.sync="error_on_delete">Failed to delete Tumblebase {{ tumblebase.id }}!</md-snackbar>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { RepositoryFactory } from './../apiRepositories/repositoryFactory'
const TWRepository = RepositoryFactory.get('tumbleWeb')


export default {
  name: 'Tumblebase_Card',
  components: {
  },
  data: () => ({
    error_on_delete: false
  }),
  computed: mapState({
    tumblebase: state => state.active_tumblebase
  }),
  methods: {
    ...mapMutations(['to_update_tumblebase', 'to_welcome', 'set_tumblebase_list']),
    async delete_Tumblebase (id) {
      this.error_on_delete = false
      try {
        const result = await TWRepository.delete_tumblebase(id)
        if (result.status != 200) {
          this.error_on_delete = true
        } else {
        this.to_welcome()
        const { data } = await TWRepository.get_tumblebases()
        this.set_tumblebase_list(data)
      }
      } catch {
        this.error_on_delete = true
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#card-type {
  color: #d69760
}
</style>
