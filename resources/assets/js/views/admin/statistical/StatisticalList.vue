<template>
   <div class="main-content">
      <div class="page-header">
         <h3 class="page-title">Thống kê</h3>
         <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="#">Home</a></li>
            <li class="breadcrumb-item"><a href="#">Charts</a></li>
            <li class="breadcrumb-item active">Chart JS</li>
         </ol>
      </div>

      <div class="mailbox">
         <div class="card">
            <div class="card-header">
               <h6>Bộ lọc</h6>
            </div>
            <div class="card-body">
               <div class="row">
                  <div class="col-md-5">
                     <label class="container">Ngày
                       <input
                        type="radio"
                        name="inlineRadioOptions"
                        value="day"
                        v-model="view"
                        >
                       <span class="checkmark"></span>
                     </label>
                     <label class="container">Tuần
                       <input
                        type="radio"
                        name="inlineRadioOptions"
                        value="week"
                        v-model="view"
                        >
                       <span class="checkmark"></span>
                     </label>
                     <label class="container">Tháng
                       <input
                        type="radio"
                        name="inlineRadioOptions"
                        value="month"
                        v-model="view"
                        >
                       <span class="checkmark"></span>
                     </label>
                     <label class="container">Năm
                       <input
                        type="radio"
                        name="inlineRadioOptions"
                        value="year"
                        v-model="view"
                        >
                       <span class="checkmark"></span>
                     </label>
      
                  </div>
                  <div class="col-md-7">
                     <div class="form-group row">
                        <label for="lastName" class="col-sm-1 col-form-label">Từ</label>
                        <div class="col-sm-5">
                           <datepicker 
                              v-model="date_start" 
                              :format="format" 
                              input-class="form-control"
                           />
                        </div>
                        <label for="lastName" class="col-sm-1 col-form-label">Đến</label>
                        <div class="col-sm-5">
                           <datepicker
                              :disabled-dates="disabledDateEnd"
                              v-model="date_end"
                              :format="format"
                              input-class="form-control"
                           />
                        </div>
                     </div>
                  </div>
               </div>
               <button @click="applyFilter()" class="btn btn-success btn-sm">Áp dụng</button>
               <button @click="resetFilter()" class="btn btn-info btn-sm">Làm mới</button>
            </div>
         </div>

         <div class="mailbox-content">
            <div class="col-sm-12">
               <div class="card">
                  <div class="card-body">
                     <div class="mb-4">
                        <h5 class="section-semi-title">
                           Biểu đồ thống kê số lượng booking theo trạng thái
                        </h5>
                        <stacked-clustered-column-chart 
                           :values="booking_status"
                        />
                     </div>
                     <div class="mb-4">
                        <h5 class="section-semi-title">
                           Biểu đồ thống kê số lượng booking theo thành phố
                        </h5>
                        <stacked-column-chart 
                           :values="booking_city"
                        />
                     </div>
                     <div class="mb-4">
                        <h5 class="section-semi-title">
                           Biểu đồ thống kê doanh thu của booking theo trạng thái thanh toán và trạng thái booking
                        </h5>
                        <stacked-clustered-column-chart 
                           :values="booking_revenue"
                        />
                     </div>
                     <div class="mb-4">
                        <h5 class="section-semi-title">
                           Biểu đồ thống kê Top phòng có booking nhiều nhất
                        </h5>
                        <pie-chart-with-legend 
                           :values="room_top_booking"
                        />
                     </div>
                     <div class="mb-4">
                        <h5 class="section-semi-title">
                           Biểu đồ thống kê Top phòng có booking nhiều nhất theo loại phòng
                        </h5>
                        <pie-chart-with-legend 
                           :values="room_type_top_booking"
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

   </div>
</template>

