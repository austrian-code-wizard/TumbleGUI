<template>
  <div>
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div id="card-type" class="md-body-1">Tumblebase</div>
          <div class="md-display-1">Update</div>
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
              <md-field :class="getValidationClass('address')">
                <label for="address">Address</label>
                <md-input name="address" id="address" v-model="form.address" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.address.required">The address is required</span>
                <span class="md-error" v-else-if="!$v.form.address.minlength">Invalid address</span>
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('host')">
                <label for="host">Host</label>
                <md-input name="host" id="host" v-model="form.host" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.host.required">The host is required</span>
                <span class="md-error" v-else-if="!$v.form.host.minlength">Invalid host</span>
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('port')">
                <label for="port">Port</label>
                <md-input name="port" id="port" v-model="form.port" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.port.required">The port is required</span>
                <span class="md-error" v-else-if="!$v.form.port.minlength">Invalid port</span>
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('command_route')">
                <label for="command_route">Command API Route</label>
                <md-input name="command_route" id="command_route" v-model="form.command_route" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.command_route.required">The command api route is required</span>
                <span class="md-error" v-else-if="!$v.form.command_route.minlength">Invalid command api route</span>
              </md-field>
            </div>
          </div>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">Update Tumblebase</md-button>
        </md-card-actions>
      </md-card>

      <md-snackbar :md-active.sync="tumblebaseSaved">The Tumblebase {{ lastTumblebase }} was updated with success!</md-snackbar>
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
    name: 'Update_Tumblebase',
    mixins: [validationMixin],
    data: () => ({
      form: {
        name: null,
        address: null,
        host: null,
        port: null,
        command_type: null
      },
      tumblebaseSaved: false,
      sending: false,
      lastTumblebase: null
    }),
    validations: {
      form: {
        name: {
          required,
          minLength: minLength(3)
        },
        address: {
          required,
          minLength: minLength(8)
        },
        host: {
          required,
          minLength: minLength(7)
        },
        port: {
        },
        command_route: {
        }
      }
    },
    computed: mapState({
      tumblebase: state => state.active_tumblebase,
    }),
    methods: {

    ...mapMutations(['to_tumblebase', 'set_tumblebase', 'set_tumblebase_list']),

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
      this.form.address = null
      this.form.host = null
      this.form.port = null
      this.form.command_route = null
    },
    async saveUser () {
      this.sending = true

      // Instead of this timeout, here you can call your API
      const payload = {name: this.form.name, address: this.form.address,
        host: this.form.host, port: this.form.port,
        command_route: this.form.command_route}
      const result = await TWRepository.update_tumblebase(this.tumblebase.id, payload)
      this.lastTumblebase = `${this.form.name} ${this.form.address}`
      this.tumblebaseSaved = true
      this.sending = false
      this.clearForm()
      this.refreshTumblebases()
      const active_tumblebase = await TWRepository.get_tumblebase(result.data.info)
      this.to_tumblebase()
      this.set_tumblebase(active_tumblebase.data)
    },
    validateUser () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.saveUser()
      }
    },
    async refreshTumblebases () {
      const { data } = await TWRepository.get_tumblebases()
      this.set_tumblebase_list(data)
    }
  },
  beforeMount(){
    this.form.name = this.tumblebase.name;
    this.form.address = this.tumblebase.address;
    this.form.host = this.tumblebase.host;
    this.form.port = this.tumblebase.port;
    this.form.command_route = this.tumblebase.command_route;
  }
}
</script>

<style lang="scss" scoped>
  .md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }
  #card-type {
    color: #d69760
  }
</style>
