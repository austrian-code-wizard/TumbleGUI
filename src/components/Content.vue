<template>
  <div class="content-wrapper">
    <template v-if="get_type=='welcome'">
      <md-card>
          <md-card-header>
            <div class="md-title">Welcome to Tumble GUI</div>
          </md-card-header>

          <md-card-content>
            This is a user interface to control and analyze tumbleweeds.
          </md-card-content>
      </md-card>
    </template>
    <template v-else-if="get_type=='add_tumbleweed'">
      <Add_Tumbleweed/>
    </template>
    <template v-else-if="get_type=='add_subsystem'">
      <Add_SubSystem/>
    </template>
    <template v-else-if="get_type=='add_datasource'">
      <Add_Datasource/>
    </template>
    <template v-else-if="get_type=='add_tumblebase'">
      <Add_Tumblebase/>
    </template>
    <template v-else-if="get_type=='tumbleweed'">
      <Tumbleweed_Card/>
    </template>
    <template v-else-if="get_type=='subSystem'">
      <SubSystem_Card/>
    </template>
    <template v-else-if="get_type=='dataSource'">
      <DatasourceCard/>
    </template>
    <template v-else-if="get_type=='tumblebase'">
      <Tumblebase_Card/>
    </template>
    <template v-else-if="get_type=='update_tumbleweed'">
      <Update_Tumbleweed/>
    </template>
    <template v-else-if="get_type=='update_subsystem'">
      <Update_SubSystem/>
    </template>
    <template v-else-if="get_type=='update_datasource'">
      <Update_Datasource/>
    </template>
    <template v-else-if="get_type=='update_tumblebase'">
      <Update_Tumblebase/>
    </template>
    <template v-else>
      <md-card>
        <md-card-header>
          <div class="md-title">{{get_obj.name}}</div>
        </md-card-header>
        <md-card-content>
          ID: {{get_obj.id}}
          Created at: {{get_obj.created_at}}
        </md-card-content>
        <md-card-actions>
          <md-button>Edit</md-button>
          <md-button>Delete</md-button>
        </md-card-actions>
      </md-card>
    </template>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Add_Tumbleweed from './Add_Tumbleweed_Card.vue'
import Tumbleweed_Card from './Tumbleweed_Card.vue'
import Update_Tumbleweed from './Update_Tumbleweed_Card.vue'
import SubSystem_Card from './SubSystem_Card.vue'
import Add_SubSystem from './Add_Subsystem_Card.vue'
import Update_SubSystem from './Update_Subsystem_Card.vue'
import DatasourceCard from './Datasource_Card.vue'
import Add_Datasource from './Add_Datasource_Card.vue'
import Update_Datasource from './Update_Datasource_Card.vue'
import Tumblebase_Card from './Tumblebase_Card.vue'
import Add_Tumblebase from './Add_Tumblebase_Card.vue'
import Update_Tumblebase from './Update_Tumblebase_Card.vue'

export default {
  name: 'Content',
  components: {
    Add_Tumbleweed,
    Tumbleweed_Card,
    Update_Tumbleweed,
    SubSystem_Card,
    Add_SubSystem,
    Update_SubSystem,
    DatasourceCard,
    Add_Datasource,
    Update_Datasource,
    Tumblebase_Card,
    Add_Tumblebase,
    Update_Tumblebase
  },
  computed: mapState({
    get_type: state => state.active_type,
    get_obj: state => state.active_object
  }),
  methods: {
    ...mapMutations(['to_tumbleweed', 'to_tumblebase']),
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
