<template>
  <div class="main-content">
    <div class="page-header">
      <h4 class="page-title">Quản lý Admin</h4>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#">Trang chủ</a>
        </li>
        <li class="breadcrumb-item">
          <a href="#">Người dùng</a>
        </li>
        <li class="breadcrumb-item active">Admin</li>
      </ol>
      <div class="page-actions">
        <a @click="$refs.create_user.open()" style="color:white" class="btn btn-primary">
          <i class="icon-fa icon-fa-plus"/> Tạo mới
        </a>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <div class="card-header">
            <h6>Danh sách người dùng</h6>
            <div class="card-actions"/>
          </div>
          <div class="card-body">
            <table-component
              :data="getUsers"
              sort-by="row.name"
              ref="table"
              sort-order="desc"
              table-class="table"
            >
              <table-column show="id" label="ID"/>
              <table-column show="name" label="Tên"/>
              <table-column show="email" label="Email"/>
              <table-column show="type_txt" label="Quyền,"/>
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
                    <router-link :to="{ name: 'user.profile', params: { userId: row.id }}">
                      <a class="btn btn-default btn-sm">
                        <i class="icon-fa icon-fa-search"/> Chi Tiết
                      </a>
                    </router-link>
                    <router-link :to="{ name: 'user.edit', params: { userId: row.id }}">
                      <a class="btn btn-default btn-sm">
                        <i class="icon-fa icon-fa-search"/> Sửa
                      </a>
                    </router-link>
                    <a
                      class="btn btn-default btn-sm"
                      data-delete
                      data-confirmation="notie"
                      @click="deleteUser(row.id)"
                    >
                      <i class="icon-fa icon-fa-trash"/> Xoá
                    </a>
                  </div>
                </template>
              </table-column>
            </table-component>
          </div>
        </div>
      </div>
    </div>
    <!-- All Modal Here -->
    <div class="row">
      <!-- Modal New User -->
      <sweet-modal ref="create_user" modal-theme="light" title="Create User" overlay-theme="dark">
        <div class="col-sm-12">
          <form @submit.prevent="createUser">
            <div class="form-group row">
              <label
                for="firstName"
                style="errors.has('name') ? 'color:red;' : ''"
                class="col-sm-3 col-form-label"
              >
                {{errors.has('name')
                ? errors.first('name') : 'Name *'}}
              </label>
              <div class="col-sm-9">
                <input
                  v-model="user.name"
                  id="firstName"
                  v-validate="'required'"
                  type="text"
                  name="name"
                  data-vv-as="Tên"
                  class="form-control"
                  placeholder="Full name"
                >
              </div>
            </div>
            <div class="form-group row">
              <label
                for="email"
                style="errors.has('email') ? 'color:red;' : ''"
                class="col-sm-3 col-form-label"
              >
                {{errors.has('email')
                ? errors.first('email') : 'Email *'}}
              </label>
              <div class="col-sm-9">
                <input
                  v-model="user.email"
                  v-validate="'required|email'"
                  id="email"
                  type="email"
                  class="form-control"
                  name="email"
                  data-vv-as="Email"
                  placeholder="Email"
                >
              </div>
            </div>
            <div class="form-group row">
              <label
                for="lastName"
                style="errors.has('password') ? 'color:red;' : ''"
                class="col-sm-3 col-form-label"
              >
                {{errors.has('password')
                ? errors.first('password') : 'Password *'}}
              </label>
              <div class="col-sm-9">
                <input
                  v-validate="'required'"
                  data-vv-as="Mật khẩu"
                  name="password"
                  v-model="user.password"
                  type="password"
                  class="form-control"
                  placeholder="Mật khẩu"
                >
              </div>
            </div>
            <!-- <div class="form-group row">
              <label for="lastName" style="errors.has('password_confirm') ? 'color:red;' : ''" class="col-sm-3 col-form-label">{{errors.has('password_confirm')
                ? errors.first('password_confirm') : 'Password Confirm *'}}</label>
              <div class="col-sm-9">
                <input v-validate="'required|confirmed:password'" name="password_confirm" data-vv-as="Nhập lại mật khẩu"
                  v-model="user.password_confirmation" type="password" class="form-control" placeholder="Nhập lại mật khẩu">
              </div>
            </div>-->
            <div class="form-group row">
              <label
                for="lastName"
                style="errors.has('role') ? 'color:red;' : ''"
                class="col-sm-3 col-form-label"
              >
                {{errors.has('role')
                ? errors.first('role') : 'Phân Quyền *'}}
              </label>
              <div class="col-sm-9">
                <multiselect
                  :allow-empty="true"
                  name="role"
                  data-vv-as="Phân quyền"
                  v-model="roles"
                  label="name"
                  :options="role_list"
                  :searchable="true"
                  track-by="id"
                  :multiple="true"
                  :close-on-select="false"
                  :clear-on-select="false"
                />
              </div>
            </div>
            <div class="form-group row">
              <label for="lastName" class="col-sm-3 col-form-label">Loại người dùng</label>
              <div class="col-sm-9">
                <div class="custom-control custom-checkbox">
                  <input
                    v-model.number="user.type"
                    id="customControlValidation1"
                    type="checkbox"
                    class="custom-control-input"
                    :true-value="2"
                    required
                  >
                  <label class="custom-control-label" for="customControlValidation1">Admin</label>
                </div>
              </div>
            </div>
            <button type="submit" class="btn btn-success">Tạo tài khoản</button>
          </form>
        </div>
      </sweet-modal>
      <!-- End new user -->
    </div>
  </div>
