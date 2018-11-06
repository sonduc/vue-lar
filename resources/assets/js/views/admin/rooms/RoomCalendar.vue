<template>
  <div class="main-content" style="background-color: white;">
    <div class="page-header">
      <h3 class="page-title">Room</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item"><a href="#">Room</a></li>
        <li class="breadcrumb-item active">Calendar</li>
      </ol>
      <div class="row">
        <div class="col-sm-9">
          <full-calendar :events="bookingCalendar" :selectable="true" id="calendar"
          :default-view="defaultView" :header="header" :config="config" :event-limit="true"
          :editable="false" :selectHelper="true" ref="calendar">
          </full-calendar>
        </div>
        <div class="col-sm-3">
          <div class="card" style="margin-top: 59px;">
            <div class="card-header">
              <h5>Thay đổi trạng thái phòng</h5>
            </div>
            <div class="card-body">
              <form>
                <div class="form-group">
                  <label>Từ ngày *</label>
                  <datepicker
                    v-model="date.startDate" input-class="form-control" :format="format"
                    placeholder="Please choose end date">
                  </datepicker>
                </div>
                <div class="form-group">
                  <label>Đến ngày *</label>
                  <datepicker
                    v-model="date.endDate" :disabled-dates="disabledEndDate" :format="format" readonly="true"
                    input-class="form-control" placeholder="Please choose end date">
                  </datepicker>
                </div>
                <div class="form-group row">
                  <label for="lastName" class="col-sm-12 col-form-label">Trạng thái phòng</label>
                  <div class="col-sm-12" style="text-align: left;">
                    <div class="form-check form-check-inline">
                      <input v-model="status" id="openRoom" class="form-check-input" type="radio" name="status" value="1">
                      <label class="form-check-label" for="openRoom">Phòng mở</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input v-model="status" id="blockRoom" class="form-check-input" type="radio" name="status" value="0">
                      <label class="form-check-label" for="blockRoom">Phòng khóa</label>
                    </div>
                  </div>
                </div>
               <!--  <div class="form-group row">
                  <label for="password" class="col-sm-4 col-form-label">Thuê phòng theo</label>
                  <div class="col-sm-8">
                    <label :style="errors.has('room.rent_type') ? 'color:red;' : ''">
                      {{errors.has('room.rent_type')
                      ? errors.first('room.rent_type') : 'Thuê theo *'}}
                    </label>
                    <multiselect
                    :allow-empty="false" name="room.rent_type"
                    v-validate="step==0 ? 'required':''"
                    data-vv-as="Thuê theo"
                    v-model="rentType" label="value"
                    :options="rent_type" :searchable="true"
                    :show-labels="false" track-by="value">
                    </multiselect>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="password" class="col-sm-4 col-form-label">Giá theo ngày</label>
                  <div class="col-sm-8">
                    <input
                      id="pasword"
                      type="pasword"
                      class="form-control"
                      placeholder="Price day">
                  </div>
                </div>
                <div class="form-group row">
                  <label for="pasword" class="col-sm-4 col-form-label">Giá theo giờ</label>
                  <div class="col-sm-8">
                    <input
                      id="pasword"
                      type="pasword"
                      class="form-control"
                      placeholder="Price hour">
                  </div>
                </div>
                <div class="form-group row">
                  <label for="pasword" class="col-sm-4 col-form-label">Giá phụ thu</label>
                  <div class="col-sm-8">
                    <input
                      id="pasword"
                      type="pasword"
                      class="form-control"
                      placeholder="Price after hour">
                  </div>
                </div> -->
                <button class="btn btn-outline-success" style="margin-right: 15px;"
                @click.prevent="onSubmit()">Save</button>
                <button class="btn btn-outline-danger">Cancel</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue"
