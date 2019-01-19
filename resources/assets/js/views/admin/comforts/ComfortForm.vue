<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Tiện ích</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#">Home</a>
        </li>
        <li class="breadcrumb-item">
          <a href="#">Tiện ích</a>
        </li>
        <li class="breadcrumb-item active" v-if="type === 'Create'">Tạo mới</li>
        <li class="breadcrumb-item active" v-else>Cập nhật</li>
      </ol>
    </div>
    <form>
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-body">
              <div class="container">
                <div class="row" style="margin-top: 20px;">
                  <div class="col-sm-12">
                    <div class="form-group">
                      <label :style="errors.has('comfort.icon') ? 'color:red;' : ''">
                        {{errors.has('comfort.icon')
                        ? errors.first('comfort.icon') :
                        'Icon biểu thị *'}}
                      </label>
                      <multiselect
                        style="z-index: 10"
                        id="inputIcon"
                        name="comfort.icon"
                        v-model="value"
                        v-validate="'required'"
                        data-vv-as="Icon biểu thị"
                        label="name"
                        track-by="name"
                        :option-height="104"
                        :custom-label="customLabel"
                        :options="iconComfortList"
                        :searchable="true"
                        :show-labels="false"
                        :allow-empty="false"
                      >
                        <template slot="singleLabel" slot-scope="props">
                          <img
                            height="25px"
                            width="25px;"
                            class="option__image"
                            :alt="props.option.icon"
                            :src="'/assets/svg_comforts/'+ comfort.icon +'.svg'"
                            style="margin-right: 10px;"
                          >
                          <span class="option__title">{{ props.option.name }}</span>
                        </template>
                        <template slot="option" slot-scope="props">
                          <img
                            height="25px"
                            width="25px;"
                            class="option__image"
                            :src="props.option.icon"
                            style="margin-right: 10px;"
                          >
                          <span class="option__title">{{ props.option.name }}</span>
                        </template>
                      </multiselect>
                    </div>
                  </div>
                </div>
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-lg-6">
                        <h5 class="section-semi-title">Thông tin</h5>
                      </div>
                      <div class="col-lg-6">
                        <button
                          type="button"
                          v-if="checkCountLang"
                          @click="addNewLangEnglishForm"
                          style="float:right;"
                          class="btn btn-outline-primary"
                        >
                          <i class="icon-fa icon-fa-plus"/> Thêm tiếng anh
                        </button>
                        <button
                          :disabled="currentTab === 'English'"
                          type="button"
                          v-else
                          @click="deleteLangEnglishForm"
                          style="float:right;"
                          class="btn btn-outline-danger"
                        >
                          <i class="icon-fa icon-fa-trash-o"/> Xóa tiếng anh
                        </button>
                      </div>
                    </div>
                    <tabs
                      :options="{ useUrlFragment: false }"
                      class="tabs-default"
                      @changed="tabChanged"
                    >
                      <tab
                        :id="detail.id"
                        :name="detail.lang === 'vi' ? 'Việt Nam':'English'"
                        v-for="(detail, index) in comfort.details"
                        :key="index"
                      >
                        <div class="col-lg-12">
                          <div class="form-group">
                            <label :style="errors.has('detail.name' + index) ? 'color:red;' : ''">
                              {{errors.has('detail.name' + index)
                              ? errors.first('detail.name' + index) : 'Tên tiện ích *'}}
                            </label>
                            <input
                              type="text"
                              v-model="comfort.details[index].name"
                              :name="'detail.name' + index"
                              v-validate="'required'"
                              data-vv-as="Tên tiện ích"
                              class="form-control"
                            >
                          </div>
                          <div class="form-group">
                            <label>Mô tả</label>
                            <textarea
                              rows="4"
                              type="text"
                              v-model="comfort.details[index].description"
                              :name="'detail.description' + index"
                              class="form-control"
                            ></textarea>
                          </div>
                        </div>
                      </tab>
                    </tabs>
                  </div>
                </div>
                <div class="btn-center">
                  <button
                    class="btn btn-success"
                    v-if="type === 'Create'"
                    @click.prevent="onSubmit"
                  >Tạo tiện ích</button>
                  <button class="btn btn-success" v-else @click.prevent="onSubmit">Cập nhật tiện ích</button>
                  <button class="btn btn-danger" @click.prevent="returnComfortList">Quay lại</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Auth from "../../../services/auth";
