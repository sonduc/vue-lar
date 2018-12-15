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

              <div class="row">
                <div class="col-sm-6">
                  <p style="text-decoration: underline;">Hoặc:</p>
                </div>
                <div class="col-sm-6" style="text-align: right; padding-right: 42px;">
                  <p style="text-decoration: underline;">Bắt buộc</p>
                </div>
              </div>

              <div class="form-group row">
                <label for="pasword" class="col-sm-3 col-form-label">
                  Chọn các phòng/căn hộ:
                </label>
                <div class="col-sm-8">
                  <multiselect
                    style="z-index: 12"
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
                <div
                  class="col-sm-1 custom-checkbox-all custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    value="rooms"
                    v-model="coupons.settings.bind"
                    id="rooms">
                  <label class="custom-control-label style-checkbox" for="rooms">
                  </label>
                </div>
              </div>
              <div class="form-group row wrapper-room panel-collapse custom-panel"
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
                  Chọn các quản lý phòng:
                </label>
                <div class="col-sm-8" >
                  <multiselect
                    style="z-index: 11"
                    v-model="coupons.settings.merchants"
                    :multiple="true"
                    :close-on-select="false"
                    :clear-on-select="true"
                    :preserve-search="true"
                    track-by="name"
                    :options="merchantlist"
                    placeholder="Chọn quản lý phòng"
                    label="name"
                    :disabled="isAllRoom == 1 ? true : false"
                    :preselect-first="true">
                    <template slot="selection" slot-scope="{ values, search, isOpen }">
                      <span class="multiselect__single" style="color:#ff6666"
                        v-if="values.length &amp;&amp; !isOpen">
                        {{ values.length }} quản lý phòng đã được chọn
                      </span>
                    </template>
                  </multiselect>
                </div>
                <div
                  class="col-sm-1 custom-checkbox-all custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    value="merchants"
                    v-model="coupons.settings.bind"
                    id="merchants">
                  <label class="custom-control-label style-checkbox" for="merchants">
                  </label>
                </div>
              </div>
              <div class="form-group row wrapper-room panel-collapse custom-panel"
                v-if="coupons.settings.merchants.length">
                <div class="col-sm-12">
                  <draggable
                    v-model="coupons.settings.merchants"
                    :options="{group:'people'}"
                    @start="drag=true"
                    @end="drag=false"
                    class="container-form">
                    <div class="list-form"
                      v-for="(merchant,index) in coupons.settings.merchants"
                      :key="index">
                      <p class="btn btn-outline-secondary name-room">
                      {{merchant.name}}
                        <i @click="deleteMerchant(index)"
                          class="icon-fa icon-fa-times icon-room">
                        </i>
                      </p>
                    </div>
                  </draggable>
                </div>
              </div>

              <div class="form-group row">
                <label for="pasword" class="col-sm-3 col-form-label">
                  Chọn các khách hàng:
                </label>
                <div class="col-sm-8" >
                  <multiselect
                    style="z-index: 10"
                    v-model="coupons.settings.users"
                    :multiple="true"
                    :close-on-select="false"
                    :clear-on-select="true"
                    :preserve-search="true"
                    track-by="name"
                    :options="userlist"
                    placeholder="Chọn khách hàng"
                    label="name"
                    :disabled="isAllRoom == 1 ? true : false"
                    :preselect-first="true">
                    <template slot="selection" slot-scope="{ values, search, isOpen }">
                      <span class="multiselect__single" style="color:#660066"
                        v-if="values.length &amp;&amp; !isOpen">
                        {{ values.length }} khách hàng đã được chọn
                      </span>
                    </template>
                  </multiselect>
                </div>
                <div
                  class="col-sm-1 custom-checkbox-all custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    value="users"
                    v-model="coupons.settings.bind"
                    id="users">
                  <label class="custom-control-label style-checkbox" for="users">
                  </label>
                </div>
              </div>
              <div class="form-group row wrapper-room panel-collapse custom-panel"
                v-if="coupons.settings.users.length">
                <div class="col-sm-12">
                  <draggable
                    v-model="coupons.settings.users"
                    :options="{group:'people'}"
                    @start="drag=true"
                    @end="drag=false"
                    class="container-form">
                    <div class="list-form"
                      v-for="(user,index) in coupons.settings.users"
                      :key="index">
                      <p class="btn btn-outline-secondary name-room">
                      {{user.name}}
                        <i @click="deleteUser(index)"
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
                <div class="col-sm-8" >
                  <multiselect
                    style="z-index: 9"
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
                <div
                  class="col-sm-1 custom-checkbox-all custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    value="cities"
                    v-model="coupons.settings.bind"
                    id="cities">
                  <label class="custom-control-label style-checkbox" for="cities">
                  </label>
                </div>
              </div>
              <div class="form-group row wrapper-room panel-collapse custom-panel"
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
                <div class="col-sm-8" >
                  <multiselect
                    style="z-index: 8"
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
                <div
                  class="col-sm-1 custom-checkbox-all custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    value="districts"
                    v-model="coupons.settings.bind"
                    id="districts">
                  <label class="custom-control-label style-checkbox" for="districts">
                  </label>
                </div>
              </div>
              <div class="form-group row wrapper-room panel-collapse custom-panel"
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
                <label for="pasword" class="col-sm-3 col-form-label">
                  Áp dụng cho các loại phòng:
                </label>
                <div class="col-sm-8" >
                  <multiselect
                    style="z-index: 7"
                    v-model="coupons.settings.room_type"
                    :multiple="true"
                    :allow-empty="true"
                    :close-on-select="false"
                    :clear-on-select="true"
                    :preserve-search="true"
                    track-by="name"
                    :options="room_type_list"
                    placeholder="Chọn loại phòng"
                    label="name"
                    :disabled="isAllRoom == 1 ? true : false"
                    :preselect-first="true">
                    <template slot="selection" slot-scope="{ values, search, isOpen }">
                      <span class="multiselect__single" style="color:#007c91"
                        v-if="values.length &amp;&amp; !isOpen">
                        {{ values.length }} loại phòng đã được chọn
                      </span>
                    </template>
                  </multiselect>
                </div>
                <div
                  class="col-sm-1 custom-checkbox-all custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    value="room_type"
                    v-model="coupons.settings.bind"
                    id="room_type">
                  <label class="custom-control-label style-checkbox" for="room_type">
                  </label>
                </div>
              </div>
              <div class="form-group row wrapper-room panel-collapse custom-panel"
                v-if="coupons.settings.room_type.length">
                <div class="col-sm-12">
                  <draggable
                    v-model="coupons.settings.room_type"
                    :options="{group:'people'}"
                    @start="drag=true"
                    @end="drag=false"
                    class="container-form">
                    <div
                      class="list-form"
                      v-for="(r_type,index) in coupons.settings.room_type"
                      :key="index">
                      <p class="btn btn-outline-secondary name-room">
                        {{r_type.name}}
                        <i @click="deleteRoomType(index)"
                        class="icon-fa icon-fa-times icon-room"></i>
                      </p>
                    </div>
                  </draggable>
                </div>
              </div>

              <div class="form-group row">
                <label for="pasword" class="col-sm-3 col-form-label">
                  Áp dụng cho các ngày trong tuần:
                </label>
                <div class="col-sm-8" >
                  <multiselect
                    style="z-index: 6"
                    v-model="coupons.settings.days_of_week"
                    :multiple="true"
                    :close-on-select="false"
                    :clear-on-select="true"
                    :preserve-search="true"
                    track-by="name"
                    :options="weekday_list"
                    placeholder="Chọn ngày trong tuần"
                    label="name"
                    :disabled="isAllRoom == 1 ? true : false"
                    :preselect-first="true">
                    <template slot="selection" slot-scope="{ values, search, isOpen }">
                      <span class="multiselect__single" style="color:#6b9b37"
                        v-if="values.length &amp;&amp; !isOpen">
                        {{ values.length }} ngày trong tuần đã được chọn
                      </span>
                    </template>
                  </multiselect>
                </div>
                <div
                  class="col-sm-1 custom-checkbox-all custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    value="days_of_week"
                    v-model="coupons.settings.bind"
                    id="days_of_week">
                  <label class="custom-control-label style-checkbox"
                    for="days_of_week">
                  </label>
                </div>
              </div>
              <div class="form-group row wrapper-room panel-collapse custom-panel"
                v-if="coupons.settings.days_of_week.length">
                <div class="col-sm-12">
                  <draggable
                    v-model="coupons.settings.days_of_week"
                    :options="{group:'people'}"
                    @start="drag=true"
                    @end="drag=false"
                    class="container-form">
                    <div
                      class="list-form"
                      v-for="(day,index) in coupons.settings.days_of_week"
                      :key="index">
                      <p class="btn btn-outline-secondary name-room">
                        {{day.name}}
                        <i @click="deleteDayOfWeek(index)"
                        class="icon-fa icon-fa-times icon-room"></i>
                      </p>
                    </div>
                  </draggable>
                </div>
              </div>

              <div class="form-group row">
                <label for="pasword" class="col-sm-3 col-form-label">
                  Áp dụng cho các loại booking:
                </label>
                <div class="col-sm-8" >
                  <multiselect
                    style="z-index: 5"
                    v-model="coupons.settings.booking_type"
                    :multiple="true"
                    :close-on-select="false"
                    :clear-on-select="true"
                    :preserve-search="true"
                    track-by="name"
                    :options="booking_type_list"
                    placeholder="Chọn loại booking"
                    label="name"
                    :disabled="isAllRoom == 1 ? true : false"
                    :preselect-first="true">
                    <template slot="selection" slot-scope="{ values, search, isOpen }">
                      <span class="multiselect__single" style="color:#ee98fb"
                        v-if="values.length &amp;&amp; !isOpen">
                        {{ values.length }} loại booking đã được chọn
                      </span>
                    </template>
                  </multiselect>
                </div>
                <div
                  class="col-sm-1 custom-checkbox-all custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    value="booking_type"
                    v-model="coupons.settings.bind"
                    id="booking_type">
                  <label class="custom-control-label style-checkbox"
                    for="booking_type">
                  </label>
                </div>
              </div>
              <div class="form-group row wrapper-room panel-collapse custom-panel"
                v-if="coupons.settings.booking_type.length">
                <div class="col-sm-12">
                  <draggable
                    v-model="coupons.settings.booking_type"
                    :options="{group:'people'}"
                    @start="drag=true"
                    @end="drag=false"
                    class="container-form">
                    <div
                      class="list-form"
                      v-for="(b_type,index) in coupons.settings.booking_type"
                      :key="index">
                      <p class="btn btn-outline-secondary name-room">
                        {{b_type.name}}
                        <i @click="deleteBookingType(index)"
                        class="icon-fa icon-fa-times icon-room"></i>
                      </p>
                    </div>
                  </draggable>
                </div>
              </div>

              <div class="form-group row">
                <label for="pasword" class="col-sm-3 col-form-label">
                Áp dụng cho giá booking trên:
                </label>
                <div class="col-sm-8 min-price">
                 <input
                    type="text"
                    v-model="coupons.settings.min_price"
                    class="form-control">
                </div>
                <div
                  class="col-sm-1 custom-checkbox-all custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    value="min_price"
                    v-model="coupons.settings.bind"
                    id="min_price">
                  <label class="custom-control-label style-checkbox"
                    for="min_price">
                  </label>
                </div>
              </div><br/>

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
                <div
                  class="col-sm-1 custom-checkbox-all custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    value="days"
                    v-model="coupons.settings.bind"
                    id="days">
                  <label class="custom-control-label style-checkbox"
                    for="days">
                  </label>
                </div>
              </div><br/>

              <div class="form-group row">
                <label for="pasword" class="col-sm-3 col-form-label"
                  style="padding-top: 35px;">
                  Áp dụng cho ngày tạo booking:
                </label>
                <div class="col-sm-4">
                  <div class="form-group">
                    <label>Bắt đầu</label>
                    <datepicker
                      name="start_booking_create"
                      :format="format"
                      v-model="bookingCreate.start"
                      input-class="form-control"
                      :disabled-dates="disabledBookingCreateStart"
                    />
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="form-group">
                    <label>Kết thúc</label>
                    <datepicker
                      name="end_booking_create"
                      :format="format"
                      v-model="bookingCreate.end"
                      input-class="form-control"
                      :disabled-dates="disabledBookingCreateEnd"
                    />
                  </div>
                </div>
                <div
                  class="col-sm-1 custom-checkbox-all custom-control custom-checkbox"
                  style="padding-top: 38px;">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    value="booking_create"
                    v-model="coupons.settings.bind"
                    id="booking_create">
                  <label class="custom-control-label style-checkbox"
                    for="booking_create">
                  </label>
                </div>
              </div><br/>

              <div class="form-group row">
                <label for="pasword" class="col-sm-3 col-form-label"
                  style="padding-top: 35px;">
                Áp dụng cho ngày khách ở:
                </label>
                <div class="col-sm-4">
                  <div class="form-group">
                    <label>Bắt đầu</label>
                    <datepicker
                      name="start_booking_stay"
                      :format="format"
                      v-model="bookingStay.start"
                      input-class="form-control"
                      :disabled-dates="disabledBookingStayStart"
                    />
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="form-group">
                    <label>Kết thúc</label>
                    <datepicker
                      name="end_booking_stay"
                      :format="format"
                      v-model="bookingStay.end"
                      input-class="form-control"
                      :disabled-dates="disabledBookingStayEnd"
                    />
                  </div>
                </div>
                <div
                  class="col-sm-1 custom-checkbox-all custom-control custom-checkbox"
                  style="padding-top: 38px;">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    value="booking_stay"
                    v-model="coupons.settings.bind"
                    id="booking_stay">
                  <label class="custom-control-label style-checkbox"
                    for="booking_stay">
                  </label>
                </div>
              </div><br/>

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
  import { constant, location } from "../../../helpers/mixins";
  import { map } from "lodash";
  export default {
    mixins: [constant, location],
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
      },
    },
    data() {
      return {
        format: "yyyy-MM-dd",
        disabledBookingCreateStart: {
          to: new Date()
        },
        disabledBookingCreateEnd: {
          to: ""
        },
        bookingCreate: {
          start: "",
          end: ""
        },
        disabledBookingStayStart: {
          to: new Date()
        },
        disabledBookingStayEnd: {
          to: ""
        },
        bookingCreate: {
          start: "",
          end: ""
        },
        bookingStay: {
          start: "",
          end: ""
        },
        coupons: {
          discount: 0,
          max_discount: 0,
          code: null,
          all_day: 1,
          usable: 0,
          used: 0,
          status:0,
          promotion_id: null,
          settings: {
            bind: [],
            rooms: [],
            merchants: [],
            users: [],
            cities: [],
            districts: [],
            days:[],
            booking_type: [],
            room_type: [],
            days_of_week: [],
            min_price: 0,
          }
        },
        promotion:null,
        isAllRoom: 0,
        roomlist: [],
        merchantlist: [],
        userlist: [],
        disabledDay: {
         to: null,
         from: null
        }
      }
    },
    computed: {
      ...mapGetters(['getPromotionId','getPromotionDay']),

    },
    watch: {
      isAllRoom: {
        handler(val) {
          if(val == 1) {
            this.coupons.settings.rooms = [];
            this.coupons.settings.cities = [];
            this.coupons.settings.districts = [];
            this.coupons.settings.merchants = [];
            this.coupons.settings.users = [];
            this.coupons.settings.booking_type = [];
            this.coupons.settings.room_type = [];
            this.coupons.settings.days_of_week = [];
            this.coupons.settings.min_price = 0;
            this.coupons.settings.days = [];
            this.bookingCreate.start = "";
            this.bookingCreate.end = "";
            this.bookingStay.start = "";
            this.bookingStay.end = "";
          }
        }
      },
      "bookingCreate.start": {
        handler(val) {
          this.disabledBookingCreateEnd.to = new Date(val);
        },
        deep: true
      },
      "bookingStay.start": {
        handler(val) {
          this.disabledBookingStayEnd.to = new Date(val);
        },
        deep: true
      }
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
        if(dataCoupon.settings.booking_create.length > 1){
          let {0 : start, [dataCoupon.settings.booking_create.length - 1] : end}
            = dataCoupon.settings.booking_create;
          this.bookingCreate.start = start;
          this.bookingCreate.end = end;
        }
        if(dataCoupon.settings.booking_stay.length > 1){
          let {0 : start, [dataCoupon.settings.booking_stay.length - 1] : end}
            = dataCoupon.settings.booking_stay;
          this.bookingStay.start = start;
          this.bookingStay.end = end;
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
      deleteMerchant(id) {
        this.coupons.settings.merchants.splice(id,1);
      },
      deleteUser(id) {
        this.coupons.settings.users.splice(id,1);
      },
      deleteCity(id) {
        this.coupons.settings.cities.splice(id,1);
      },
      deleteDistrict(id) {
        this.coupons.settings.districts.splice(id,1);
      },
      deleteRoomType(id) {
        this.coupons.settings.room_type.splice(id,1);
      },
      deleteDayOfWeek(id) {
        this.coupons.settings.days_of_week.splice(id,1);
      },
      deleteBookingType(id) {
        this.coupons.settings.booking_type.splice(id,1);
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
      minusDay(date) {
        let beforeAddDay = new Date(date);
        let timeDay = 86400000;
        let afterAddDay = new Date(beforeAddDay.getTime() - timeDay);
        let day = afterAddDay.toISOString().substring(0,10);
        return day;
      },
      async getMerchants() {
        try {
          const response = await axios.get(`users`, {
            params: {
              limit: -1,
              is_owner: 1
            }
          });
          this.merchantlist = response.data.data;
        } catch (error) {
          if (error) {
            window.toastr["error"]("There was an error", "Error");
          }
        }
      },
      async getUsers() {
        try {
          const response = await axios.get(`users`, {
            params: {
              limit: -1,
              is_owner: 0
            }
          });
          this.userlist = response.data.data;
        } catch (error) {
          if (error) {
            window.toastr["error"]("There was an error", "Error");
          }
        }
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
            let arrMerchantId = [];
            let arrUserId = [];
            let arrCityId = [];
            let arrDistrictId = [];
            let arrDays = [];
            let arrRoomTypeId = [];
            let arrBookingTypeId = [];
            let arrWeekdayId = [];
            let startBCreate;
            let endBCreate;
            let startBStay;
            let endBStay;
            if(this.coupons.settings.days.length) {
              this.coupons.settings.days.forEach(date => {
                let day = this.addDay(date);
                let d = new Date(day);
                arrDays.push(d.toISOString().substring(0, 10));
              })
            }
            if(this.bookingCreate.start && this.bookingCreate.end){
              let start = new Date(this.bookingCreate.start);
              startBCreate = start.toISOString().substring(0, 10);

              let end = new Date(this.bookingCreate.end);
              endBCreate = end.toISOString().substring(0, 10);
            }
            if(this.bookingStay.start && this.bookingStay.end){
              let start = new Date(this.bookingStay.start);
              startBStay = start.toISOString().substring(0, 10);

              let end = new Date(this.bookingStay.end);
              endBStay = end.toISOString().substring(0, 10);
            }
            if(this.coupons.settings.rooms.length) {
              arrRoomId = this.coupons.settings.rooms.map(room => room.id);
            }
            if(this.coupons.settings.cities.length) {
              arrCityId = this.coupons.settings.cities.map(city => city.id);
            }
            if(this.coupons.settings.districts.length) {
              arrDistrictId = this.coupons.settings.districts.map(
                district => district.id);
            }
            if(this.coupons.settings.merchants.length) {
              arrMerchantId = this.coupons.settings.merchants.map(
                merchant => merchant.id);
            }
            if(this.coupons.settings.users.length) {
              arrUserId = this.coupons.settings.users.map(user => user.id);
            }
            if(this.coupons.settings.room_type.length) {
              arrRoomTypeId = this.coupons.settings.room_type.map(
                r_type => r_type.id);
            }
            if(this.coupons.settings.booking_type.length) {
              arrBookingTypeId = this.coupons.settings.booking_type.map(
                b_type => b_type.id);
            }
            if(this.coupons.settings.days_of_week.length) {
              arrWeekdayId = this.coupons.settings.days_of_week.map(
                d_week => d_week.id);
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
                      bind: this.isAllRoom == 0 ? this.coupons.settings.bind : [],
                      rooms: this.isAllRoom == 0 ? arrRoomId : [],
                      cities: this.isAllRoom == 0 ? arrCityId : [],
                      districts: this.isAllRoom == 0 ? arrDistrictId : [],
                      merchants: this.isAllRoom == 0 ? arrMerchantId : [],
                      users: this.isAllRoom == 0 ? arrUserId : [],
                      room_type: this.isAllRoom == 0 ? arrRoomTypeId : [],
                      booking_type: this.isAllRoom == 0 ? arrBookingTypeId : [],
                      booking_create: this.isAllRoom == 0 ?
                        [startBCreate, endBCreate] : [],
                      booking_stay: this.isAllRoom == 0 ?
                        [startBStay, endBStay] : [],
                      days_of_week: this.isAllRoom == 0 ? arrWeekdayId : [],
                      min_price: this.coupons.settings.min_price,
                      days: this.isAllRoom == 0 ? arrDays : []
                    }
                  })
                  .then(response => {
                    this.$swal(
                      "Thành công",
                      "Phiếu giảm giá được cập nhật thành công",
                      "success"
                    );
                    console.log(response)
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
                      bind: this.isAllRoom == 0 ? this.coupons.settings.bind : [],
                      rooms: this.isAllRoom == 0 ? arrRoomId : [],
                      cities: this.isAllRoom == 0 ? arrCityId : [],
                      districts: this.isAllRoom == 0 ? arrDistrictId : [],
                      merchants: this.isAllRoom == 0 ? arrMerchantId : [],
                      users: this.isAllRoom == 0 ? arrUserId : [],
                      booking_type: this.isAllRoom == 0 ? arrBookingTypeId : [],
                      room_type: this.isAllRoom == 0 ? arrRoomTypeId : [],
                      booking_create: this.isAllRoom == 0 ?
                        [startBCreate, endBCreate] : [],
                      booking_stay: this.isAllRoom == 0 ?
                        [startBStay, endBStay] : [],
                      days_of_week: this.isAllRoom == 0 ? arrWeekdayId : [],
                      min_price: this.coupons.settings.min_price,
                      days: this.isAllRoom == 0 ? arrDays : []
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
      let disabledEnd = this.minusDay(this.getPromotionDay.endDay.substring(0,10));
      this.disabledDay.from = new Date(disabledEnd);
    },
    mounted() {
      if(this.type === "Create"){
        this.coupons.settings.booking_type = [];
        this.coupons.settings.room_type = [];
        this.coupons.settings.days_of_week = [];
      }
      Auth.getProfile().then(res => {
        if (res) {
          Auth.canAccess(res, this.permissions).then(response => {
            if (!response) {
              this.$router.push("permission-denied-403");
            } else {
              this.getRooms();
              this.getMerchants();
              this.getUsers();
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
.custom-panel {
  margin-right: 130px;
}
.style-checkbox {
  padding-top: 30px;
  margin-left: 35px;
}
.min-price {
  display: inline-block;
  position: relative;
}
.min-price::after {
  position: absolute;
  top: 7px;
  right: 1.5em;
  transition: all .05s ease-in-out;
  content: 'vnđ';
}
</style>
