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
						this.Axes(val.data,val.ValueDataFields,val.CategoryDataFields);
					}
				}
			},
		},
		methods: {
			Axes(data,ValueDataFields,CategoryDataFields){
				// Create chart instance
				let chart = am4core.create(this.$refs.chartdiv, am4charts.PieChart);

				// Add and configure Series
				let pieSeries = chart.series.push(new am4charts.PieSeries());
				pieSeries.dataFields.value = ValueDataFields;
				pieSeries.dataFields.category = CategoryDataFields;

				// Let's cut a hole in our Pie chart the size of 30% the radius
				chart.innerRadius = am4core.percent(30);

				// Put a thick white border around each Slice
				pieSeries.slices.template.stroke = am4core.color("#fff");
				pieSeries.slices.template.strokeWidth = 2;
				pieSeries.slices.template.strokeOpacity = 1;
				pieSeries.slices.template
				  // change the cursor on hover to make it apparent the object can be interacted with
				.cursorOverStyle = [
				   {
				     "property": "cursor",
				     "value": "pointer"
				   }
				];

				// Create a base filter effect (as if it's not there) for the hover to return to
				let shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
				shadow.opacity = 0;

				// Create hover state
				let hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists

				// Slightly shift the shadow and make it more prominent on hover
				let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
				hoverShadow.opacity = 0.7;
				hoverShadow.blur = 5;

				// Add a legend
				chart.legend = new am4charts.Legend();

				chart.data = data;
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
	height: 600px;
}
</style>