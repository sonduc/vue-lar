<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Mailbox</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item"><a href="#">Apps</a></li>
        <li class="breadcrumb-item active">Mailbox</li>
      </ol>
    </div>
    <div class="mailbox">

      <div class="mailbox-content">
        <div class="mailbox-content-header">
          <div class="mailbox-actions">
            <div class="custom-control custom-checkbox mailbox-action" style="display:inline-block">
              <input id="customCheckAll" v-model="selectAll" type="checkbox" class="custom-control-input">
              <label class="custom-control-label" for="customCheckAll" />
            </div>

            <v-dropdown active-url="/admin/dashboard" theme-light class="mailbox-action">
              <a slot="activator" href="#" @click.prevent>
                <button class="btn btn-light dropdown-toggle" type="button">
                  Actions
                </button>
              </a>

              <v-dropdown-item>
                <a href="#" @click.prevent="makeInvoice">Tạo hóa đơn</a>
              </v-dropdown-item>
              <v-dropdown-item>
                <a href="#" @click.prevent="showCrossCheckingModal">Yêu cầu đối soát</a>
              </v-dropdown-item>
            </v-dropdown>

          </div>

          <div class="mailbox-filters">
            <div class="mail-search">
              <input id="inputEmailTo" v-model="searchText" type="email" placeholder="Search" class="form-control">
            </div>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Ảnh</th>
              <th>Phòng</th>
              <th>Giá</th>
              <th colspan="2">Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(room,index) in filteredRooms" :key="index" :class="{'read' : room.status }">
              <td>{{index+1}}</td>
              <td>Ảnh</td>
              <td class="cell-content">
                <div class="content">
                  <div class="content-name mb-2">
                    {{ room.details.data[0].name }}
                  </div>
                  <div class="content-subject mb-2">
                    <i class="icon-fa icon-fa-home mb-2" />&ensp;Loại phòng: {{room.room_type_txt}} <br />
                    <i class="icon-fa icon-fa-clock-o" />&ensp;Cho thuê: {{room.rent_type_txt}}
                  </div>
                  <div class="content-subject mb-2">
                    <i class="icon-fa icon-fa-location-arrow" />&ensp;{{ room.details.data[0].address }}
                  </div>
                  <div class="content-subject mb-2">
                    <i class="icon-fa icon-fa-user" />&ensp; Chủ nhà: {{ room.user.data.name }}
                  </div>
                  <div class="content-subject mb-2">
                    <i class="icon-fa icon-fa-trash" />&ensp; Dọn dẹp: {{ room.cleaning_fee | formatNumber }}
                  </div>
                </div>
              </td>
              <td>
                <div class="content-subject mb-2">
                  Giá theo ngày: {{ room.price_day | formatNumber }}
                </div>
                <div class="content-subject mb-2">
                  Giá theo giờ: {{ room.price_hour | formatNumber }}
                </div>
                <div class="content-subject mb-2">
                  Phụ thu giờ: {{ room.price_after_hour | formatNumber }}
                </div>
                <div class="content-subject mb-2">
                  Phụ thu khách: {{ room.price_charge_guest | formatNumber }} ( từ sau
                  khách thứ {{ room.max_guest }})
                </div>
                <div class="content-subject mb-2">
                  Chi tiết giá
                </div>
              </td>
              <td width="10%">
                <div class="mb-2">
                  Phòng mới
                </div>
                <div class="mb-2">
                  Phòng hot
                </div>
                <div class="mb-2">
                  Phụ nổi bật
                </div>
                <div class="mb-2">
                  Phòng khóa
                </div>
              </td>
              <td class="cell-fav">
                <div class="content-subject mb-2">
                  <button type="button" class="btn btn-xs btn-icon btn-light mailbox-action"><i :class="room.new == 1? 'icon-fa icon-fa-check' : 'icon-fa icon-fa-times'"></i></button>
                </div>
                <div class="content-subject mb-2">
                  <button type="button" class="btn btn-xs btn-icon btn-light mailbox-action"><i :class="room.hot == 1? 'icon-fa icon-fa-check' : 'icon-fa icon-fa-times'"></i></button>
                </div>
                <div class="content-subject mb-2">
                  <button type="button" class="btn btn-xs btn-icon btn-light mailbox-action"><i :class="room.lastest_deal == 1? 'icon-fa icon-fa-check' : 'icon-fa icon-fa-times'"></i></button>
                </div>
                <div class="content-subject mb-2">
                  <button v-if="room.status == 0" type="button" class="btn btn-xs btn-icon btn-theme mailbox-action"><i
                      class="icon-fa icon-fa-hourglass-half"></i></button>
                  <button v-if="room.status == 2" type="button" class="btn btn-xs btn-icon btn-danger mailbox-action"><i
                      class="icon-fa icon-fa-check"></i></button>
                  <button v-if="room.status == 1" type="button" class="btn btn-xs btn-icon btn-success mailbox-action"><i
                      class="icon-fa icon-fa-times"></i></button>
                </div>

              </td>
              <td width="10%" style="text-align:center">
                <div class="btn-group mb-2" role="group" aria-label="First group">
                  <button v-tooltip.top-center="'Chi tiết phòng'" type="button" class="btn btn-sm btn-icon btn-outline-info">
                    <i class="icon-fa icon-fa-search" />
                  </button>
                  <button @click="openUpdateHostModal(room)" v-tooltip.top-center="'Cập nhật chủ nhà'" type="button"
                    class="btn btn-sm btn-icon btn-outline-info">
                    <i class="icon-fa icon-fa-user" />
                  </button>
                  <button v-tooltip.top-center="'Câp nhật phòng'" type="button" class="btn btn-sm btn-icon btn-outline-info">
                    <i class="icon-fa icon-fa-pencil" />
                  </button>
                </div>

                <button class="btn btn-light btn-xs mb-2">
                  Điểm quy chuẩn
                </button>
                <button @click="createBooking(room.id)" class="btn btn-theme btn-sm">
                  Đặt phòng
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <pagination @clicked="reloadData" :total-pages="totalPages" :current-page="currentPage" />
      </div>
      <sweet-modal overlay-theme="dark" ref="updateHost">
        <div v-if="update_room != null" class="card">
          <div class="card-header">
            <h6>{{update_room.details.data[0].name}}</h6>
          </div>
          <div class="card-body">
            <multiselect id="inputUserName" v-model="merchant" label="name" :options="merchants" :searchable="true"
              :show-labels="false" />
          </div>
        </div>

        <button slot="button" type="button" class="btn btn-default" data-dismiss="modal" @click="closeUpdateHostModal">
          Close
        </button>

        <button slot="button" type="button" class="btn btn-primary" @click="updateHostConfirm">
          Confirm
        </button>
      </sweet-modal>
    </div>
  </div>
