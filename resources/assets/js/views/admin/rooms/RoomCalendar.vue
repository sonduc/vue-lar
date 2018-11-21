<template>
  <div class="main-content" style="background-color: white;">
    <div class="page-header">
      <h3 class="page-title">Room</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item"><a href="#">Room</a></li>
        <li class="breadcrumb-item active">Calendar</li>
      </ol>
      <div class="row" >
        <div class="col-sm-9">
          <full-calendar v-if="room != null && blockSchedule !=null" :events="bookingCalendar"
          :selectable="true" :key="1"
          id="calendar" :default-view="defaultView" :header="header" :config="config"
          :event-limit="true" :editable="false" :selectHelper="true" ref="calendar">
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
                  <input type="text" name="dateSelected.startDate"
                  v-model="dateSelected.startDate" class="form-control" disabled>
                </div>
                <div class="form-group">
                  <label>Đến ngày *</label>
                  <input type="text" name="dateSelected.endDate"
                  v-model="dateSelected.endDate" class="form-control" disabled>
                </div>
                <button class="btn btn-outline-success" style="margin-right: 5px;"
                @click.prevent="unblockSubmit()"
                :disabled="dateSelected.startDate == null ? true: false">Mở phòng</button>
                <button class="btn btn-outline-danger" style="margin-right: 5px;"
                @click.prevent="blockSubmit()"
                :disabled="dateSelected.startDate == null ? true: false">Khóa phòng</button>
                <button class="btn btn-outline-primary" style="margin-right: 5px;"
                @click.prevent="clearDate()">Reset</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FullCalendar } from 'vue-full-calendar'