import { FormWizard, TabContent } from "vue-form-wizard";
import { Tabs, Tab } from "vue-tabs-component";
import Multiselect from "vue-multiselect";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import { map } from "lodash";
import { comforts } from "../../../helpers/comforts";
export default {
  mixins: [comforts],
  components: {
    FormWizard,
    TabContent,
    Tabs,
    Tab,
    Multiselect
  },
  props: {
    type: {
      type: String,
      default: "Create"
    },
    dataComfort: {
      default: () => {
        return null;
      }
    }
  },
  data() {
    return {
      value: null,
      comfort: {
        icon: null,
        details: [
          {
            name: "",
            description: "",
            lang: "vi"
          }
        ]
      },
      currentTab: null
    };
  },
  computed: {
    checkCountLang() {
      if (this.comfort.details.length) {
        let length = this.comfort.details.length;
        return !!(length == 1);
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.comfort.icon = val.name;
        }
      }
    }
  },
  methods: {
    setInitData() {
      let dataComfort = { ...this.dataComfort };
      if (dataComfort.details) {
        dataComfort.details = map(dataComfort.details.data, detail => {
          return detail;
        });
      }
      this.comfort = { ...this.comfort, ...dataComfort };
      this.value = {
        name: dataComfort.icon,
        value: "/assets/svg_comforts/" + dataComfort.icon + ".svg"
      };
    },
    addNewLangEnglishForm() {
      this.comfort.details.push({
        name: "",
        description: "",
        lang: "en"
      });
    },
    deleteLangEnglishForm() {
      let index = this.comfort.details.findIndex(x => x.lang == "en");
      this.comfort.details.splice(index, 1);
    },
    tabChanged(selectedTab) {
      this.currentTab = selectedTab.tab.name;
    },
    customLabel({ name, icon }) {
      return `${name} - ${icon}`;
    },
    returnComfortList() {
      this.$router.push({
        name: "comfort.list"
      });
    },
    async onSubmit() {
      const result = await this.$validator.validateAll();
      if (result) {
        try {
          if (this.type == "Update") {
            this.$swal({
              title: "Đang xử lý",
              text: "",
              type: "info",
              showCancelButton: false,
              showConfirmButton: false,
              showCloseButton: false,
              showLoaderOnConfirm: false
            });
            let response = await axios
              .put(`comforts/${this.$route.params.comfortId}`, this.comfort)
              .then(response => {
                this.$swal(
                  "Thành công",
                  "Tiện ích được cập nhật thành công",
                  "success"
                );
                this.$router.push({ name: "comfort.list" });
              })
              .catch(error => {
                let err = error.response.data.data.errors;
                let err_array = Object.values(err);
                let err_txt = "";
                err_array.forEach(function(element) {
                  err_txt += element + ", ";
                });
                window.toastr["error"](err_txt, "Error");
              });
          } else {
            this.$swal({
              title: "Đang xử lý",
              text: "",
              type: "info",
              showCancelButton: false,
              showConfirmButton: false,
              showCloseButton: false,
              showLoaderOnConfirm: false
            });
            let response = await axios
              .post("comforts", this.comfort)
              .then(response => {
                this.$swal(
                  "Thành công",
                  "Tiện ích được tạo mới thành công",
                  "success"
                );
                this.$router.push({ name: "comfort.list" });
              })
              .catch(error => {
                let err = error.response.data.data.errors;
                let err_array = Object.values(err);
                let err_txt = "";
                err_array.forEach(function(element) {
                  err_txt += element + ", ";
                });
                window.toastr["error"](err_txt, "Error");
              });
          }
        } catch (error) {
          if (error) {
            this.$swal(
              "Xin lỗi",
              "Tiện ích chưa đưọc lưu, làm ơn kiểm tra lại thông tin",
              "error"
            );
          }
        }
      }
    }
  },
  created() {
    !(this.dataComfort === null) && this.setInitData();
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

<style>
</style>
