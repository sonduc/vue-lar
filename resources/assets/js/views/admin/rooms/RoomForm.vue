<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Room</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item"><a href="#">Room</a></li>
        <li class="breadcrumb-item active">Update</li>
      </ol>
      <div class="page-actions">
        <a @click="$refs.dark_html_modal.open()" style="color:white" class="btn btn-primary">
          <i class="icon-fa icon-fa-plus" /> New Room
        </a>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <form-wizard :title="titleRoom" :subtitle="subTitleRoom">
          <!-- 1. Đây là bắt đầu của form-wizad Tổng quan
               2. Bao gồm thông tin nổi bật và thông tin thêm -->
            <tab-content title="Tổng quan">
              <section>
                <!-- Card 1 - Bắt đầu: Thông tin nổi bật -->
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-header">
                      <h5 class="section-semi-title">Thông tin nổi bật</h5>
                    </div>
                    <div class="card-body">
                      <div class="row">
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label :style="errors.has('room.room_type') ? 'color:red;' : ''">{{errors.has('room.room_type')
                              ? errors.first('room.room_type') : 'Loại phòng *'}}
                            </label>
                            <select
                            v-model= "room.room_type"
                            name="room.room_type"
                            v-validate="'required'"
                            data-vv-as="Loại phòng"
                            class= "form-control ls-select2">
                              <option
                              v-for= "(item, index) in room_type"
                              :value="item.id" :key= "index">{{item.value}}
                              </option>
                            </select>
                          </div>
                          <div class="form-group">
                            <label :style="errors.has('room.number_bed') ? 'color:red;' : ''">{{errors.has('room.number_bed')
                              ? errors.first('room.number_bed') : 'Số giường *'}}</label>
                            <input
                            type="number"
                            name="room.number_bed"
                            v-validate="'required|numeric'"
                            data-vv-as="Số phòng ngủ"
                            v-model.number="room.number_bed"
                            class="form-control">
                          </div>
                          <div class="form-group">
                            <label :style="errors.has('room.merchant') ? 'color:red;' : ''">{{errors.has('room.merchant')
                              ? errors.first('room.merchant') : 'Quản lý phòng *'}}
                            </label>
                            <multiselect
                            :allow-empty="false" name="room.merchant"
                            v-model="merchant_id" v-validate="'required'"
                            data-vv-as="Người quản lý phòng" label="name"
                            :options="merchants" :searchable="true"
                            :show-labels="false" track-by="name"></multiselect>
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label :style="errors.has('room.number_room') ? 'color:red;' : ''">{{errors.has('room.number_room')
                                ? errors.first('room.number_room') : 'Số phòng ngủ *'}}
                            </label>
                            <input
                            type="number"
                            name="room.number_room"
                            v-validate="'required|numeric'"
                            data-vv-as="Số phòng ngủ"
                            v-model.number="room.number_room"
                            class="form-control">
                          </div>
                          <div class="form-group">
                            <label :style="errors.has('room.max_guest') ? 'color:red;' : ''">{{errors.has('room.max_guest')
                                ? errors.first('room.max_guest') : 'Số khách tối đa *'}}
                            </label>
                            <input
                            type="number"
                            name="room.max_guest"
                            v-validate="'required|numeric'"
                            data-vv-as="Số khách tối đa"
                            v-model.number="room.max_guest"
                            class="form-control">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Card 1 - Kết thúc: Thông tin nổi bật -->

                <!-- Card 2 - Bắt đầu: Thông tin thêm -->
                <div class="col-lg-12">
                  <div class="card ">
                    <div class="card-body">
                      <div class="row">
                        <div class="col-xl-12 mb-4">
                          <h5 class="section-semi-title ">Thông tin thêm</h5>
                          <tabs class="tabs-default" >
                            <tab id="basic-vietnam-room" name="Việt Nam" v-for="(detail, index) in room.details.data" :key="index">
                              <div class="col-lg-12">
                                <div class="form-group">
                                  <label :style="errors.has('room.name') ? 'color:red;' : ''">{{errors.has('room.name')
                                    ? errors.first('room.name') : 'Tên phòng *'}}</label>
                                  <input
                                  type="text"
                                  name="room.name"
                                  v-validate="'required|min:10'"
                                  data-vv-as="Tên phòng"
                                  v-model="room.name"
                                  class="form-control">
                                </div>
                                <div class="form-group">
                                  <label :style="errors.has('room.address') ? 'color:red;' : ''">{{errors.has('room.address')
                                    ? errors.first('room.address') : 'Địa chỉ *'}}</label>
                                  <input
                                  type="text"
                                  name="room.address"
                                  v-validate="'required|min:10'"
                                  data-vv-as="Địa chỉ phòng"
                                  v-model="room.address"
                                  class="form-control">
                                </div>
                                <div class="form-group">
                                  <label>Giới thiệu phòng</label>
                                  <quill-editor style="height:250px"></quill-editor>
                                </div>
                                </br></br>
                                <div class="form-group">
                                  <label>Không gian phòng</label>
                                  <quill-editor style="height:250px"></quill-editor>
                                </div>
                                </br></br>
                                <div class="form-group">
                                  <label>Những chú ý khi sử dụng phòng</label>
                                  <quill-editor style="height:250px"></quill-editor>
                                </div>
                              </div>
                              <br/>
                            </tab>
                          </tabs>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Card 2 - Kết thúc: Thông tin thêm -->
              </section>
            </tab-content>
            <!-- Kết thúc của form-wizad Tổng quan -->

            <tab-content title="Thông tin giá">
              <div class="card">
                <div class="card-header">
                  <div class="caption">Card 1</div>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label>Email</label>
                        <input type="email" class="form-control">
                      </div>
                      <div class="form-group">
                        <label>Phone No.</label>
                        <input type="text" class="form-control">
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label>Password</label>
                        <input type="password" class="form-control">
                      </div>
                      <div class="form-group">
                        <label>Password Confirmation</label>
                        <input type="password" class="form-control">
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-header">
                  <div class="caption">Card 2</div>

                  <div class="actions">
                    <button @click="addItem" class="btn btn-primary btn-sm"><i class="icon-fa icon-fa-plus"></i> Add
                    </button>
                  </div>
                </div>
                <div class="card-body">
                  <div class="row" v-for="(l,index) in list" :key="index">
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label>Name</label>
                        <input v-model="list[index].name" :ref="`lists[${index}]name`" type="email" class="form-control">
                      </div>
                    </div>
                    <div class="col-lg-5">
                      <div class="form-group">
                        <label>Value</label>
                        <input v-model="list[index].value" :ref="`lists[${index}]value`" type="email" class="form-control">
                      </div>
                    </div>

                    <div class="col-lg-1">
                      <div class="form-group">
                        <label>&ensp;</label>
                        <button v-tooltip="{content: 'Xóa',classes: ['danger'],targetClasses: ['it-has-a-tooltip']}" @click="removeItem(index)" class="form-control btn btn-danger btn-pressable"><i class="icon-fa icon-fa-close"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </tab-content>
            <tab-content title="Tiện ích phòng ">
              Yuhuuu! This seems pretty damn simple
            </tab-content>
          </form-wizard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Auth from "../../../services/auth";
