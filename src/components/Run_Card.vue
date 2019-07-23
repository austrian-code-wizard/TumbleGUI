<template>
    <div>
      <form novalidate @submit.prevent="validateUser">
        <md-card class="md-layout-item md-size-50 md-small-size-100" v-if="active_run===null">
          <md-card-header>
              <div id="card-type" class="md-display-2">Not active</div>
          </md-card-header>
          <md-card-content>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <md-field :class="getValidationClass('name')">
                  <label for="name">Name</label>
                  <md-input name="name" id="name" v-model="form.name" :disabled="sending" />
                  <span class="md-error" v-if="!$v.form.name.required">The name is required</span>
                  <span class="md-error" v-else-if="!$v.form.name.minlength">Invalid name</span>
                </md-field>
              </div>

              <div class="md-layout-item md-small-size-100">
                <md-field :class="getValidationClass('description')">
                  <label for="description">Description</label>
                  <md-input name="description" id="description" v-model="form.description" :disabled="sending" />
                  <span class="md-error" v-if="!$v.form.description.required">The description is required</span>
                  <span class="md-error" v-else-if="!$v.form.description.minlength">Invalid description</span>
                </md-field>
              </div>
            </div>
          </md-card-content>
          <md-card-actions>
            <md-button id="start-button" @click="validateStartRun">Start</md-button>
          </md-card-actions>
        </md-card>
        <md-card class="md-layout-item md-size-50 md-small-size-100" v-else>
          <md-card-header>
            <div id="card-type" class="md-display-2">Active: {{active_run.name}}</div>
          </md-card-header>
          <md-card-content>
          </md-card-content>
          <md-card-actions>
            <md-button id="stop-button" @click="stop_run">Stop</md-button>
          </md-card-actions>
        </md-card>
        <md-snackbar v-if="active_run!==null" :md-duration=3000 :md-active.sync="error_on_delete">Failed to delete Run {{ active_run.id }}!</md-snackbar>
      </form>
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
  name: 'Run_Card',
  mixins: [validationMixin],
  components: {
  },
  data: () => ({
    error_on_delete: false,
    errorsaving: false,
    active_run: null,
    form: {
      name: null,
      description: null,
    },
    runSaved: false,
    sending: false,
    lastFormAction: null
  }),
  validations: {
    form: {
      name: {
        required,
        minLength: minLength(3)
      },
      description: {
        minLength: minLength(3)
      },
    }
  },
  computed: mapState({
    tumbleweed: state => state.active_tumbleweed
  }),
  methods: {
    ...mapMutations(['to_update_run', 'to_welcome']),
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    clearForm () {
      this.$v.$reset()
      this.form.name = null
      this.form.description = null
    },
    prefillForm () {
      this.$v.$reset()
      this.form.name = this.active_run.name
      this.form.description = this.active_run.description
    },
    validateUpdateRun () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.updateRun()
      }
    },
    validateStartRun () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.startRun()
      }
    },
    async startRun () {
      this.sending = true

      // Instead of this timeout, here you can call your API
      const payload = {name: this.form.name, description: this.form.description}
      try {
        const result = await TWRepository.start_run(this.tumbleweed.id, payload)
        this.lastFormAction = "start"
        this.runSaved = true
        this.sending = false
        this.clearForm()
        this.get_active_run()
      } catch {
        this.lastFormAction = "start";
        this.runSaved = false;
        this.sending = false;
        this.clearForm()
        this.errorsaving = true;
      }
    },
    async updateRun () {
      this.sending = true

      // Instead of this timeout, here you can call your API
      const payload = {name: this.form.name, description: this.form.description}
      try {
        const result = await TWRepository.update_run(this.active_run.id, payload)
        this.lastFormAction = "update"
        this.runSaved = true
        this.sending = false
        this.clearForm()
        this.get_active_run()
      } catch {
        this.lastFormAction = "update";
        this.runSaved = false;
        this.sending = false;
        this.clearForm()
        this.errorsaving = true;
      }
    },
    async delete_Run (id) {
      this.error_on_delete = false
      try {
        const result = await TWRepository.delete_run(id)
        if (result.status != 200) {
          this.error_on_delete = true
        } else {
        this.get_active_run()
        }
      } catch {
        this.error_on_delete = true
      }
    },
    async get_active_run () {
      try {
        const response = await TWRepository.get_active_run(this.tumbleweed.id)
        if (response.status != 200) {
          this.active_run = null
        } else {
        this.active_run = response.data
        }
      } catch {
        this.active_run = null
      }
    },
    async stop_run () {
      try {
        const response = await TWRepository.stop_run(this.tumbleweed.id)
        if (response.status != 200) {
          this.error_on_delete = true
        } else {
          this.get_active_run()
        }
      } catch {
        this.error_on_delete = true
      }
    }
  },
  beforeMount () {
    this.get_active_run()
  },
  watch: {
    tumbleweed: function (val) {
          this.get_active_run()
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#card-type {
  padding: 5px;
}
#stop-button {
  color: white;
  background-color: #ff3d00;
}
#start-button {
  color: white;
  background-color: #64dd17;
}
</style>
