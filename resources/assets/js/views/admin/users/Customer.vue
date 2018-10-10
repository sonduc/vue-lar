<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Users</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item"><a href="#">Users</a></li>
        <li class="breadcrumb-item active">Users</li>
      </ol>
      <div class="page-actions">
        <a @click="$refs.dark_html_modal.open()" style="color:white" class="btn btn-primary">
          <i class="icon-fa icon-fa-plus" /> New User
        </a>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <div class="card-header">
            <h6>All Users</h6>
            <div class="card-actions" />
          </div>
          <div class="card-body">
            <table-component :data="getUsers" sort-by="row.name" sort-order="desc" table-class="table">
              <table-column show="id" label="ID" />
              <table-column show="name" label="Name" />
              <table-column show="email" label="Email" />
              <table-column show="type_txt" label="Role" />
              <table-column show="status_txt" label="Status" />
              <table-column :sortable="true" :filterable="true" label="Actions">
                <template slot-scope="row">
                  <div class="table__actions">
                    <router-link :to="{ name: 'user.profile', params: { userId: row.id }}">
                      <a class="btn btn-default btn-sm">
                        <i class="icon-fa icon-fa-search" /> View
                      </a>
                    </router-link>
                    <router-link :to="{ name: 'user.edit', params: { userId: row.id }}">
                      <a class="btn btn-default btn-sm">
                        <i class="icon-fa icon-fa-search" /> Edit
                      </a>
                    </router-link>
                    <a class="btn btn-default btn-sm" data-delete data-confirmation="notie" @click="deleteUser(row.id)">
                      <i class="icon-fa icon-fa-trash" /> Delete
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
      <sweet-modal ref="dark_html_modal" modal-theme="light" title="Create User" overlay-theme="dark">
        <div class="col-sm-12">
          <form @submit.prevent="createUser" id="needs-validation" novalidate="novalidate" class="was-validated">
            <div class="form-group">
              <label for="firstName">Name</label>
              <input name="Name" id="firstName" type="text" required="required" placeholder="First name" v-validate="'required'" class="form-control is-valid">
              <div v-if="errors.has('Name')" class="invalid-feedback">
                {{errors.first('Name')}}
              </div>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input name="Email" id="email" type="text" required="required" v-validate="'required|email'" class="form-control is-valid">
              <div v-if="errors.has('Email')" class="invalid-feedback">
                {{errors.first('Email')}}
              </div>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input name="Password" id="password" type="password" required="required" v-validate="'required|min:6'" class="form-control is-valid">
              <div v-if="errors.has('Password')" class="invalid-feedback">
                {{errors.first('Password')}}
              </div>
            </div>
            <button type="submit" class="btn btn-success">Save</button>
          </form>
        </div>
      </sweet-modal>
      <!-- End new user -->
    </div>
  </div>
</template>

<script type="text/babel">
import { TableComponent, TableColumn } from "vue-table-component";
import { SweetModal } from "sweet-modal-vue";
import Auth from "../../../services/auth";

export default {
  components: {
    TableComponent,
    TableColumn,
    SweetModal
  },
  data() {
    return {
      users: [],
      user: {
        name: null,
        email: null,
        password: null
      }
    };
  },
  install(Vue, options) {
    Vue.component("SweetModal", SweetModal);
  },
  methods: {
    async getUsers({ page, filter, sort }) {
      try {
        const response = await axios.get(
          `users?type=0&page=${page}`
        );
        let paginate = response.data.meta.pagination;
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
      this.$validator.validateAll().then(result => {
        if (result) {
          axios
            .post("users", {
              name: this.user.name,
              email: this.user.email,
              password: this.user.password,
              password_confirmation: this.user.password
            })
            .then(response => {
              if (response) {
                this.$swal("Success", "Success", "success");
              } else {
                this.$swal("Failed", "Some errors", "error");
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
            this.$router.push("permission-denied-403");
          } else {
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
