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
        series: [],
        yAxis: {
          min: 0,
          title: {
            text: "Số lượng booking"
          },
          stackLabels: {
            enabled: true
          }
        },
        xAxis: {
          categories: []
        },
        plotOptions: {
          column: {
            // stacking: "normal",
            dataLabels: {
              enabled: true
            }
          }
        },
        tooltip: {
          formatter() {
            var cancelText =
              "<br/><span>Số phòng</span>: <b>" +
              this.series.userOptions.data[this.point.x] +
              "</b>";
            return (
              this.x +
              '<br/>  <span style="color:' +
              this.series.color +
              '">' +
              this.series.name +
              ": </span>" +
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
      const response = await axios.get("statisticals/room-type-compare", {
        params: {
          status: this.status,
          view: this.view,
          date_start: this.date_start,
          date_end: this.date_end
        }
      });
      this.chartOptions.series = response.data.data.data;
      this.chartOptions.xAxis.categories = response.data.data.createdAt;
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