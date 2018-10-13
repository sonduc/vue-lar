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
          <i class="icon-fa icon-fa-backward" /> Back
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
                          <div class="row">
                            <div class="col-lg-6">
                              <h5 class="section-semi-title ">Thông tin thêm</h5>
                            </div>
                            <div class="col-lg-6">
                              <button type="button" v-if="checkCountLang" @click="addNewLangEnglishForm" style="color:white; float:right;" class="btn btn-success">
                                <i class="icon-fa icon-fa-plus" /> Thêm tiếng anh
                              </button>
                              <button type="button" v-else @click="deleteLangEnglishForm"style="color:white; float:right;" class="btn btn-danger">
                                <i class="icon-fa icon-fa-trash-o" /> Xóa tiếng anh
                              </button>
                            </div>
                          </div>
                          <tabs class="tabs-default" >
                            <tab
                            :id="detail.id" :name="detail.lang === 'vi' ? 'Việt Nam':'English'"
                            v-for="(detail, index) in room.details.data" :key="index">
                              <div class="col-lg-12">
                                <div class="form-group">
                                  <label :style="errors.has('detail.name' + index) ? 'color:red;' : ''">{{errors.has('detail.name' + index)
                                    ? errors.first('detail.name' + index) : 'Tên phòng *'}}
                                  </label>
                                  <input
                                  type="text"
                                  v-model="room.details.data[index].name"
                                  :name="'detail.name' + index"
                                  v-validate="'required|min:10'"
                                  data-vv-as="Tên phòng"
                                  class="form-control">
                                </div>
                                <div class="form-group">
                                  <label :style="errors.has('detail.address' + index) ? 'color:red;' : ''">{{errors.has('detail.address' + index)
                                    ? errors.first('detail.address' + index) : 'Địa chỉ *'}}</label>
                                  <input
                                  type="text"
                                  v-model="room.details.data[index].address"
                                  :name="'detail.address' + index"
                                  v-validate="'required|min:10'"
                                  data-vv-as="Địa chỉ phòng"
                                  class="form-control">
                                </div>
                                <div class="form-group">
                                  <label>Giới thiệu phòng</label>
                                  <quill-editor
                                  v-model="room.details.data[index].description"
                                  style="height:250px"></quill-editor>
                                </div>
                                </br></br>
                                <div class="form-group">
                                  <label>Không gian phòng</label>
                                  <quill-editor
                                  v-model="room.details.data[index].space"
                                  style="height:250px"></quill-editor>
                                </div>
                                </br></br>
                                <div class="form-group">
                                  <label>Những chú ý khi sử dụng phòng</label>
                                  <quill-editor
                                  v-model="room.details.data[index].note"
                                  style="height:250px"></quill-editor>
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
                  <h5 class="section-semi-title">Giá cơ bản</h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label :style="errors.has('room.checkin') ? 'color:red;' : ''">{{errors.has('room.checkin')
                          ? errors.first('room.checkin') : 'Giờ checkin *'}}</label>
                        <multiselect :allow-empty="false" name="room.checkin" v-model="room.checkin" v-validate="'required'"
                        data-vv-as="Giờ checkin" :options="hoursData" :searchable="true" :show-labels="false" />
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label :style="errors.has('room.checkout') ? 'color:red;' : ''">{{errors.has('room.checkout')
                          ? errors.first('room.checkout') : 'Giờ checkout *'}}</label>
                        <multiselect :allow-empty="false" name="room.checkout" v-model="room.checkout" v-validate="'required'"
                        data-vv-as="Giờ checkout" :options="hoursData" :searchable="true" :show-labels="false" />
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label :style="errors.has('room.max_additional_guest') ? 'color:red;' : ''">{{errors.has('room.max_additional_guest')
                          ? errors.first('room.max_additional_guest') : 'Số khách thêm tối đa *'}}
                        </label>
                        <input
                        type="number"
                        name="room.max_additional_guest"
                        v-validate="'required|numeric'"
                        data-vv-as="Số khách thêm tối đa"
                        v-model.number="room.max_additional_guest"
                        class="form-control">
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label :style="errors.has('room.price_charge_guest') ?
                        'color:red;' : ''">{{errors.has('room.price_charge_guest')
                          ? errors.first('room.price_charge_guest') : 'Giá tiền tăng cho mỗi khách *'}}</label>
                        <input
                        type="number"
                        name="room.price_charge_guest"
                        v-validate="'required|numeric'"
                        data-vv-as="Giá tiền tăng cho mỗi khách"
                        v-model.number="room.price_charge_guest"
                        class="form-control">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class = "col-lg-6">
                      <div class="form-group">
                        <label :style="errors.has('room.rent_type') ? 'color:red;' : ''">{{errors.has('room.rent_type')
                          ? errors.first('room.rent_type') : 'Thuê theo *'}}
                        </label>
                        <select
                        v-model= "room.rent_type"
                        name="room.rent_type"
                        v-validate="'required'"
                        data-vv-as="Thuê theo"
                        class= "form-control ls-select2">
                          <option
                          v-for= "(item, index) in rent_type"
                          :value="item.id" :key= "index">{{item.value}}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div :class = "room.rent_type == 1 ? 'col-lg-6':'col-lg-3'"
                    v-if="room.rent_type == 1 || room.rent_type == 3">
                      <div class="form-group">
                        <label :style="errors.has('room.price_hour') ? 'color:red;' : ''">{{errors.has('room.price_hour')
                          ? errors.first('room.price_hour') : 'Giá theo giờ *'}}</label>
                        <input
                        type="number"
                        name="room.price_hour"
                        v-validate="'required|numeric'"
                        data-vv-as="Giá theo giờ"
                        v-model.number="room.price_hour"
                        class="form-control">
                      </div>
                    </div>
                    <div :class = "room.rent_type == 2 ? 'col-lg-6':'col-lg-3'"
                    v-if="room.rent_type == 2 || room.rent_type == 3">
                      <div class="form-group">
                        <label :style="errors.has('room.price_day') ? 'color:red;' : ''">{{errors.has('room.price_day')
                          ? errors.first('room.price_day') : 'Giá theo ngày  *'}}</label>
                        <input
                        type="number"
                        name="room.price_day"
                        v-validate="'required|numeric'"
                        data-vv-as="Giá theo ngày"
                        v-model.number="room.price_day"
                        class="form-control">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header">
                  <div class="row">
                    <div class="col-lg-6">
                      <h5 class="section-semi-title">Giá ngày trong tuần</h5>
                    </div>
                    <div class="col-lg-6">
                      <button @click="addItem" style="color:white; float:right;"
                      class="btn btn-success btn-sm">
                      <i class="icon-fa icon-fa-plus"></i> Thêm ngày
                      </button>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <div class="row" v-for="(l,index) in list" :key="index">
                    <div class="col-lg-3">
                      <div class="form-group">
                        <label>Thứ</label>
                        <input v-model="list[index].name" :ref="`lists[${index}]name`" type="email" class="form-control">
                      </div>
                    </div>
                    <div class="col-lg-2">
                      <div class="form-group">
                        <label>Giá theo ngày</label>
                        <input v-model="list[index].value" :ref="`lists[${index}]value`" type="email" class="form-control">
                      </div>
                    </div>
                    <div class="col-lg-2">
                      <div class="form-group">
                        <label>Giá theo giờ</label>
                        <input v-model="list[index].value" :ref="`lists[${index}]value`" type="email" class="form-control">
                      </div>
                    </div>
                    <div class="col-lg-2">
                      <div class="form-group">
                        <label>Giá giờ tiếp theo</label>
                        <input v-model="list[index].value" :ref="`lists[${index}]value`" type="email" class="form-control">
                      </div>
                    </div>
                    <div class="col-lg-2">
                      <div class="form-group">
                        <label>Giá tiền tăng cho mỗi khách</label>
                        <input v-model="list[index].value" :ref="`lists[${index}]value`" type="email" class="form-control">
                      </div>
                    </div>

                    <div class="col-lg-1">
                      <div class="form-group">
                        <label>&ensp;</label>
                        <button v-tooltip="{content: 'Xóa ngày',classes: ['danger'],targetClasses: ['it-has-a-tooltip']}" @click="removeItem(index)" class="form-control btn btn-outline-danger"><i class="icon-fa icon-fa-close"></i>Xóa
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
import { hoursList, format } from "../../../helpers/mixins";
import { Tabs, Tab } from "vue-tabs-component";
import { quillEditor } from "vue-quill-editor";
import Multiselect from "vue-multiselect";
import Datepicker from "vuejs-datepicker";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  name: 'RoomForm',
  mixins: [hoursList, format],
  components: {
    FormWizard,
    TabContent,
    Tabs,
    Tab,
    Multiselect,
    quillEditor,
    Datepicker
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
    checkCountLang() {
      if (this.room.details.data.length) {
        let length = this.room.details.data.length
        return !!(length == 1)
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
      room_type: null,
      rent_type: null,
      merchants:[],
      weekdays: [
        {
          title: 'Thứ 2',
          weekday: 2,
          price_day: null,
          price_hour: null,
          price_after_hour: null,
          price_charge_guest: null,
          status:0
        },
        {
          title: 'Thứ 3',
          weekday: 3,
          price_day: null,
          price_hour: null,
          price_after_hour: null,
          price_charge_guest: null,
          status:0
        },
        {
          title: 'Thứ 4',
          weekday: 4,
          price_day: null,
          price_hour: null,
          price_after_hour: null,
          price_charge_guest: null,
          status:0
        },
        {
          title: 'Thứ 5',
          weekday: 5,
          price_day: null,
          price_hour: null,
          price_after_hour: null,
          price_charge_guest: null,
          status:0
        },
        {
          title: 'Thứ 6',
          weekday: 6,
          price_day: null,
          price_hour: null,
          price_after_hour: null,
          price_charge_guest: null,
          status:0
        },
        {
          title: 'Thứ 7',
          weekday: 7,
          price_day: null,
          price_hour: null,
          price_after_hour: null,
          price_charge_guest: null,
          status:0
        },
        {
          title: 'Chủ Nhật',
          weekday: 1,
          price_day: null,
          price_hour: null,
          price_after_hour: null,
          price_charge_guest: null,
          status:0
        }
      ],
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
    async getRentType() {
      try {
        const response = await axios.get('rooms/rent-type');
        this.rent_type = response.data
        console.log(this.rent_type)
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
    addNewLangEnglishForm() {
      this.room.details.data.push({
        name: '',
        address: '',
        description: '',
        lang: 'en',
        space: '',
        note: ''
      })
    },
    deleteLangEnglishForm() {
      let index = this.room.details.data.findIndex(x => x.lang == 'en')
      this.room.details.data.splice( index, 1)
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
            this.getRentType();
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
