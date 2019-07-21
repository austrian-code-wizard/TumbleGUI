<template>
    <div>
      <md-card>
        <md-card-header>
          <div id="card-type" class="md-body-1">Subsystem</div>
          <div class="md-display-3">{{subsystem.name}}</div>
        </md-card-header>
        <md-card-content>
          <md-table>
            <md-table-row>
              <md-table-cell>ID</md-table-cell>
              <md-table-cell>{{subsystem.id}}</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Created at</md-table-cell>
              <md-table-cell>{{Date(subsystem.created_at)}}</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Tumbleweed ID</md-table-cell>
              <md-table-cell>{{subsystem.tumbleweed_id}}</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Description</md-table-cell>
              <md-table-cell>{{subsystem.description}}</md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-content>
        <md-card-actions>
          <md-button @click="to_update_subsystem">Edit</md-button>
          <md-button @click="delete_Subsystem(subsystem.id)">Delete</md-button>
        </md-card-actions>
      </md-card>
      <md-snackbar :md-duration=3000 :md-active.sync="error_on_delete">Failed to delete Subsystem {{ subsystem.id }}!</md-snackbar>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { RepositoryFactory } from './../apiRepositories/repositoryFactory'
const TWRepository = RepositoryFactory.get('tumbleWeb')


export default {
  name: 'SubSystem_Card',
  components: {
  },
  data: () => ({
    error_on_delete: false
  }),
  computed: mapState({
    tumbleweed: state => state.active_tumbleweed,
    subsystem: state => state.active_subsystem
  }),
  methods: {
    ...mapMutations(['to_update_subsystem', 'to_welcome', 'set_subsystem_list']),
    async delete_Subsystem (id) {
      this.error_on_delete = false
      try {
        const result = await TWRepository.delete_subsystem(id)
        if (result.status != 200) {
          this.error_on_delete = true
        } else {
        this.to_welcome()
        const { data } = await TWRepository.get_subsystems_by_tumbleweed_id(this.tumbleweed.id)
        this.set_subsystem_list(data)
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
