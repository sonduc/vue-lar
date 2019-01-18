<template>
  <div class="chartElem">
    <highcharts class="chart" :options="chartOptions" :updateArgs="updateArgs"></highcharts>
  </div>
</template>

<script>
export default {
  props: ["view", "date_start", "date_end"],
  data() {
    return {
      updateArgs: [true, true, { duration: 1000 }],
      chartOptions: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie"
        },
        title: {
          text: ""
        },
        series: [
          {
            name: "Số lượng phòng",
            colorByPoint: true,
            data: []
          }
        ],
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format:
                "<b>{point.name}</b>: {point.y} phòng <br/> {point.percentage:.1f} %"
            }
          }
        },
        tooltip: {
          pointFormat:
            "{series.name}: {point.y} <br/> <b>{point.percentage:.1f}%</b>"
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
      const response = await axios.get("statisticals/room-type", {
        params: {
          //   view: this.view,
          //   date_start: this.date_start,
          //   date_end: this.date_end
        }
      });
      // console.log(response.data.data[0]);
      // console.log(this.chartOptions.series.data);
      this.chartOptions.series[0].data = response.data.data[0];
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