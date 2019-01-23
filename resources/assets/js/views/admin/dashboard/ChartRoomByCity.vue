<template>
  <div class="chartElem">
    <highcharts class="chart" :options="chartOptions" :updateArgs="updateArgs"></highcharts>
  </div>
</template>

<script>
export default {
  props: ["view", "date_start", "date_end", "status"],
  data() {
    return {
      updateArgs: [true, true, { duration: 1000 }],
      chartOptions: {
        chart: {
          type: "column"
        },
        title: {
          text: ""
        },
        xAxis: {
          type: "category"
        },
        legend: {
          enabled: true
        },
        series: [],
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
            dataLabels: {
              enabled: true
            }
          }
        },
        tooltip: {
          pointFormat:
            '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> phòng<br/>'
        }
      }
    };
  },
  created() {
    let i = document.createElement("input");
    i.setAttribute("type", "color");
    i.type === "color"
      ? (this.colorInputIsSupported = true)
      : (this.colorInputIsSupported = false);
  },
  watch: {
    date_start() {
      this.getData();
    },
    date_end() {
      this.getData();
    },
    view() {
      this.getData();
    }
  },
  methods: {
    async getData() {
      const response = await axios.get("statisticals/room-city", {
        params: {
          status: this.status
          //   view: this.view,
          //   date_start: this.date_start,
          //   date_end: this.date_end
        }
      });
      // console.log(response.data.data[0]);
      // console.log(this.chartOptions.series.data);
      this.chartOptions.series = response.data.data[0];
      //   this.chartOptions.xAxis.categories = response.data.data.createdAt;
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style scoped>
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
#colorPicker {
  border: 0;
  padding: 0;
  margin: 0;
  width: 30px;
  height: 30px;
}
.numberInput {
  width: 30px;
}
</style>