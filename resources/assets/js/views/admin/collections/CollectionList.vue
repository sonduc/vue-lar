<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Collections</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item active"><a href="#">Collections</a></li>
      </ol>
      <div class="page-actions">
        <router-link :to="{ name: 'collection.create'}">
          <a style="color:white" class="btn btn-primary">
            <i class="icon-fa icon-fa-plus" /> Thêm mới collection
          </a>
        </router-link>
      </div>
    </div>

    <div class="mailbox">
      <div class="card">
        <div class="card-header">
          <h6>Bộ lọc</h6>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group row">
                <label for="firstName" class="col-sm-3 col-form-label">
                  Tên bô sưu tập
                </label>
                <div class="col-sm-9">
                  <input
                    @keyup.enter="applyFilter(1)"
                    v-model="params.name"
                    id="firstName"
                    type="text"
                    class="form-control"
                    placeholder="Nhập vào tên bô sưu tập">
                </div>
              </div>
            </div>

            <div class="col-md-12 mt-5">
              <div class="form-group row">
                <div class="col-md-4 row">
                  <label for="email" class="col-sm-3 col-form-label">Trạng thái:</label>
                  <div class="col-sm-9 mt-2 ml-0">
                    <div class="form-check form-check-inline">
                      <input
                        id="inlineCheckbox1"
                        class="form-check-input"
                        type="radio"
                        v-model="params.hot"
                        :value="1"
                        >
                      <label class="form-check-label" for="inlineCheckbox1">Đã duyệt</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        id="inlineCheckbox2"
                        class="form-check-input"
                        type="radio"
                        v-model="params.hot"
                        :value="0">
                    <label class="form-check-label" for="inlineCheckbox2">Đang chờ duyệt</label>
                  </div>
                  </div>
                </div>
                <div class="col-md-4 row">
                  <label for="email" class="col-sm-3 col-form-label">Mới nhất:</label>
                  <div class="col-sm-9 mt-2 ml-0">
                    <div class="form-check form-check-inline">
                      <input
                        id="inlineCheckbox1"
                        class="form-check-input"
                        type="radio"
                        v-model="params.new"
                        :value="1"
                        >
                      <label class="form-check-label" for="inlineCheckbox1">Mới</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        id="inlineCheckbox2"
                        class="form-check-input"
                        type="radio"
                        v-model="params.new"
                        :value="0">
                    <label class="form-check-label" for="inlineCheckbox2">Cũ</label>
                  </div>
                  </div>
                </div>
                <div class="col-md-4 row">
                  <label for="email" class="col-sm-3 col-form-label">Nổi bật:</label>
                  <div class="col-sm-9 mt-2 ml-0">
                    <div class="form-check form-check-inline">
                      <input
                        id="inlineCheckbox1"
                        class="form-check-input"
                        type="radio"
                        v-model="params.hot"
                        :value="1"
                        >
                      <label class="form-check-label" for="inlineCheckbox1">Nổi bật</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        id="inlineCheckbox2"
                        class="form-check-input"
                        type="radio"
                        v-model="params.hot"
                        :value="0">
                    <label class="form-check-label" for="inlineCheckbox2">Không nổi bật</label>
                  </div>
                  </div>
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
        <table class="table table-hover" v-else>
          <thead>
            <tr>
              <th>#</th>
              <th>Ảnh</th>
              <th>Tên bộ sưu tập</th>
              <th>Số lưọng phòng</th>
              <th colspan="2">Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(collection,index) in collections"
              :key="index"
              :class="{'read' : collection.status }">
              <td>{{index+1}}</td>
              <td>{{collection.image}}</td>
              <td>{{collection.details.data[0].name}}</td>
              <td>{{Object.keys(collection.rooms.data).length}}</td>
              <td width="10%">
                <div class="mb-3">
                  Mới nhất
                </div>
                <div class="mb-3">
                  Nổi bật
                </div>
                <div class="mb-3">
                  Trạng thái
                </div>
              </td>
              <td class="cell-fav">
                <div class="content-subject mb-3">
                  <button
                    @click="updateCollectionMinor('new',collection)"
                    type="button"
                    class="btn btn-xs btn-icon btn-light mailbox-action">
                    <i :class="collection.new == 1? 'icon-fa icon-fa-check color-green' : 'icon-fa icon-fa-times color-red'">
                    </i>
                   </button>
                </div>
                <div class="content-subject mb-3">
                  <button
                    @click="updateCollectionMinor('hot',collection)"
                    type="button"
                    class="btn btn-xs btn-icon btn-light mailbox-action">
                    <i :class="collection.hot == 1? 'icon-fa icon-fa-check color-green' : 'icon-fa icon-fa-times color-red'">
                    </i>
                   </button>
                </div>
                <div class="content-subject mb-3">
                  <button
                    @click="updateCollectionMinor('status',collection)"
                    type="button"
                    class="btn btn-xs btn-icon btn-light mailbox-action">
                    <i :class="collection.status == 1? 'icon-fa icon-fa-check color-green' : 'icon-fa icon-fa-times color-red'">
                    </i>
                   </button>
                </div>
              </td>
              <td width="10%" style="text-align:center">
                <div class="btn-group mb-3" role="group" aria-label="First group">
                  <router-link :to="{ name: 'collection.detail',params: { collectionId: collection.id }}">
                    <button
                      v-tooltip.top-center="'Chi tiết collection'"
                      type="button"
                      class="btn btn-sm btn-icon btn-outline-info">
                      <i class="icon-fa icon-fa-search" />
                    </button>
                  </router-link>
                  <router-link :to="{ name: 'collection.update',params: { collectionId: collection.id }}">
                    <button
                      v-tooltip.top-center="'Cập nhật collection'"
                      type="button"
                      class="btn btn-sm btn-icon btn-outline-info">
                      <i class="icon-fa icon-fa-pencil" />
                    </button>
                  </router-link>
                  <button
                    @click="remove(collection.id)"
                    v-tooltip.top-center="'Xóa collection'"
                    type="button"
                    class="btn btn-sm btn-icon btn-outline-info">
                    <i class="icon-fa icon-fa-trash" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <pagination @clicked="reloadData" :total-pages="totalPages" :current-page="currentPage" />
      </div>
    </div>
  </div>
