<template>
  <div>
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div id="card-type" class="md-body-1">Tumbleweed</div>
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
              <md-field :class="getValidationClass('address')">
                <label for="address">Address</label>
                <md-input name="address" id="address" v-model="form.address" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.address.required">The address is required</span>
                <span class="md-error" v-else-if="!$v.form.address.minlength">Invalid address</span>
              </md-field>
            </div>
          </div>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">Create Tumbleweed</md-button>
        </md-card-actions>
      </md-card>

      <md-snackbar :md-active.sync="tumbleweedSaved">The Tumbleweed {{ lastTumbleweed }} was saved with success!</md-snackbar>
      <md-snackbar :md-active.sync="errorsaving">Unable to save Tumbleweed!</md-snackbar>
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
    name: 'Add_Tumbleweed',
    mixins: [validationMixin],
    data: () => ({
      form: {
        name: null,
        address: null,
      },
      tumbleweedSaved: false,
      sending: false,
      lastTumbleweed: null
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
      }
    },
    methods: {

    ...mapMutations(['to_tumbleweed', 'set_tumbleweed', 'set_tumbleweed_list']),

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
    },
    async saveUser () {
      this.sending = true

      // Instead of this timeout, here you can call your API
      const payload = {name: this.form.name, address: this.form.address}
      try {
        const result = await TWRepository.add_tumbleweed(payload)
        this.lastTumbleweed = `${this.form.name} ${this.form.address}`
        this.tumbleweedSaved = true
        this.sending = false
        this.clearForm()
        this.refreshTumbleweeds()
        const active_tumbleweed = await TWRepository.get_tumbleweed(result.data.info)
        this.to_tumbleweed()
        this.set_tumbleweed(active_tumbleweed.data)
      } catch {
        this.lastTumbleweed = `${this.form.name} ${this.form.address}`;
        this.tumbleweedSaved = false;
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
    async refreshTumbleweeds () {
      const { data } = await TWRepository.get_tumbleweeds()
      this.set_tumbleweed_list(data)
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
