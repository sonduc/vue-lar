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
        <li class="breadcrumb-item active" >Cập nhật</li>
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
                        v-model="svgChoose"
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
                        @select.once="afterUpdateIcon"
                      >
                        <template
                          slot="singleLabel" slot-scope="props">
                          <div
                           v-if="icon_rechoose == 0"
                            style="height: 25px; width: 25px;"
                            v-html="comfort.icon">
                          </div>
                          <img
                            v-if="icon_rechoose == 1"
                            height="25px"
                            width="25px;"
                            class="option__image"
                            :alt="props.option.icon"
                            :src="svgChoose.icon"
                            style="margin-right: 10px;"
                          >
                          <span
                            v-if="icon_rechoose == 1"
                            class="option__title">{{ props.option.name }}
                          </span>
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
                         :disabled="comfort.details[0].name === ''"
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
                        :ref="'tab'+ index"
                        :name="detail.lang === 'vi' ? 'Việt Nam':'English'"
                        v-for="(detail, index) in comfort.details"
                        :key="detail.index"
                      >
                        <div class="col-lg-12">
                          <div class="form-group">
                            <label :style="errors.has('detail.name' + index) ? 'color:red;' : ''">
                              {{errors.has('detail.name' + index)
                              ? errors.first('detail.name' + index) : 'Tên tiện ích *'}}
                            </label>
                            <input
                              :ref="'name'+index"
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
                  <button class="btn btn-success"
                    @click.prevent="onSubmit">Cập nhật tiện ích</button>
                  <button class="btn btn-danger"
                    @click.prevent="returnComfortList">Quay lại</button>
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
  data() {
    return {
      svgChoose: null,
      icon_rechoose: 0,
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
      currentTab: null,
      permissions:"comfort.update",
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
  methods: {
    setInitData(dataComfort) {
      if (dataComfort.details) {
        dataComfort.details = map(dataComfort.details.data, detail => {
          return detail;
        });
      }
      this.comfort = { ...this.comfort, ...dataComfort };
      this.svgChoose = {
        name: dataComfort.icon,
        value: dataComfort.icon,

      };
    },
    afterUpdateIcon(){
      this.icon_rechoose = 1;
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
    getContentFileSvg(svgDir) {
      let XMLrequest = new XMLHttpRequest(); // new XML request
      XMLrequest.open("GET", svgDir, false);
      XMLrequest.send(null); // get the SVG file
      let mySVG = XMLrequest.responseText;
      return mySVG;
    },
    async getComfortById() {
      try {
        const response = await axios.get(`comforts/${ this.$route.params.comfortId }`,
          {
            params: {
              include: "details"
            }
          });
        this.setInitData(response.data.data);
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu tiện ích phòng hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
        }
      }
    },
    async onSubmit() {
      const result = await this.$validator.validateAll();
      if(!result) {
        if (this.comfort.details.length == 2 && this.comfort.details[1].name === '') {
          window.toastr["error"](
            'Trong tab English tên tiện ích là bắt buộc',
            "Error"
          );
        }
      }
      else {
        try {
          this.$swal({
            title: "Đang xử lý",
            text: "",
            type: "info",
            showCancelButton: false,
            showConfirmButton: false,
            showCloseButton: false,
            showLoaderOnConfirm: false
          });
          if(this.icon_rechoose == 1) {
            this.comfort.icon = this.getContentFileSvg(this.svgChoose.icon);
          }
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
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("permission-denied-403");
          } else {
            this.getComfortById();
          }
        });
      }
    });
  }
};
</script>

<style>
</style>
