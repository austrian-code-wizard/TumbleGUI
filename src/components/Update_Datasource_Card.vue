<template>
  <div>
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div id="card-type" class="md-body-1">Data Source</div>
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
              <md-field :class="getValidationClass('description')">
                <label for="description">Description</label>
                <md-input name="description" id="description" v-model="form.description" :disabled="sending" />
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('type')">
                <label for="type">Type</label>
                <md-input name="type" id="type" v-model="form.type" :disabled="sending" />
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('short_key')">
                <label for="short_key">Key</label>
                <md-input name="short_key" id="short_key" v-model="form.short_key" :disabled="sending" />
              </md-field>
            </div>

            <div class="md-layout-item">
              <md-field>
                <md-select v-model="form.dtype" name="dtype" id="dtype" placeholder="Data Type">
                  <md-option value="I">Integer</md-option>
                  <md-option value="L">Long</md-option>
                  <md-option value="F">Float</md-option>
                  <md-option value="S">String</md-option>
                  <md-option value="B">Bytes</md-option>
                  <md-option value="M">Image</md-option>
                </md-select>
              </md-field>
            </div>

          </div>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">Update Datasource</md-button>
        </md-card-actions>
      </md-card>

      <md-snackbar :md-active.sync="datasourceSaved">The Data Source {{ lastDatasource }} was updated with success!</md-snackbar>
      <md-snackbar :md-active.sync="errorsaving">Unable to save Data Source {{ lastDataSource }}!</md-snackbar>
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
    name: 'Update_Datasource',
    mixins: [validationMixin],
    computed: mapState({
      subsystem: state => state.active_subsystem,
      datasource: state => state.active_datasource,
    }),
    data: () => ({
      form: {
        name: null,
        description: null,
        type: null,
        short_key: null,
        dtype: null
      },
      datasourceSaved: false,
      sending: false,
      lastDatasource: null
    }),
    validations: {
      form: {
        name: {
          required,
          minLength: minLength(3)
        },
        description: {
        },
        type: {
        },
        short_key: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(2)
        },
        dtype: {
          required
        }
      }
    },
    methods: {

    ...mapMutations(['to_dataSource', 'set_datasource', 'set_datasource_list']),

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
      this.form.type = null
      this.form.dtype = null
      this.form.short_key = null
    },
    async saveUser () {
      this.sending = true

      // Instead of this timeout, here you can call your API
      const payload = {name: this.form.name, description: this.form.description,
      type: this.form.type, dtype: this.form.dtype, short_key: this.form.short_key}
      try {
        const result = await TWRepository.update_datasource(this.datasource.id, payload)
        this.lastDatasource = `${this.form.name} ${this.form.description}`
        this.datasourceSaved = true
        this.sending = false
        this.clearForm()
        this.refreshDatasources()
        const active_datasource = await TWRepository.get_datasource(result.data.info)
        this.to_dataSource()
        this.set_datasource(active_datasource.data)
      } catch {
        this.lastDataSource = `${this.form.name} ${this.form.description}`;
        this.datasourceSaved = false;
        this.sending = false;
        this.$v.$reset()
        this.form.name = this.datasource.name
        this.form.description = this.datasource.description
        this.form.type = this.datasource.type
        this.form.dtype = this.datasource.dtype
        this.form.short_key = this.datasource.short_key
        this.errorsaving = true;
      }
    },
    validateUser () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.saveUser()
      }
    },
    async refreshDatasources () {
      const { data } = await TWRepository.get_datasources_by_subsystem_id(this.subsystem.id)
      this.set_datasource_list(data)
    }
  },
  beforeMount(){
    this.form.name = this.datasource.name
    this.form.description = this.datasource.description
    this.form.type = this.datasource.type
    this.form.dtype = this.datasource.dtype
    this.form.short_key = this.datasource.short_key
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
