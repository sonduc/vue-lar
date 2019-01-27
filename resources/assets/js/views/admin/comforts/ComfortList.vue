<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Danh sách tiện ích</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#">Trang chủ</a>
        </li>
        <li class="breadcrumb-item active">Danh sách tiện ích</li>
      </ol>
      <div class="page-actions">
        <router-link :to="{ name: 'comfort.create'}">
          <a style="color:white" class="btn btn-primary">
            <i class="icon-fa icon-fa-plus"/> Thêm mới
          </a>
        </router-link>
      </div>
    </div>
    <div class="mailbox">
      <div class="mailbox-content">
        <lottie v-if="loading" :options="defaultOptions" :height="150" :width="150"></lottie>
        <table v-else class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên tiện ích</th>
              <th>Icon biểu thị</th>
              <th style="text-align:center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(comfort,index) in comforts" :key="index">
              <td width="20%">{{ index+1 }}</td>
              <td width="30%" class="cell-content">
                <div class="content">
                  <div class="content-name">{{ comfort.details.data[0].name }}</div>
                </div>
              </td>
              <td class="cell-content" width="40%">
                <div class="content">
                  <div class="content-name">
                    <img :src="comfort.icon" :alt="comfort.name">
                  </div>
                </div>
              </td>
              <td width="10%" style="text-align:center">
                <div class="btn-group mb-3" role="group" aria-label="First group">
                  <button
                    @click="openUpdateComfort(comfort.id)"
                    v-tooltip.top-center="'Cập nhật tiện ích'"
                    type="button"
                    class="btn btn-sm btn-icon btn-outline-info"
                  >
                    <i class="icon-fa icon-fa-pencil"/>
                  </button>
                  <button
                    @click="deleteComfort(comfort.id)"
                    v-tooltip.top-center="'Xóa tiện ích'"
                    type="button"
                    class="btn btn-sm btn-icon btn-outline-info"
                  >
                    <i class="icon-fa icon-fa-remove"/>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <pagination @clicked="reloadData" :total-pages="totalPages" :current-page="currentPage"/>
      </div>
    </div>
  </div>
</template>

<script>
import Auth from "../../../services/auth";
import Lottie from "vue-lottie";
import * as animationData from "../../loading/material_wave_loading.json";
import Pagination from "../../../components/paginate/ServerPagination";
export default {
  components: {
    Pagination,
    Lottie
  },
  data() {
    return {
      defaultOptions: {
        animationData: animationData
      },
      comforts: [],
      totalPages: null,
      currentPage: null,
      count: null,
      loading: true
    };
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403");
          } else {
            this.getComforts({});
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  },
  methods: {
    async getComforts({ page }) {
      try {
        const response = await axios.get(`comforts`, {
          params: {
            include: "details",
            page: page,
            limit: 10
          }
        });
        let paginate = response.data.meta.pagination;
        this.currentPage = paginate.current_page;
        this.totalPages = paginate.total_pages;
        this.count = paginate.count;
        this.comforts = response.data.data;
        this.loading = false;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    openUpdateComfort(id) {
      this.$router.push({
        name: "comfort.update",
        params: {
          comfortId: id
        }
      });
    },
    async deleteComfort(id) {
      this.$swal({
        title: "Bạn có muốn xóa tiện ích này không ?",
        type: "warning",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Quay lại",
        showCloseButton: true
      }).then(result => {
        if (result.value) {
          let response = axios.delete("comforts/" + id).then(result => {
            if (result) {
              this.reloadData(this.currentPage);
              this.$swal("Success!", "Tiện ích đã xóa thành công !", "success");
            } else {
              this.$swal("Xin lỗi", "Tiện ích chưa được xóa", "error");
            }
          });
        }
      });
    },
    reloadData(page) {
      this.getComforts({
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
    }
  }
};
</script>
