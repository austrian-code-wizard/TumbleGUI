import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    active_type: "welcome",
    active_tumbleweed: null,
    active_tumblebase: null,
    active_commandType: null,
    active_subsystem: null,
    active_datasource: null,
    tumbleweed_list: [],
    tumblebase_list: [],
    command_type_list: [],
    subsystem_list: [],
    datasource_list: [],
  },
  mutations: {
    to_welcome : (state) => {
      state.active_type = "welcome"
    },
    to_tumbleweed : (state) => {
      state.active_type = "tumbleweed"
    },
    to_add_tumbleweed : (state) => {
      state.active_type = "add_tumbleweed"
    },
    to_update_tumbleweed : (state) => {
      state.active_type = "update_tumbleweed"
    },
    to_update_subsystem : (state) => {
      state.active_type = "update_subsystem"
    },
    to_update_datasource : (state) => {
      state.active_type = "update_datasource"
    },
    to_update_tumblebase : (state) => {
      state.active_type = "update_tumblebase"
    },
    to_add_subsystem : (state) => {
      state.active_type = "add_subsystem"
    },
    to_tumblebase : (state) => {
      state.active_type = "tumblebase"
    },
    to_add_tumblebase : (state) => {
      state.active_type = "add_tumblebase"
    },
    to_subSystem : (state) => {
      state.active_type = "subSystem"
    },
    to_dataSource : (state) => {
      state.active_type = "dataSource"
    },
    to_add_datasource : (state) => {
      state.active_type = "add_datasource"
    },
    to_commandType : (state) => {
      state.active_type = "commandType"
    },
    set_tumbleweed : (state, obj) => {
      state.active_tumbleweed = obj
    },
    set_tumblebase : (state, obj) => {
      state.active_tumblebase = obj
    },
    set_commandType : (state, obj) => {
      state.active_commandType = obj
    },
    set_subsystem : (state, obj) => {
      state.active_subsystem = obj
    },
    set_datasource : (state, obj) => {
      state.active_datasource = obj
    },
    set_tumbleweed_list : (state, list) => {
      state.tumbleweed_list = list
    },
    set_subsystem_list : (state, list) => {
      state.subsystem_list = list
    },
    set_datasource_list : (state, list) => {
      state.datasource_list = list
    },
    set_tumblebase_list : (state, list) => {
      state.tumblebase_list = list
    },
    set_commandType_list : (state, list) => {
      state.command_type_list = list
    }
  }
})
