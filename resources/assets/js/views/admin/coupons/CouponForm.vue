<template >
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Coupon (Phiếu giảm giá)</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item"><a href="#">Coupon</a></li>
        <li class="breadcrumb-item active">{{type}}</li>
      </ol>
    </div>

    <div class="row">
      <div class="col-sm-12">
        <form>
          <div class="card">
            <div class="card-header">
              <h5>{{titleCard}}</h5>
            </div>
            <div class="card-body">
              <div class="form-group row">
                <div class="form-group col-md-3">
                  <label :style="errors.has('coupons.code') ? 'color:red;' : ''">
                    {{errors.has('coupons.code')
                    ? errors.first('coupons.code') : 'Mã code *'}}
                  </label>
                  <input
                    type="text"
                    name="coupons.code"
                    v-validate="'required|min:4|alpha_num'"
                    data-vv-as="Mã code"
                    v-model="coupons.code"
                    class="form-control">
                </div>
                <div class="form-group col-md-3">
                  <label :style="errors.has('coupons.usable') ? 'color:red;' : ''">
                    {{errors.has('coupons.usable')
                    ? errors.first('coupons.usable') : 'Số lần sử dụng tối đa'}}
                  </label>
                  <input
                    type="number"
                    name="coupons.usable"
                    v-validate="'min_value:0'"
                    v-model.number="coupons.usable"
                    data-vv-as="Số lần sử dụng tối đa"
                    class="form-control">
                </div>
                <div class="form-group col-md-3">
                  <label :style="errors.has('coupons.discount') ? 'color:red;' : ''">
                    {{errors.has('coupons.discount')
                  ? errors.first('coupons.discount') : 'Giảm % (discount) *'}}</label>
                  <input
                    type="number"
                    name="coupons.discount"
                    data-vv-as="Discount"
                    v-validate="'required|min_value:0|max_value:100'"
                    v-model.number="coupons.discount"
                    class="form-control">
                </div>
                <div class="form-group col-md-3">
                  <label :style="errors.has('coupons.max_discount') ? 'color:red;' : ''">
                    {{errors.has('coupons.max_discount')
                      ? errors.first('coupons.max_discount') : 'Giảm tối đa (VNĐ) *'}}
                  </label>
                  <input
                    type="number"
                    name="coupons.max_discount"
                    v-model.number="coupons.max_discount"
                    v-validate="'min_value:0'"
                    data-vv-as="Giá tiền giảm tối đa"
                    class="form-control">
                </div>
              </div><br/>
              <div class="form-group row">
                <label for="pasword" class="col-sm-3 col-form-label">
                  Trạng thái phiếu giảm giá:
                </label>
                <div class="col-sm-9">
                  <button v-if="coupons.status == 1" type="button"
                    @click="updateStatus(1)"
                    v-tooltip.top-center="'Click để thay đổi trạng thái'"
                    class="btn btn-sm btn-icon btn-primary custom-btn">Đang chạy
                  </button>
                 <!--  <button v-else-if="checkDueDate(days.endDay)"
                    disabled="true" type="button"
                    class="btn btn-sm btn-icon btn-danger pl-3 pr-4 custom-btn" >Hết hạn
                  </button> -->
                  <button v-else type="button" @click="updateStatus(0)"
                    v-tooltip.top-center="'Click để thay đổi trạng thái'"
                    class="btn btn-sm btn-icon btn-danger" >Tạm dừng
                  </button>
                </div>
              </div>
              <div class="form-group row">
                <label for="pasword" class="col-sm-3 col-form-label">
                  Áp dụng cho:
                </label>
                <div class="col-sm-3 custom-checkbox-all custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    v-model="isAllRoom"
                    :true-value="1" :false-value="0"
                    id="isAllRoom">
                  <label class="custom-control-label" for="isAllRoom">
                    Tất cả phòng/căn hộ
                  </label>
                </div>
              </div>
              <div>
                <p style="text-decoration: underline;">Hoặc:</p>
              </div>
              <div class="form-group row">
                <label for="pasword" class="col-sm-3 col-form-label">
                  Chọn các phòng/căn hộ:
                </label>
                <div class="col-sm-9" >
                  <multiselect
                    style="z-index: 6"
                    v-model="coupons.settings.rooms"
                    :multiple="true"
                    :close-on-select="false"
                    :clear-on-select="true"
                    :preserve-search="true"
                    track-by="name"
                    :options="roomlist"
                    placeholder="Chọn phòng/căn hộ"
                    label="name"
                    :disabled="isAllRoom == 1 ? true : false"
                    :preselect-first="true">
                    <template slot="selection" slot-scope="{ values, search, isOpen }">
                      <span class="multiselect__single" style="color:green"
                        v-if="values.length &amp;&amp; !isOpen">
                        {{ values.length }} phòng/căn hộ đã được chọn
                      </span>
                    </template>
                  </multiselect>
                </div>
              </div>
              <div class="form-group row wrapper-room panel-collapse"
                v-if="coupons.settings.rooms.length">
                <div class="col-sm-12">
                  <draggable
                    v-model="coupons.settings.rooms"
                    :options="{group:'people'}"
                    @start="drag=true"
                    @end="drag=false"
                    class="container-form">
                    <div class="list-form"
                      v-for="(room,index) in coupons.settings.rooms"
                      :key="index">
                      <p class="btn btn-outline-secondary name-room">
                      {{room.name}}
                        <i @click="deleteRoom(index)"
                          class="icon-fa icon-fa-times icon-room">
                        </i>
                      </p>
                    </div>
                  </draggable>
                </div>
              </div>
              <div class="form-group row">
                <label for="pasword" class="col-sm-3 col-form-label">
                  Chọn các tỉnh/thành phố:
                </label>
                <div class="col-sm-9" >
                  <multiselect
                    style="z-index: 5"
                    v-model="coupons.settings.cities"
                    :multiple="true"
                    :close-on-select="false"
                    :clear-on-select="true"
                    :preserve-search="true"
                    track-by="name"
                    :options="cities"
                    placeholder="Chọn tỉnh/thành phố"
                    label="name"
                    :disabled="isAllRoom == 1 ? true : false"
                    :preselect-first="true">
                    <template slot="selection" slot-scope="{ values, search, isOpen }">
                      <span class="multiselect__single" style="color:blue" v-if="values.length &amp;&amp; !isOpen">
                        {{ values.length }} tỉnh/thành phố đã được chọn
                      </span>
                    </template>
                  </multiselect>
                </div>
              </div>
              <div class="form-group row wrapper-room panel-collapse"
                v-if="coupons.settings.cities.length">
                <div class="col-sm-12">
                  <draggable
                    v-model="coupons.settings.cities"
                    :options="{group:'people'}"
                    @start="drag=true"
                    @end="drag=false"
                    class="container-form">
                    <div
                    class="list-form"
                    v-for="(city,index) in coupons.settings.cities"
                    :key="index">
                      <p class="btn btn-outline-secondary name-room">
                        {{city.name}}
                        <i @click="deleteCity(index)"
                        class="icon-fa icon-fa-times icon-room">
                        </i>
                      </p>
                    </div>
                  </draggable>
                </div>
              </div>
              <div class="form-group row">
                <label for="pasword" class="col-sm-3 col-form-label">
                  Chọn các quận/huyện:
                </label>
                <div class="col-sm-9" >
                  <multiselect
                    style="z-index: 4"
                    v-model="coupons.settings.districts"
                    :multiple="true"
                    :close-on-select="false"
                    :clear-on-select="true"
                    :preserve-search="true"
                    track-by="name"
                    :options="districts"
                    placeholder="Chọn quận/huyện"
                    label="name"
                    :disabled="isAllRoom == 1 ? true : false"
                    :preselect-first="true">
                    <template slot="selection" slot-scope="{ values, search, isOpen }">
                      <span class="multiselect__single" style="color:#ff0066"
                        v-if="values.length &amp;&amp; !isOpen">
                        {{ values.length }} quận/huyện đã được chọn
                      </span>
                    </template>
                  </multiselect>
                </div>
              </div>
              <div class="form-group row wrapper-room panel-collapse"
                v-if="coupons.settings.districts.length">
                <div class="col-sm-12">
                  <draggable
                    v-model="coupons.settings.districts"
                    :options="{group:'people'}"
                    @start="drag=true"
                    @end="drag=false"
                    class="container-form">
                    <div
                      class="list-form"
                      v-for="(district,index) in coupons.settings.districts"
                      :key="index">
                      <p class="btn btn-outline-secondary name-room">
                        {{district.name}}
                        <i @click="deleteDistrict(index)"
                        class="icon-fa icon-fa-times icon-room"></i>
                      </p>
                    </div>
                  </draggable>
                </div>
              </div>
              <div class="form-group row">
                <label for="pasword" class="col-sm-3 col-form-label pt-35">
                  Áp dụng cho các ngày:
                </label>
                <div class="col-sm-8">
                  <v-date-picker
                    mode='multiple'
                    v-model="coupons.settings.days"
                    :min-date='disabledDay.to'
                    :max-date='disabledDay.from'
                    :input-props='{ class: "form-control",
                    placeholder: "Please choose days", readonly: true }'>
                  </v-date-picker>
                </div>
                <div class="col-sm-1">
                  <button style="float:right;" @click.prevent="deleteDay"
                  class="btn btn-outline-primary">Xóa ngày</button>
                </div>
              </div>
              <div class="btn-center">
                <button :disabled="coupons.used > 0 ? true : false" class="btn btn-success"
                  @click.prevent="onSubmit" style="float:right;">Lưu phiếu</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Auth from "../../../services/auth";
  import Multiselect from "vue-multiselect";
  import Draggable from 'vuedraggable';
  import Datepicker from "vuejs-datepicker";
  import { location } from "../../../helpers/mixins";
  import { map } from "lodash";
  export default {
    mixins: [location],
    components: {
      Datepicker,
      Multiselect,
      Draggable,
    },
    props: {
      type: {
        type: String,
        default: "Create"
      },
      dataCoupon: {
        default: () => {
          return null;
        }
      },
      titleCard: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        coupons: {
          discount: 0,
          max_discount: 0,
          code: null,
          all_day: 1,
          usable: 0,
          used: 0,
          status:0,
          promotion_id:null,
          settings: {
            rooms: [],
            cities: [],
            districts: [],
            days:[],
          }
        },
        promotion:null,
        isAllRoom: 0,
        roomlist: [],
        disabledDay: {
         to: null,
         from: null
        }
      }
    },
    computed: {
    ...mapGetters(['getPromotionId','getPromotionDay'])
    },
    watch: {
      isAllRoom: {
        handler(val) {
          if(val == 1) {
            this.coupons.settings.rooms = [];
            this.coupons.settings.cities = [];
            this.coupons.settings.districts = [];
          }
        }
      },
    },
    methods: {
      setInitData() {
        let dataCoupon = { ...this.dataCoupon };
        this.isAllRoom = dataCoupon.all_day;
        if(dataCoupon.settings.days.length) {
          dataCoupon.settings.days.forEach(item => {
            let date = new Date(item);
            this.coupons.settings.days.push(date);
          })
        }
        this.coupons = JSON.parse(JSON.stringify({ ...this.coupons, ...dataCoupon }));
        if(dataCoupon.settings.days.length) {
          this.coupons.settings.days= [];
          dataCoupon.settings.days.forEach(item => {
            let date = new Date(item);
            date.setTime(date.getTime() - 7 * 60 * 60 * 1000);
            this.coupons.settings.days.push(date);
          })
        }
      },
      selectRoom(selectedOption, id) {
        let objectRoom = {
          id :selectedOption.id,
          name: selectedOption.name,
        }
        this.coupons.settings.rooms.push(objectRoom);
      },
      deleteRoom(id) {
        this.coupons.settings.rooms.splice(id,1);
      },
      deleteCity(id) {
        this.coupons.settings.cities.splice(id,1);
      },
      deleteDistrict(id) {
        this.coupons.settings.districts.splice(id,1);
      },
      deleteDay() {
        this.coupons.settings.days = [];
      },
      updateStatus(status) {
        if(status == 1) {
          this.coupons.status = 0;
        }
        else {
          this.coupons.status = 1;
        }
      },
      addDay(date) {
        let beforeAddDay = new Date(date);
        let timeDay = 86400000;
        let afterAddDay = new Date(beforeAddDay.getTime() + timeDay);
        let day = afterAddDay.toISOString().substring(0,10);
        return day;
      },
      async getRooms() {
        try {
          const response = await axios.get('rooms/get-name');
          this.roomlist = response.data.data;
        } catch (error) {
          if (error) {
            window.toastr["error"]("There was an error", "Error");
          }
        }
      },
      async onSubmit() {
        const result = await this.$validator.validateAll();
        if (result) {
          try {
            let arrRoomId = [];
            let arrCityId = [];
            let arrDistrictId = [];
            let arrDays = [];
            if(this.coupons.settings.days.length) {
              this.coupons.settings.days.forEach(date => {
                let day = this.addDay(date);
                let d = new Date(day);
                arrDays.push(d.toISOString().substring(0, 10));
              })
            }
            if(this.coupons.settings.rooms.length) {
              arrRoomId = this.coupons.settings.rooms.map(room => room.id);
            }
            if(this.coupons.settings.cities.length) {
              arrCityId = this.coupons.settings.cities.map(city => city.id);
            }
            if(this.coupons.settings.districts.length) {
              arrDistrictId = this.coupons.settings.districts.map(district => district.id);
            }
            if (this.type === "Update") {
              this.$swal({
                title: "Bạn có muốn cập nhật phiếu giảm giá này không",
                text: "",
                type: "warning",
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                showCloseButton: false,
                showLoaderOnConfirm: true,
                preConfirm: async () => {
                  let response = await axios
                  .put(`coupons/${this.$route.params.couponId}`, {
                    code: this.coupons.code,
                    discount: this.coupons.discount,
                    max_discount: this.coupons.max_discount,
                    usable: this.coupons.usable,
                    used: this.coupons.used,
                    all_day: this.isAllRoom,
                    promotion_id: this.coupons.promotion_id,
                    status: this.coupons.status,
                    settings: {
                      rooms: this.isAllRoom == 0 ? arrRoomId : [],
                      cities: this.isAllRoom == 0 ? arrCityId : [],
                      districts: this.isAllRoom == 0 ? arrDistrictId : [],
                      days: arrDays
                    }
                  })
                  .then(response => {
                    this.$swal(
                      "Thành công",
                      "Phiếu giảm giá được cập nhật thành công",
                      "success"
                    );
                    this.$router.push({ name: "promotion.list" });
                  })
                  .catch(error => {
                    console.log(error)
                    let err = error.response.data.data.errors;
                    let err_array = Object.values(err)
                    let err_txt = '';
                    err_array.forEach(function(element) {
                      err_txt += element + '; ';
                    });
                    window.toastr["error"](err_txt, "Error");
                  });
                }
              });
            } else {
              this.$swal({
                title: "Bạn có muốn tạo phiếu giảm giá này không",
                text: "",
                type: "warning",
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                showCloseButton: false,
                showLoaderOnConfirm: true,
                preConfirm: async () => {
                  let response = await axios
                  .post("coupons", {
                    code: this.coupons.code,
                    discount: this.coupons.discount,
                    max_discount: this.coupons.max_discount,
                    usable: this.coupons.usable,
                    used: this.coupons.used,
                    all_day: this.isAllRoom,
                    promotion_id: this.getPromotionId,
                    status: this.coupons.status,
                    settings: {
                      rooms: this.isAllRoom == 0 ? arrRoomId : [],
                      cities: this.isAllRoom == 0 ? arrCityId : [],
                      districts: this.isAllRoom == 0 ? arrDistrictId : [],
                      days: arrDays
                    }
                  })
                  .then(response => {
                    this.$swal(
                      "Thành công",
                      "Phiếu giảm giá được tạo mới thành công",
                      "success",
                    );
                    this.$router.push({ name: "promotion.list" });
                  })
                  .catch(error => {
                    let err = error.response.data.data.errors;
                    let err_array = Object.values(err)
                    let err_txt = '';
                    err_array.forEach(function(element) {
                      err_txt += element + '; ';
                    });
                    window.toastr["error"](err_txt, "Error");
                });
                }
              })
            }
          }
          catch (error) {
            if (error) {
              this.$swal(
                "Xin lỗi",
                "Discount chưa đưọc lưu, làm ơn kiểm tra lại thông tin",
                "error"
              );
            }
          }
        }
      },
    },
    created() {
      !(this.dataCoupon === null) && this.setInitData();
      this.disabledDay.to = new Date(this.getPromotionDay.startDay.substring(0,10));
      this.disabledDay.from = new Date(this.getPromotionDay.endDay.substring(0,10));
    },
    mounted() {
      Auth.getProfile().then(res => {
        if (res) {
          Auth.canAccess(res, this.permissions).then(response => {
            if (!response) {
              this.$router.push("permission-denied-403");
            } else {
              this.getRooms();
            }
          });
        }
      });
    }
  };
</script>

<style>
.wrapper-room {
  border: 1px solid #dddddd;
  padding-top: 1rem;
  border-radius: 5px;
  margin-right: 0px;
  margin-left: 388px;
  height: auto;
}
.container-form {
  display: block;
}
.list-form {
  display: inline-block;
  margin-right: 1em;
}
.custom-checkbox-all {
  padding-top: 8px;
  padding-left: 40px;
}
.btn-center {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
