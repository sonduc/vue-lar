<template>
   <div class="hello" ref="chartdiv">
   </div>
</template>

<script>
   import * as am4core from "@amcharts/amcharts4/core";
   import * as am4charts from "@amcharts/amcharts4/charts";
   import am4themes_animated from "@amcharts/amcharts4/themes/animated";
   am4core.useTheme(am4themes_animated);
   export default {
      data(){
         return {
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
                  this.Axes(val.data,val.series,val.dataFields,val.titleValueAxis);
               }
            }
         },
      },
      methods: {
         Axes(data,dataSery,dataField,titleValueAxis){
            let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);
            chart.data = data;
            let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = dataField;
            categoryAxis.title.text = "Mục thống kê";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 20;
            categoryAxis.renderer.cellStartLocation = 0.1;
            categoryAxis.renderer.cellEndLocation = 0.9;

            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.title.text = titleValueAxis;

            function createSeries(field, name, stacked) {
               let series = chart.series.push(new am4charts.ColumnSeries());
               series.dataFields.valueY = field;
               series.dataFields.categoryX = dataField;
               series.name = name;
               series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
               series.stacked = stacked;
               series.columns.template.width = am4core.percent(95);
            }
            for (var i = 0; i < dataSery.length; i++) {
               createSeries(dataSery[i].field, dataSery[i].name, dataSery[i].stacked);
            }
            chart.legend = new am4charts.Legend();
         },
      },
      beforeDestroy() {
         if (this.chart) {
            this.chart.dispose();
         }
      }
   }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
   width: 100%;
   height: 500px;
}
</style>