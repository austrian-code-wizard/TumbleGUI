<template>
  <div class="data-card">
    <md-card>
      <md-card-header>
        <div>
          <div class="md-layout md-gutter md-align-center-space-between">
            <div class="md-layout-item">
              <md-field>
                <label for="selected_run_id">Select Run</label>
                <md-select v-model="selected_run_id" name="selected_run_id" id="selected_run_id">
                  <md-option v-for="run in runs" :key="run.id" :value="run.id">{{run.name}}</md-option>
                </md-select>
              </md-field>
            </div>
            <div v-if="run_is_active" class="input md-layout-item">
              <md-checkbox v-model="live">Live</md-checkbox>
            </div>
          </div>
          <div v-if="live">
            <md-field>
              <label>Live Window</label>
              <md-input v-model="live_window"></md-input>
            </md-field>
          </div>
          <div v-if="!live">
            <div>
              <el-date-picker
                v-model="time_range"
                type="datetimerange"
                range-separator="-"
                start-placeholder="Start date"
                end-placeholder="End date"
                :picker-options="pickerOptions">
              </el-date-picker>
            </div>
          </div>
        </div>
      </md-card-header>
      <md-card-content>
        <template v-if="((datasource.dtype=='S')||(datasource.dtype=='B')||(datasource.dtype=='L'))">
          <List_Chart :chartData="chart_data"/>
        </template>
        <template v-else-if="((datasource.dtype=='I')||(datasource.dtype=='F'))">
          <Numeric_Chart :chartData="chart_data" :viewMin="viewMin" :viewMax="viewMax"/>
        </template>
        <template v-else-if="datasource.dtype=='M'">
          <Image_Chart :chartData="chart_data"/>
        </template>
        <template v-else>
        </template>
      </md-card-content>
    </md-card>
    <md-snackbar :md-duration=3000 :md-active.sync="error">{{error_message}}</md-snackbar>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { RepositoryFactory } from './../apiRepositories/repositoryFactory'
const TWRepository = RepositoryFactory.get('tumbleWeb')
import Numeric_Chart from "./Numeric_Chart_Card.vue"
import Image_Chart from "./Image_Chart_Card.vue"
import List_Chart from "./List_Chart_Card.vue"

Date.prototype.toLocalISOString = function() {

    // If not called on a Date instance, or timevalue is NaN, return undefined
    if (isNaN(this) || Object.prototype.toString.call(this) != '[object Date]') return;

    // Copy date so don't modify original
    var d = new Date(+this);
    var offset = d.getTimezoneOffset();
    var offSign = offset > 0? '-' : '+';
    offset = Math.abs(offset);
    var tz = offSign + ('0' + (offset/60|0)).slice(-2) + ':' + ('0' + offset%60).slice(-2)
    return new Date(d.setMinutes(d.getMinutes() - d.getTimezoneOffset())).toISOString().slice(0,-1) + tz;
}