import { FormWizard, TabContent } from "vue-form-wizard";
import { Tabs, Tab } from "vue-tabs-component";
import { quillEditor } from "vue-quill-editor";
import Multiselect from "vue-multiselect";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  name: 'RoomForm',
  components: {
    FormWizard,
    TabContent,
    Tabs,
    Tab,
    Multiselect,
    quillEditor
  },
  props: {
    type: {
      type: String,
      default: 'create'
    },
    dataRoom: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    merchant_id: {
      get: function () {
        return {
          name: this.room.user.data.name
        }
      },
      set: function (val) {
        this.room.user.data = val;
        this.room.merchant_id = val.id;
      }
    },
  },
  data() {
    return {
      list: [
        {
          name: null,
          value: null
        }
      ],
      titleRoom: "Chào mừng bạn đến với chức năng chỉnh sửa phòng",
      subTitleRoom: "Vui lòng hoàn thành chính xác các thông tin trước khi lưu",
      room_type: null,
      room: {
        comforts: [],
        details:{
          data:[
            {
              name: '',
              address: '',
              description: '',
              lang: 'vi',
              space: '',
              note: ''
            }
          ]
        },
        room_time_blocks: [],
        weekday_price: [],
        optional_prices:
          {
            days: [],
            price_day:null,
            price_hour: null,
            price_after_hour: null,
            price_charge_guest: null,
            status: 1
          },
        max_additional_guest: null,
        price_charge_guest: null,

        rent_type: null,
        price_day: null,
        price_hour: null,
        price_after_hour: null,

        checkin: null, // Bind giá trị thời gian
        checkout: null, // Bind giá trị thời gian
        room_type: '',
        // merchant_id: null,
        number_bed: null,
        number_room: null,
        max_guest: null,
      },
      merchants:[],
    };
  },
  methods: {
    setInitData() {
      let dataRoom = { ...this.dataRoom }
      this.room = JSON.parse(JSON.stringify({ ...this.room, ...dataRoom }))
      console.log(this.room)
    },
    addItem() {
      this.list.push({
        name: null,
        value: null
      });
      let index = this.list.length - 1;
    },
    removeItem(index) {
      this.list.splice(index, 1);
    },
    async getRoomType() {
      try {
        const response = await axios.get('rooms/type');
        this.room_type = response.data

      } catch(error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        } {}
      }
    },
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
    hideSidebarOnMobile() {
      let self = this;
      window.onresize = function() {
        if (window.innerWidth <= 992) {
          self.isLeftSidebarVisible = false;
        }
      };
    },
  },
  created () {
    !!this.dataRoom && this.setInitData()
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("permission-denied-403");
          } else {
            this.getRoomType();
            this.getMerchants();
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  }
};
</script>

<style>
</style>
