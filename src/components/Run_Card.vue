<template>
    <div>
      <form novalidate @submit.prevent="validateUser">
        <md-card class="md-layout-item" v-if="active_run===null">
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
        <md-card class="md-layout-item" v-else>
          <md-card-header>
            <div id="card-type" class="md-display-2">Active: {{active_run.name}}</div>
          </md-card-header>
          <md-card-content>
            <div class="md-display-3">T+ {{time_delta}}</div>
          </md-card-content>
          <md-card-actions>
            <md-button id="stop-button" @click="stop_run">Stop</md-button>
          </md-card-actions>
        </md-card>
        <md-snackbar v-if="active_run!==null" :md-duration=3000 :md-active.sync="error_on_delete">Failed to delete Run {{ active_run.id }}!</md-snackbar>
      </form>

      <form novalidate @submit.prevent="validateUser">
        <md-card class="md-layout-item">
          <md-card-header>
            <div class="md-layout-item">
              <md-field>
                <label for="selected_run_id">Select Run</label>
                <md-select v-model="selected_run_id" name="selected_run_id" id="selected_run_id">
                  <md-option v-for="run in runs" :key="run.id" :value="run.id">{{run.name}}</md-option>
                </md-select>
              </md-field>
            </div>
          </md-card-header>
          <md-card-content>
            <div v-if="selected_run != null">
              <md-table>
                <md-table-row>
                  <md-table-cell>ID</md-table-cell>
                  <md-table-cell>{{selected_run.id}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                  <md-table-cell>Created at</md-table-cell>
                  <md-table-cell>{{selected_run.created_at}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                  <md-table-cell>Ended at</md-table-cell>
                  <md-table-cell>{{selected_run.ended_at}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                  <md-table-cell>Name</md-table-cell>
                  <md-table-cell>{{selected_run.name}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                  <md-table-cell>Description</md-table-cell>
                  <md-table-cell>{{selected_run.description}}</md-table-cell>
                </md-table-row>
              </md-table>
            </div>
            <div class="md-layout md-gutter" v-if="updating == true">
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
          <md-card-actions v-if="(selected_run != null) && (updating==false)">
            <md-button @click="prefillForm(); updating = true">Edit</md-button>
            <md-button @click="delete_Run(selected_run.id)">Delete</md-button>
          </md-card-actions>
          <md-card-actions v-if="updating == true">
            <md-button @click="validateUpdateRun()"> Update </md-button>
          </md-card-actions>
        </md-card>
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
    updating: false,
    interval: null,
    time_delta: null,
    error_on_delete: false,
    errorsaving: false,
    active_run: null,
    runs: [],
    selected_run: null,
    selected_run_id: null,
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
      this.form.name = this.selected_run.name
      this.form.description = this.selected_run.description
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
        this.get_runs()
        if (this.selected_run != null) {
          this.selected_run_id = result.data.info
          this.set_selected_run
        }
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
        const result = await TWRepository.update_run(this.selected_run.id, payload)
        this.lastFormAction = "update"
        this.runSaved = true
        this.sending = false
        this.clearForm()
        this.get_active_run()
        this.get_runs()
        this.set_selected_run(this.selected_run.id)
        this.updating = false
      } catch {
        this.lastFormAction = "update";
        this.runSaved = false;
        this.sending = false;
        this.prefillForm()
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
        this.get_runs()
        this.selected_run_id = null
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
          if (this.selected_run != null) {
            this.set_selected_run(this.selected_run.id)
          }
        }
      } catch {
        this.error_on_delete = true
      }
    },
    async get_runs () {
      try {
        const response = await TWRepository.get_runs_by_tumbleweed_id(this.tumbleweed.id)
        if (response.status != 200) {
          this.error_on_delete = true
        } else {
          this.runs = response.data.reverse()
        }
      } catch {
        this.error_on_delete = true
      }
    },
    async set_selected_run(id) {
      if (id != null) {
        try {
          const response = await TWRepository.get_run(id)
          if (response.status != 200) {
            this.error_on_delete = true
          } else {
            this.selected_run = response.data
          }
        } catch {
          this.error_on_delete = true
        }
      } else {
        this.selected_run = null
      }
    },
    get_time_delta () {
      var start = new Date(this.active_run.created_at)
      var now = new Date()
      var time = ((now.getTime()-start.getTime()) / 1000)
      // Hours, minutes and seconds
      var hrs = ~~(time / 3600);
      var mins = ~~((time % 3600) / 60);
      var secs = ~~time % 60;

      // Output like "1:01" or "4:03:59" or "123:03:59"
      var ret = "";

      if (hrs > 0) {
          ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
      }
      ret += "" + mins + ":" + (secs < 10 ? "0" : "");
      ret += "" + secs;
      this.time_delta = ret;
      return
    },
  },
  beforeMount () {
    this.get_active_run()
    this.get_runs()
  },
  watch: {
    tumbleweed: function (val) {
          this.selected_run_id = null
          this.get_active_run()
          this.get_runs()
    },
    selected_run_id: function(val) {
      this.set_selected_run(val)
      this.updating = false
    },
  },
  mounted() {
    this.interval = setInterval(() => {
      this.get_time_delta();
    },1000);
  },
  destroyed() {
    clearInterval(this.interval);
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
