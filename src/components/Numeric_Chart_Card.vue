<template>
  <md-card>
    <md-card-content>
      <div>
      <GChart class="chart-card"
        :settings="{packages: ['corechart']}"
        :data="chartData"
        :options="chartOptions"
        :resizeDebounce="500"
        type="LineChart"
      />
    </div>
</md-card-content>
</md-card>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { RepositoryFactory } from './../apiRepositories/repositoryFactory'
const TWRepository = RepositoryFactory.get('tumbleWeb')

export default {
  name: 'Numeric_Chart',
  components: {
  },
  props: ["chartData", "viewMin", "viewMax"],
  data: () => ({
    selected_run: null,
    selected_run_id: null,
    chartOptions: {
      theme: 'material',
      legend: {position: 'none'},
      hAxis: {
        minValue: "auto",
        maxValue: "auto",
      },
    }
  }),
  computed: mapState({
    tumbleweed: state => state.active_tumbleweed,
    datasource: state => state.active_datasource
  }),
  methods: {
    ...mapMutations([])
  },
  watch: {
    viewMin: function (val) {
      this.chartOptions.hAxis.minValue = val
    },
    viewMax: function (val) {
      this.chartOptions.hAxis.maxValue = val
    },
    chartData: function (val) {
      if (val.length <= 1) {
        val.push([this.viewMin, 0])
        this.chartOptions.series = {
            0: {
                color: 'transparent',
            }
        }
      } else {
        this.chartOptions.series = {}
      }
    }
  },
  beforeMount () {
  }
}

</script>

<style scoped>
.chart-card {
  height: 500px
}
</style>
