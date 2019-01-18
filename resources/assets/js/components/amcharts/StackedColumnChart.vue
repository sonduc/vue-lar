<template>
   <div class="hello" ref="chartdiv"></div>
</template>

<script>
   import * as am4core from "@amcharts/amcharts4/core";
   import * as am4charts from "@amcharts/amcharts4/charts";
   // import am4themes_animated from "@amcharts/amcharts4/themes/animated";
   import _ from "lodash";
   // am4core.useTheme(am4themes_animated);
   export default {
      data() {
         return {
            test: null
         };
      },
      props: {
         values: {
            type: Object,
            default: Object
         }
      },
      watch: {
         values: {
            handler(val) {
               if (val !== null) {
                  this.Axes(val.data,val.dataFields);
               }
            }
         }
      },
      methods: {
         Axes(data,dataFields) {
            // Create chart instance
            let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);
            // Add data
            data.forEach(element => {
               element.forEach(e => {
                  chart.data.push(e);
               });
            });
            // console.log(chart.data);
            // Create axes
            let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = dataFields;
            categoryAxis.renderer.grid.template.location = 0;

            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.renderer.inside = true;
            valueAxis.renderer.labels.template.disabled = true;
            valueAxis.min = 0;

            // Create series
            function createSeries(field, name) {
                 
               // Set up series
               var series = chart.series.push(new am4charts.ColumnSeries());
               series.name = name;
               series.dataFields.valueY = field;
               series.dataFields.categoryX = dataFields;
               series.sequencedInterpolation = true;

               // Make it stacked
               series.stacked = true;

               // Configure columns
               series.columns.template.width = am4core.percent(75);
               series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";

               // Add label
               var labelBullet = series.bullets.push(new am4charts.LabelBullet());
               labelBullet.label.text = "{valueY}";
               labelBullet.locationY = 0.5;

               return series;
            }

            // Combine all array keys
            let data_arr = [];
            chart.data.forEach(element => {
               data_arr = [...data_arr, ...Object.keys(element)];
            });

            // console.log(data_arr);
            // Remove createdAt keys
            var remain_field = _.remove(data_arr, function(n) {
               return n !== dataFields;
            });

            //Unique City name keys
            let city_field = _.intersection(remain_field);
            //Create series
            city_field.forEach(element => {
               createSeries(element, element);
            });

            // Legend
            chart.legend = new am4charts.Legend();
         }
      },
      beforeDestroy() {
         if (this.chart) {
            this.chart.dispose();
         }
      }
   };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
   width: 100%;
   height: 600px;
}
</style>