</template>
<script>
import { SweetModal } from "sweet-modal-vue";
import Datepicker from "vuejs-datepicker";
import Multiselect from "vue-multiselect";
import Auth from "../../../services/auth";
import VueSlider from "vue-slider-component";
import Lottie from "vue-lottie";
import * as animationData from "../../loading/material_wave_loading.json";
import Pagination from "../../../components/paginate/ServerPagination";
import { format, constant, location } from "../../../helpers/mixins";

export default {
  mixins: [format, constant, location],
  components: {
    Pagination,
    Multiselect,
    Datepicker,
    SweetModal,
    VueSlider,
    Lottie
  },
  data() {
    return {
      defaultOptions: { animationData: animationData },
      permissions: "collection.view",
      collections:[],
      collection:{},
      loading: true,
      params:{
        name:null,
        status:null,
        new:null,
        hot:null,
      },
      countRoom:null,
      getStatus: ['Select option', 'options', ],
      getNews: ['Select option', 'options',],
      currentPage: null,
      totalPages: null,
      count: null,
    }
  },
  install(Vue, options) {
    Vue.component("SweetModal", SweetModal);
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permission).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403");
          } else {
            this.allCollection({});
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  },
  methods: {
    async allCollection({ page, filter, sort }) {
      try {
        const response = await axios.get(`collections`,{
          params:{
            include:'details,rooms.details',
            page:page,
            new:this.params.new,
            hot: this.params.hot,
            status:this.params.status,
            name: this.params.name,
          }
        });
        let paginate = response.data.meta.pagination;
        this.currentPage = paginate.current_page;
        this.totalPages = paginate.total_pages;
        this.count = paginate.count;
        this.collections = response.data.data;
        this.loading = false;
        // console.log(response.data.data)
        return {
          data: response.data.data,
          pagination: {
            totalPages: paginate.total_pages,
            currentPage: page,
            count: paginate.count
          }
        };
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    reloadData(page) {
      this.allCollection({
        page
      });
    },
    async updateCollectionMinor(option, collection) {
      if (option === "hot") {
        let response = await axios
          .put(`collections/single-update/${collection.id}?option=${option}`, {
            hot: collection.hot == 1 ? 0 : 1
          })
          .then(result => {
            if (result) {
              this.reloadData(this.currentPage);

              window.toastr["success"]("Cập nhật thành công!", "Success");
            } else {
              window.toastr["error"]("Something wrong!", "Error");
            }
          });
      } else if (option === "new") {
        let response = await axios
          .put(`collections/single-update/${collection.id}?option=${option}`, {
            new: collection.new == 1 ? 0 : 1
          })
          .then(result => {
            if (result) {
              this.reloadData(this.currentPage);

              window.toastr["success"]("Cập nhật thành công!", "Success");
            } else {
              window.toastr["error"]("Something wrong!", "Error");
            }
          });
      } else if (option === "status") {
        let response = await axios
          .put(`collections/single-update/${collection.id}?option=${option}`, {
            status: collection.status == 1 ? 0 : 1
          })
          .then(result => {
            if (result) {
              this.reloadData(this.currentPage);
              window.toastr["success"]("Cập nhật thành công!", "Success");
            } else {
              window.toastr["error"]("Something wrong!", "Error");
            }
          });
      }
    },
    applyFilter(page) {
      this.allCollection({
        page
      });
    },
    resetFilter(page){
      this.params.name = null;
      this.params.status = null;
      this.params.new = null;
      this.params.hot = null;
      this.allCollection({
        page
      });
    },
    remove(id) {
      console.log(id)
      this.$swal({
        title: "Bạn có muốn xóa bộ sưu tập không không",
        type: "info",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Quay lại",
        showCloseButton: true,
        showLoaderOnConfirm: true
      })
      .then((result) => {
        if (result.value) {
          axios.delete('collections/'+id).then(response => {
            window.toastr["success"]("Xóa thành công", "Success");
            this.reloadData(this.currentPage);
          })
        }
      });
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
}
</script>
<style scoped>
.color-green{
  color: green;
}
.color-red{
  color: red;
}
</style>
