<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Room</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item"><a href="#">Room</a></li>
        <li class="breadcrumb-item active">Create</li>
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
            <tab-content title="Tổng quan">
              <section>
                <div class="row">
                  <div class="col-lg-6">
                    <div class="form-group">
                      <label :style="errors.has('room.room_type') ? 'color:red;' : ''">{{errors.has('room.room_type')
                        ? errors.first('room.room_type') : 'Loại phòng *'}}</label>
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
                     <input name="room.number_bed" v-validate="'required|numeric'" data-vv-as="Số phòng ngủ" type="number" v-model="room.number_bed"
                      class="form-control">
                    </div>
                    <div class="form-group">
                      <label :style="errors.has('room.merchant') ? 'color:red;' : ''">{{errors.has('room.merchant')
                        ? errors.first('room.merchant') : 'Quản lý phòng *'}}</label>
                      <multiselect
                      :allow-empty="false" name="room.merchant"
                      v-model="room.merchant_id" v-validate="'required'"
                      data-vv-as="Người quản lý phòng" label="name"
                      :options="merchants" :searchable="true"
                      :show-labels="false" />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-group">
                      <label :style="errors.has('room.number_room') ? 'color:red;' : ''">{{errors.has('room.number_room')
                        ? errors.first('room.number_room') : 'Số phòng ngủ *'}}</label>
                     <input name="room.number_room" v-validate="'required|numeric'" data-vv-as="Số phòng ngủ" type="number" v-model="room.number_room"
                      class="form-control">
                    </div>
                    <div class="form-group">
                      <label :style="errors.has('room.max_guest') ? 'color:red;' : ''">{{errors.has('room.max_guest')
                        ? errors.first('room.max_guest') : 'Số khách tối đa *'}}</label>
                     <input name="room.max_guest" v-validate="'required|numeric'" data-vv-as="Số khách tối đa" type="number" v-model="room.max_guest"
                      class="form-control">
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="card">
                      <div class="card-body">
                        <div class="row">
                          <div class="col-xl-12 mb-4">
                            <h5 class="section-semi-title">Basic</h5>
                            <tabs class="tabs-default">
                              <tab id="basic-home" name="Tab 1">
                                <div class="col-lg-12">

                                  <div class="form-group">
                                    <label>DOB</label>
                                    <div class="input-group">
                                      <input type="text" class="form-control ls-datepicker" value="06/10/2017">
                                      <div class="input-group-append">
                                        <span class="input-group-text">
                                          <i class="icon-fa icon-fa-calendar"></i>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="col-lg-12">
                                  <div class="form-group">
                                    <label>Hobbies</label>
                                    <select class="form-control ls-select2">
                                      <option value="developing">Developing</option>
                                      <option value="singing">Singing</option>
                                      <option value="reading">Reading</option>
                                      <option value="internet-surfing">Internet Surfing</option>
                                    </select>
                                  </div>
                                  <div class="form-group">
                                    <label>Occupation</label>
                                    <input type="text" class="form-control">
                                  </div>
                                </div>
                              </tab>
                              <tab id="basic-profile" name="Tab 2">
                                <div class="col-lg-12">
                                  <div class="form-group">
                                    <label>First Name</label>
                                    <input type="text" class="form-control">
                                  </div>
                                  <div class="form-group">
                                    <label>Last Name</label>
                                    <input type="text" class="form-control">
                                  </div>
                                  <div class="form-group">
                                    <label>DOB</label>
                                    <quill-editor style="height:250px"></quill-editor>
                                  </div>
                                </div>
                                <br/>
                                <div class="col-lg-12">
                                  <div class="form-group">
                                    <label>Hobbies</label>
                                    <select class="form-control ls-select2">
                                      <option value="developing">Developing</option>
                                      <option value="singing">Singing</option>
                                      <option value="reading">Reading</option>
                                      <option value="internet-surfing">Internet Surfing</option>
                                    </select>
                                  </div>
                                  <div class="form-group">
                                    <label>Occupation</label>
                                    <input type="text" class="form-control">
                                  </div>
                                </div>
                              </tab>

                            </tabs>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </tab-content>
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
  components: {
    FormWizard,
    TabContent,
    Tabs,
    Tab,
    Multiselect,
    quillEditor
  },
  props: {

  },
  data() {
    return {
      list: [
        {
          name: null,
          value: null
        }
      ],
      titleRoom: "Chào mừng bạn đến với chức năng tạo phòng",
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
        merchant_id: null,
        number_bed: null,
        number_room: null,
        max_guest: null,
      },
      merchants:[],
    };
  },
  methods: {
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
        const response = await axios.get('rooms/type',{
          params: {
          }
        });
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
