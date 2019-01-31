<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Quận/huyện</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#">Trang chủ</a>
        </li>
        <li class="breadcrumb-item active">Danh sách quận/huyện</li>
      </ol>
    </div>
    <div class="mailbox">
      <div class="card">
        <div class="card-header">
          <h6>Bộ lọc</h6>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-12">
              <div class="form-group row">
                <label for="firstName" class="col-sm-2 col-form-label">Tên quận/huyện</label>
                <div class="col-sm-10">
                  <input
                    v-model="name"
                    id="firstName"
                    type="text"
                    class="form-control"
                    placeholder="Nhập tên..."
                  >
                </div>
              </div>
            </div>
          </div>
          <button @click="applyFilter(1)" class="btn btn-success btn-sm">Áp dụng</button>
          <button @click="resetFilter(1)" class="btn btn-info btn-sm">Làm mới</button>
        </div>
      </div>

      <div class="mailbox-content">
        <lottie v-if="loading" :options="defaultOptions" :height="150" :width="150"></lottie>
        <table v-else class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên</th>
              <th colspan="2" style="text-align: center;">Trạng thái</th>
              <th style="text-align: center;">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(district,index) in districts"
              :key="index"
            >
              <td width="20%">{{index+1}}</td>
              <td  width="50%" class="cell-content">
                <div class="content">
                  <div class="content-name">{{ district.name }}</div>
                </div>
              </td>
              <td width="10%">
               <div class="mb-3">Trạng thái</div>
                <div class="mb-3">Nổi bật</div>
                <div class="mb-3">Độ ưu tiên</div>
              </td>
              <td class="cell-fav">
                <div class="content-subject mb-3">
                  <button
                    @click="updateDistrictMinor('status',district)"
                    v-if="district.status == 0"
                    type="button"
                    v-tooltip.top-center="'Quận/huyện không khả dụng (click để cập nhật)'"
                    class="btn btn-xs btn-icon btn-danger mailbox-action"
                  >
                    <i class="icon-fa icon-fa-times"></i>
                  </button>
                  <button
                    @click="updateDistrictMinor('status',district)"
                    v-if="district.status == 1"
                    type="button"
                    v-tooltip.top-center="'Quận/huyện khả dụng (click để cập nhật)'"
                    class="btn btn-xs btn-icon btn-success mailbox-action"
                  >
                    <i class="icon-fa icon-fa-check"></i>
                  </button>
                </div>
                <div class="content-subject mb-3">
                  <button
                    @click="updateDistrictMinor('hot',district)"
                    v-if="district.hot == 0"
                    type="button"
                    v-tooltip.top-center="'Quận/huyện không nổi bật (click để cập nhật)'"
                    class="btn btn-xs btn-icon btn-danger mailbox-action"
                  >
                    <i class="icon-fa icon-fa-times"></i>
                  </button>
                  <button
                    @click="updateDistrictMinor('hot',district)"
                    v-if="district.hot == 1"
                    type="button"
                    v-tooltip.top-center="'Quận/huyện nổi bật (click để cập nhật)'"
                    class="btn btn-xs btn-icon btn-success mailbox-action"
                  >
                    <i class="icon-fa icon-fa-check"></i>
                  </button>
                </div>

                <div class="content-subject mb-3">
                  <button
                    style="width: 37px;"
                    @click="updateDistrictMinor('priority',district)"
                    v-if="district.priority == 0"
                    type="button"
                    v-tooltip.top-center="'Mức độ ưu tiên 0 (click để cập nhật lên 1)'"
                    class="btn btn-xs btn-icon btn-danger mailbox-action"
                  >0
                  </button>
                  <button
                    style="width: 37px;"
                    @click="updateDistrictMinor('priority',district)"
                    v-if="district.priority == 1"
                    v-tooltip.top-center="'Mức độ ưu tiên 1 (click để cập nhật lên 2)'"
                    type="button"
                    class="btn btn-xs btn-icon btn-warning mailbox-action"
                  >1
                  </button>
                  <button
                    style="width: 37px;"
                    @click="updateDistrictMinor('priority',district)"
                    v-if="district.priority == 2"
                    v-tooltip.top-center="'Mức độ ưu tiên 2 (click để cập nhật lên 3)'"
                    type="button"
                    class="btn btn-xs btn-icon btn-primary mailbox-action"
                  >2
                  </button>
                  <button
                    style="width: 37px;"
                    @click="updateDistrictMinor('priority',district)"
                    v-if="district.priority == 3"
                    v-tooltip.top-center="'Mức độ ưu tiên 3 (click để cập nhật xuống 0)'"
                    type="button"
                    class="btn btn-xs btn-icon btn-success mailbox-action"
                  >3
                  </button>
                </div>
              </td>

              <td width="20%" style="text-align: center;">
                <div class="btn-group" role="group" aria-label="First group">
                  <button
                    @click="openUpdateDistrict(district.id)"
                    type="button"
                    v-tooltip.top-center="'Cập nhật quận/huyện'"
                    class="btn btn-sm btn-icon btn-outline-primary"
                  >
                    <i class="icon-fa icon-fa-pencil"/>Cập nhật
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
import { SweetModal } from "sweet-modal-vue";
import Auth from "../../../services/auth";
import Lottie from "vue-lottie";
import * as animationData from "../../loading/material_wave_loading.json";
import Pagination from "../../../components/paginate/ServerPagination";
export default {
  components: {
    Pagination,
    SweetModal,
    Lottie
  },
  data() {
    return {
      defaultOptions: {
        animationData: animationData
      },
      districts: [],
      name: "",
      totalPages: null,
      currentPage: null,
      count: null,
      loading: true,
      permissions: "district.view"
    };
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403");
          } else {
            this.getDistricts({});
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  },
  methods: {
    async getDistricts({ page }) {
      try {
        const response = await axios.get(`districts`, {
          params: {
            page: page,
            limit: 5,
            q: this.name,
          }
        });
        let paginate = response.data.meta.pagination;
        this.currentPage = paginate.current_page;
        this.totalPages = paginate.total_pages;
        this.count = paginate.count;
        this.districts = response.data.data;
        this.loading = false;
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu quận/huyện hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
        }
      }
    },
    async updateDistrictMinor(option, district) {
      if (option === "status") {
        let response = await axios
          .put(`districts/prop-update/${district.id}?option=${option}`, {
            status: district.status == 1 ? 0 : 1
          })
          .then(result => {
            if (result) {
              this.reloadData(this.currentPage);
              window.toastr["success"](
                "Cập nhật trạng thái thành công !",
                "Success"
              );
            } else {
              window.toastr["error"](
                "Cập nhật trạng thái xảy ra lỗi !",
                "Error"
              );
            }
          });
      } else if (option === "hot") {
        let response = await axios
          .put(`districts/prop-update/${district.id}?option=${option}`, {
            hot: district.hot == 1 ? 0 : 1
          })
          .then(result => {
            if (result) {
              this.reloadData(this.currentPage);
              window.toastr["success"]("Cập nhật nổi bật thành công !", "Success");
            } else {
              window.toastr["error"]("Cập nhật nổi bật xảy ra lỗi !", "Error");
            }
          });
      }
      else if (option === "priority") {
        let priorityStatus;
        if (district.priority == 0) {
          priorityStatus = 1;
        } else if (district.priority == 1) {
          priorityStatus = 2;
        } else if (district.priority == 2) {
          priorityStatus = 3;
        } else if (district.priority == 3) {
          priorityStatus = 0;
        }
        let response = await axios
          .put(`districts/prop-update/${district.id}?option=${option}`, {
            priority: priorityStatus
          })
          .then(result => {
            if (result) {
              this.reloadData(this.currentPage);
              window.toastr["success"]("Cập nhật ưu tiên thành công !", "Success");
            } else {
              window.toastr["error"]("Cập nhật nổi bật xảy ra lỗi !", "Error");
            }
          });
      }
    },
    openUpdateDistrict(id) {
      this.$router.push({
        name: "district.update",
        params: {
          districtId: id
        }
      });
    },
    applyFilter(page) {
      this.getDistricts({
        page
      });
    },
    resetFilter(page) {
      this.name = "";
      this.getDistricts({
        page
      });
    },
    reloadData(page) {
      this.getDistricts({
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