<script>
   import Auth from "../../../services/auth";
   import Datepicker from "vuejs-datepicker";
   import { format, constant, location } from "../../../helpers/mixins";
   import StackedClusteredColumnChart from '../../../components/amcharts/StackedClusteredColumnChart.vue';
   import PieChartWithLegend from '../../../components/amcharts/PieChartWithLegend.vue';
   import StackedColumnChart from '../../../components/amcharts/StackedColumnChart.vue';
   import ColumnChart from '../../../components/fusioncharts/ColumnChart.vue';

   export default {
      components: {
         Datepicker,
         StackedClusteredColumnChart,
         PieChartWithLegend,
         StackedColumnChart,
         ColumnChart,
      },
      data () {
         return {
            permission: "statistical.view",
            date_start: '2018-02-12',
            date_end: '2018-03-12',
            view:"week",
            format: "yyyy-MM-dd",
            disabledDateEnd: {
              to: ""
            },
            booking_status:null,
            booking_city:null,
            booking_revenue:null,
            room_top_booking:null,
            room_type_top_booking:null,
         }
      },
      mounted() {
         Auth.getProfile().then(res => {
            if (res) {
               Auth.canAccess(res, this.permission).then(response => {
               if (!response) {
                  this.$router.push("/permission-denied-403");
               } else {
                     this.getBookingStatus({});
                     this.getBookingCity({});
                     this.getBookingRevenue({});
                     this.getRoomTopBooking({});
                     this.getRoomTypeTopBooking({});
                  }
               });
            }
         });
         this.hideSidebarOnMobile();
      },
      methods: {
         hideSidebarOnMobile() {
            let self = this;
            window.onresize = function() {
               if (window.innerWidth <= 992) {
                  self.isLeftSidebarVisible = false;
               }
            };
         },
         applyFilter(){
            this.getBookingStatus({});
            this.getBookingCity({});
         },
         resetFilter() {
            this.date_start = null;
            this.date_end = null;
            this.view = "week";
         },
         async getBookingStatus({}) {
            try {
               const response = await axios.get(`statisticals/booking-status`,{
                  params:{
                     date_start:this.date_start,
                     date_end:this.date_end,
                     view:this.view,
                  }
               });
               let series = [
                  {field: "success",name: "Thành công",stacked: true},
                  {field: "cancel",name: "Huỷ",stacked: true},
                  {field: "total_booking",name: "Tổng",stacked: false},
               ];
               let data = {
                  data: response.data.data,
                  series: series,
                  dataFields:'createdAt',
                  titleValueAxis:"Số lượng booking",
               };
               this.booking_status = data;
            } catch (error) {
               if (error) {
                  window.toastr["error"]("There was an error", "Error");
               }
            }
         },
         async getBookingCity({}) {
            try {
               const response = await axios.get(`statisticals/booking-city`,{
                  params:{
                     date_start:this.date_start,
                     date_end:this.date_end,
                     view:this.view,
                  }
               });
               this.booking_city = response.data.data;
            } catch (error) {
               if (error) {
                  window.toastr["error"]("There was an error", "Error");
               }
            }
         },
         async getBookingRevenue({}) {
            try {
               const response = await axios.get(`statisticals/booking-revenue`,{
                  params:{
                     date_start:this.date_start,
                     date_end:this.date_end,
                     view:this.view,
                  }
               });
               let series = [
                  {field: "revenue",name: "Doanh thu",stacked: false},
                  {field: "total_revenue",name: "Tổng tiền về",stacked: false},
               ];
               let data = {
                  data: response.data.data,
                  series: series,
                  dataFields:'date',
                  titleValueAxis:"Khoảng tiền",
               };
               this.booking_revenue = data;
               // console.log(response);
            } catch (error) {
               if (error) {
                  window.toastr["error"]("There was an error", "Error");
               }
            }
         },
         async getRoomTopBooking({}) {
            try {
               const response = await axios.get(`statisticals/room-top-booking`,{
                  params:{
                     date_start:this.date_start,
                     date_end:this.date_end,
                     view:this.view,
                  }
               });
               let data = {
                  data: response.data.data,
                  ValueDataFields:'total_booking',
                  CategoryDataFields:"name",
               };
               this.room_top_booking = data;
               
            } catch (error) {
               if (error) {
                  window.toastr["error"]("There was an error", "Error");
               }
            }
         },
         async getRoomTypeTopBooking({}) {
            try {
               const response = await axios.get(`statisticals/room-type-top-booking`,{
                  params:{
                     date_start:this.date_start,
                     date_end:this.date_end,
                     view:this.view,
                  }
               });
               let data = {
                  data: response.data.data,
                  ValueDataFields:'total_booking',
                  CategoryDataFields:"room_type_txt",
               };
               this.room_type_top_booking = data;
               
            } catch (error) {
               if (error) {
                  window.toastr["error"]("There was an error", "Error");
               }
            }
         },
      }
   }
</script>
<style scoped>
/* The container */
.container {
  display: inline;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 18px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default radio button */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

/* Create a custom radio button */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  border-radius: 50%;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the radio button is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: #2196F3;
}

/* Create the indicator (the dot/circle - hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the indicator (dot/circle) */
.container .checkmark:after {
   top: 9px;
   left: 9px;
   width: 8px;
   height: 8px;
   border-radius: 50%;
   background: white;
}
</style>