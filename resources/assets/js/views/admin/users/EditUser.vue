<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">User Update</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item"><a href="#">Users</a></li>
        <li class="breadcrumb-item active">User Update</li>
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
                  <label for="inputFirstName">Name</label>
                  <input
                    id="inputFirstName"
                    type="text"
                    v-model="user.name"
                    class="form-control"
                    placeholder="Name"
                  >
                </div>
                <div class="form-group col-md-6">
                  <label for="exampleInputEmail">Email address</label>
                  <input
                  id="exampleInputEmail"
                  type="email"
                  readonly
                  v-model="user.email"
                  class="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                  >
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                    <label for="inputUserName">Phone Number</label>
                    <input
                    id="inputUserName"
                    type="number"
                    readonly
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
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="inputUserName">Quyền</label>
                  <multiselect
                    :disabled="user.type != 2"
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
                <div class="form-group col-md-6">
                  <label for="inputUserName">Trạng thái</label>
                  <multiselect 
                    v-model="status"
                    :allow-empty="false" 
                    name="status" 
                    data-vv-as="Trạng thái" 
                    label="name"
                    :options="status_list" 
                    :searchable="true" 
                    track-by="id"
                    :close-on-select="true"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="exampleInputPassword">Thành phố</label>
                  <multiselect id="inputUserName" v-model="city" label="name" :options="cities" :searchable="true"
                    :show-labels="false" />
                </div>
                <div class="form-group col-md-6" v-if="city !== null">
                  <label for="exampleInputPassword">Quận / Huyện</label>
                  <multiselect :disabled="city == null" id="inputUserName" v-model="district" label="name" :options="filteredDistrict"
                    :searchable="true" :show-labels="false" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-4">
                  <label>Ngày sinh</label>
                  <datepicker v-model="birthday" :format="format" input-class="form-control" />
                </div>
                <div class="form-group col-md-4">
                    <label for="inputUserName">Account Number</label>
                    <input
                    id="inputUserName"
                    type="number"
                    readonly
                    v-model="user.account"
                    class="form-control"
                    placeholder="Account Number"
                    >
                </div>
                <div class="form-group col-md-4">
                    <label for="inputUserName">Bank</label>
                    <input
                    id="inputUserName"
                    type="number"
                    readonly
                    v-model="user.account"
                    class="form-control"
                    placeholder="Bank"
                    >
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-5">
                  <label>Giới tính</label>
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
                        id="checkOther"
                        class="form-check-input"
                        type="radio"
                        v-model="user.gender"
                        name="gender"
                        value="3"
                      >
                      <label class="form-check-label" for="checkFemale">Female</label>
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
                      <label class="form-check-label" for="checkOther">Other</label>
                    </div>
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
import { location } from "../../../helpers/mixins";
import Datepicker from "vuejs-datepicker";
export default {
  mixins: [location],
  components: {
    Multiselect,
    Datepicker
  },
  data() {
    return {
      user: null,
      permissions: "user.update",
      role_list: [],
      roles: [],
      status_list: [
        {
          id: 1,
          name: "Kích hoạt"
        },
        {
          id: 0,
          name: "Khóa"
        }
      ],
      format: "yyyy-MM-dd"
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
  computed: {
    status: {
      get() {
        return {
          id: this.user.status,
          name: this.user.status_txt
        };
      },
      set(val) {
        this.user.status = val.id;
        this.user.status_txt = val.name;
        return {
          id: val.id,
          name: val.name
        };
      }
    },
    city: {
      get() {
        return {
          id: this.user.city.data.id,
          name: this.user.city.data.name
        };
      },
      set(val) {
        this.user.city_id = val.id;
        this.user.city.data = {
          id: val.id,
          name: val.name
        };
        return {
          id: val.id,
          name: val.name
        };
      }
    },
    district: {
      get() {
        return {
          id: this.user.district.data.id,
          name: this.user.district.data.name
        };
      },
      set(val) {
        this.user.district_id = val.id;
        this.user.district.data = {
          id: val.id,
          name: val.name
        };
        return {
          id: val.id,
          name: val.name
        };
      }
    },
    filteredDistrict() {
      let self = this;
      return this.districts.filter(function(item) {
        return item.city_id == self.city.id;
      });
    },
    birthday: {
      get() {
        return this.user.birthday;
      },
      set(val) {
        this.user.birthday = val.toISOString().substr(0, 10);
        return val;
      }
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
            include: "roles,city,district"
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

