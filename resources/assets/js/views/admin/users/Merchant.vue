<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Users</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#">Home</a>
        </li>
        <li class="breadcrumb-item">
          <a href="#">Merchant</a>
        </li>
        <li class="breadcrumb-item active">List</li>
      </ol>
    </div>
    <div class="mailbox">
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-md-6 col-sm-6 col-lg-6 col-xs-12">
              <div class="form-group row">
                <label for="firstName" class="col-sm-2 col-md-3 col-form-label">Tìm kiếm</label>
                <div class="col-sm-10 col-md-9">
                  <input
                    v-model="q"
                    id="firstName"
                    type="text"
                    class="form-control"
                    placeholder="Nhập vào thông tin tìm kiếm"
                  >
                </div>
              </div>
            </div>
          </div>
          <button @click="applyFilter(1)" class="btn btn-success btn-sm">Áp dụng</button>
          <button @click="resetFilter(1)" class="btn btn-info btn-sm">Làm mới</button>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header">
              <h6>All Users</h6>
              <div class="card-actions"/>
            </div>
            <div class="card-body">
              <table-component
                v-if="data_users !== null"
                :data="data_users"
                sort-by="row.name"
                sort-order="desc"
                table-class="table"
              >
                <table-column show="id" label="ID"/>
                <table-column show="name" label="Name"/>
                <table-column show="email" label="Email"/>
                <table-column show="type_txt" label="Role"/>
                <table-column label="Status" :sortable="false" :filterable="false">
                  <template slot-scope="row">
                    <button
                      :class="row.status == 0 ? 'btn btn-danger btn-sm' : 'btn btn-success btn-sm'"
                    >{{row.status_txt}}</button>
                  </template>
                </table-column>
                <table-column :sortable="true" :filterable="true" label="Actions">
                  <template slot-scope="row">
                    <div class="table__actions">
                      <router-link :to="{ name: 'user.profile.edit', params: { userId: row.id }}">
                        <a class="btn btn-default btn-sm">
                          <i class="icon-fa icon-fa-search"/> View
                        </a>
                      </router-link>
                      <router-link :to="{ name: 'user.edit', params: { userId: row.id }}">
                        <a class="btn btn-default btn-sm">
                          <i class="icon-fa icon-fa-pencil"/> Edit
                        </a>
                      </router-link>
                    </div>
                  </template>
                </table-column>
              </table-component>
            </div>

            <div class="card-footer">
              <pagination
                @clicked="reloadData"
                :total-pages="totalPages"
                :current-page="currentPage"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- All Modal Here -->
  </div>
</template>

<script type="text/babel">
import { TableComponent, TableColumn } from "vue-table-component";
import { SweetModal } from "sweet-modal-vue";
import Auth from "../../../services/auth";
import Pagination from "../../../components/paginate/ServerPagination";

export default {
  components: {
    TableComponent,
    TableColumn,
    SweetModal,
    Pagination
  },
  data() {
    return {
      data_users: [],
      users: [],
      q: null,
      user: {
        name: null,
        email: null,
        password: null
      },
      totalPages: null,
      currentPage: null,
      count: null,
      permissions: "user.view"
    };
  },
  install(Vue, options) {
    Vue.component("SweetModal", SweetModal);
  },
  methods: {
    async getUsers({ page, filter, sort }) {
      try {
        const response = await axios.get(`users?type=1&page=${page}`, {
          params: {
            q: this.q
          }
        });
        let paginate = response.data.meta.pagination;
        this.data_users = response.data.data;
        this.currentPage = paginate.current_page;
        this.totalPages = paginate.total_pages;
        this.count = paginate.count;
        // return {
        //   data: response.data.data,
        //   pagination: {
        //     totalPages: paginate.total_pages,
        //     currentPage: page,
        //     count: paginate.count
        //   }
        // };
      } catch (error) {
        if (error) {
          window.toastr["error"]("Không lấy được dữ liệu chủ nhà", "Error");
        }
      }
    },
    deleteUser(id) {
      let self = this;
      window.notie.confirm({
        text: "Are you sure?",
        cancelCallback: function() {
          window.toastr["info"]("Cancel");
        },
        submitCallback: function() {
          self.deleteUserData(id);
        }
      });
    },
    async deleteUserData(id) {
      try {
        let response = await window.axios.delete("/api/users/" + id);
        this.users = response.data;
        window.toastr["success"]("User Deleted", "Success");
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    redirectUserDetail(id) {
      this.$router.push("/admin/users/profile/" + id);
    },
    applyFilter(page) {
      this.getUsers({
        page
      });
    },
    resetFilter(page) {
      this.q = null;
      this.getUsers({
        page
      });
    },
    reloadData(page) {
      this.getUsers({
        page
      });
    }
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403");
          } else {
            this.getUsers({});
          }
        });
      }
    });
  }
};
</script>
<style scoped>
.swal2-container {
  z-index: 10000;
}
.sweet-modal-overlay {
  z-index: 1000;
}
</style>
