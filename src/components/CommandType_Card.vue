<template>
    <div>
      <md-card>
        <md-card-header>
          <div id="card-type" class="md-body-1">Command Type</div>
          <div class="md-display-3">{{commandType.type}}</div>
        </md-card-header>
        <md-card-content>
          <md-table>
            <md-table-row>
              <md-table-cell>ID</md-table-cell>
              <md-table-cell>{{commandType.id}}</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Created at</md-table-cell>
              <md-table-cell>{{Date(commandType.created_at)}}</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Description</md-table-cell>
              <md-table-cell>{{commandType.description}}</md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-content>
        <md-card-actions>
          <md-button @click="to_update_commandType">Edit</md-button>
          <md-button @click="delete_commandType(commandType.id)">Delete</md-button>
        </md-card-actions>
      </md-card>
      <md-snackbar :md-duration=3000 :md-active.sync="error_on_delete">Failed to delete Command Type {{ commandType.id }}!</md-snackbar>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { RepositoryFactory } from './../apiRepositories/repositoryFactory'
const TWRepository = RepositoryFactory.get('tumbleWeb')


export default {
  name: 'CommandType_Card',
  components: {
  },
  data: () => ({
    error_on_delete: false
  }),
  computed: mapState({
    commandType: state => state.active_commandType
  }),
  methods: {
    ...mapMutations(['to_update_commandType', 'to_welcome', 'set_commandType_list']),
    async delete_commandType (id) {
      this.error_on_delete = false
      try {
        const result = await TWRepository.delete_commandType(id)
        if (result.status != 200) {
          this.error_on_delete = true
        } else {
        this.to_welcome()
        const { data } = await TWRepository.get_commandTypes()
        this.set_commandType_list(data)
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
