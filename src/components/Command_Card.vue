<template>
  <div>
    <md-card class="md-layout-item">
      <md-card-header>
        <div class="md-display-1">Commands</div>
      </md-card-header>
      <md-card-content>
        <div class="md-display-1">Test</div>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  email,
  minLength,
  maxLength
} from 'vuelidate/lib/validators'
import { mapState, mapMutations } from 'vuex'
import { RepositoryFactory } from './../apiRepositories/repositoryFactory'
const TWRepository = RepositoryFactory.get('tumbleWeb')

export default {
  name: 'Command_Card',
  mixins: [validationMixin],
  components: {
  },
  data: () => ({
  })
}

</script>

<style scoped>
</style>
