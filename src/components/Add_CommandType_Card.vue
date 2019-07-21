<template>
  <div>
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div id="card-type" class="md-body-1">Command Type</div>
          <div class="md-display-1">Add</div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('type')">
                <label for="type">Type</label>
                <md-input name="type" id="type" v-model="form.type" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.type.required">The type is required</span>
                <span class="md-error" v-else-if="!$v.form.type.minlength">Invalid type</span>
              </md-field>
            </div>

            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('address')">
                <label for="description">Description</label>
                <md-input name="description" id="description" v-model="form.description" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.description.required">The description is required</span>
                <span class="md-error" v-else-if="!$v.form.description.minlength">Invalid description</span>
              </md-field>
            </div>
          </div>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">Create Command Type</md-button>
        </md-card-actions>
      </md-card>

      <md-snackbar :md-active.sync="commandTypeSaved">The Command Type {{ lastCommandType }} was saved with success!</md-snackbar>
      <md-snackbar :md-active.sync="errorsaving">Unable to save command Type!</md-snackbar>
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
    name: 'Add_CommandType',
    mixins: [validationMixin],
    data: () => ({
      form: {
        type: null,
        description: null,
      },
      commandTypeSaved: false,
      sending: false,
      lastCommandType: null
    }),
    validations: {
      form: {
        type: {
          required,
          minLength: minLength(3)
        },
        description: {
          minLength: minLength(2)
        },
      }
    },
    methods: {

    ...mapMutations(['to_commandType', 'set_commandType', 'set_commandType_list']),

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
      this.form.type = null
      this.form.description = null
    },
    async saveUser () {
      this.sending = true

      // Instead of this timeout, here you can call your API
      const payload = {type: this.form.type, description: this.form.description}
      try {
        const result = await TWRepository.add_commandType(payload)
        this.lastCommandType = `${this.form.type} ${this.form.description}`
        this.commandTypeSaved = true
        this.sending = false
        this.clearForm()
        this.refreshCommandTypes()
        const active_commandType = await TWRepository.get_commandType(result.data.info)
        this.to_commandType()
        this.set_commandType(active_commandType.data)
      } catch {
        this.lastCommandType = `${this.form.type} ${this.form.description}`;
        this.commandTypeSaved = false;
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
    async refreshCommandTypes () {
      const { data } = await TWRepository.get_commandTypes()
      this.set_commandType_list(data)
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
