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
          :selectable="true"
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
                <button class="btn btn-outline-success" style="margin-right: 15px;"
                @click.prevent="unblockSubmit()"
                :disabled="dateSelected.startDate == null ? true: false">Mở phòng</button>
                <button class="btn btn-outline-danger" style="margin-right: 15px;"
                @click.prevent="blockSubmit()"
                :disabled="dateSelected.startDate == null ? true: false">Khóa phòng</button>
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
      let roomCalendar = this.room;
      let blockSchedule = this.blockSchedule;
      return {
        locale: 'vi',
        dayRender: function(date,cell) {
          let current = new Date();
          let currentDate = current.toISOString().substring(0, 10);
          if(date.format('YYYY-MM-DD') < currentDate ) {
            cell.addClass("bg-past-day");
          }
          else if(blockSchedule.includes(date.format('YYYY-MM-DD'))){
            cell.addClass("bg-blocked-day");
          }
          else {
            cell.append("<div class='available'>"+roomCalendar.price_day+"đ</div>");
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
        },
        select(start, end, jsEvent, view) {
          self.dateSelected.startDate = start.format('YYYY-MM-DD');
          end = end.subtract(1, 'days');
          self.dateSelected.endDate = end.format('YYYY-MM-DD');
        }
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
            booking.end = item.checkout;
            this.bookingCalendar.push(booking)
          })
        }
      }
    },
    'block.startDate': {
      handler(val) {
        this.disabledEndDate.to = val;
      },
      deep: true
    },
    'unblock.startDate': {
      handler(val) {
        this.disabledEndDate.to = val;
      },
      deep: true
    },
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
              overlap: true,
              rendering: 'background',
              color: 'rgb(118, 118, 118)',
              className:'event-full'
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
        console.log(response.data.data.blocks.data);
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
        let unblockDays = [];
        unblockDays.push(unblock);
        let blockDays = this.blockRoom;
        blockDays.forEach(item => {
          if(item[0] === item[1]) {
            item.pop();
          }
        });
        let response = await axios
        .put('rooms/update-block', {
          room_id: this.$route.params.roomId,
          room_time_blocks: blockDays,
          unlock_days: unblockDays
        })
        .then(response => {
          this.getBlockOfRoom();
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
          this.getBlockOfRoom();
        });
      } else {
        return window.scroll({
          top: 0,
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
  cursor: not-allowed;
}
.bg-blocked-day {
  background-color: #ffffff;
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
}
.event-full {
  background: repeating-linear-gradient(
    -45deg,
    #cccccc,
    #cccccc 10px,
    #f2f2f2 10px,
    #f2f2f2 20px
  );
}
</style>






