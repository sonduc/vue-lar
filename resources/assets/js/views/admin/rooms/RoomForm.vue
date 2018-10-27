<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Room</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item"><a href="#">Room</a></li>
        <li class="breadcrumb-item active">{{type}}</li>
      </ol>
      <div class="page-actions">
        <a @click="$router.push({name: 'room.list'})" style="color:white" class="btn btn-primary">
          <i class="icon-fa icon-fa-backward" /> Back
        </a>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <form-wizard  :title="titleHeader" :subtitle="subTitleHeader" >
          <!-- 1. Đây là bắt đầu của form-wizad Tổng quan
               2. Bao gồm thông tin nổi bật và thông tin thêm -->
            <tab-content title="Tổng quan" :before-change="validateBeforeNext" >
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
                            v-validate="step==0 ? 'required':''"
                            data-vv-as="Loại phòng"
                            class= "form-control ls-select2 custom-select">
                              <option
                              v-for= "(item, index) in room_type"
                              :value="item.id" :key= "index">{{item.value}}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label :style="errors.has('room.number_bed') ? 'color:red;' : ''">{{errors.has('room.number_bed')
                              ? errors.first('room.number_bed') : 'Số giường *'}}</label>
                            <input
                            type="text"
                            name="room.number_bed"
                            v-validate="step==0 ? 'required|numeric|min_value:1':''"
                            data-vv-as="Số phòng ngủ"
                            v-model.number="room.number_bed"
                            class="form-control">
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-6">
                           <div class="form-group">
                            <label :style="errors.has('room.max_guest') ? 'color:red;' : ''">{{errors.has('room.max_guest')
                                ? errors.first('room.max_guest') : 'Số khách tối đa *'}}
                            </label>
                            <input
                            type="text"
                            name="room.max_guest"
                            v-validate="step==0 ? 'required|numeric|min_value:1':''"
                            data-vv-as="Số khách tối đa"
                            v-model.number="room.max_guest"
                            class="form-control">
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label :style="errors.has('room.number_room') ? 'color:red;' : ''">{{errors.has('room.number_room')
                                ? errors.first('room.number_room') : 'Số phòng ngủ *'}}
                            </label>
                            <input
                            type="text"
                            name="room.number_room"
                            v-validate="step==0 ? 'required|numeric|min_value:1':''"
                            data-vv-as="Số phòng ngủ"
                            v-model.number="room.number_room"
                            class="form-control">
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label :style="errors.has('room.merchant') ? 'color:red;' : ''">{{errors.has('room.merchant')
                              ? errors.first('room.merchant') : 'Quản lý phòng *'}}
                            </label>
                            <multiselect
                            :allow-empty="false" name="room.merchant"
                            v-model="merchant_id" v-validate="step==0 ? 'required':''"
                            data-vv-as="Quản lý phòng" label="name"
                            :options="merchants" :searchable="true"
                            :show-labels="false" track-by="name">
                            </multiselect>
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="form-group">
                            <div class="form-check-label">
                              <label>Trạng thái phòng</label>
                            </div>
                            <div class="form-group">
                              <div class="form-check form-check-inline" style="margin-top: 5px;">
                                <label
                                  v-if="room.status == 1"
                                  class="container"
                                  style="color:#6c757d">
                                  Đang hoạt động
                                <input
                                  type="checkbox"
                                  :id="room.status"
                                  :true-value="1"
                                  :false-value="0"
                                  v-model.number="room.status">
                                <span class="checkmark"></span>
                                </label>
                                <label
                                  v-else
                                  class="container"
                                  style="color:#6c757d">
                                  Phòng đã khóa
                                <input
                                  type="checkbox"
                                  :id="room.status"
                                  :true-value="1"
                                  :false-value="0"
                                  v-model.number="room.status">
                                <span class="checkmark"></span>
                                </label>
                              </div>

                            </div>
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
                              <button type="button" v-else @click="deleteLangEnglishForm" style="color:white; float:right;" class="btn btn-danger">
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
                                  v-validate="step==0 ? { required:true, min:10, max:255,
                                  regex:/^([a-zA-Z0-9ạảắặằẳẵấậầẩẫẹẻẽếệềểễịỉĩọỏõốộồổỗơớợờởỡụủũưứựừửữỵỳỷỹđ\uooCO-\u017F\s]+)$/ }:''"
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
                                  v-validate="step==0 ? 'required|min:10':''"
                                  data-vv-as="Địa chỉ phòng"
                                  class="form-control">
                                </div>
                                <div class="row">
                                  <div class="col-lg-6">
                                    <div class="form-group">
                                      <label>Tỉnh thành</label>
                                      <multiselect id="inputUserName" v-model="city"
                                      label="name" :options="cities" :searchable="true" :show-labels="false" />
                                    </div>
                                  </div>
                                  <div class="col-lg-6">
                                    <div class="form-group">
                                      <label>Quận/Huyện</label>
                                      <multiselect :disabled="city.id == ''" id="inputUserName" v-model="district" label="name" :options="filteredDistrict" :searchable="true" :show-labels="false" />
                                    </div>
                                  </div>
                                </div>
                                <div class="form-group">
                                  <label>Giới thiệu phòng</label>
                                  <quill-editor
                                  v-model="room.details.data[index].description"
                                  style="height:250px"></quill-editor>
                                </div>
                                <br/><br/>
                                <div class="form-group">
                                  <label>Không gian phòng</label>
                                  <quill-editor
                                  v-model="room.details.data[index].space"
                                  style="height:250px"></quill-editor>
                                </div>
                                <br/><br/>
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

            <tab-content title="Thông tin giá" :before-change="validateBeforeNext">
              <section>
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
                          <multiselect :allow-empty="false" name="room.checkin" v-model="room.checkin" v-validate="step==1 ? 'required':''"
                          data-vv-as="Giờ checkin" :options="hoursData" :searchable="true" :show-labels="false" />
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group">
                          <label :style="errors.has('room.checkout') ? 'color:red;' : ''">{{errors.has('room.checkout')
                            ? errors.first('room.checkout') : 'Giờ checkout *'}}</label>
                          <multiselect :allow-empty="false" name="room.checkout" v-model="room.checkout" v-validate="step==1 ? 'required':''"
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
                          type="text"
                          name="room.max_additional_guest"
                          v-validate="step==1 ? 'required|numeric|min:1':''"
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
                          type="text"
                          name="room.price_charge_guest"
                          v-validate="step==1 ? 'required|numeric':''"
                          data-vv-as="Giá tiền tăng cho mỗi khách"
                          v-model.number="room.price_charge_guest"
                          class="form-control">
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class = "col-lg-6">
                        <div class="form-group">
                          <label :style="errors.has('room.rent_type') ? 'color:red;' : ''">
                            {{errors.has('room.rent_type')
                            ? errors.first('room.rent_type') : 'Thuê theo *'}}
                          </label>
                          <select
                          v-model= "room.rent_type"
                          name="room.rent_type"
                          v-validate="step==1 ? 'required':''"
                          data-vv-as="Thuê theo"
                          class= "form-control ls-select2 custom-select">
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
                          type="text"
                          name="room.price_hour"
                          v-validate="step==1 ? 'required|numeric':''"
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
                          type="text"
                          name="room.price_day"
                          v-validate="step==1 ? 'required|numeric':''"
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
                    <h5 class="section-semi-title">Giá ngày đặc biệt</h5>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-lg-12">
                        <div class="form-group">
                          <label>Chọn ngày lễ</label>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-11">
                        <div class="form-group">
                          <v-date-picker
                          mode='multiple'
                          v-model='specialDays'
                          show-caps
                          :input-props='{ class: "form-control", placeholder: "Please choose days", readonly: true }'>
                          </v-date-picker>
                        </div>
                      </div>
                       <div class="col-lg-1">
                        <div class="form-group">
                          <button v-tooltip="{content: ' Bạn muốn xóa tất cả ngày ? ',classes: ['danger'],targetClasses: ['it-has-a-tooltip']}"
                          @click.prevent="specialDays = null" class="form-control btn btn-outline-danger"><i class="icon-fa icon-fa-close"></i>Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="row" v-if="checkSpecialDays">
                      <div :class = "room.rent_type == 2 ? 'col-lg-12':'col-lg-4'"
                        v-if="room.rent_type == 2 || room.rent_type == 3">
                        <div class="form-group">
                          <label :style="errors.has('room.optional_prices.price_day') ?
                          'color:red;' : ''">
                          {{errors.has('room.optional_prices.price_day')
                          ? errors.first('room.optional_prices.price_day') : 'Giá phòng theo ngày *'}}
                          </label>
                          <input
                          type="text"
                          name="room.optional_prices.price_day"
                          v-validate="step==1 ? 'required|numeric':''"
                          data-vv-as="Giá phòng theo ngày"
                          v-model.number="room.optional_prices.price_day"
                          class="form-control">
                        </div>
                      </div>
                      <div :class = "room.rent_type == 1 ? 'col-lg-6':'col-lg-4'"
                        v-if="room.rent_type == 1 || room.rent_type == 3">
                        <div class="form-group">
                          <label :style="errors.has('room.optional_prices.price_hour') ?
                          'color:red;' : ''">
                          {{errors.has('room.optional_prices.price_hour')
                          ? errors.first('room.optional_prices.price_hour') : 'Giá phòng theo giờ *'}}
                          </label>
                          <input
                          type="text"
                          name="room.optional_prices.price_hour"
                          v-validate="step==1 ? 'required|numeric':''"
                          data-vv-as="Giá phòng theo giờ"
                          v-model.number="room.optional_prices.price_hour"
                          class="form-control">
                        </div>
                      </div>
                      <div :class = "room.rent_type == 1 ? 'col-lg-6':'col-lg-4'"
                        v-if="room.rent_type == 1 || room.rent_type == 3">
                        <div class="form-group">
                          <label :style="errors.has('room.optional_prices.price_after_hour') ?
                          'color:red;' : ''">
                          {{errors.has('room.optional_prices.price_after_hour')
                          ? errors.first('room.optional_prices.price_after_hour') : 'Giá phòng khi ở thêm giờ *'}}
                          </label>
                          <input
                          type="text"
                          name="room.optional_prices.price_after_hour"
                          v-validate="step==1 ? 'required|numeric':''"
                          data-vv-as="Giá phòng khi ở thêm giờ"
                          v-model.number="room.optional_prices.price_after_hour"
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
                        <button @click="addWeekday" style="color:white; float:right;"
                        class="btn btn-success btn-sm">
                        <i class="icon-fa icon-fa-plus"></i> Thêm ngày
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="row" v-for="(r,index) in room.weekday_price" :key="index">
                      <div class="col-lg-2">
                        <div class="form-group">
                          <label :style="errors.has(`weekdays[${index}]weekday`) ? 'color:red;' : ''">{{errors.has(`weekdays[${index}]weekday`)
                            ? errors.first(`weekdays[${index}]weekday`) : 'Ngày *'}}
                          </label>
                          <select-week-day
                          :id = "index" :weekday_price = "room.weekday_price"
                          v-model="room.weekday_price[index].weekday"
                          v-validate="step==1 ? 'required':''" data-vv-as="Ngày"
                          :name="`weekdays[${index}]weekday`" label="title"
                          :options="weekdays" track-by="title">
                          </select-week-day>
                        </div>
                      </div>
                      <div class="col-lg-3">
                        <div class="form-group">
                          <label :style="errors.has(`weekdays[${index}]price_day`) ? 'color:red;' : ''">{{errors.has(`weekdays[${index}]price_day`)
                            ? errors.first(`weekdays[${index}]price_day`) : 'Giá theo ngày *'}}
                          </label>
                          <input
                          type="text"
                          :name="`weekdays[${index}]price_day`"
                          v-validate="step==1 ? 'required|numeric':''"
                          data-vv-as="Giá theo ngày"
                          v-model.number="room.weekday_price[index].price_day"
                          class="form-control">
                        </div>
                      </div>
                      <div class="col-lg-3">
                        <div class="form-group">
                         <label :style="errors.has(`weekdays[${index}]price_hour`) ? 'color:red;' : ''">{{errors.has(`weekdays[${index}]price_hour`)
                            ? errors.first(`weekdays[${index}]price_hour`) : 'Giá theo giờ *'}}
                          </label>
                          <input
                          type="text"
                          :name="`weekdays[${index}]price_hour`"
                          v-validate="step==1 ? 'required|numeric':''"
                          data-vv-as="Giá theo giờ"
                          v-model.number="room.weekday_price[index].price_hour"
                          class="form-control">
                        </div>
                      </div>
                      <div class="col-lg-3">
                        <div class="form-group">
                         <label :style="errors.has(`weekdays[${index}]price_after_hour`) ? 'color:red;' : ''">{{errors.has(`weekdays[${index}]price_after_hour`)
                            ? errors.first(`weekdays[${index}]price_after_hour`) : 'Giá khi ở thêm giờ *'}}
                          </label>
                          <input
                          type="text"
                          :name="`weekdays[${index}]price_after_hour`"
                          v-validate="step==1 ? 'required|numeric':''"
                          data-vv-as="Giá khi ở thêm giờ"
                          v-model.number="room.weekday_price[index].price_after_hour"
                          class="form-control">
                        </div>
                      </div>

                      <div class="col-lg-1">
                        <div class="form-group">
                          <label>&ensp;</label>
                          <button v-tooltip="{content: 'Bạn muốn xóa ngày này ?',classes: ['danger'],targetClasses: ['it-has-a-tooltip']}"
                          @click.prevent="deleteWeekday(index)" class="form-control btn btn-outline-danger"><i class="icon-fa icon-fa-close"></i>Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </tab-content>
            <tab-content title="Tiện ích phòng ">
              <div class="card">
                <div class="card-header">
                  <h5 class="section-semi-title">Tiện ích phòng</h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class = "col-lg-3" v-for="com in comforts" :key="com.id">
                      <div class="form-group custom-control custom-checkbox mb-3">
                        <input type="checkbox" v-model = "room.comforts"
                        :id="com.id" :value="com.id"
                        class="custom-control-input">
                        <label :for="com.id" class="custom-control-label">
                        {{com.details.data[0].name}}</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </tab-content>
            <tab-content title="Upload ảnh">
              <div class="card">
                <div class="card-header">
                  <h5 class="section-semi-title">Upload ảnh đại diện cho phòng</h5>
                </div>
                <div class="card-body">
                  <div class="row mt-4">
                    <div class="col-sm-12">
                    <!-- Vì data trong DB trùng nhau nên chưa để :duplicateCheck="true" được -->
                      <vue-dropzone
                        id="dropzone1"
                        ref="myVueDropzone1"
                        :options="imageAvatar"
                        @vdropzone-mounted="vmountedAvatar"
                        @vdropzone-complete="afterCompleteImageAvatar"
                        @vdropzone-canceled
                        @vdropzone-removed-file="removedImageInDropzone"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header">
                  <h5 class="section-semi-title">Upload ảnh cho bài viết</h5>
                </div>
                <div class="card-body">
                  <div class="row mt-4">
                    <div class="col-sm-12">
                      <vue-dropzone
                        id="dropzone2"
                        ref="myVueDropzone2"
                        :options="imagePost"
                        @vdropzone-canceled
                        @vdropzone-removed-file="removedImageInDropzone"
                        @vdropzone-mounted="vmountedPost"
                        @vdropzone-complete="afterCompleteImagePost"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </tab-content>
            <template slot="footer" slot-scope="props">
              <div class="wizard-footer-left">
                <wizard-button  v-if="props.activeTabIndex > 0" @click.native="previousTabForm(props.prevTab())" :style="props.fillButtonStyle">Previous</wizard-button>
              </div>
              <div class="wizard-footer-right">
                <wizard-button v-if="!props.isLastStep" @click.native="props.nextTab()" class="wizard-footer-right" :style="props.fillButtonStyle">Next</wizard-button>
                <wizard-button v-else @click.native="onSubmit()" class="wizard-footer-right finish-button" :style="props.fillButtonStyle">{{props.isLastStep ? `${type}` : 'Next'}}</wizard-button>
              </div>
            </template>
          </form-wizard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Auth from "../../../services/auth";
