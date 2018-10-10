<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Danh sách phòng</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item active">Danh sách phòng</li>
      </ol>
    </div>
    <div class="mailbox">
      <div class="card">
        <div class="card-header">
          <h6>Horizontal Form</h6>
        </div>
        <div class="card-body">
          <form>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group row">
                  <label for="firstName" class="col-sm-2 col-form-label">Tên phòng</label>
                  <div class="col-sm-10">
                    <input id="firstName" type="text" class="form-control" placeholder="Nhập vào tên phòng">
                  </div>
                </div>
                <div class="form-group row">
                  <label for="email" class="col-sm-2 col-form-label">Thành phố</label>
                  <div class="col-sm-4">
                    <multiselect v-model="city" label="name" :options="cities" :searchable="true" :show-labels="false" />
                  </div>
                  <label for="email" class="col-sm-2 col-form-label">Quận</label>
                  <div class="col-sm-4">
                    <multiselect :disabled="city == null" v-model="district" label="name" :options="filteredDistrict"
                      :searchable="true" :show-labels="false" />
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group row">
                  <label for="lastName" class="col-sm-2 col-form-label">Host</label>
                  <div class="col-sm-4">
                    <multiselect id="inputUserName" v-model="merchant_id" label="name" :options="merchants" :searchable="true"
                      :show-labels="false" />
                  </div>
                  <label for="lastName" class="col-sm-2 col-form-label">Phòng</label>
                  <div class="col-sm-4">
                    <multiselect id="inputUserName" v-model="room_type" label="name" :options="room_type_list"
                      :searchable="true" :show-labels="false" />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="lastName" class="col-sm-1 col-form-label"> Từ </label>
                  <div class="col-sm-5">
                    <datepicker v-model="date_start" :format="format" input-class="form-control" />
                  </div>
                  <label for="lastName" class="col-sm-1 col-form-label"> Đến </label>
                  <div class="col-sm-5">
                    <datepicker v-model="date_end" :format="format" input-class="form-control" />
                  </div>
                </div>
              </div>
            </div>
            <button class="btn btn-success">Áp dụng</button>
          </form>
        </div>
      </div>
      <div class="mailbox-content">
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
                  <div class="content-name mb-3">
                    {{ room.details.data[0].name }}
                  </div>
                  <div class="content-subject mb-3">
                    <i class="icon-fa icon-fa-home mb-3" />&ensp;Loại phòng: {{room.room_type_txt}} <br />
                    <i class="icon-fa icon-fa-clock-o" />&ensp;Cho thuê: <button type="button" class="btn btn-xs btn-outline-primary">
                      {{room.rent_type_txt}}
                    </button>
                  </div>
                  <div class="content-subject mb-3">
                    <i class="icon-fa icon-fa-location-arrow" />&ensp;{{ room.details.data[0].address }}
                  </div>
                  <div class="content-subject mb-3">
                    <i class="icon-fa icon-fa-user" />&ensp; Chủ nhà: {{ room.user.data.name }}
                  </div>
                  <div class="content-subject mb-3">
                    <i class="icon-fa icon-fa-trash" />&ensp; Dọn dẹp: {{ room.cleaning_fee | formatNumber }}
                  </div>
                </div>
              </td>
              <td>
                <div class="content-subject mb-3">
                  Giá theo ngày: {{ room.price_day | formatNumber }}
                </div>
                <div class="content-subject mb-3">
                  Giá theo giờ: {{ room.price_hour | formatNumber }}
                </div>
                <div class="content-subject mb-3">
                  Phụ thu giờ: {{ room.price_after_hour | formatNumber }}
                </div>
                <div class="content-subject mb-3">
                  Phụ thu khách: {{ room.price_charge_guest | formatNumber }} ( từ sau
                  khách thứ {{ room.max_guest }})
                </div>
                <div class="content-subject mb-3">
                  Chi tiết giá
                </div>
              </td>
              <td width="10%">
                <div class="mb-3">
                  Phòng mới
                </div>
                <div class="mb-3">
                  Phòng hot
                </div>
                <div class="mb-3">
                  Phụ nổi bật
                </div>
                <div class="mb-3">
                  Tự quản lý
                </div>
                <div class="mb-3">
                  Phòng khóa
                </div>
              </td>
              <td class="cell-fav">
                <div class="content-subject mb-3">
                  <button @click="updateRoomMinor('new',room)" type="button" class="btn btn-xs btn-icon btn-light mailbox-action"><i
                      :class="room.new == 1? 'icon-fa icon-fa-check' : 'icon-fa icon-fa-times'"></i></button>
                </div>
                <div class="content-subject mb-3">
                  <button @click="updateRoomMinor('hot',room)" type="button" class="btn btn-xs btn-icon btn-light mailbox-action"><i
                      :class="room.hot == 1? 'icon-fa icon-fa-check' : 'icon-fa icon-fa-times'"></i></button>
                </div>
                <div class="content-subject mb-3">
                  <button @click="updateRoomMinor('latest_deal',room)" type="button" class="btn btn-xs btn-icon btn-light mailbox-action"><i
                      :class="room.latest_deal == 1? 'icon-fa icon-fa-check' : 'icon-fa icon-fa-times'"></i></button>
                </div>
                <div class="content-subject mb-3">
                  <button @click="updateRoomMinor('is_manager',room)" type="button" class="btn btn-xs btn-icon btn-light mailbox-action"><i
                      :class="room.is_manager == 1? 'icon-fa icon-fa-check' : 'icon-fa icon-fa-times'"></i></button>
                </div>
                <div class="content-subject mb-3">
                  <button @click="updateRoomMinor('status',room)" v-if="room.status == 2" type="button" class="btn btn-xs btn-icon btn-danger mailbox-action"><i
                      class="icon-fa icon-fa-check"></i></button>
                  <button @click="updateRoomMinor('status',room)" v-if="room.status == 1" type="button" class="btn btn-xs btn-icon btn-success mailbox-action"><i
                      class="icon-fa icon-fa-times"></i></button>
                </div>

              </td>
              <td width="10%" style="text-align:center">
                <div class="btn-group mb-3" role="group" aria-label="First group">
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

                <button class="btn btn-light btn-xs mb-3">
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
      room_type: null,
      room: {},
      update_room: null,
      update_payment_status: null,
      update_room_status: null,
      q: "",
      date_start: null,
      date_end: null,
      merchant_id: null,
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
      totalPages: null,
      currentPage: null,
      count: null,
      room_type_list: [
        {
          id: 1,
          value: "Nhà riêng"
        },
        {
          id: 2,
          value: "Căn hộ/Chung cư"
        },
        {
          id: 3,
          value: "Biệt thự"
        },
        {
          id: 4,
          value: "Phòng riêng"
        },
        {
          id: 5,
          value: "Khách sạn"
        }
      ]
    };
  },
  computed: {
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
            limit: -1,
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
            limit: -1
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
            limit: -1
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
        // console.log(response.data.data);
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
      this.option = "merchant_id";
      this.$refs.updateHost.open();
    },
    closeUpdateHostModal(room) {
      this.update_room = {};
      this.$refs.updateHost.close();
    },
    async updateHostConfirm() {
      let response = await axios
        .put(`rooms/prop-update/${this.update_room.id}?option=${this.option}`, {
          merchant_id: this.merchant.id
        })
        .then(result => {
          if (result) {
            this.reloadData(1);
            this.$refs.updateHost.close();
            window.toastr["success"]("Updated host!", "Success");
          } else {
            window.toastr["error"]("Something wrong!", "Error");
          }
        });
    },
    async updateRoomMinor(option, room) {
      if (option === "hot") {
        let response = await axios
          .put(`rooms/prop-update/${room.id}?option=${option}`, {
            hot: room.hot == 1 ? 0 : 1
          })
          .then(result => {
            if (result) {
              this.reloadData(1);

              window.toastr["success"]("Updated Hot Room!", "Success");
            } else {
              window.toastr["error"]("Something wrong!", "Error");
            }
          });
      } else if (option === "new") {
        let response = await axios
          .put(`rooms/prop-update/${room.id}?option=${option}`, {
            new: room.new == 1 ? 0 : 1
          })
          .then(result => {
            if (result) {
              this.reloadData(1);

              window.toastr["success"]("Updated New Room!", "Success");
            } else {
              window.toastr["error"]("Something wrong!", "Error");
            }
          });
      } else if (option === "latest_deal") {
        let response = await axios
          .put(`rooms/prop-update/${room.id}?option=${option}`, {
            latest_deal: room.latest_deal == 1 ? 0 : 1
          })
          .then(result => {
            if (result) {
              this.reloadData(1);
              window.toastr["success"]("Updated Latest Deal!", "Success");
            } else {
              window.toastr["error"]("Something wrong!", "Error");
            }
          });
      } else if (option === "is_manager") {
        let response = await axios
          .put(`rooms/prop-update/${room.id}?option=${option}`, {
            is_manager: room.is_manager == 1 ? 0 : 1
          })
          .then(result => {
            if (result) {
              this.reloadData(1);
              window.toastr["success"]("Updated Self Manage!", "Success");
            } else {
              window.toastr["error"]("Something wrong!", "Error");
            }
          });
      } else if (option === "status") {
        let response = await axios
          .put(`rooms/prop-update/${room.id}?option=${option}`, {
            status: room.status == 1 ? 2 : 1
          })
          .then(result => {
            if (result) {
              this.reloadData(1);
              window.toastr["success"]("Updated Status!", "Success");
            } else {
              window.toastr["error"]("Something wrong!", "Error");
            }
          });
      }
    }
  }
};
</script>
