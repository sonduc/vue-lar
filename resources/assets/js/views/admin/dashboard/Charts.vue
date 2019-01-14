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
      points: [
        "01-01-2019",
        "02-01-2019",
        "03-01-2019",
        "04-01-2019",
        "05-01-2019",
        "06-01-2019",
        "07-01-2019",
        "08-01-2019",
        "09-01-2019",
        "10-01-2019"
      ],
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
        series: [
          {
            name: "Hà Nội",
            data: [4, 5, 12, 10, 13, 3, 6, 17, 14, 1],
            success: [3, 4, 10, 7, 12, 1, 3, 14, 14, 1],
            cancel: [1, 1, 2, 3, 1, 2, 3, 3, 0, 0]
          },
          {
            name: "Hồ Chí Minh",
            data: [1, 0, 0, 1, 1, 1, 4, 0, 1, 1],
            success: [0, 0, 0, 0, 0, 0, 2, 0, 1, 1],
            cancel: [1, 0, 0, 1, 1, 1, 2, 0, 0, 0]
          },
          {
            name: "Hưng Yên",
            data: [0, 0, 0, 2, 0, 0, 1, 1, 0, 0],
            success: [0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
            cancel: [0, 0, 0, 0, 0, 0, 1, 1, 0, 0]
          },
          {
            name: "Long An",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            success: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cancel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "Đà Nẵng",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            success: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cancel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "Quảng Ninh",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            success: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cancel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "Nha Trang",
            data: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            success: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cancel: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "Huế",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            success: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cancel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "Đà Lạt",
            data: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            success: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cancel: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
          },
          {
            name: "Vũng Tàu",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            success: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cancel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "Sơn La",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            success: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cancel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "Hoà Bình",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            success: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cancel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "Vĩnh Phúc",
            data: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            success: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cancel: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "Thanh Hoá",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            success: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cancel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "Sapa",
            data: [0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
            success: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            cancel: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "Bình Định",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            success: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cancel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "Bình Thuận",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            success: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cancel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "Ninh Bình",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            success: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cancel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "Quảng Nam",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            success: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cancel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "Kiên Giang",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            success: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cancel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "Bắc Ninh",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            success: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cancel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "Phú Yên",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            success: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            cancel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        ]
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
    title(newValue) {
      this.chartOptions.title.text = newValue;
    },
    points(newValue) {
      this.chartOptions.series[0].data = newValue;
    },
    chartType(newValue) {
      this.chartOptions.chart.type = newValue.toLowerCase();
    },
    seriesColor(newValue) {
      this.chartOptions.series[0].color = newValue.toLowerCase();
    },
    animationDuration(newValue) {
      this.updateArgs[2].duration = Number(newValue);
    }
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