<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Bookings</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Bookings</a></li>
        <li class="breadcrumb-item"><a href="#">Create</a></li>
      </ol>
      <div class="page-actions">
        <a @click="$refs.dark_html_modal.open()" style="color:white" class="btn btn-primary">
          <i class="icon-fa icon-fa-plus" /> New User
        </a>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-9">
        <div class="card">
          <form-wizard>
            <tab-content title="Thông tin khách hàng">

              <section>
                <div class="row">
                  <div class="col-lg-6">
                    <div class="form-group">
                      <label>Giờ nhận phòng</label>
                      <br/>
                      <vue-timepicker></vue-timepicker>
                    </div>
                    <div class="form-group">
                      <label>Họ và tên</label>
                      <input type="text" class="form-control">
                    </div>
                    <div class="form-group">
                      <label>Last Name</label>
                      <input type="text" class="form-control">
                    </div>
                    <div class="form-group">
                      <label>DOB</label>
                      <div class="input-group">
                        <input type="text" class="form-control ls-datepicker" value="06/10/2017">
                        <div class="input-group-append">
                          <span class="input-group-text">
                            <i class="icon-fa icon-fa-calendar"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-group">
                      <label>Giờ trả phòng</label>
                      <br/>
                      <vue-timepicker></vue-timepicker>
                    </div>
                    <div class="form-group">
                      <label>Occupation</label>
                      <input type="text" class="form-control">
                    </div>
                    <div class="form-group">
                      <label>Hobbies</label>
                      <select class="form-control ls-select2">
                        <option value="developing">Developing</option>
                        <option value="singing">Singing</option>
                        <option value="reading">Reading</option>
                        <option value="internet-surfing">Internet Surfing</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="card">
                      <div class="card-body">
                        <div class="row">
                          <div class="col-xl-12 mb-4">
                            <h5 class="section-semi-title">Basic</h5>
                            <tabs class="tabs-default">
                              <tab id="basic-home" name="Tab 1">
                                <div class="col-lg-12">

                                  <div class="form-group">
                                    <label>DOB</label>
                                    <div class="input-group">
                                      <input type="text" class="form-control ls-datepicker" value="06/10/2017">
                                      <div class="input-group-append">
                                        <span class="input-group-text">
                                          <i class="icon-fa icon-fa-calendar"></i>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="col-lg-12">
                                  <div class="form-group">
                                    <label>Hobbies</label>
                                    <select class="form-control ls-select2">
                                      <option value="developing">Developing</option>
                                      <option value="singing">Singing</option>
                                      <option value="reading">Reading</option>
                                      <option value="internet-surfing">Internet Surfing</option>
                                    </select>
                                  </div>
                                  <div class="form-group">
                                    <label>Occupation</label>
                                    <input type="text" class="form-control">
                                  </div>
                                </div>
                              </tab>
                              <tab id="basic-profile" name="Tab 2">
                                <div class="col-lg-12">
                                  <div class="form-group">
                                    <label>First Name</label>
                                    <input type="text" class="form-control">
                                  </div>
                                  <div class="form-group">
                                    <label>Last Name</label>
                                    <input type="text" class="form-control">
                                  </div>
                                  <div class="form-group">
                                    <label>DOB</label>
                                    <quill-editor style="height:250px"></quill-editor>
                                  </div>
                                </div>
                                <br />
                                <div class="col-lg-12">
                                  <div class="form-group">
                                    <label>Hobbies</label>
                                    <select class="form-control ls-select2">
                                      <option value="developing">Developing</option>
                                      <option value="singing">Singing</option>
                                      <option value="reading">Reading</option>
                                      <option value="internet-surfing">Internet Surfing</option>
                                    </select>
                                  </div>
                                  <div class="form-group">
                                    <label>Occupation</label>
                                    <input type="text" class="form-control">
                                  </div>
                                </div>
                              </tab>

                            </tabs>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </tab-content>
            <tab-content title="Thanh toán">
              <div class="card">
                <div class="card-header">
                  <div class="caption">Card 1</div>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label>Email</label>
                        <input type="email" class="form-control">
                      </div>
                      <div class="form-group">
                        <label>Phone No.</label>
                        <input type="text" class="form-control">
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label>Password</label>
                        <input type="password" class="form-control">
                      </div>
                      <div class="form-group">
                        <label>Password Confirmation</label>
                        <input type="password" class="form-control">
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-header">
                  <div class="caption">Card 2</div>
                </div>
                <div class="card-body">
                  <div class="row" v-for="(l,index) in list" :key="index">
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label>Name</label>
                        <input v-model="list[index].name" :ref="`lists[${index}]name`" type="email" class="form-control">
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label>Value</label>
                        <input v-model="list[index].value" :ref="`lists[${index}]value`" type="email" class="form-control">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </tab-content>
          </form-wizard>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="card">
          <div class="card-header bg-warning">
            <h6><i class="icon-fa icon-fa-warning"></i> Warning</h6>
          </div>
          <div class="card-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Alias enim excepturi exercitationem ipsum labore provident quam ut velit vero
              voluptatum!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FormWizard, TabContent } from "vue-form-wizard";
import Auth from "../../../services/auth";
import { Tabs, Tab } from "vue-tabs-component";
import { quillEditor } from "vue-quill-editor";
import VueTimepicker from "vue2-timepicker";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  components: {
    FormWizard,
    TabContent,
    Tabs,
    Tab,
    quillEditor,
    VueTimepicker
  },
  data() {
    return {
      room: null,
      permissions: "booking.create",
      list: [
        {
          name: null,
          value: null
        }
      ]
    };
  },
  methods: {
    async getRoom() {
      try {
        const response = await axios.get(
          `http://ws-api.lc/api/rooms/${
            this.$route.params.roomId
          }?include=details`
        );
        return (this.room = response.data.data);
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    }
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("permission-denied-403"); // push về page 403
          } else {
            this.getRoom(); //fetch data sau khi check permissions của người đang đăng nhập
          }
        });
      }
    });
  }
};
</script>

<style>
</style>
