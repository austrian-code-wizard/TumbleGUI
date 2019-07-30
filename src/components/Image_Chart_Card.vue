<template>
    <div class="chart-card">
      <md-card v-for="datapoint in chartData.slice(1).reverse()">
        <md-card-header>
          <div v-if="Object.prototype.toString.call(datapoint[0]) === '[object Date]'" class="md-primary md-caption">{{datapoint[0].toISOString()}}</div>
          <div v-else class="md-primary md-caption">T+ {{datapoint[0]}} </div>
        </md-card-header>
        <md-card-media md-small>
          <img :src="getImageSource(datapoint[1])" alt="Cover">
        </md-card-media>
      </md-card>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { RepositoryFactory } from './../apiRepositories/repositoryFactory'
const TWRepository = RepositoryFactory.get('tumbleWeb')

export default {
  name: 'Image_Chart',
  components: {
  },
  props: ["chartData"],
  data: () => ({
  }),
  computed: mapState({
    tumbleweed: state => state.active_tumbleweed,
    datasource: state => state.active_datasource
  }),
  methods: {
    ...mapMutations([]),
    getImageSource(data) {
      return "data:image/jpg;base64, " + data
    }
  },
  watch: {
  },
  beforeMount () {
  }
}

</script>

<style scoped>
.md-card {
    width: 180px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
}
</style>