import { FormWizard, TabContent, WizardButton } from "vue-form-wizard";
import vue2Dropzone from 'vue2-dropzone'
import { hoursList, format, location } from "../../../helpers/mixins";
import { Tabs, Tab } from "vue-tabs-component";
import { quillEditor } from "vue-quill-editor";
import Multiselect from "vue-multiselect";
import SelectWeekDay from './SelectWeekDay'
import Datepicker from "vuejs-datepicker";
import { map } from 'lodash'
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
export default {
  name: 'RoomForm',
  mixins: [hoursList, format, location],
  components: {
    FormWizard,
    TabContent,
    WizardButton,
    Tabs,
    Tab,
    Multiselect,
    quillEditor,
    Datepicker,
    SelectWeekDay,
    vueDropzone: vue2Dropzone
  },
  props: {
    type: {
      type: String,
      default: 'Create'
    },
    dataRoom: {
      default: () => {
        return null
      },
    },
    titleHeader:{
      type: String,
      default: ''
    },
  },
  computed: {
    merchant_id: {
      get: function () {
        if(this.room.user.data.name == null){
          return null
        }
        else {
          return {
            name: this.room.user.data.name
          }
        }
      },
      set: function (val) {
        this.room.user.data = val;
        this.room.merchant_id = val.id;
      }
    },
    city: {
      get: function () {
        if(this.room.city.data == null){
          return null
        }
        else {
          return {
            id: this.room.city.data.id,
            name: this.room.city.data.name
          }
        }
      },
      set: function (val) {
        this.room.city.data = val;
        this.room.city_id = val.id;
      }
    },
    district: {
      get: function () {
        if(this.room.district.data == null){
          return null
        }
        else {
          return {
            id: this.room.district.data.id,
            name: this.room.district.data.name
          }
        }
      },
      set: function (val) {
        this.room.district.data = val;
        this.room.district_id = val.id;
      }
    },

    checkCountLang() {
      if (this.room.details.data.length) {
        let length = this.room.details.data.length
        return !!(length == 1)
      }
    },
    checkSpecialDays(){
      if (this.room.optional_prices.days.length) {
        let length = this.room.optional_prices.days.length
        return !!(length > 0)
      }
    },
    filteredDistrict() {
      let self = this;
      return this.districts.filter(function(item) {
        return item.city_id == self.city.id;
      });
    },
  },
  watch: {
    specialDays: {
      handler(val) {
        this.room.optional_prices.days = [];
        if(val !== null) {
          val.forEach(element => {
            let beforeAddDay = new Date(element);
            let timeDay = 60 * 60 * 24 * 1000;
            let afterAddDay = new Date(beforeAddDay.getTime() + timeDay);
            let day = afterAddDay.toISOString().substring(0, 10);
            this.room.optional_prices.days.push(day);
          });
        }
      }
    },
  },
  data() {
    return {
      step:0,
      subTitleHeader: "Vui lòng hoàn thành chính xác các thông tin trước khi lưu",
      specialDays:[],
      comforts: [],
      latest_deal:0,
      imageAvatar: {
        url: 'https://httpbin.org/post',
        maxFilesize: 3,
        maxFiles:1,
        addRemoveLinks: true,
        thumbnailWidth: 150,
        thumbnailHeight: 150,
        dictCancelUpload: 'Cancel File',
        dictDefaultMessage: "<i class='icon-fa icon-fa-cloud-upload'/></i> Uploads Your File's Here",
        headers: { 'My-Awesome-Header': 'header value' },

      },
      imagePost: {
        url: 'https://httpbin.org/post',
        maxFilesize: 3,
        maxFiles:50,
        addRemoveLinks: true,
        thumbnailWidth: 150,
        thumbnailHeight: 150,
        dictCancelUpload: 'Cancel File',
        dictDefaultMessage: "<i class='icon-fa icon-fa-cloud-upload'/></i> Uploads Your File's Here",
        headers: { 'My-Awesome-Header': 'header value' }
      },
      count: 1,
      room: {
        comforts: [],
        city: {
          data: {}
        },
        district: {
          data: {}
        },
        images:[],
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
        user:{
          data:{
            name:null
          }
        },
        room_time_blocks: [],
        weekday_price: [],
        optional_prices:
          {
            days: [],
            price_day:null,
            price_hour: null,
            price_after_hour: null,
            status: 1
          },
        max_additional_guest: null,
        price_charge_guest: null,

        rent_type: null,
        price_day: 0,
        price_hour: 0,
        price_after_hour: 0,

        checkin: null,
        checkout: null,
        room_type: 1,
        number_bed: null,
        number_room: null,
        max_guest: null,
        status:0,
        city_id:null,
        district_id:null,
      },
      room_type: null,
      rent_type: null,
      merchants:[],
      weekdays: [
        {
          title: 'Thứ 2',
          weekday: 2,
          price_day: 0,
          price_hour: 0,
          price_after_hour: 0,
          status:0
        },
        {
          title: 'Thứ 3',
          weekday: 3,
          price_day: 0,
          price_hour: 0,
          price_after_hour: 0,
          status:0
        },
        {
          title: 'Thứ 4',
          weekday: 4,
          price_day: 0,
          price_hour: 0,
          price_after_hour: 0,
          status:0
        },
        {
          title: 'Thứ 5',
          weekday: 5,
          price_day: 0,
          price_hour: 0,
          price_after_hour: 0,
          status:0
        },
        {
          title: 'Thứ 6',
          weekday: 6,
          price_day: 0,
          price_hour: 0,
          price_after_hour: 0,
          status:0
        },
        {
          title: 'Thứ 7',
          weekday: 7,
          price_day: 0,
          price_hour: 0,
          price_after_hour: 0,
          status:0
        },
        {
          title: 'Chủ nhật',
          weekday: 1,
          price_day: 0,
          price_hour: 0,
          price_after_hour: 0,
          status:0
        }
      ],
    };
  },
  methods: {
    setInitData() {
      let dataRoom = { ...this.dataRoom }
      if (dataRoom.prices.data.length) {
          dataRoom.prices.data.forEach(item => {
          if(item.day === "Không xác định") {
            let w_day = {
              weekday: null,
              price_day: null,
              price_hour: null,
              price_after_hour: null,
              status:0
            }
            w_day.weekday = item.weekday
            w_day.price_day = item.price_day
            w_day.price_hour = item.price_hour
            w_day.price_after_hour = item.price_after_hour
            this.room.weekday_price.push(w_day)
          }
          else {
          let date = new Date(item.day)
          date.setTime(date.getTime() - (7 * 60 * 60 * 1000))
          this.specialDays.push(date)
          this.room.optional_prices.days.push(item.day)
          this.room.optional_prices.price_day === null && (this.room.optional_prices.price_day = item.price_day)
          this.room.optional_prices.price_hour === null && (this.room.optional_prices.price_hour = item.price_hour)
          this.room.optional_prices.price_after_hour === null && (this.room.optional_prices.price_after_hour = item.price_after_hour)
          }
        });
      }
      this.room = JSON.parse(JSON.stringify({ ...this.room, ...dataRoom }))
      if(dataRoom.media.data.length){
        dataRoom.media.data.forEach(item => {
          this.room.images.push({source: item.image, type: item.type});
        });
      }
      if(this.room.comforts.data.length) {
        this.room.comforts = map(this.room.comforts.data,item => { return item.id })
      }
    },
    vmountedPost(){
      this.room.images.forEach(item => {
        if(item.type == 1) {
          let file = { name: item.source, size:12356, type: "image" };
          let url = item.source;
          this.$refs.myVueDropzone2.manuallyAddFile(file, url);
        }
      });
    },
    vmountedAvatar(){
      this.room.images.forEach(item => {
        if(item.type == 4) {
          let file = { name: item.source, size:12356, type: "image" };
          let url = item.source;
          this.$refs.myVueDropzone1.manuallyAddFile(file, url);
        }
      });
    },
    addWeekday () {
      if(this.room.weekday_price.length < 7 ) {
        this.room.weekday_price.push({
          weekday: this.room.weekday_price.length + 1,
          status: 0,
          price_day: 0,
          price_hour: 0,
          price_after_hour: 0,
        });
      }
    },
    deleteWeekday (index) {
      this.room.weekday_price.splice(index, 1)
    },
    formatDate (date) {
      if (!date) return null
      const [h,m,s] = date.split(':')
      return `${h}:${m}`
    },
    previousTabForm(event) {
      this.step--;
      return event;
    },
    afterCompleteImageAvatar(file){
      let picture = {
        source: null,
        type: 4
      }
      if(file.dataURL){
        picture.source = file.dataURL
        this.room.images.push(picture);
      }
    },
    afterCompleteImagePost(file){
      let picture = {
        source: null,
        type: 1
      }
      if(file.dataURL){
        picture.source = file.dataURL;
        this.room.images.push(picture);
      }
    },
    removedImageInDropzone(file, error, xhr){
      let index = this.room.images.findIndex(item => item.dataURL === file.dataURL)
      this.room.images.splice(index,1)
    },
    async getBase64ImageFromUrl(imageUrl) {
      let res = await fetch(imageUrl);
      let blob = await res.blob();

      return new Promise((resolve, reject) => {
        let reader  = new FileReader();
        reader.addEventListener("load", function () {
            resolve(reader.result);
        }, false);

        reader.onerror = () => {
          return reject(this);
        };
        reader.readAsDataURL(blob);
      })
    },
    async validateBeforeNext(){
      const result = await this.$validator.validateAll();
      if(!result){
        return window.scroll({
          top: 0,
          behavior: "smooth"
        });
      }
      else {
        this.step++;
        return true;
      }
    },
    async onSubmit() {
      const result = await this.$validator.validateAll();
      if(result){
        try {
          if(this.type == 'Update'){
            this.$swal({
                title: 'Đang xử lý',
                text: '',
                type: 'info',
                showCancelButton: false,
                showConfirmButton: false,
                showCloseButton: false,
                showLoaderOnConfirm: false
              });
            let response = await axios.put(`rooms/${this.$route.params.roomId}`,this.room)
            .then(response => {
              this.$swal("Thành công", "Phòng được cập nhật thành công", "success");

            });
          }
          else {
            this.$swal({
                title: 'Đang xử lý',
                text: '',
                type: 'info',
                showCancelButton: false,
                showConfirmButton: false,
                showCloseButton: false,
                showLoaderOnConfirm: false
              });
            let response = await axios.post('rooms',this.room)
            .then(response => {
              console.log(response)
              this.$swal("Thành công", "Phòng được tạo mới thành công", "success");
            });
          }
        } catch(error) {
          if (error) {
           this.$swal("Xin lỗi", "Phòng chưa đưọc lưu, làm ơn kiểm tra lại thông tin", "error");
          } {}
        }
      }
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
            limit:-1,
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
    async getComforts() {
      try {
        const response = await axios.get(`comforts`, {
          params: {
            limit:-1,
            include:"details"
          }
        });
        this.comforts = response.data.data;
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
    !(this.dataRoom === null) && this.setInitData()
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
            this.getComforts();
          }
        });
      }
    });
    this.hideSidebarOnMobile();
    if(this.room.checkin) {
      this.room.checkin = this.formatDate(this.room.checkin);
    }
    if(this.room.checkout) {
      this.room.checkout = this.formatDate(this.room.checkout);
    }
  }
};
</script>

<style>
.container {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

/* Create a custom checkbox */
.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
    background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
    background-color: #2196F3;
}
.checkmark {
  border-radius: 5px;
  font-size: 15px;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
    content: "";
    position: absolute;
    display: none;
    border: 5px solid gray;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
    display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
}
</style>






