<template>
  <div class="chartElem">
    <!-- <div class="row"> -->
    <!-- <div class="col-md-12 col-lg-6 col-xl-3"> -->
    <highcharts class="chart" :options="chartOptions" :updateArgs="updateArgs"></highcharts>
    <!-- </div> -->
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      points: [],
      chartType: "column",
      colorInputIsSupported: null,
      updateArgs: [true, true, { duration: 1000 }],
      chartOptions: {
        chart: {
          type: "column"
        },
        title: {
          text: "Sin chart"
        },
        series: [],
        yAxis: {
          min: 0,
          title: {
            text: "Total fruit consumption"
          },
          stackLabels: {
            enabled: true
          }
        },
        plotOptions: {
          column: {
            stacking: "normal",
            dataLabels: {
              enabled: true
            }
          }
        },
        tooltip: {
          formatter() {
            var cancelText =
              "<br/><span>Hủy</span>: <b>" +
              this.series.userOptions.cancel[this.point.x] +
              "</b>";
            var successText =
              "<br/><span>Thành công </span>: <b>" +
              this.series.userOptions.success[this.point.x] +
              "</b><br/>";
            var totalText =
              "<br/><span>Thất bại</span>: <b>" +
              this.series.userOptions.data[this.point.x] +
              "</b><br/>";
            return (
              this.x +
              '<br/>  <span style="color:' +
              this.series.color +
              '">' +
              this.series.name +
              ": </span>" +
              totalText +
              successText +
              cancelText
            );
          }
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

  methods: {
    async getData() {
      const response = await axios.get(
        "statisticals/booking-city?view=week&date_start=2018-12-01&date_end=2018-12-12"
      );
      this.chartOptions.series = response.data.data.data;
      this.points = response.data.data.createdAt;
    }
  },
  mounted() {
    this.getData();
  }
  // watch: {
  //   title(newValue) {
  //     this.chartOptions.title.text = newValue;
  //   },
  //   points(newValue) {
  //     this.chartOptions.series[0].data = newValue;
  //   },
  //   chartType(newValue) {
  //     this.chartOptions.chart.type = newValue.toLowerCase();
  //   },
  //   seriesColor(newValue) {
  //     this.chartOptions.series[0].color = newValue.toLowerCase();
  //   },
  //   animationDuration(newValue) {
  //     this.updateArgs[2].duration = Number(newValue);
  //   }
  // }
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