</template>

<script>
import { TableComponent, TableColumn } from "vue-table-component";
import { SweetModal } from "sweet-modal-vue";
import Auth from "../../../services/auth";
import Multiselect from "vue-multiselect";
export default {
  components: {
    TableComponent,
    TableColumn,
    SweetModal,
    Multiselect
  },
  data() {
    return {
      users: [],
      user: {
        name: null,
        email: null,
        password: null,
        password_confirmation: null,
        type: 2,
        roles: []
      },
      current_page: 1,
      role_list: [],
      roles: [],
      permissions: "user.view"
    };
  },
  watch: {
    roles: {
      handler(val) {
        this.user.roles = [];
        val.forEach(element => {
          this.user.roles.push(element.id);
        });
      },
      deep: true
    }
  },

  methods: {
    async getUsers({ page, filter, sort }) {
      try {
        const response = await axios.get(`users?type=2&page=${page}`);
        let paginate = response.data.meta.pagination;
        this.current_page = page;
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
    async getRoles() {
      try {
        const response = await axios.get(`roles`);
        this.role_list = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
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
    createUser() {
      let per = "user.create";
      this.$validator.validateAll().then(result => {
        if (result) {
          Auth.getProfile().then(res => {
            if (res) {
              Auth.canAccess(res, per).then(response => {
                if (!response) {
                  this.$swal(
                    "Xin lỗi",
                    "Bạn không có quyền thực hiện tác vụ này",
                    "error"
                  );
                } else {
                  axios
                    .post("users", {
                      name: this.user.name,
                      email: this.user.email,
                      password: this.user.password,
                      password_confirmation: this.user.password,
                      type: 2,
                      roles: this.user.role
                    })
                    .then(response => {
                      this.$swal({
                        title: "Thành công",
                        text: "Đã tạo người dùng mới",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonText: "OK",
                        cancelButtonText: "Quay lại",
                        showCloseButton: false,
                        showLoaderOnConfirm: true
                      }).then(result => {
                        let page = this.current_page;
                        this.getUsers({ page });
                        this.$refs.create_user.close();
                        this.$refs.table.refresh();
                      });
                    })
                    .catch(error => {
                      let err = error.response.data.data.errors;
                      let err_array = Object.values(err);
                      let err_txt = "";
                      err_array.forEach(function(element) {
                        err_txt += element + "; ";
                      });
                      window.toastr["error"](err_txt, "Error");
                    });
                }
              });
            }
          });
          return;
        }
        this.$swal("Failed", "Some errors", "error");
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
            this.getRoles();
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
