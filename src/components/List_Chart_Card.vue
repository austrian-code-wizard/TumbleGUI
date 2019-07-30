<template>
    <div class="chart-card">
      <md-table>
        <md-table-row>
          <md-table-cell v-if="chartData[0][0]=='T+'">T+</md-table-cell>
          <md-table-cell v-else>Datetime</md-table-cell>
          <md-table-cell>Data</md-table-cell>
        </md-table-row>
        <md-table-row v-for="datapoint in chartData.slice(1).reverse()">
          <md-table-cell>{{datapoint[0]}}</md-table-cell>
          <md-table-cell>{{datapoint[1]}}</md-table-cell>
        </md-table-row>
      </md-table>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { RepositoryFactory } from './../apiRepositories/repositoryFactory'
const TWRepository = RepositoryFactory.get('tumbleWeb')

export default {
  name: 'List_Chart',
  components: {
  },
  props: ["chartData"],
  data: () => ({
  }),
  computed: mapState({
  }),
  methods: {
    ...mapMutations([])
  },
  watch: {
  },
  beforeMount () {
  }
}

</script>

<style scoped>
.chart-card {
  height: 500px;
  overflow: auto;
}
</style>