</template>

<script>
import { SweetModal } from "sweet-modal-vue";
import Datepicker from "vuejs-datepicker";
import Multiselect from "vue-multiselect";
import Auth from "../../../services/auth";
import Pagination from "../../../components/paginate/ServerPagination";
import { format, constant } from "../../../helpers/mixins";
export default {
  mixins: [format, constant],
  components: {
    Pagination,
    Multiselect,
    Datepicker,
    SweetModal
  },
  data() {
    return {
      format: "yyyy-MM-dd",
      rooms: [],
      room: {},
      update_room: null,
      update_payment_status: null,
      update_room_status: null,
      q: "",
      date_start: null,
      date_end: null,
      merchant: {
        id: ""
      },
      city: {
        id: ""
      },
      district: {
        id: ""
      },
      merchants: [],
      cities: [],
      districts: [],
      option: null,
      isModalVisible: false,
      isLeftSidebarVisible: true,
      selectedRooms: [],
      permissions: "room.view",
      searchText: "",
      totalPages: null,
      currentPage: null,
      count: null
    };
  },
  computed: {
    selectAll: {
      get: function() {
        return this.rooms
          ? this.selectedRooms.length === this.rooms.length
          : false;
      },
      set: function(value) {
        let selectedRooms = [];

        if (value) {
          this.rooms.forEach(function(room) {
            selectedRooms.push(room.id);
          });
        }

        this.selectedRooms = selectedRooms;
      }
    },
    filteredRooms() {
      return this.rooms.filter(room => {
        let nameValid = true;

        if (this.searchText) {
          let searchText = this.searchText.toLowerCase();
          nameValid =
            room.title.toLowerCase().includes(searchText) ||
            room.from.name.toLowerCase().includes(searchText);
        }

        return nameValid;
      });
    },
    filteredDistrict() {
      let self = this;
      return this.districts.filter(function(item) {
        return item.city_id == self.city.id;
      });
    }
  },
  watch: {
    selectedStatus() {
      this.isModalVisible = false;
    }
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("permission-denied-403");
          } else {
            this.getRooms({});
            this.getMerchants();
            this.getCities();
            this.getDistricts();
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  },
  methods: {
    async getMerchants() {
      try {
        const response = await axios.get(`users`, {
          params: {
            limit: 99999,
            is_owner: 1
          }
        });
        this.merchants = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async getCities() {
      try {
        const response = await axios.get(`cities`, {
          params: {
            limit: 100
          }
        });
        this.cities = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async getDistricts() {
      try {
        const response = await axios.get(`districts`, {
          params: {
            limit: 1000
          }
        });
        this.districts = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async getRooms({ page, filter, sort }) {
      let date_start =
        this.date_start !== null
          ? this.date_start.toISOString().substr(0, 10)
          : "";
      let date_end =
        this.date_end !== null ? this.date_end.toISOString().substr(0, 10) : "";
      try {
        const response = await axios.get(`rooms`, {
          params: {
            include: "details,user",
            page: page,
            limit: 5
          }
        });

        let paginate = response.data.meta.pagination;
        this.currentPage = paginate.current_page;
        this.totalPages = paginate.total_pages;
        this.count = paginate.count;
        this.rooms = response.data.data;
        console.log(response.data.data);
        return {
          data: response.data.data,
          pagination: {
            totalPages: paginate.total_pages,
            currentPage: page,
            count: paginate.count
          }
        };
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    reloadData(page) {
      this.getRooms({
        page
      });
    },
    hideSidebarOnMobile() {
      let self = this;
      window.onresize = function() {
        if (window.innerWidth <= 992) {
          self.isLeftSidebarVisible = false;
        }
      };
    },
    createBooking(roomId) {
      this.$router.push({
        name: "booking.create",
        params: {
          roomId: roomId
        }
      });
    },
    openUpdateHostModal(room) {
      this.update_room = room;
      this.$refs.updateHost.open();
    },
    closeUpdateHostModal(room) {
      this.update_room = {};
      this.$refs.updateHost.close();
    },
    updateHostConfirm() {
      //Axios post update room
      this.update_room = {};
      this.$refs.updateHost.close();
    }
  }
};
</script>