import { FullCalendar } from 'vue-full-calendar'
import 'fullcalendar/dist/fullcalendar.css'
import 'fullcalendar/dist/locale/vi.js'
import 'fullcalendar/dist/locale/fr.js'
import Auth from "../../../services/auth"
import CalendarEvent from "../components/CalendarEvent"
import Datepicker from "vuejs-datepicker";
export default {
  name: "RoomForm",
  components: {
    FullCalendar,
    Datepicker
  },
  data() {
    return {
      car: null,
      room:null,
      date: {
        startDate:null,
        endDate:null,
      },
      format: "dd-MM-yyyy",
      status:1,
      blockSchedule:[],
      rent_type:[],
      blockRoom:[],
      room_time_blocks: [],
      bookingCalendar:[],
      bookingRoom:[],
      disabledEndDate: {
        to: ""
      },
      defaultView: 'month',
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      config: {
        locale: 'vi',
        dayRender: function(date,cell) {
          let current = new Date();
          let currentDate = current.toISOString().substring(0, 10);
          if(date.format('YYYY-MM-DD') < currentDate) {
            cell.addClass("bg-blocked-day");
          }
          else {
            cell.append("<div class='available'></div>");
          }
        },
        selectAllow: function(info) {
          let current = new Date();
          let currentDate = current.toISOString().substring(0, 10);
          if (info.start.isBefore(currentDate)) {
            return false;
          }
          return true;
        },
        eventRender(event, element) {
          const Constructor = Vue.extend(CalendarEvent);
          const vm = new Constructor({
            propsData: {
              event
            }
          }).$mount();
          element.html(vm.$el);
        }
      },
    }
  },
  watch: {
    bookingRoom: {
      handler(val) {
        this.bookings = [];
        if(val != null) {
          val.forEach(item => {
            let booking = {
              title: null,
              start: null,
              end: null,
              allDay:true,
              textColor: 'white',
              color: '#257e4a',
            };
            booking.title = item.name + ': '+ item.total_fee +'đ';
            booking.start = item.checkin;
            booking.end = item.checkout;
            this.bookingCalendar.push(booking)
          })
        }
      }
    },
    'date.startDate': {
      handler(val) {
        this.disabledEndDate.to = val;
      },
      deep: true
    },
    // date: {
    //   handler(val) {
    //     if(val.startDate && val.endDate){

    //       let start = this.correctDay(val.startDate)
    //       let miliStart = this.convertMiliSecond(start)

    //       let end = this.correctDay(val.endDate)
    //       let miliEnd = this.convertMiliSecond(end)

    //       let timeDay = 86400000;
    //       let arr = [];
    //       while(miliStart <= miliEnd){
    //         this.blockSchedule.push(miliStart)
    //         miliStart += timeDay;
    //       }
    //       // sắp xếp mảng
    //       this.blockSchedule.sort();
    //       // loại bỏ ngày trùng nhau
    //       this.blockSchedule = Array.from(new Set(this.blockSchedule));
    //       // chuyển các ngày riêng lẻ thành khoảng ngày: [ ngày bắt đầu, ngày kết thúc ]
    //       let d = this.convertRangeDate(this.blockSchedule)
    //       console.log(d)

    //     }
    //   },
    //   deep:true
    // },
    room_time_blocks: {
      handler(val) {
        if(val != null) {
          val.forEach(item => {
            let block = {
              title: '',
              start: null,
              end: null,
              allDay:true,
              textColor: 'white',
              overlap: false,
              rendering: 'background',
              color: 'rgb(118, 118, 118)',
              //className:'background-color:red'
            };
            let currentDate = new Date();
            let today = currentDate.getTime();

            let start_Date = new Date(item.date_start);
            let start = start_Date.getTime();

            if(today > start) {
              block.start = currentDate.toISOString().substring(0, 10);
            }
            else {
              block.start = item.date_start;
            }
            if(item.date_start != item.date_end){
              let beforeAddDay = new Date(item.date_end);
              let timeDay = 86400000;
              let afterAddDay = new Date(beforeAddDay.getTime() + timeDay);
              let day = afterAddDay.toISOString().substring(0, 10);
              block.end = day;
            }
            else {
              block.end = item.date_end;
            }
            this.bookingCalendar.push(block)
          })
        }
      }
    },
  },
  methods: {
    correctDay(date) {
      let beforeAddDay = new Date(date);
      let timeDay = 86400000;
      let afterAddDay = new Date(beforeAddDay.getTime() + timeDay);
      let day = afterAddDay.toISOString().substring(0, 10);
      return day;
    },
    // convertMiliSecond(date) {
    //   let day = new Date(date);
    //   let miliSecond = day.getTime();
    //   return miliSecond;
    // },
    // convertMiliToDate(miliDate) {
    //   let date = new Date(miliDate);
    //   var d = date.toISOString().substring(0, 10)
    //   return d;
    // },
    // convertRangeDate(arrDate) {
    //   let length = arrDate.length;
    //   let arrObj = [];
    //   let date = { start: null, end: null};
    //   let i;
    //   let timeDay = 86400000;
    //   if(length) {
    //     date.start = arrDate[0];
    //     date.end = arrDate[0];
    //     for(i = 0; i < length; i++) {
    //       if(arrDate[i+1] == arrDate[i] + timeDay) {
    //         date.end = arrDate[i+1];
    //       }
    //       else {
    //         date.end = arrDate[i];
    //         arrObj.push(date);
    //         date.start = arrDate[i+1];
    //         date.end = arrDate[i+1];
    //       }
    //     }
    //   }
    //   console.log(arrObj)
    //   return arrObj;
    // },
    // addEvent: function (start, end, view) {
    //   this.renderEvent(start, end)
    // },
    // renderEvent(start, end) {
    //   let self = this;
    //   console.log(start.format('YYYY-MM-DD HH:mm'))

    //   // Add new event
    //   var evt = {
    //     id: tmpId,
    //     title: 'NA',
    //     start: start,
    //     end: end,
    //     color: '#bd362f',
    //     editable: false
    //   };
    //   self.$refs.calendar.fullCalendar('renderEvent', evt, false)
    // },
    async getRentType() {
      try {
        const response = await axios.get("rooms/rent-type");
        this.rent_type = response.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async getRoomById() {
      try {
        const response = await axios.get(`rooms/${ this.$route.params.roomId }`);
        this.room = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async getBookingOfRoom() {
      try {
        const response = await axios.get(
          `rooms/${ this.$route.params.roomId }`,
          {
            params: {
              include: "bookings"
            }
          }
        );
        this.bookingRoom = response.data.data.bookings.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async getBlockOfRoom() {
      try {
        const response = await axios.get(
          `rooms/${ this.$route.params.roomId }`,
          {
            params: {
              include: "blocks"
            }
          }
        );
        this.room_time_blocks = response.data.data.blocks.data;
        this.room_time_blocks.forEach(item => {
          let arr = Object.values(item)
          this.blockRoom.push(arr)
        })
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async getBlockSchedule() {
      try {
        const response = await axios.get(
          `rooms/schedule/${ this.$route.params.roomId }`);
        let data = response.data.data.blocks;
        data.forEach(item => {
          let el = new Date(item)
          let date = el.getTime()
          this.blockSchedule.push(date)
        })
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async onSubmit() {
      const result = this.$validator.validateAll();
      if (result) {
        let date = Object.values(this.date)
        let blockDays = this.blockRoom.push(date)
        let response = await axios
          .put(`rooms/${this.$route.params.roomId}`, {
            blockRoom: blockDays
          })
          .then(response => {
            this.$refs.calendar.$emit('refetch-events');
          });
      } else {
        return window.scroll({
          top: 80,
          behavior: "smooth"
        });
      }
    },
  },
  created() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("permission-denied-403");
          } else {
            this.getBookingOfRoom();
            this.getBlockOfRoom();
            this.getRoomById();
            this.getRentType();
            this.getBlockSchedule();
          }
        });
      }
    });
  },
};
</script>

<style>
.bg-blocked-day {
  background: repeating-linear-gradient(
    -45deg,
    #edeef7,
    #edeef7 10px,
    #f2f2f2 10px,
    #f2f2f2 20px
  );
  cursor: not-allowed;
}
.available {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.available:hover {
  background-color: #edeef7;
  outline: rgb(118, 118, 118) solid 1px !important;
}.
.block {
  background-color: red;
}
</style>