export default {
  name: 'Datasource_Data',
  components: {
    Numeric_Chart,
    Image_Chart,
    List_Chart
  },
  data: () => ({
    live: false,
    live_window: 120,
    interval: null,
    start_time: null,
    end_time: null,
    time_range: [],
    start_time_limit: null,
    end_time_limit: null,
    data: [],
    data_header: [],
    error: false,
    error_message: null,
    runs: [],
    run: null,
    run_is_active: null,
    selected_run_id: null,
    chart_data: [],
    viewMin: null,
    viewMax: null,
    pickerOptions: {
    },
  }),
  computed: mapState({
    datasource: state => state.active_datasource,
    tumbleweed: state => state.active_tumbleweed,

  }),
  destroyed() {
    if (this.interval != null) {
      clearInterval(this.interval);
    }
  },
  async beforeMount () {
    this.data_header[0] = null
    this.data_header[1] = this.datasource.name
    this.pickerOptions.disabledDate = this.validate_date
    window.addEventListener('resize', this.refresh_data())
    this.get_runs()
  },
  watch: {
    datasource: function (val) {
      this.data_header[0] = null
      this.data_header[1] = this.datasource.name
      this.selected_run_id = null
      this.run = null
      this.runs = []
      this.get_runs()
    },
    live: function (val) {
      this.refresh_data();
      if (val == true) {
        this.interval = setInterval(() => {
          this.refresh_data();
        },100)
        this.viewMin = 0
        this.viewMax = this.live_window
      } else {
        clearInterval(this.interval)
        this.viewMin = this.start_time
        this.viewMax = this.end_time
        this.time_range = [this.start_time_limit, this.end_time_limit]
      }
    },
    live_window: function (val) {
      this.viewMax = val
      this.refresh_data();
    },
    start_time: function (val) {
      this.viewMin = val;
    },
    end_time: function (val) {
      this.viewMax = val;
    },
    time_range: function (val) {
      this.start_time = val[0]
      this.end_time = val[1]
      this.refresh_data()
    },
    selected_run_id: function (val) {
      this.run = this.runs.find(function(element){return element.id == val})
      if (this.run.ended_at != null) {
        this.run_is_active = false
        this.start_time_limit = new Date(this.run.created_at)
        this.end_time_limit = new Date(this.run.ended_at)
        this.end_time = this.end_time_limit
        if ((this.end_time_limit.getSeconds()-this.start_time_limit.getSeconds()) > 120) {
          this.start_time = new Date()
          this.start_time.setSeconds(this.end_time.getSeconds()-120)
        } else {
          this.start_time = this.start_time_limit
        }
        this.time_range = [this.start_time, this.end_time]
      } else {
        this.run_is_active = true
        this.start_time_limit = new Date(this.run.created_at)
        this.end_time_limit = new Date()
        this.end_time = new Date()
        if ((this.end_time_limit.getSeconds()-this.start_time_limit.getSeconds()) > 120) {
          this.start_time = new Date()
          this.start_time.setSeconds(this.end_time.getSeconds()-120)
        } else {
          this.start_time = this.start_time_limit
        }
        this.time_range = [this.start_time, this.end_time]
      }
      this.live = false
      this.refresh_data()
    }
  },
  methods: {
    async refresh_data () {
      this.error = false
      if (this.live == true) {
        var end_time = new Date()
        var start_time = new Date()
        start_time.setSeconds(end_time.getSeconds()-this.live_window)
      } else {
        var end_time = this.end_time
        var start_time = this.start_time
      }
        const response = await TWRepository.get_datapoints_by_datasource_and_run_id_interval(
          this.datasource.id, this.run.id, start_time.toLocalISOString(), end_time.toLocalISOString())
        if (response.status != 200) {
          this.error_message = "Failed to fetch chart data"
          this.error = true
        } else {
          var raw_result = response.data
          var result = []
          if (this.live == true) {
            for (var x=0; x<raw_result.length; x++) {
              result.push([this.get_time_diff(raw_result[x].receiving_start, end_time), raw_result[x].data])
            }
            this.data_header[0] = 'T+'
          } else {
            for (var x=0; x<raw_result.length; x++) {
              result.push([new Date(raw_result[x].receiving_start), raw_result[x].data])
            }
            this.data_header[0] = "Timestamp"
          }
          result.unshift(this.data_header)
          this.chart_data = result
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
          if (this.selected_run_id == null) {
            this.selected_run_id = (this.runs[0]).id
          }
        }
      } catch {
        this.error_message = "Failed to fetch runs"
        this.error = true
      }
    },
    get_time_diff (iso, now) {
        var start = new Date(iso)
        return ((now.getTime()-start.getTime()) / 1000)
    },
    validate_date (d) {
      return !((d >= this.start_time_limit)&&(d <= this.end_time_limit))
    }
  }
}
</script>

<style scoped>
</style>
