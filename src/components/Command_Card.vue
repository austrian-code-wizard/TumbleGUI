<template>
  <div id="command-card">
    <md-card>
      <md-card-header>
        <div id="card-type" class="md-body-1">Commands</div>
      </md-card-header>
      <md-card-content v-if="active_run">
        <div class="md-display-1">Send Command</div>
          <form novalidate @submit.prevent="validateAndSendCommand">
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <md-field :class="getValidationClass('command_type_id')">
                  <label for="command_type_id">Command Type</label>
                  <md-select name="command_type_id" id="command_type_id" v-model="form.command_type_id" md-dense>
                    <md-option v-for="commandType in commandTypes" :key="commandType.id" :value="commandType.id">{{commandType.type}}</md-option>
                  </md-select>
                  <span class="md-error">The command type is required</span>
                </md-field>
              </div>

              <div class="md-layout-item md-small-size-100">
                <md-field :class="getValidationClass('tumblebase_id')">
                  <label for="tumblebase_id">Tumblebase</label>
                  <md-select name="tumblebase_id" id="tumblebase_id" v-model="form.tumblebase_id" md-dense>
                    <md-option v-for="tumblebase in tumblebases" :key="tumblebase.id" :value="tumblebase.id">{{tumblebase.name}}</md-option>
                  </md-select>
                  <span class="md-error">The Tumblebase is required</span>
                </md-field>
              </div>

              <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('args')">
                <label for="args">Arguments</label>
                <md-input name="args" id="args" v-model="form.args"/>
                <span class="md-error">Arguments are required</span>
              </md-field>
            </div>
            <md-button type="submit" class="md-layout-item">Send</md-button>
          </div>
        </form>
      </md-card-content>
    </md-card>
      <md-card>
        <md-card-header class="md-layout md-gutter md-alignment-center-space-between">
          <div class="md-layout-item">
            <md-field>
              <label for="selected_run_id">Select Run</label>
              <md-select v-model="selected_run_id" name="selected_run_id" id="selected_run_id">
                <md-option v-for="run in runs" :key="run.id" :value="run.id">{{run.name}}</md-option>
              </md-select>
            </md-field>
          </div>
          <div class="md-layout-item">
            <div class="input">
              <md-checkbox v-model="get_unanswered">Unanswered</md-checkbox>
            </div>
          </div>
        </md-card-header>
        <md-card-content>
          <div class="command-table">
            <md-table v-model="commands" md-sort="id" md-sort-order="desc" md-card md-fixed-header>
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="ID">{{ item.id }}</md-table-cell>
                <md-table-cell md-label="Created At" >T+{{ get_time_delta(item.created_at)}}</md-table-cell>
                <md-table-cell md-label="Base">{{ item.sender_base_id }}</md-table-cell>
                <md-table-cell md-label="CType">{{ item.command_type_id }}</md-table-cell>
                <md-table-cell md-label="Args">{{ item.args }}</md-table-cell>
                <md-table-cell md-label="Trans">{{ item.transmitted }}</md-table-cell>
                <md-table-cell md-label="Resp">{{ item.response }}</md-table-cell>
              </md-table-row>
            </md-table>
          </div>
        </md-card-content>
      </md-card>
    <md-snackbar :md-duration=3000 :md-active.sync="error">{{error_message}}</md-snackbar>
  </div>
</template>

<script>
import {
  required
} from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import { mapState, mapMutations } from 'vuex'
import { RepositoryFactory } from './../apiRepositories/repositoryFactory'
const TWRepository = RepositoryFactory.get('tumbleWeb')

