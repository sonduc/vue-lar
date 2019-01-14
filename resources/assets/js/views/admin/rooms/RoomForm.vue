<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Room</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#">Home</a>
        </li>
        <li class="breadcrumb-item">
          <a href="#">Room</a>
        </li>
        <li class="breadcrumb-item active">{{type}}</li>
      </ol>
      <div class="page-actions">
        <a @click="$router.push({name: 'room.list'})" style="color:white" class="btn btn-primary">
          <i class="icon-fa icon-fa-backward"/> Back
        </a>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <form-wizard :title="titleHeader" :subtitle="subTitleHeader">
            <!-- 1. Đây là bắt đầu của form-wizad Tổng quan
            2. Bao gồm thông tin nổi bật và thông tin thêm-->
            <tab-content title="Tổng quan" :before-change="validateBeforeNext">
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
                            <label :style="errors.has('room.room_type') ? 'color:red;' : ''">
                              {{errors.has('room.room_type')
                              ? errors.first('room.room_type') : 'Loại phòng *'}}
                            </label>
                            <multiselect
                              style="z-index:4"
                              :allow-empty="false"
                              name="room.room_type"
                              v-validate="step==0 ? 'required':''"
                              data-vv-as="Loại phòng"
                              v-model="roomType"
                              label="value"
                              :options="room_type"
                              :searchable="true"
                              :show-labels="false"
                              track-by="value"
                            ></multiselect>
                          </div>
                        </div>

                        <div class="col-lg-6">
                          <div class="form-group">
                            <label :style="errors.has('room.number_bed') ? 'color:red;' : ''">
                              {{errors.has('room.number_bed')
                              ? errors.first('room.number_bed') : 'Số giường *'}}
                            </label>
                            <input
                              type="text"
                              name="room.number_bed"
                              v-validate="step==0 ? 'required|numeric|min_value:1|max_value:100':''"
                              data-vv-as="Số giường"
                              v-model.number="room.number_bed"
                              class="form-control"
                            >
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label :style="errors.has('room.max_guest') ? 'color:red;' : ''">
                              {{errors.has('room.max_guest')
                              ? errors.first('room.max_guest') : 'Số khách tối đa *'}}
                            </label>
                            <input
                              type="text"
                              name="room.max_guest"
                              v-validate="step==0 ? 'required|numeric|min_value:1|max_value:100':''"
                              data-vv-as="Số khách tối đa"
                              v-model.number="room.max_guest"
                              class="form-control"
                            >
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label :style="errors.has('room.number_room') ? 'color:red;' : ''">
                              {{errors.has('room.number_room')
                              ? errors.first('room.number_room') : 'Số phòng ngủ *'}}
                            </label>
                            <input
                              type="text"
                              name="room.number_room"
                              v-validate="step==0 ?
                                'required|numeric|min_value:1|max_value:100':''"
                              data-vv-as="Số phòng ngủ"
                              v-model.number="room.number_room"
                              class="form-control"
                            >
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label :style="errors.has('room.merchant') ? 'color:red;' : ''">
                              {{errors.has('room.merchant')
                              ? errors.first('room.merchant') : 'Quản lý phòng *'}}
                            </label>
                            <multiselect
                              style="z-index: 3"
                              :allow-empty="false"
                              name="room.merchant"
                              v-model="merchant_id"
                              v-validate="step==0 ? 'required':''"
                              data-vv-as="Quản lý phòng"
                              label="name"
                              :options="merchants"
                              :searchable="true"
                              :show-labels="false"
                              track-by="name"
                            ></multiselect>
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label>Trạng thái phòng</label>
                            <multiselect
                              :allow-empty="false"
                              name="room.status"
                              v-model="statusRoom"
                              label="value"
                              :options="status"
                              :searchable="true"
                              :show-labels="false"
                              track-by="value"
                            ></multiselect>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Card 1 - Kết thúc: Thông tin nổi bật -->
                <!-- Card 2 - Bắt đầu: Thông tin thêm -->
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <div class="row">
                        <div class="col-xl-12 mb-4">
                          <div class="row">
                            <div class="col-lg-6">
                              <h5 class="section-semi-title">Thông tin thêm</h5>
                            </div>
                            <div class="col-lg-6">
                              <button
                                type="button"
                                v-if="checkCountLang"
                                @click="addNewLangEnglishForm"
                                style="color:white; float:right;"
                                class="btn btn-success"
                              >
                                <i class="icon-fa icon-fa-plus"/> Thêm tiếng anh
                              </button>
                              <button
                                :disabled="currentTab === 'English'"
                                type="button"
                                v-else
                                @click="deleteLangEnglishForm"
                                style="color:white; float:right;"
                                class="btn btn-danger"
                              >
                                <i class="icon-fa icon-fa-trash-o"/> Xóa tiếng anh
                              </button>
                            </div>
                          </div>
                          <tabs
                            :options="{ useUrlFragment: false }"
                            class="tabs-default"
                            @changed="tabChanged">
                            <tab
                              :id="detail.id"
                              :name="detail.lang === 'vi' ? 'Việt Nam':'English'"
                              v-for="(detail, index) in room.details.data"
                              :key="index"
                            >
                              <div class="col-lg-12">
                                <div class="form-group">
                                  <label
                                    :style="errors.has('detail.name' + index) ? 'color:red;' : ''"
                                  >
                                    {{errors.has('detail.name' + index)
                                    ? errors.first('detail.name' + index) : 'Tên phòng *'}}
                                  </label>
                                  <input
                                    type="text"
                                    v-model="room.details.data[index].name"
                                    :name="'detail.name' + index"
                                    v-validate="step==0 ? { required:true, min:10, max:255,
                                    regex:/^([a-zA-Z0-9ạảắặằẳẵấậầẩẫẹẻẽếệềểễịỉĩọỏõốộồổỗơớợờởỡụủũưứựừửữỵỳỷỹđ\uooCO-\u017F\s]+)$/ }:''"
                                    data-vv-as="Tên phòng"
                                    class="form-control"
                                  >
                                </div>

                                <div class="form-group">
                                  <label>Giới thiệu phòng</label>
                                  <quill-editor
                                    v-model="room.details.data[index].description"
                                    style="height:250px"
                                  ></quill-editor>
                                </div>
                                <br>
                                <br>
                                <div class="form-group">
                                  <label>Không gian phòng</label>
                                  <quill-editor
                                    v-model="room.details.data[index].space"
                                    style="height:250px"
                                  ></quill-editor>
                                </div>
                                <br>
                                <br>
                                <div class="form-group">
                                  <label>Những chú ý khi sử dụng phòng</label>
                                  <quill-editor
                                    v-model="room.details.data[index].note"
                                    style="height:250px"
                                  ></quill-editor>
                                </div>
                              </div>
                              <br>
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
                          <label :style="errors.has('room.checkin') ? 'color:red;' : ''">
                            {{errors.has('room.checkin')
                            ? errors.first('room.checkin') : 'Giờ checkin *'}}
                          </label>
                          <multiselect
                            :allow-empty="false"
                            name="room.checkin"
                            v-model="room.checkin"
                            v-validate="step==1 ? 'required':''"
                            data-vv-as="Giờ checkin"
                            :options="hoursData"
                            :searchable="true"
                            :show-labels="false"
                          />
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group">
                          <label :style="errors.has('room.checkout') ? 'color:red;' : ''">
                            {{errors.has('room.checkout')
                            ? errors.first('room.checkout') : 'Giờ checkout *'}}
                          </label>
                          <multiselect
                            :allow-empty="false"
                            name="room.checkout"
                            v-model="room.checkout"
                            v-validate="step==1 ? 'required':''"
                            data-vv-as="Giờ checkout"
                            :options="hoursData"
                            :searchable="true"
                            :show-labels="false"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group">
                          <label
                            :style="errors.has('room.max_additional_guest') ? 'color:red;' : ''"
                          >
                            {{errors.has('room.max_additional_guest')
                            ? errors.first('room.max_additional_guest') : 'Số khách thêm tối đa *'}}
                          </label>
                          <input
                            type="text"
                            name="room.max_additional_guest"
                            v-validate="step==1 ? 'required|numeric|min:1|max_value:100':''"
                            data-vv-as="Số khách thêm tối đa"
                            v-model.number="room.max_additional_guest"
                            class="form-control"
                          >
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group">
                          <label
                            :style="errors.has('room.price_charge_guest') ?
                          'color:red;' : ''"
                          >
                            {{errors.has('room.price_charge_guest')
                            ? errors.first('room.price_charge_guest') : 'Giá tiền tăng cho mỗi khách *'}}
                          </label>
                          <vue-numeric
                            separator="."
                            v-model="room.price_charge_guest"
                            v-validate="step==1 ? 'required|numeric':''"
                            data-vv-as="Giá tiền tăng cho mỗi khách"
                            class="form-control"
                            name="room.price_charge_guest"
                          >
                          </vue-numeric>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group">
                          <label :style="errors.has('room.rent_type') ? 'color:red;' : ''">
                            {{errors.has('room.rent_type')
                            ? errors.first('room.rent_type') : 'Thuê theo *'}}
                          </label>
                          <multiselect
                            :allow-empty="false"
                            name="room.rent_type"
                            v-validate="step==0 ? 'required':''"
                            data-vv-as="Thuê theo"
                            v-model="rentType"
                            label="value"
                            :options="rent_type"
                            :searchable="true"
                            :show-labels="false"
                            track-by="value"
                          ></multiselect>
                        </div>
                      </div>
                      <div
                        :class="room.rent_type == 1 ? 'col-lg-6':'col-lg-3'"
                        v-if="room.rent_type == 1 || room.rent_type == 3"
                      >
                        <div class="form-group">
                          <label :style="errors.has('room.price_hour') ? 'color:red;' : ''">
                            {{errors.has('room.price_hour')
                            ? errors.first('room.price_hour') : 'Giá theo giờ *'}}
                          </label>
                          <vue-numeric
                            separator="."
                            v-model="room.price_hour"
                            class="form-control"
                            data-vv-as="Giá theo giờ"
                            v-validate="step==1 ? 'required|numeric':''"
                            name="room.price_hour"
                          >
                          </vue-numeric>
                        </div>
                      </div>
                      <div
                        :class="room.rent_type == 2 ? 'col-lg-6':'col-lg-3'"
                        v-if="room.rent_type == 2 || room.rent_type == 3"
                      >
                        <div class="form-group">
                          <label :style="errors.has('room.price_day') ? 'color:red;' : ''">
                            {{errors.has('room.price_day')
                            ? errors.first('room.price_day') : 'Giá theo ngày *'}}
                          </label>
                          <vue-numeric
                            separator="."
                            v-model="room.price_day"
                            class="form-control"
                            data-vv-as="Giá theo ngày"
                            v-validate="step==1 ? 'required|numeric':''"
                            name="room.price_day"
                          >
                          </vue-numeric>
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
                            mode="multiple"
                            v-model="specialDays"
                            show-caps
                            :input-props="{ class: 'form-control', placeholder: 'Please choose days', readonly: true }"
                          ></v-date-picker>
                        </div>
                      </div>
                      <div class="col-lg-1">
                        <div class="form-group">
                          <button
                            v-tooltip="{content: ' Bạn muốn xóa tất cả ngày ? ',classes: ['danger'],targetClasses: ['it-has-a-tooltip']}"
                            @click.prevent="specialDays = null"
                            class="form-control btn btn-outline-danger"
                          >
                            <i class="icon-fa icon-fa-close"></i>Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="row" v-if="checkSpecialDays">
                      <div
                        :class="room.rent_type == 2 ? 'col-lg-12':'col-lg-4'"
                        v-if="room.rent_type == 2 || room.rent_type == 3"
                      >
                        <div class="form-group">
                          <label
                            :style="errors.has('room.optional_prices.price_day') ?
                          'color:red;' : ''"
                          >
                            {{errors.has('room.optional_prices.price_day')
                            ? errors.first('room.optional_prices.price_day') : 'Giá phòng theo ngày *'}}
                          </label>
                          <vue-numeric
                            separator="."
                            v-model="room.optional_prices.price_day"
                            class="form-control"
                            data-vv-as="Giá phòng theo ngày"
                            v-validate="step==1 ? 'required|numeric':''"
                            name="room.optional_prices.price_day"
                          >
                          </vue-numeric>
                        </div>
                      </div>
                      <div
                        :class="room.rent_type == 1 ? 'col-lg-6':'col-lg-4'"
                        v-if="room.rent_type == 1 || room.rent_type == 3"
                      >
                        <div class="form-group">
                          <label
                            :style="errors.has('room.optional_prices.price_hour') ?
                          'color:red;' : ''"
                          >
                            {{errors.has('room.optional_prices.price_hour')
                            ? errors.first('room.optional_prices.price_hour') : 'Giá phòng theo giờ *'}}
                          </label>
                          <vue-numeric
                            separator="."
                            v-model="room.optional_prices.price_hour"
                            class="form-control"
                            data-vv-as="Giá phòng theo giờ"
                            v-validate="step==1 ? 'required|numeric':''"
                            name="room.optional_prices.price_hour"
                          >
                          </vue-numeric>
                          <!-- <input
                            type="text"
                            name="room.optional_prices.price_hour"
                            v-validate="step==1 ? 'required|numeric':''"
                            data-vv-as="Giá phòng theo giờ"
                            v-model.number="room.optional_prices.price_hour"
                            class="form-control"
                          > -->
                        </div>
                      </div>
                      <div
                        :class="room.rent_type == 1 ? 'col-lg-6':'col-lg-4'"
                        v-if="room.rent_type == 1 || room.rent_type == 3"
                      >
                        <div class="form-group">
                          <label
                            :style="errors.has('room.optional_prices.price_after_hour') ?
                          'color:red;' : ''"
                          >
                            {{errors.has('room.optional_prices.price_after_hour')
                            ? errors.first('room.optional_prices.price_after_hour') : 'Giá phòng khi ở thêm giờ *'}}
                          </label>
                          <vue-numeric
                            separator="."
                            v-model="room.optional_prices.price_after_hour"
                            class="form-control"
                            data-vv-as="Giá phòng khi ở thêm giờ"
                            v-validate="step==1 ? 'required|numeric':''"
                            name="room.optional_prices.price_after_hour"
                          >
                          </vue-numeric>
                          <!-- <input
                            type="text"
                            name="room.optional_prices.price_after_hour"
                            v-validate="step==1 ? 'required|numeric':''"
                            data-vv-as="Giá phòng khi ở thêm giờ"
                            v-model.number="room.optional_prices.price_after_hour"
                            class="form-control"
                          > -->
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
                        <button
                          @click="addWeekday"
                          style="color:white; float:right;"
                          class="btn btn-success btn-sm"
                        >
                          <i class="icon-fa icon-fa-plus"></i> Thêm ngày
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="card-body">
                    <div
                      class="row"
                      v-for="(r,index) in room.weekday_price"
                      :key="index"
                      :id="index"
                    >
                      <div class="col-lg-2">
                        <div class="form-group">
                          <label
                            :style="errors.has(`weekdays[${index}]weekday`) ? 'color:red;' : ''"
                          >
                            {{errors.has(`weekdays[${index}]weekday`)
                            ? errors.first(`weekdays[${index}]weekday`) : 'Ngày *'}}
                          </label>
                          <select-week-day
                            :id="index"
                            :weekday_price="room.weekday_price"
                            v-model="room.weekday_price[index].weekday"
                            v-validate="step==1 ? 'required':''"
                            data-vv-as="Ngày"
                            :name="`weekdays[${index}]weekday`"
                            label="title"
                            :options="filteredWeekday"
                            track-by="title"
                          ></select-week-day>
                        </div>
                      </div>
                      <div
                        :class="room.rent_type == 2 ? 'col-lg-9':'col-lg-3'"
                        v-if="room.rent_type == 2 || room.rent_type == 3"
                      >
                        <div class="form-group">
                          <label
                            :style="errors.has(`weekdays[${index}]price_day`) ? 'color:red;' : ''"
                          >
                            {{errors.has(`weekdays[${index}]price_day`)
                            ? errors.first(`weekdays[${index}]price_day`) : 'Giá theo ngày *'}}
                          </label>
                          <vue-numeric
                            separator="."
                            v-model="room.weekday_price[index].price_day"
                            class="form-control"
                            data-vv-as="Giá theo ngày"
                            v-validate="step==1 ? 'required|numeric':''"
                            :name="`weekdays[${index}]price_day`"
                          >
                          </vue-numeric>
                          <!-- <input
                            type="text"
                            :name="`weekdays[${index}]price_day`"
                            v-validate="step==1 ? 'required|numeric':''"
                            data-vv-as="Giá theo ngày"
                            v-model.number="room.weekday_price[index].price_day"
                            class="form-control"
                          > -->
                        </div>
                      </div>
                      <div
                        :class="room.rent_type == 1 ? 'col-lg-5':'col-lg-3'"
                        v-if="room.rent_type == 1 || room.rent_type == 3"
                      >
                        <div class="form-group">
                          <label
                            :style="errors.has(`weekdays[${index}]price_hour`) ? 'color:red;' : ''"
                          >
                            {{errors.has(`weekdays[${index}]price_hour`)
                            ? errors.first(`weekdays[${index}]price_hour`) : 'Giá theo giờ *'}}
                          </label>
                          <vue-numeric
                            separator="."
                            v-model="room.weekday_price[index].price_hour"
                            class="form-control"
                            data-vv-as="Giá theo giờ"
                            v-validate="step==1 ? 'required|numeric':''"
                            :name="`weekdays[${index}]price_hour`"
                          >
                          </vue-numeric>
                          <!-- <input
                            type="text"
                            :name="`weekdays[${index}]price_hour`"
                            v-validate="step==1 ? 'required|numeric':''"
                            data-vv-as="Giá theo giờ"
                            v-model.number="room.weekday_price[index].price_hour"
                            class="form-control"
                          > -->
                        </div>
                      </div>
                      <div
                        :class="room.rent_type == 1 ? 'col-lg-4':'col-lg-3'"
                        v-if="room.rent_type == 1 || room.rent_type == 3"
                      >
                        <div class="form-group">
                          <label
                            :style="errors.has(`weekdays[${index}]price_after_hour`) ? 'color:red;' : ''"
                          >
                            {{errors.has(`weekdays[${index}]price_after_hour`)
                            ? errors.first(`weekdays[${index}]price_after_hour`) : 'Giá khi ở thêm giờ *'}}
                          </label>
                          <vue-numeric
                            separator="."
                            v-model="room.weekday_price[index].price_after_hour"
                            class="form-control"
                            data-vv-as="Giá khi ở thêm giờ"
                            v-validate="step==1 ? 'required|numeric':''"
                            :name="`weekdays[${index}]price_after_hour`"
                          >
                          </vue-numeric>
                          <!-- <input
                            type="text"
                            :name="`weekdays[${index}]price_after_hour`"
                            v-validate="step==1 ? 'required|numeric':''"
                            data-vv-as="Giá khi ở thêm giờ"
                            v-model.number="room.weekday_price[index].price_after_hour"
                            class="form-control"
                          > -->
                        </div>
                      </div>

                      <div class="col-lg-1">
                        <div class="form-group">
                          <label>&ensp;</label>
                          <button
                            v-tooltip="{content: 'Bạn muốn xóa ngày này ?',classes: ['danger'],targetClasses: ['it-has-a-tooltip']}"
                            @click.prevent="deleteWeekday(index)"
                            class="form-control btn btn-outline-danger"
                          >
                            <i class="icon-fa icon-fa-close"></i>Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card">
                  <div class="card-header">
                    <div class="row">
                      <div class="col-lg-6">
                        <h5 class="section-semi-title">Chính sách hủy booking</h5>
                      </div>
                    </div>
                  </div>

                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-4 row">
                        <label for="cancel" class="col-sm-5 col-form-label">Cho phép hủy booking:</label>
                        <div class="col-sm-7 mt-2 ml-0">
                          <div class="form-check form-check-inline" style="margin-right: 50px;">
                            <input
                              id="inlineCheckbox1"
                              v-model="room.settings.no_booking_cancel"
                              class="form-check-input"
                              type="radio"
                              :value="1"
                            >
                            <label class="form-check-label" for="inlineCheckbox1">Không</label>
                          </div>
                          <div class="form-check form-check-inline">
                            <input
                              id="inlineCheckbox2"
                              v-model="room.settings.no_booking_cancel"
                              class="form-check-input"
                              type="radio"
                              :value="0"
                            >
                            <label class="form-check-label" for="inlineCheckbox2">Có</label>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-5">
                        <div class="form-group row" v-if="room.settings.no_booking_cancel == 0">
                          <label
                            class="col-sm-4 col-form-label"
                            for="firstName"
                            :style="errors.has('room.cancelDay') ? 'color:red;' : ''"
                          >
                            {{ errors.has('room.cancelDay')
                            ? errors.first('room.cancelDay') : 'Chỉ được hủy trước:'}}
                          </label>
                          <div class="col-sm-8 pr-0 cancel-day">
                            <input
                              id="firstName"
                              name="room.cancelDay"
                              v-validate="step==1 ? 'required|numeric|min_value:1':''"
                              data-vv-as="Ngày hủy trước"
                              v-model.number="room.settings.refunds[0].days"
                              type="text"
                              class="form-control"
                            >
                          </div>
                        </div>
                      </div>
                      <div class="col-md-3" v-if="room.settings.no_booking_cancel == 0">
                        <div class="form-group row">
                          <label
                            for="firstName"
                            class="col-sm-4 col-form-label"
                            style="text-align: center;"
                          >Hoàn tiền:</label>
                          <div class="col-sm-8 pr-0 percent">
                            <input disabled="true" value="100" type="text" class="form-control">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </tab-content>
            <tab-content title="Tiện ích phòng" :before-change="validateBeforeNext">
              <div class="card">
                <div class="card-header">
                  <h5 class="section-semi-title">Tiện ích phòng</h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-lg-3" v-for="com in comforts" :key="com.id">
                      <div class="form-group custom-control custom-checkbox mb-3">
                        <input
                          type="checkbox"
                          v-model="room.comforts"
                          :id="com.id"
                          :value="com.id"
                          class="custom-control-input"
                        >
                        <label
                          :for="com.id"
                          class="custom-control-label"
                        >{{com.details.data[0].name}}</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </tab-content>
            <tab-content title="Ảnh phòng" :before-change="validateBeforeNext">
              <div class="card">
                <div class="card-header">
                  <h5 class="section-semi-title">Upload ảnh đại diện cho phòng</h5>
                </div>
                <div class="card-body">
                  <div class="row mt-4">
                    <div class="col-sm-12" v-if="checkLoadedImage()">
                      <vue-dropzone
                        id="dropzone1"
                        ref="myVueDropzone1"
                        :options="imageAvatar"
                        @vdropzone-mounted="vmountedAvatar"
                        @vdropzone-complete="afterCompleteImageAvatar"
                        @vdropzone-canceled
                        @vdropzone-removed-file="removedImageAvatar"
                        :duplicateCheck="true"
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
                    <div class="col-sm-12" v-if="checkLoadedImage()">
                      <vue-dropzone
                        id="dropzone2"
                        ref="myVueDropzone2"
                        :options="imagePost"
                        @vdropzone-canceled
                        @vdropzone-removed-file="removedImagePost"
                        @vdropzone-mounted="vmountedPost"
                        @vdropzone-complete="afterCompleteImagePost"
                        :duplicateCheck="true"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </tab-content>
            <tab-content title="Địa chỉ" :before-change="validateBeforeNext">
              <div class="card">
                <div class="card-header">
                  <h5 class="section-semi-title">Địa chỉ phòng</h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-sm-12">
                      <div class="form-group">
                        <label
                          :style="errors.has('detail.address') ? 'color:red;' : ''">
                          {{errors.has('detail.address')
                            ? errors.first('detail.address') : 'Địa chỉ *'}}
                        </label>
                        <input
                          type="text"
                          id="addressMap"
                          v-model="addressMap"
                          v-validate="step==4 ?'required':''"
                          name="detail.address"
                          data-vv-as="Địa chỉ phòng"
                          class="form-control"
                          placeholder="Nhập địa điểm..."
                          @click="doAutocomplete()"
                        />
                      </div>
                    </div>
                    <div class="col-sm-12">
                      <div class="row">
                        <div class="col-lg-6">
                          <div class="form-group">
                            <label :style="errors.has('room.city') ? 'color:red;' : ''">
                              {{errors.has('room.city')
                              ? errors.first('room.city') : 'Tỉnh thành *'}}
                            </label>
                            <multiselect
                              id="inputCity"
                              v-model="city"
                              v-validate="step==4 ? 'required':''"
                              data-vv-as="Tỉnh thành"
                              name="room.city"
                              label="name"
                              :options="cities"
                              :searchable="true"
                              :show-labels="false"
                              :allow-empty="false"
                              track-by="name"
                            />
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="form-group">
                             <label :style="errors.has('room.district') ? 'color:red;' : ''">
                              {{errors.has('room.district')
                              ? errors.first('room.district') : 'Quận huyện *'}}
                            </label>
                            <multiselect
                              id="inputDistrict"
                              name="room.district"
                              v-model="district"
                              v-validate="step==4 ? 'required':''"
                              data-vv-as="Quận huyện"
                              label="name"
                              :options="filteredDistrict"
                              :searchable="true"
                              :show-labels="false"
                              :allow-empty="false"
                            />
                          </div>
                        </div>
                      </div>

                      <gmap-map
                        :center="center"
                        :zoom="17"
                        map-type-id="terrain"
                        style="width: 1500px; height: 300px"
                      >
                        <gmap-marker
                          v-if="dataRoom"
                          label="★"
                          :position="center"
                        />
                        <gmap-marker
                          v-else
                          label="★"
                          :position="center"
                        />
                      </gmap-map>
                    </div>
                  </div>
                </div>
              </div>
            </tab-content>
            <template slot="footer" slot-scope="props">
              <div class="wizard-footer-left">
                <wizard-button
                  v-if="props.activeTabIndex > 0"
                  @click.native="previousTabForm(props.prevTab())"
                  :style="props.fillButtonStyle"
                >Previous</wizard-button>
              </div>
              <div class="wizard-footer-right">
                <wizard-button
                  v-if="!props.isLastStep"
                  @click.native="props.nextTab()"
                  class="wizard-footer-right"
                  :style="props.fillButtonStyle"
                >Next</wizard-button>
                <wizard-button
                  v-else
                  @click.native="onSubmit()"
                  class="wizard-footer-right finish-button"
                  :style="props.fillButtonStyle"
                >{{props.isLastStep ? `${type}` : 'Next'}}</wizard-button>
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
import vue2Dropzone from "vue2-dropzone";
import { hoursList, format, location } from "../../../helpers/mixins";
import { Tabs, Tab } from "vue-tabs-component";
import { quillEditor } from "vue-quill-editor";
import Multiselect from "vue-multiselect";
import SelectWeekDay from "./SelectWeekDay";
import Datepicker from "vuejs-datepicker";
import { map } from "lodash";
import { gmapApi } from "vue2-google-maps";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
export default {
  name: "RoomForm",
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
      default: "Create"
    },
    dataRoom: {
      default: () => {
        return null;
      }
    },
    titleHeader: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      place: null,
      marker: null,
      step: 0,
      subTitleHeader:
        "Vui lòng hoàn thành chính xác các thông tin trước khi lưu",
      latest_deal: 0,
      specialDays: [],
      selectedWeekday: [],
      comforts: [],
      status: [],
      imageAvatar: {
        url: "https://httpbin.org/post",
        maxFilesize: 3,
        maxFiles: 1,
        addRemoveLinks: true,
        thumbnailWidth: 150,
        thumbnailHeight: 150,
        dictCancelUpload: "Cancel File",
        dictDefaultMessage:
          "<i class='icon-fa icon-fa-cloud-upload'/></i> Uploads Your File's Here",
        headers: { "My-Awesome-Header": "header value" }
      },
      imagePost: {
        url: "https://httpbin.org/post",
        maxFilesize: 3,
        maxFiles: 50,
        addRemoveLinks: true,
        thumbnailWidth: 150,
        thumbnailHeight: 150,
        dictCancelUpload: "Cancel File",
        dictDefaultMessage:
          "<i class='icon-fa icon-fa-cloud-upload'/></i> Uploads Your File's Here",
        headers: { "My-Awesome-Header": "header value" }
      },
      room: {
        comforts: {
          data: []
        },
        city: {
          data: {
            name: null
          }
        },
        district: {
          data: {
            name: null
          }
        },
        statusRoom: {
          value: null
        },
        roomType: {
          value: null
        },
        images: [],
        details: {
          data: [
            {
              name: "",
              address: "",
              description: "",
              lang: "vi",
              space: "",
              note: ""
            }
          ]
        },
        user: {
          data: {
            name: null
          }
        },
        weekday_price: [],
        optional_prices: {
          days: [],
          price_day: 0,
          price_hour: 0,
          price_after_hour: 0,
          status: 1
        },
        max_additional_guest: null,
        price_charge_guest: 0,

        price_day: 0,
        price_hour: 0,
        price_after_hour: 0,

        checkin: null,
        checkout: null,
        room_type: 1,
        room_type_txt: "Nhà riêng",
        rent_type: 2,
        rent_type_txt: "Theo ngày",
        number_bed: 1,
        number_room: 1,
        max_guest: 1,
        status: 0,
        status_txt: "Chưa xác nhận",
        city_id: null,
        district_id: null,
        settings: {
          no_booking_cancel: 1,
          refunds: [
            {
              days: 1,
              amount: 100
            }
          ]
        }
      },
      room_type: [],
      rent_type: [],
      merchants: [],
      weekdays: [
        {
          title: "Thứ 2",
          weekday: 2,
          price_day: 0,
          price_hour: 0,
          price_after_hour: 0,
          status: 0
        },
        {
          title: "Thứ 3",
          weekday: 3,
          price_day: 0,
          price_hour: 0,
          price_after_hour: 0,
          status: 0
        },
        {
          title: "Thứ 4",
          weekday: 4,
          price_day: 0,
          price_hour: 0,
          price_after_hour: 0,
          status: 0
        },
        {
          title: "Thứ 5",
          weekday: 5,
          price_day: 0,
          price_hour: 0,
          price_after_hour: 0,
          status: 0
        },
        {
          title: "Thứ 6",
          weekday: 6,
          price_day: 0,
          price_hour: 0,
          price_after_hour: 0,
          status: 0
        },
        {
          title: "Thứ 7",
          weekday: 7,
          price_day: 0,
          price_hour: 0,
          price_after_hour: 0,
          status: 0
        },
        {
          title: "Chủ nhật",
          weekday: 1,
          price_day: 0,
          price_hour: 0,
          price_after_hour: 0,
          status: 0
        }
      ],
      addressMap: null,
      center: {
        lat: 21.027895,
        lng: 105.833896,
      },
      infoWindowPos: {
        lat: 0,
        lng: 0
      },
      loadedImages: false,
      isActive: true,
      currentTab: null,
    };
  },
  computed: {
    merchant_id: {
      get() {
        if (this.room.user.data.name == null) {
          return null;
        } else {
          return {
            name: this.room.user.data.name
          };
        }
      },
      set(val) {
        this.room.user.data = val;
        this.room.merchant_id = val.id;
      }
    },
    statusRoom: {
      get() {
        return {
          value: this.room.status_txt
        };
      },
      set(val) {
        this.room.statusRoom = val;
        this.room.status = val.id;
        this.room.status_txt = val.value;
      }
    },
    roomType: {
      get() {
        return {
          value: this.room.room_type_txt
        };
      },
      set(val) {
        this.room.roomType = val;
        this.room.room_type = val.id;
        this.room.room_type_txt = val.value;
      }
    },
    rentType: {
      get() {
        return {
          value: this.room.rent_type_txt
        };
      },
      set(val) {
        this.room.rentType = val;
        this.room.rent_type = val.id;
        this.room.rent_type_txt = val.value;
      }
    },
    city: {
      get() {
        if (this.room.city.data.name == null) {
          return null;
        } else {
          return {
            id: this.room.city.data.id,
            name: this.room.city.data.name
          };
        }
      },
      set(val) {
        this.room.district.name = null;
        this.room.city.data = val;
        this.room.city_id = val.id;
      }
    },
    district: {
      get() {
        if (this.room.district.data.name == null) {
          return null;
        } else {
          return {
            id: this.room.district.data.id,
            name: this.room.district.data.name
          };
        }
      },
      set(val) {
        this.room.district.data = val;
        this.room.district_id = val.id;
      }
    },
    checkCountLang() {
      if (this.room.details.data.length) {
        let length = this.room.details.data.length;
        return !!(length == 1);
      }
    },
    checkSpecialDays() {
      if (this.room.optional_prices.days.length) {
        let length = this.room.optional_prices.days.length;
        return !!(length > 0);
      }
    },
    filteredDistrict() {
      let self = this;
      return this.districts.filter(function(item) {
        if (self.city != null) {
          return item.city_id == self.city.id;
        }
      });
    },
    filteredWeekday() {
      let self = this;
      if (self.selectedWeekday.length) {
        return this.weekdays.filter(function(item) {
          return !self.selectedWeekday.includes(item.weekday);
        });
      } else {
        return this.weekdays;
      }
    },
    google: gmapApi
  },
  watch: {
    specialDays: {
      handler(val) {
        this.room.optional_prices.days = [];
        if (val !== null) {
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
    "room.weekday_price": {
      handler(val) {
        this.selectedWeekday = [];
        if (val !== null) {
          val.forEach(element => {
            this.selectedWeekday.push(element.weekday);
          });
        }
      },
      deep: true
    },
    place: {
      handler(val) {
        if(val) {
          this.center = {
            lat: val.geometry.location.lat(),
            lng: val.geometry.location.lng()
          }
        }
      }
    },
  },
  methods: {
    setInitData() {
      let dataRoom = { ...this.dataRoom };
      if (dataRoom.prices.data.length) {
        dataRoom.prices.data.forEach(item => {
          if (item.day === "Không xác định") {
            let w_day = {
              weekday: null,
              price_day: null,
              price_hour: null,
              price_after_hour: null,
              status: 1
            };
            w_day.weekday = item.weekday;
            w_day.price_day = item.price_day;
            w_day.price_hour = item.price_hour;
            w_day.price_after_hour = item.price_after_hour;
            this.room.weekday_price.push(w_day);
            this.selectedWeekday.push(w_day.weekday);
          } else {
            let date = new Date(item.day);
            date.setTime(date.getTime() - 7 * 60 * 60 * 1000);
            this.specialDays.push(date);
            this.room.optional_prices.days.push(item.day);
            this.room.optional_prices.price_day == 0 &&
              (this.room.optional_prices.price_day = item.price_day);
            this.room.optional_prices.price_hour == 0 &&
              (this.room.optional_prices.price_hour = item.price_hour);
            this.room.optional_prices.price_after_hour == 0 &&
              (this.room.optional_prices.price_after_hour =
                item.price_after_hour);
          }
        });
      }
      this.room = JSON.parse(JSON.stringify({ ...this.room, ...dataRoom }));

      this.center.lat = parseFloat(dataRoom.latitude);
      this.center.lng = parseFloat(dataRoom.longitude);
      this.addressMap = dataRoom.details.data[0].address;
      if (dataRoom.settings.no_booking_cancel == 1) {
        this.room.settings = {
          no_booking_cancel: 1,
          refunds: [
            {
              days: 1,
              amount: 100
            }
          ]
        };
      }
      if(dataRoom.media.data.length){
        this.room.images = [];
        let countImg = 0;
        dataRoom.media.data.forEach(item => {
          this.getBase64ImageFromUrl(
            "https://s3-ap-southeast-1.amazonaws.com/d-beauty/"+item.image)
          .then(result => {
            let img = { source:null, type:null };
            img.source = result;
            img.type = item.type;
            this.room.images.push(img);
            this.room.images = JSON.parse(JSON.stringify(this.room.images));
            countImg ++;
            if(countImg == dataRoom.media.data.length) {
               this.loadedImages = true;
            }
           })
          .catch(err => console.error(err));
        });
      }
      else {
        this.loadedImages = true;
      }

      if (this.room.comforts.data.length) {
        let arr = this.room.comforts.data.map(item => item.id);
        this.room.comforts = arr;
      } else {
        this.room.comforts = [];
      }
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
    tabChanged (selectedTab) {
      this.currentTab = selectedTab.tab.name;
    },
    vmountedPost() {
      let arrImage = this.room.images;
      let i = 1;
      arrImage.forEach(item => {
        if (item.type == 1) {
          let file = { name: "Ảnh bài viết "+ i, size: 12356, type: "image",dataURL: item.source };
          let url = item.source;
          this.$refs.myVueDropzone2.manuallyAddFile(file, url);
          i++;
        }
      });
    },
    vmountedAvatar() {
      let arrImage = this.room.images;
      let i = 1;
      arrImage.forEach(item => {
        if (item.type == 4) {
          let file = { name: "Ảnh đại diện "+ i, size: 12356, type: "image",dataURL: item.source };
          let url = item.source;
          this.$refs.myVueDropzone1.manuallyAddFile(file, url);
          i++;
        }
      });
    },
    addWeekday() {
      if (this.room.weekday_price.length < 7) {
        let w = this.filteredWeekday[0].weekday;
        this.room.weekday_price.push({
          weekday: w,
          status: 1,
          price_day: 0,
          price_hour: 0,
          price_after_hour: 0
        });
      }
    },
    deleteWeekday(index) {
      this.room.weekday_price.splice(index, 1);
    },
    formatDate(date) {
      if (!date) return null;
      const [h, m, s] = date.split(":");
      return `${h}:${m}`;
    },
    previousTabForm(event) {
      this.step--;
      return event;
    },
    afterCompleteImageAvatar(file) {
      let picture = {
        source: null,
        type: 4
      };
      if (file.accepted == true) {
        picture.source = file.dataURL;
        this.room.images.push(picture);
      }
    },
    afterCompleteImagePost(file) {
      let picture = {
        source: null,
        type: 1
      };
      if (file.accepted == true) {
        picture.source = file.dataURL;
        this.room.images.push(picture);
      }
    },
    removedImageAvatar(file, error, xhr) {
      this.room.images.forEach((item,index) => {
        if (item.source === file.dataURL) {
          this.room.images.splice(index, 1);
        }
      })
    },
    removedImagePost(file, error, xhr) {
      this.room.images.forEach((item,index) => {
        if (item.source === file.dataURL) {
          this.room.images.splice(index, 1);
        }
      })
    },
    doAutocomplete() {
      let element = document.getElementById('addressMap')
      this.autocomplete = new google.maps.places.Autocomplete(element)
      this.autocomplete.setComponentRestrictions(
            {'country': ['vn']});
      this.autocomplete.addListener('place_changed', () => {
        let place = this.autocomplete.getPlace();
        let address = "";
        let place_name = place.name.split("-")[0].trim();
        let place_formated = place.formatted_address.split(",")[0].trim();
        if(place_name !== place_formated) {
          address += (place_name + ', ' + place.formatted_address);
        }
        else {
          address = place.formatted_address;
        }
        this.addressMap = address;

        this.place = place;
        this.room.latitude = this.place.geometry.location.lat();
        this.room.longitude = this.place.geometry.location.lng();

        this.room.details.data.forEach(element => {
          element.address = address;
        });
      });
    },
    checkLoadedImage() {
      if(this.type == "Create") {
        return true;
      }
      else {
        if(this.loadedImages){
          return true;
        }
        else {
          return false;
        }
      }
    },
    async getBase64ImageFromUrl(imageUrl) {
      let res = await fetch(imageUrl);
      let blob = await res.blob();

      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.addEventListener(
          "load",
          function() {
            resolve(reader.result);
          },
          false
        );
        reader.onerror = () => {
          return reject(this);
        };
        reader.readAsDataURL(blob);
      });
    },
    async validateBeforeNext() {
      const result = await this.$validator.validateAll();
      if (!result) {
        return window.scroll({
          top: 0,
          behavior: "smooth"
        });
      } else {
        this.step++;
        return true;
      }
    },
    async onSubmit() {
      const result = await this.$validator.validateAll();
      if (result) {
        if (this.room.details.data[0].address) {
          try {
            if (this.type == "Update") {
              this.$swal({
                title: "Đang xử lý",
                text: "",
                type: "info",
                showCancelButton: false,
                showConfirmButton: false,
                showCloseButton: false,
                showLoaderOnConfirm: false
              });
              let response = await axios
                .put(`rooms/${this.$route.params.roomId}`, this.room)
                .then(response => {
                  this.$swal(
                    "Thành công",
                    "Phòng được cập nhật thành công",
                    "success"
                  );
                  this.$router.push({ name: "room.list" });
                });
            } else {
              this.$swal({
                title: "Đang xử lý",
                text: "",
                type: "info",
                showCancelButton: false,
                showConfirmButton: false,
                showCloseButton: false,
                showLoaderOnConfirm: false
              });
              let response = await axios
                .post("rooms", this.room)
                .then(response => {
                  this.$swal(
                    "Thành công",
                    "Phòng được tạo mới thành công",
                    "success"
                  );
                  this.$router.push({ name: "room.list" });
                });
            }
          } catch (error) {
            if (error) {
              console.log(error)
              this.$swal(
                "Xin lỗi",
                "Phòng chưa đưọc lưu, làm ơn kiểm tra lại thông tin",
                "error"
              );
            }
          }
        } else {
          this.$swal("Xin lỗi", "Địa chỉ không được bỏ trống", "danger");
        }
      }
    },
    async getRoomType() {
      try {
        const response = await axios.get("rooms/type");
        this.room_type = response.data;
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu loại phòng hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
        }
      }
    },
    async getRentType() {
      try {
        const response = await axios.get("rooms/rent-type");
        this.rent_type = response.data;
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu loại thuê phòng hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
        }
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
          window.toastr["error"](
            "Dữ liệu quản lý phòng hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
        }
      }
    },
    async getComforts() {
      try {
        const response = await axios.get(`comforts`, {
          params: {
            limit: -1,
            include: "details"
          }
        });
        this.comforts = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Danh sách tiện ích phòng hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
        }
      }
    },
    async getStatus() {
      try {
        const response = await axios.get("rooms/room-status");
        this.status = response.data;
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu trạng thái phòng hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
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
        name: "",
        address: this.room.details.data[0].address,
        description: "",
        lang: "en",
        space: "",
        note: ""
      });
    },
    deleteLangEnglishForm() {
      let index = this.room.details.data.findIndex(x => x.lang == "en");
      this.room.details.data.splice(index, 1);
      // let elem = this.$refs.myTab.$el;
      // console.log(elem)
      // elem.click();
    },
  },
  created() {
    !(this.dataRoom === null) && this.setInitData();
    this.dataRoom === null && (this.room.comforts = []);
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
            this.getStatus();
          }
        });
      }
    });
    this.hideSidebarOnMobile();
    if (this.room.checkin) {
      this.room.checkin = this.formatDate(this.room.checkin);
    }
    if (this.room.checkout) {
      this.room.checkout = this.formatDate(this.room.checkout);
    }
  }
};
</script>

<style>
.cancel-day,
.percent {
  display: inline-block;
  position: relative;
}
.cancel-day::after {
  position: absolute;
  top: 5px;
  right: 0.5em;
  transition: all 0.05s ease-in-out;
  content: "ngày";
}
.percent::after {
  position: absolute;
  top: 5px;
  right: 0.5em;
  transition: all 0.05s ease-in-out;
  content: "%";
}
</style>






