<template>
    <div id="app">
        <div id="chart-container">
            <fusioncharts
            :type="type"
            :width="width"
            :height="height"
            :dataformat="dataformat"
            :datasource="datasource"
            >
        	</fusioncharts>
        </div>
    </div>
</template>
<script>
	import Vue from 'vue';
	import VueFusionCharts from 'vue-fusioncharts';
	import FusionCharts from 'fusioncharts';
	import Column2D from 'fusioncharts/fusioncharts.charts';
	import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

	Vue.use(VueFusionCharts, FusionCharts, Column2D, FusionTheme);
	export default {
		name: 'app',
		data () {
			return {
				type: "column2d",
				renderAt: "chart-container",
				width: "100%",
				height: "500",
				dataFormat: "json",
				datasource: {
					chart: {
						theme: "fusion"
					},
					data: [{
						label: "Mon",
						value: "15123"
					}, {
						label: "Tue",
						value: "14233"
					}, {
						label: "Wed",
						value: "25507"
					}]
				}
			}
		}
	}
</script>