export default {
  name: 'Command_Card',
  mixins: [validationMixin],
  components: {
  },
  data: () => ({
    selected_run: null,
    selected_run_id: null,
    runs: null,
    error: null,
    error_message: null,
    get_unanswered: false,
    interval: null,
    selected_commandType: null,
    selected_commandType_id: null,
    active_run: null,
    commandTypes: [],
    commands: [],
    tumblebases: [],
    form: {
      command_type_id: null,
      tumblebase_id: null,
      args: null
    },
  }),
  validations: {
    form: {
      args: {
      },
      command_type_id: {
        required
      },
      tumblebase_id: {
        required
      }
    }
  },
  computed: mapState({
    tumbleweed: state => state.active_tumbleweed,
    update_runs: state => state.update_runs
  }),
  mounted() {
    this.interval = setInterval(() => {
      this.refresh_commands();
    },5000),
    this.refresh_commands()
  },
  destroyed() {
    clearInterval(this.interval);
  },
  beforeMount () {
    this.get_active_run()
    this.get_runs()
    this.get_commandTypes()
    this.get_tumblebases()
  },
  watch: {
    selected_run_id: function () {
      this.refresh_commands();
    },
    get_unanswered: function() {
      this.refresh_commands();
    },
    tumbleweed: function() {
      this.get_active_run()
      this.get_runs()
      this.get_commandTypes()
      this.get_tumblebases()
    },
    update_runs: function() {
      this.set_update_runs_false()
      this.get_active_run()
      this.get_runs()
      this.get_commandTypes()
      this.get_tumblebases()
    }
  },
  methods: {
    ...mapMutations(['set_update_runs_false']),
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    validateAndSendCommand () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.send_command()
      }
    },
    clearForm () {
      this.$v.$reset()
      this.form.args = null
      this.form.command_type_id = null
      this.form.tumblebase_id = null
    },
    async send_command () {
      this.error = false
      if (this.form.args == null) {
        this.form.args = ""
      }
      const payload = {args: this.form.args, response: null, received_response_at: null, response_message_id: null}
      try {
        const result = await TWRepository.send_command(this.tumbleweed.id, this.form.tumblebase_id, this.form.command_type_id, payload)
        if (result.status != 200) {
          this.error_message = "Failed to send command"
          this.error = true
          this.clearForm()
        } else {
          this.clearForm()
          if (this.get_unanswered == true) {
            this.get_commands_by_run_and_tumbleweed_id()
          } else {
            this.get_unanswered_commands_by_run_and_tumbleweed_id()
          }
        }
      } catch {
        this.error_message = "Failed to send command"
        this.error = true
        this.clearForm()
      }
    },
    refresh_commands () {
      if (this.get_unanswered == false) {
        this.get_commands_by_run_and_tumbleweed_id()
      } else {
        this.get_unanswered_commands_by_run_and_tumbleweed_id()
      }
    },
    async get_runs () {
      this.error = false
      try {
        const response = await TWRepository.get_runs_by_tumbleweed_id(this.tumbleweed.id)
        if (response.status != 200) {
          this.error_message = "Failed to fetch runs"
          this.error = true
        } else {
          this.runs = response.data.reverse()
        }
      } catch {
        this.error_message = "Failed to fetch runs"
        this.error = true
      }
    },
    async get_commandTypes () {
      this.error = false
      try {
        const response = await TWRepository.get_commandTypes()
        if (response.status != 200) {
          this.error_message = "Failed to fetch command Types"
          this.error = true
        } else {
          this.commandTypes = response.data.reverse()
        }
      } catch {
        this.error_message = "Failed to fetch comand Types"
        this.error = true
      }
    },
    async get_commands_by_run_and_tumbleweed_id () {
      this.error = false
      if (this.selected_run_id != null) {
        try {
          const response = await TWRepository.get_commands_by_tumbleweed_id_and_run_id(this.tumbleweed.id, this.selected_run_id)
          if (response.status != 200) {
            this.error_message = "Failed to fetch commands"
            this.error = true
          } else {
            this.commands = response.data.reverse()
          }
        } catch {
          this.error_message = "Failed to fetch commands"
          this.error = true
        }
      }
    },
    async get_unanswered_commands_by_run_and_tumbleweed_id () {
      this.error = false
      if (this.selected_run_id != null) {
        try {
          const response = await TWRepository.get_unanswered_commands_by_tumbleweed_id_and_run_id(this.tumbleweed.id, this.selected_run_id)
          if (response.status != 200) {
            this.error_message = "Failed to fetch commands"
            this.error = true
          } else {
            this.commands = response.data.reverse()
          }
        } catch {
          this.error_message = "Failed to fetch commands"
          this.error = true
        }
      }
    },
    async get_tumblebases () {
      this.error = false
      try {
        const response = await TWRepository.get_tumblebases()
        if (response.status != 200) {
          this.error_message = "Failed to tumblebases"
          this.error = true
        } else {
          this.tumblebases = response.data.reverse()
        }
      } catch {
        this.error_message = "Failed to fetch tumblebases"
        this.error = true
      }
    },
    async get_active_run () {
      try {
        const response = await TWRepository.get_active_run(this.tumbleweed.id)
        if (response.status != 200) {
          this.active_run = false
          return
        } else {
          this.selected_run_id = response.data.id
          this.selected_run = response.data
          this.active_run = true
        }
      } catch {
        this.active_run = false
      }
    },
    get_time_delta (iso) {
        var start = new Date(iso)
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
        return ret
    },
  }
}


</script>

<style scoped>
#card-type {
  color: #d69760
}
.command-table {
  overflow: auto;
  width: 100%;
  height: 100%;
}
.md-table .md-table-cell {
  text-align: left;
}
</style>
