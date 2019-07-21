<template>
    <div>
      <md-card>
        <md-card-header>
          <div id="card-type" class="md-body-1">Datasource</div>
          <div class="md-display-3">{{datasource.name}}</div>
        </md-card-header>
        <md-card-content>
          <md-table>
            <md-table-row>
              <md-table-cell>ID</md-table-cell>
              <md-table-cell>{{datasource.id}}</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Created at</md-table-cell>
              <md-table-cell>{{Date(datasource.created_at)}}</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Subsystem ID</md-table-cell>
              <md-table-cell>{{datasource.subsystem_id}}</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Description</md-table-cell>
              <md-table-cell>{{datasource.description}}</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Short key</md-table-cell>
              <md-table-cell>{{datasource.short_key}}</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Data Type</md-table-cell>
              <md-table-cell>{{datasource.dtype}}</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Source Type</md-table-cell>
              <md-table-cell>{{datasource.type}}</md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-content>
        <md-card-actions>
          <md-button @click="to_update_datasource">Edit</md-button>
          <md-button @click="delete_Datasource(datasource.id)">Delete</md-button>
        </md-card-actions>
      </md-card>
      <md-snackbar :md-duration=3000 :md-active.sync="error_on_delete">Failed to delete Datasource {{ datasource.id }}!</md-snackbar>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { RepositoryFactory } from './../apiRepositories/repositoryFactory'
const TWRepository = RepositoryFactory.get('tumbleWeb')


export default {
  name: 'DatasourceCard',
  components: {
  },
  data: () => ({
    error_on_delete: false
  }),
  computed: mapState({
    subsystem: state => state.active_subsystem,
    datasource: state => state.active_datasource
  }),
  methods: {
    ...mapMutations(['to_update_datasource', 'to_welcome', 'set_datasource_list']),
    async delete_Datasource (id) {
      this.error_on_delete = false
      try {
        const result = await TWRepository.delete_datasource(id)
        if (result.status != 200) {
          this.error_on_delete = true
        } else {
        this.to_welcome()
        const { data } = await TWRepository.get_datasources_by_subsystem_id(this.subsystem.id)
        this.set_datasource_list(data)
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
