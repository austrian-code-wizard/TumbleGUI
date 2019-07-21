<template>
  <div>
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div id="card-type" class="md-body-1">Subsystem</div>
          <div class="md-display-1">Add</div>
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
                <label for="last-name">Description</label>
                <md-input name="description" id="description" v-model="form.description" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.description.required">The description is required</span>
                <span class="md-error" v-else-if="!$v.form.description.minlength">Invalid description</span>
              </md-field>
            </div>
          </div>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">Create SubSystem</md-button>
        </md-card-actions>
      </md-card>

      <md-snackbar :md-active.sync="subSystemSaved">The Sub System {{ lastSubSystem }} was saved with success!</md-snackbar>
      <md-snackbar :md-active.sync="errorsaving">Unable to save Sub System!</md-snackbar>
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
    name: 'Add_SubSystem',
    mixins: [validationMixin],
    computed: mapState({
      tumbleweed: state => state.active_tumbleweed
    }),
    data: () => ({
      form: {
        name: null,
        description: null,
      },
      subSystemSaved: false,
      sending: false,
      lastSubSystem: null
    }),
    validations: {
      form: {
        name: {
          required,
          minLength: minLength(3)
        },
        description: {
        },
      }
    },
    methods: {

    ...mapMutations(['to_subSystem', 'set_subsystem', 'set_subsystem_list']),

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
    async saveUser () {
      this.sending = true

      // Instead of this timeout, here you can call your API
      const payload = {name: this.form.name, description: this.form.description}
      try {
        const result = await TWRepository.add_subsystem(this.tumbleweed.id, payload)
        this.lastSubSystem = `${this.form.name} ${this.form.description}`
        this.subSystemSaved = true
        this.sending = false
        this.clearForm()
        this.refreshSubSystems()
        const active_subsystem = await TWRepository.get_subsystem(result.data.info)
        this.to_subSystem()
        this.set_subsystem(active_subsystem.data)
      } catch {
        this.lastSubSystem = `${this.form.name} ${this.form.description}`;
        this.subSystemSaved = false;
        this.sending = false;
        this.clearForm()
        this.errorsaving = true;
      }
    },
    validateUser () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.saveUser()
      }
    },
    async refreshSubSystems () {
      const { data } = await TWRepository.get_subsystems_by_tumbleweed_id(this.tumbleweed.id)
      this.set_subsystem_list(data)
    }
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
