<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Roles</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item active"><a href="#">Roles</a></li>
      </ol>
      <div class="page-actions">
        <router-link :to="{ name: 'role.create'}">
          <a style="color:white" class="btn btn-primary">
            <i class="icon-fa icon-fa-plus" /> Thêm mới role
          </a>
        </router-link>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h6>Roles</h6>
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
                <router-link :to="{ name: 'role.update', params: { roleId: row.id }}">
                  <a class="btn btn-default btn-sm">
                    <i class="icon-fa icon-fa-search" /> Edit
                  </a>
                </router-link>
                <a class="btn btn-default btn-sm" href="#">
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
      <!-- Modal New User -->
      <!-- <sweet-modal ref="dark_html_modal" modal-theme="light" title="Create Role" overlay-theme="dark">
        <div class="col-sm-12">
          <form @submit.prevent="">
            <div class="form-group row">
              <label for="firstName" class="col-sm-3 col-form-label">Name *</label>
            </div>
            <button type="submit" class="btn btn-success">Save</button>
          </form>
        </div>
      </sweet-modal> -->
      <!-- End new user -->
    </div>
    <!-- <dialog-confirm v-model="dialogDelete" @input="remove" /> -->
  </div>
</template>

<script>
import { TableComponent, TableColumn } from 'vue-table-component';
import { SweetModal } from "sweet-modal-vue";
import Auth from "../../../services/auth";
import Pagination from "../../../components/paginate/ServerPagination";
import DialogConfirm from "../../../components/DialogConfirm";
import { format, constant } from "../../../helpers/mixins";

export default {
  components: {
    TableComponent,
    TableColumn,
    SweetModal,
    DialogConfirm,
  },
  data() {
    return{
      permission: "role.view",
      roles:[],
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
            this.$router.push("permission-denied-403");
          } else {
            this.getRoles({});
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  },
  methods: {
    async getRoles({ page, filter, sort }) {
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
