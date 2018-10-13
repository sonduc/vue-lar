<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Form Layouts</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item"><a href="#">Forms</a></li>
        <li class="breadcrumb-item active">Form Layouts</li>
      </ol>
    </div>
    <div class="row" v-if="user">
      <div class="col-sm-12">
        <div class="card">
          <div class="card-header">
            <h6>Basic Form</h6>
          </div>
          <div class="card-body">
            <form @submit.prevent="editUser">
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="inputFirstName">First Name</label>
                  <input
                    id="inputFirstName"
                    type="text"
                    v-model="user.name"
                    class="form-control"
                    placeholder="First Name"
                  >
                </div>
                <div class="form-group col-md-6">
                    <label for="exampleInputEmail">Email address</label>
                    <input
                    id="exampleInputEmail"
                    type="email"
                    v-model="user.email"
                    class="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                    >
                    <small id="emailHelp" class="form-text text-muted">
                    We'll never share your email with
                    anyone else.
                    </small>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                    <label for="inputUserName">Phone Number</label>
                    <input
                    id="inputUserName"
                    type="number"
                    v-model="user.phone"
                    class="form-control"
                    placeholder="Phone number"
                    >
                </div>
                <div class="form-group col-md-6">
                    <label for="inputUserName">Address</label>
                    <input
                    id="inputUserName"
                    type="text"
                    v-model="user.address"
                    class="form-control"
                    placeholder="Address"
                    >
                </div>
              </div>
              <div class="form-group col-md-6">
                <label for="inputUserName">Quyền</label>
                <multiselect 
                  v-model="roles"
                  :allow-empty="true" 
                  name="role" 
                  data-vv-as="Phân quyền" 
                  label="name"
                  :options="role_list" 
                  :searchable="true" 
                  track-by="id" 
                  :multiple="true" 
                  :close-on-select="false"
                  :clear-on-select="false" 
                />
              </div>
              <div class="form-group">
                <label>Gender</label>
                <div>
                  <div class="form-check form-check-inline">
                    <input
                      id="checkMale"
                      class="form-check-input"
                      type="radio"
                      v-model="user.gender"
                      name="gender"
                      value="1"
                    >
                    <label class="form-check-label" for="checkMale">Male</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      id="checkFemale"
                      class="form-check-input"
                      type="radio"
                      v-model="user.gender"
                      name="gender"
                      value="2"
                    >
                    <label class="form-check-label" for="checkFemale">Female</label>
                  </div>
                </div>
              </div>
              
              <button type="submit" class="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>
<script>
import Auth from "../../../services/auth";
import Multiselect from "vue-multiselect";
export default {
  components: {
    Multiselect
  },
  data() {
    return {
      user: null,
      permissions: "user.edit",
      role_list: [],
      roles: []
    };
  },
  watch: {
    roles: {
      handler(val) {
        this.user.roles = [];
        console.log(val);
        val.forEach(element => {
          this.user.roles.push(element.id);
        });
      },
      deep: true
    }
  },
  methods: {
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
    async getUsers() {
      try {
        const response = await axios.get(`users/${this.$route.params.userId}`, {
          params: {
            include: "roles"
          }
        });
        this.roles = response.data.data.roles.data;
        return (this.user = response.data.data);
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    editUser() {
      axios
        .put(`users/${this.$route.params.userId}`, this.user)
        .then(result => {
          if (result) {
            this.$swal("Thành công", "Thông tin đã được cập nhật", "success");
          }
        });
    }
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("permission-denied-403"); // push về page 403
          } else {
            this.getRoles();
            this.getUsers();
          }
        });
      }
    });
  }
};
</script>

