<template>
    <div>
      <md-card>
        <md-card-header>
          <div id="card-type" class="md-body-1">Tumbleweed</div>
          <div class="md-display-3">{{tumbleweed.name}}</div>
        </md-card-header>
        <md-card-content>
          <md-table>
            <md-table-row>
              <md-table-cell>ID</md-table-cell>
              <md-table-cell>{{tumbleweed.id}}</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Created at</md-table-cell>
              <md-table-cell>{{Date(tumbleweed.created_at)}}</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Address</md-table-cell>
              <md-table-cell>{{tumbleweed.address}}</md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-content>
        <md-card-actions>
          <md-button @click="to_update_tumbleweed">Edit</md-button>
          <md-button @click="delete_Tumbleweed(tumbleweed.id)">Delete</md-button>
        </md-card-actions>
      </md-card>
      <md-snackbar :md-duration=3000 :md-active.sync="error_on_delete">Failed to delete Tumbleweed {{ tumbleweed.id }}!</md-snackbar>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { RepositoryFactory } from './../apiRepositories/repositoryFactory'
const TWRepository = RepositoryFactory.get('tumbleWeb')


export default {
  name: 'Tumbleweed_Card',
  components: {
  },
  data: () => ({
    error_on_delete: false
  }),
  computed: mapState({
    tumbleweed: state => state.active_tumbleweed
  }),
  methods: {
    ...mapMutations(['to_update_tumbleweed', 'to_welcome', 'set_tumbleweed_list']),
    async delete_Tumbleweed (id) {
      this.error_on_delete = false
      try {
        const result = await TWRepository.delete_tumbleweed(id)
        if (result.status != 200) {
          this.error_on_delete = true
        } else {
        this.to_welcome()
        const { data } = await TWRepository.get_tumbleweeds()
        this.set_tumbleweed_list(data)
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