import 'fullcalendar/dist/fullcalendar.css'
import 'fullcalendar/dist/locale/vi.js'
import Auth from "../../../services/auth"
import CalendarEvent from "../components/CalendarEvent"
import Datepicker from "vuejs-datepicker"
export default {
  name: "RoomCalendar",
  components: {
    FullCalendar,
    Datepicker
  },
  data() {
    return {
      room:null,
      dateSelected: {
        startDate: null,
        endDate: null
      },
      blockSchedule:null,
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
    }
  },
  computed: {
    config() {
      let self = this;
      return {
        locale: 'vi',
        dayRender: function(date,cell) {
          let current = new Date();
          let currentDate = current.toISOString().substring(0, 10);
          let price_day = self.formatNumber(self.room.price_day);
          let price_hour = self.formatNumber(self.room.price_hour);
          let rent_type = self.room.rent_type;
          if(date.format('YYYY-MM-DD') < currentDate)
          {
            cell.addClass("bg-past-day");
          }
          else if(self.blockSchedule.includes(date.format('YYYY-MM-DD'))){
            cell.addClass("bg-blocked-day");
          }
          else {
            if(rent_type == 3) {
              cell.append("<div class='available'><div>"+price_day+" đ/1 ngày</div><div class='center'></div><div> "+price_hour+" đ/1 giờ</div></div>");
            }
            else if(rent_type == 2) {
              cell.append("<div class='available' id='price'>"+price_day+" đ/1 ngày</div>");
            }
            else {
              cell.append("<div class='available' id='price'>"+price_hour+" đ/1 giờ</div>");
            }
          }
        },
        selectAllow: function(info) {
          let current = new Date();
          let currentDate = current.toISOString().substring(0, 10);
          if (info.start.format('YYYY-MM-DD') <= currentDate) {
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
        },
        select(start, end, jsEvent, view) {
          self.dateSelected.startDate = start.format('YYYY-MM-DD');
          end = end.subtract(1, 'days');
          self.dateSelected.endDate = end.format('YYYY-MM-DD');
        },
      }
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
            booking.end = this.correctDay(item.checkout);
            this.bookingCalendar.push(booking)
          })
        }
      }
    },
    blockRoom: {
      handler(val) {
        let self = this;
        let length = val.length;
        let dayBlock = val[length - 1]
        let block = {
          title: '',
          start: null,
          end: null,
          allDay:true,
          textColor: 'white',
          overlap: true,
          rendering: 'background',
          color: 'rgb(118, 118, 118)',
          className:'event-block'
        };
        if(dayBlock.length == 1) {
          block.start = dayBlock[0]
          block.end = this.correctDay(dayBlock[0]);
        }
        else {
          block.start = dayBlock[0];
          block.end = this.correctDay(dayBlock[1]);
        }
        self.bookingCalendar.push(block)
      },
      deep:true
    }
  },
  methods: {
    correctDay(date) {
      let beforeAddDay = new Date(date);
      let timeDay = 86400000;
      let afterAddDay = new Date(beforeAddDay.getTime() + timeDay);
      let day = afterAddDay.toISOString().substring(0, 10);
      return day;
    },
    changeToArangeDate(startDate, endDate) {
      let dates = [];
      let currentDate = startDate;
      let addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
      while (currentDate <= endDate) {
        dates.push(currentDate);
        currentDate = addDays.call(currentDate, 1);
      }
      return dates;
    },
    formatNumber(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    clearDate(){
      this.dateSelected.startDate = null;
      this.dateSelected.endDate = null;
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
        this.initBlockDay(this.blockRoom)
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
        this.blockSchedule = [];
        data.forEach(item => {
          this.blockSchedule.push(item)
        })
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async unblockSubmit() {
      const result = this.$validator.validateAll();
      if (result) {
        let unblock = Object.values(this.dateSelected);
        if(this.dateSelected.startDate === this.dateSelected.endDate) {
          unblock.pop();
        }
        let unblockDates = [];
        unblockDates.push(unblock);
        let blockDates = this.blockRoom;
        blockDates.forEach(item => {
          if(item[0] === item[1]) {
            item.pop();
          }
        });
        let response = await axios
        .put('rooms/update-block', {
          room_id: this.$route.params.roomId,
          room_time_blocks: blockDates,
          unlock_days: unblockDates
        })
        .then(response => {
          this.dateSelected.startDate = null;
          this.dateSelected.endDate = null;
        });
      } else {
        return window.scroll({
          top: 0,
          behavior: "smooth"
        });
      }
    },
    async blockSubmit() {
      const result = this.$validator.validateAll();
      if (result) {
        let blockDate = Object.values(this.dateSelected);
        this.blockRoom.forEach(item => {
          if(item[0] === item[1]) {
            item.pop();
          }
        });
        if(this.dateSelected.startDate === this.dateSelected.endDate) {
          blockDate.pop();
        }
        this.blockRoom.push(blockDate);
        let response = await axios
        .put('rooms/update-block', {
          room_id: this.$route.params.roomId,
          room_time_blocks: this.blockRoom,
        })
        .then(response => {
          this.dateSelected.startDate = null;
          this.dateSelected.endDate = null;
        });
        //Object.assign(this.$data, this.$options.data.call(this))

      } else {
        return window.scroll({
          top: 0,
          behavior: "smooth"
        });
      }
    },
    initBlockDay(arrBlockDate) {
      if(arrBlockDate.length){
        arrBlockDate.forEach(item => {
          let block = {
            title: '',
            start: null,
            end: null,
            allDay:true,
            textColor: 'white',
            overlap: true,
            rendering: 'background',
            color: 'rgb(118, 118, 118)',
            className:'event-block'
          };
          let currentDate = new Date();
          let today = currentDate.getTime();

          let start_Date = new Date(item[0]);
          let start = start_Date.getTime();

          if(today > start) {
            block.start = currentDate.toISOString().substring(0, 10);
          }
          else {
            block.start = item[0];
          }

          if(item.length == 2){
            let day = this.correctDay(item[1]);
            block.end = day;
          }
          else {
            block.end = this.correctDay(item[0]);
          }
          this.bookingCalendar.push(block)
        })
      }
    }
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
            this.getBlockSchedule();
          }
        });
      }
    });
  },
};
</script>

<style>
.bg-past-day {
  background: repeating-linear-gradient(
    -45deg,
    #edeef7,
    #edeef7 10px,
    #f2f2f2 10px,
    #f2f2f2 20px
  );
  cursor: not-allowed !important;
}
.bg-blocked-day {
  background-color: #ffffff;
}
.available {
  padding-top: 27px;
  font-size: 14px;
  text-align: center;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.available:hover {
  background-color: #edeef7;
  outline: rgb(118, 118, 118) solid 2px ;
}
.event-block {
  background: repeating-linear-gradient(
    -45deg,
    #cccccc,
    #cccccc 10px,
    #f2f2f2 10px,
    #f2f2f2 20px
  );
}
.center {
  background-color: rgb(155, 155, 134);
  height: 1px;
  width: 110px;
  margin: 5px auto;
}
#price {
  padding-top: 38px;
}
</style>






