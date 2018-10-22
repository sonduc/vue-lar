<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Danh sách quyền</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Trang chủ</a></li>
        <li class="breadcrumb-item active"><a href="#">Phân Quyền</a></li>
      </ol>
      <div class="page-actions">
        <router-link :to="{ name: 'role.create'}">
          <a style="color:white" class="btn btn-primary">
            <i class="icon-fa icon-fa-plus" /> Thêm mới
          </a>
        </router-link>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h6>Danh sách quyền người dùng</h6>
      </div>
      <div class="card-body">
        <table-component
          :data="roles"
          table-class="table"
          sort-by="songs"
          sort-order="asc" >
          <table-column
            show="id"
            label="#"/>
          <table-column
            show="name"
            label="name"/>
          <table-column
            show="slug"
            label="slug"/>
          <table-column
            :sortable="false"
            :filterable="false"
            label="Action">
            <template slot-scope="row">
              <div class="table__actions">
                <a class="btn btn-default btn-sm" @click="showDetail(row.id)">
                    <i class="icon-fa icon-fa-eye" /> Show
                </a>
                <router-link :to="{ name: 'role.update', params: { roleId: row.id }}">
                  <a class="btn btn-default btn-sm">
                    <i class="icon-fa icon-fa-search" /> Edit
                  </a>
                </router-link>
                <a class="btn btn-default btn-sm" @click="remove(row.id)">
                  Delete
                </a>
              </div>
            </template>
          </table-column>
        </table-component>
      </div>
    </div>

    <!-- All Modal Here -->
    <div class="row">
      <!-- Modal Detail Role -->
      <sweet-modal
        ref="dark_html_modal"
        modal-theme="light"
        :title="'Tên quyền: '+this.role.name"
        overlay-theme="dark">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nhóm</th>
              <th>Quyền hạn</th>
            </tr>
          </thead>
          <tbody>
            <tr
              :key="index"
              v-for="(per,index) in this.role.pers">
              <td>{{index+1}}</td>
              <td>{{per.group}}</td>
              <td>{{per.slug}}</td>
            </tr>
          </tbody>
        </table>
      </sweet-modal>
      <!-- End Detail Role -->
    </div>
  </div>
</template>

<script>
import { TableComponent, TableColumn } from 'vue-table-component';
import { SweetModal } from "sweet-modal-vue";
import Auth from "../../../services/auth";
import Pagination from "../../../components/paginate/ServerPagination";
import { format, constant } from "../../../helpers/mixins";

export default {
  components: {
    TableComponent,
    TableColumn,
    SweetModal,
  },
  data() {
    return{
      permission: "role.view",
      roles:[],
      role:{},
      currentPage: null,
      totalPages: null,
      count: null,
      dialogDelete: false
    };
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
            this.allRole({});
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  },
  methods: {
    async allRole({ page, filter, sort }) {
      try {
        const response = await axios.get(`roles`,{
          params:{
            include:'pers',
            page:page,
          }
        });
        let paginate = response.data.meta.pagination;
        this.currentPage = paginate.current_page;
        this.totalPages = paginate.total_pages;
        this.count = paginate.count;
        this.roles = response.data.data;
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
    async showDetail(id){
      this.$refs.dark_html_modal.open();
      try {
        const response = await axios.get(`roles/`+id, {
          params: {
            include:"pers"
          }
        });
        this.role = response.data.data
        // console.log(response.data.data)
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    reloadData(page) {
      this.allRole({
        page
      });
    },
    remove(id) {
      console.log(id)
      this.$swal({
        title: "Bạn có muốn xóa quyền không",
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
          axios.delete('roles/'+id).then(response => {
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
  }
}
</script>
