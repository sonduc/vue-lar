<template>
  <div class="sidebar-left">
    <div class="sidebar-body scroll-pane">
      <div class="side-nav">
        <v-collapse accordion>
          <v-collapse-item active-url="/admin/dashboard">
            <a slot="item-title" href="#">
              <i class="icon-fa icon-fa-dashboard"/>Thống kê
              <span class="icon-fa arrow icon-fa-fw"/>
            </a>

            <router-link to="/admin/dashboard/booking">Thống kê đặt phòng</router-link>
            <router-link to="/admin/dashboard/finance">Thống kê doanh thu</router-link>
            <router-link to="/admin/dashboard/room">Thống kê số lượng phòng</router-link>
          </v-collapse-item>

          <v-collapse-item active-url="/admin/users">
            <a slot="item-title" href="#">
              <i class="icon-fa icon-fa-user"/>Người dùng
              <span class="icon-fa arrow icon-fa-fw"/>
            </a>

            <router-link to="/admin/users/customers">Khách hàng</router-link>
            <router-link to="/admin/users/merchants">Chủ nhà</router-link>
            <router-link to="/admin/users/admins">Admin</router-link>
          </v-collapse-item>

          <v-collapse-item active-url="/admin/bookings">
            <a slot="item-title" href="#">
              <i class="icon-fa icon-fa-book"/>Đặt phòng
              <span class="icon-fa arrow icon-fa-fw"/>
            </a>
            <router-link to="/admin/bookings/list">Danh sách Booking</router-link>
          </v-collapse-item>

          <v-collapse-item active-url="/admin/roles">
            <a slot="item-title" href="#">
              <i class="icon-fa icon-fa-key"/>Phân Quyền
              <span class="icon-fa arrow icon-fa-fw"/>
            </a>
            <router-link to="/admin/roles/list">Danh sách quyền</router-link>
          </v-collapse-item>

          <v-collapse-item active-url="/admin/collections">
            <a slot="item-title" href="#">
              <i class="icon-fa icon-fa-qrcode"/>Bộ sưu tập
              <span class="icon-fa arrow icon-fa-fw"/>
            </a>
            <router-link to="/admin/collections/list">Danh sách bộ sưu tập</router-link>
            <router-link to="/admin/collections/create">Tạo bộ sưu tập</router-link>
          </v-collapse-item>

          <v-collapse-item active-url="/admin/rooms">
            <a slot="item-title" href="#">
              <i class="icon-fa icon-fa-home"/>Phòng
              <span class="icon-fa arrow icon-fa-fw"/>
            </a>
            <router-link to="/admin/rooms/list">Danh sách phòng</router-link>
          </v-collapse-item>

          <v-collapse-item active-url="/admin/promotions">
            <a slot="item-title" href="#">
              <i class="icon-fa icon-fa-gift"/> Khuyến mãi
              <span class="icon-fa arrow icon-fa-fw"/>
            </a>
            <router-link to="/admin/promotions/list">Chương trình khuyến mãi</router-link>
            <router-link to="/admin/promotions/create">Tạo chương trình khuyến mãi</router-link>
            <router-link to="/admin/coupons/list">Danh sách phiếu giảm giá</router-link>
            <router-link to="/admin/coupons/create">
              <span @click="openCreateCoupon">Tạo phiếu giảm giá</span>
            </router-link>
          </v-collapse-item>

          <v-collapse-item active-url="/admin/blogs">
            <a slot="item-title" href="#">
              <i class="icon-fa icon-fa-newspaper-o"/>Bài viết
              <span class="icon-fa arrow icon-fa-fw"/>
            </a>
            <router-link to="/admin/blogs/list">Danh sách Bài viết</router-link>
            <router-link to="/admin/blogs/create">Đăng bài viết</router-link>
          </v-collapse-item>

          <v-collapse-item active-url="/admin/comforts">
            <a slot="item-title" href="#">
              <i class="icon-fa icon-fa-bed"/>Tiện ích
              <span class="icon-fa arrow icon-fa-fw"/>
            </a>
            <router-link to="/admin/comforts/list">Danh sách Tiện ích</router-link>
            <router-link to="/admin/comforts/create">Tạo tiện ích</router-link>
          </v-collapse-item>

          <v-collapse-item active-url="/admin/transactions">
            <a slot="item-title" href="#">
              <i class="icon-fa icon-fa-money"/>Sổ quỹ
              <span class="icon-fa arrow icon-fa-fw"/>
            </a>
            <router-link to="/admin/transactions/list">Giao dịch</router-link>
            <router-link to="/admin/transactions/compare-checking">Đối soát</router-link>
          </v-collapse-item>

          <v-collapse-item active-url="/admin/cities">
            <a slot="item-title" href="#">
              <i class="icon-fa icon-fa-map-marker"/>Tỉnh/thành phố
              <span class="icon-fa arrow icon-fa-fw"/>
            </a>
            <router-link to="/admin/cities/list">Danh sách Tỉnh/thành phố</router-link>
            <router-link to="/admin/districts/list">Danh sách Quận/huyện</router-link>
          </v-collapse-item>

          <v-collapse-item active-url="/admin/settings">
            <router-link slot="item-title" to="/admin/settings">
              <i class="icon-fa icon-fa-cogs"/>Settings
            </router-link>
          </v-collapse-item>
        </v-collapse>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions(["changeProId"]),

    openCreateCoupon() {
      this.changeProId(0);
    }
  }
};
</script>
