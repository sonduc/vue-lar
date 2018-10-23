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
                    v-model="params.name"
                    id="firstName"
                    type="text"
                    class="form-control"
                    placeholder="Nhập vào tên bô sưu tập">
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group row">
                <label for="email" class="col-sm-2 col-form-label">
                  Trạng thái
                </label>
                <div class="col-sm-4">
                  <multiselect
                    v-model="params.status"
                    :options="getNews"
                    :searchable="false"
                    :close-on-select="true"
                    :show-labels="false"
                    placeholder="Pick a value"/>
                </div>
                <label for="email" class="col-sm-2 col-form-label">
                  New
                </label>
                <div class="col-sm-4">
                  <multiselect
                    v-model="params.new"
                    :options="getStatus"
                    :searchable="false"
                    :close-on-select="true"
                    :show-labels="false"
                    placeholder="Pick a value"/>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group row">
                <label for="email" class="col-sm-2 col-form-label">
                  Hot
                </label>
                <div class="col-sm-4">
                  <multiselect
                    v-model="params.hot"
                    :options="getNews"
                    :searchable="false"
                    :close-on-select="true"
                    :show-labels="false"
                    placeholder="Pick a value"/>
                </div>
              </div>
            </div>
          </div>

          <button @click="" class="btn btn-success btn-sm">Áp dụng</button>
          <button @click="" class="btn btn-info btn-sm">Làm mới</button>
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
                  Collection cũ
                </div>
                <div class="mb-3">
                  Collection hot
                </div>
                <div class="mb-3">
                  Trạng thái
                </div>
              </td>
              <td class="cell-fav">
                <div class="content-subject mb-3">
                  <button type="button" class="btn btn-xs btn-icon btn-light mailbox-action">
                    <i :class="collection.new == 1? 'icon-fa icon-fa-check' : 'icon-fa icon-fa-times'">
                    </i>
                   </button>
                </div>
                <div class="content-subject mb-3">
                  <button type="button" class="btn btn-xs btn-icon btn-light mailbox-action">
                    <i :class="collection.hot == 1? 'icon-fa icon-fa-check' : 'icon-fa icon-fa-times'">
                    </i>
                   </button>
                </div>
                <div class="content-subject mb-3">
                  <button type="button" class="btn btn-xs btn-icon btn-light mailbox-action">
                    <i :class="collection.status == 1? 'icon-fa icon-fa-check' : 'icon-fa icon-fa-times'">
                    </i>
                   </button>
                </div>
              </td>
              <td width="10%" style="text-align:center">
                <div class="btn-group mb-3" role="group" aria-label="First group">
                  <button
                    v-tooltip.top-center="'Chi tiết collection'"
                    type="button"
                    class="btn btn-sm btn-icon btn-outline-info">
                    <i class="icon-fa icon-fa-search" />
                  </button>
                  <button
                    v-tooltip.top-center="'Cập nhật collection'"
                    type="button"
                    class="btn btn-sm btn-icon btn-outline-info">
                    <i class="icon-fa icon-fa-pencil" />
                  </button>
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
        name:'',
        status:'',
        new:'',
        hot:'',
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
        console.log(response.data.data)
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
