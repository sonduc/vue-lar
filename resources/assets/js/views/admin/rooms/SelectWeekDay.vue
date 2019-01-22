<template>
  <multiselect
    v-model="showWeekDay"
    :options="options"
    :searchable="true"
    :track-by="trackBy"
    :label="label"
    :show-labels="false"
    :allow-empty="false"
  ></multiselect>
</template>
<script>
import Multiselect from "vue-multiselect";
export default {
  name: "SelectWeekDay",
  components: {
    Multiselect
  },
  props: {
    id: Number,
    value: Number,
    label: String,
    options: Array,
    trackBy: String,
    weekday_price: Array
  },
  computed: {
    showWeekDay: {
      get: function() {
        if (this.value > 1 && this.value < 8) {
          return {
            title: "Thứ " + this.value
          };
        } else if (this.value === 1) {
          return {
            title: "Chủ nhật"
          };
        } else {
          return {
            title: ""
          };
        }
      },
      set: function(val) {
        this.weekday_price[this.id].weekday = val.weekday;
      }
    }
  }
};
</script>
