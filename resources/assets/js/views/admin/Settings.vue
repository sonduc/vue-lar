<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Settings</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#">Home</a>
        </li>
        <li class="breadcrumb-item">
          <a href="#">settings</a>
        </li>
      </ol>
    </div>
    <lottie v-if="loading" :options="defaultOptions" :height="150" :width="150"></lottie>
    <div class="row" v-else>
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-lg-12 mb-3">
                <tabs class="tabs-default" :options="{ useUrlFragment: false }">
                  <tab name="Thông tin cơ bản">
                    <div class="col-lg-12 row">
                      <div class="col-lg-6 pl-0">
                        <div class="form-group">
                          <label :style="errors.has('name') ? 'color:red;' : ''">
                            {{errors.has('name')
                            ? errors.first('name') : 'Tên công ty *'}}
                          </label>
                          <input
                            v-model="settings.name"
                            name="name"
                            data-vv-as="Tên công ty"
                            v-validate="{ required:true,
                              regex:/^[\d\-a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀẾỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ, ]*$/u }"
                            type="text"
                            class="form-control"
                          >
                        </div>
                        <div class="form-group">
                          <label :style="errors.has('address') ? 'color:red;' : ''">
                            {{errors.has('address')
                            ? errors.first('address') : 'Địa chỉ *'}}
                          </label>
                          <input
                            v-model="settings.address"
                            name="address"
                            data-vv-as="Địa chỉ"
                            v-validate="'required|min:5'"
                            type="text"
                            class="form-control"
                          >
                        </div>
                        <div class="form-group">
                          <label :style="errors.has('description') ? 'color:red;' : ''">
                            {{errors.has('description')
                            ? errors.first('description') : 'Mô tả ngắn gọn về công ty *'}}
                          </label>
                          <quill-editor
                            style="height: 260px;"
                            name="description"
                            data-vv-as="Mô tả"
                            v-validate="'required'"
                            v-model="settings.description"
                          ></quill-editor>
                        </div>
                      </div>
                      <div class="col-lg-6 pr-0">
                        <div class="form-group">
                          <label v-if="this.arrImgHomepage.length">Ảnh homepage *</label>
                          <label v-else style="color: red;">Ảnh homepage là bắt buộc</label>
                          <vue-dropzone
                            class="customdropzone"
                            id="dropzone1"
                            ref="myVueDropzone1"
                            :options="imageHomepage"
                            @vdropzone-mounted="vmountedHomepage"
                            @vdropzone-complete="afterCompleteImageHomepage"
                            @vdropzone-canceled
                            @vdropzone-removed-file="removedImageHomepage"
                            :duplicateCheck="true"
                          />
                        </div>
                        <div class="form-group">
                           <label v-if="this.arrImgLogo.length">Ảnh logo *</label>
                          <label v-else style="color: red;">Ảnh logo là bắt buộc</label>
                          <vue-dropzone
                            class="customdropzone"
                            id="dropzone2"
                            ref="myVueDropzone2"
                            :options="imageLogo"
                            @vdropzone-mounted="vmountedLogo"
                            @vdropzone-complete="afterCompleteImageLogo"
                            @vdropzone-canceled
                            @vdropzone-removed-file="removedImageLogo"
                            :duplicateCheck="true"
                          />
                        </div>
                      </div>
                    </div>
                    <br>
                  </tab>
                </tabs>
                <div class="col-lg-12">
                  <div class="col-lg-6 custom-button-setting">
                    <button
                      @click.prevent="addNewAccountBank"
                      type="button"
                      style="color:white; float:right;"
                      class="btn btn-success"
                    >
                      <i class="icon-fa icon-fa-plus"/> Thêm tài khoản
                    </button>
                  </div>
                </div>
                <tabs class="tabs-default" :options="{ useUrlFragment: false }">
                  <tab name="Tài khoản ngân hàng">
                    <div class="row"
                      v-for="(account, index) in settings.bank_account" :key="index">
                      <div class="col-lg-3">
                        <div class="form-group">
                          <label :style="errors.has('account_name' + index) ? 'color:red;' : ''">
                            {{errors.has('account_name' + index)
                             ? errors.first('account_name' + index) : 'Tên tài khoản '+ ( index + 1)+' *'}}
                          </label>
                          <input
                            type="text"
                            :name="'account_name' + index"
                            v-validate="{ required:true, min:3,
                              regex:/^[\d\-a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀẾỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ, ]*$/u }"
                            data-vv-as="Tên tài khoản"
                            v-model="settings.bank_account[index].account_name"
                            class="form-control"
                          >
                        </div>
                      </div>
                      <div class="col-lg-3">
                        <div class="form-group">
                          <label :style="errors.has('account_number' + index) ? 'color:red;' : ''">
                            {{errors.has('account_number' + index)
                            ? errors.first('account_number' + index) : 'Số tài khoản '+ ( index + 1)+' *'}}
                          </label>
                          <input
                            type="text"
                            v-model="settings.bank_account[index].account_number"
                            :name="'account_number' + index"
                            v-validate="{ required:true, min:3, regex:/^\+?[0-9-]*$/ }"
                            data-vv-as="Tên tài khoản"
                            class="form-control"
                          >
                        </div>
                      </div>
                      <div class="col-lg-5">
                        <div class="form-group">
                          <label :style="errors.has('bank_branch' + index) ? 'color:red;' : ''">
                            {{errors.has('bank_branch' + index)
                            ? errors.first('bank_branch' + index) : 'Ngân hàng - chi nhánh '+ ( index + 1)+' *'}}
                          </label>
                          <input
                            type="text"
                            :name="'bank_branch' + index"
                            v-validate="{ required:true, min:3,
                              regex:/^[\d\-a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀẾỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ, ]*$/u }"
                            data-vv-as="Tên ngân hàng"
                            v-model="settings.bank_account[index].bank_branch"
                            class="form-control"
                          >
                        </div>
                      </div>
                      <div class="col-lg-1">
                        <div class="form-group">
                          <label>&ensp;</label>
                          <button
                            :disabled="settings.bank_account.length == 1"
                            v-tooltip="{content: 'Bạn muốn xóa tài khoản này ?',
                              classes: ['danger'],targetClasses: ['it-has-a-tooltip']}"
                            @click.prevent="deleteAccountBank(index)"
                            class="form-control btn btn-outline-danger"
                          >
                            <i class="icon-fa icon-fa-close"></i>Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                    <br>
                  </tab>
                </tabs>
                <div class="col-lg-12">
                  <div class="col-lg-6 custom-button-setting">
                    <button
                      type="button"
                      @click.prevent="addNewPhone"
                      style="color:white; float:right;"
                      class="btn btn-success"
                    >
                      <i class="icon-fa icon-fa-plus"/> Thêm số điện thoại
                    </button>
                  </div>
                </div>
                <tabs class="tabs-default" :options="{ useUrlFragment: false }">
                  <tab name="Contact hotline">
                    <div class="row"
                      v-for="(phone, index) in settings.contact_hotline" :key="index">
                      <div class="col-lg-11">
                        <div class="form-group">
                          <label :style="errors.has('phone' + index) ? 'color:red;' : ''">
                            {{errors.has('phone' + index)
                            ? errors.first('phone' + index) : 'Số điện thoại '+(index + 1)+' *'}}
                          </label>
                          <input
                            type="text"
                            :name="'phone'+index"
                            v-validate="{ required:true, min:10, max:20, regex:/^\+?[0-9-]*$/ }"
                            data-vv-as="Số điện thoại"
                            v-model="settings.contact_hotline[index].phone"
                            class="form-control"
                          >
                        </div>
                      </div>
                      <div class="col-lg-1">
                        <div class="form-group">
                          <label>&ensp;</label>
                          <button
                            :disabled="settings.contact_hotline.length == 1"
                            v-tooltip="{content: 'Bạn muốn xóa số điện thoại này ?',
                              classes: ['danger'],targetClasses: ['it-has-a-tooltip']}"
                            @click.prevent="deletePhone(index)"
                            class="form-control btn btn-outline-danger"
                          >
                            <i class="icon-fa icon-fa-close"></i>Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                    <br>
                  </tab>
                </tabs>
                <div class="col-lg-12">
                  <div class="col-lg-6 custom-button-setting">
                    <button
                      type="button"
                      @click.prevent="addNewEmail"
                      style="color:white; float:right;"
                      class="btn btn-success"
                    >
                      <i class="icon-fa icon-fa-plus"/> Thêm email
                    </button>
                  </div>
                </div>
                <tabs class="tabs-default" :options="{ useUrlFragment: false }">
                  <tab name="Contact email">
                    <div class="row"
                      v-for="(email, index) in settings.contact_email" :key="index">
                      <div class="col-lg-11">
                        <div class="form-group">
                          <label :style="errors.has('email' + index) ? 'color:red;' : ''">
                            {{errors.has('email' + index)
                            ? errors.first('email' + index) : 'Email '+ (index + 1) +' *'}}
                          </label>
                          <input
                            type="text"
                            :name="'email'+index"
                            v-validate="'required|email|max:100'"
                            data-vv-as="Email"
                            v-model="settings.contact_email[index].email"
                            class="form-control"
                          >
                        </div>
                      </div>
                      <div class="col-lg-1">
                        <div class="form-group">
                          <label>&ensp;</label>
                          <button
                            :disabled="settings.contact_email.length == 1"
                            v-tooltip="{content: 'Bạn muốn xóa email này ?',
                              classes: ['danger'],targetClasses: ['it-has-a-tooltip']}"
                            @click.prevent="deleteEmail(index)"
                            class="form-control btn btn-outline-danger"
                          >
                            <i class="icon-fa icon-fa-close"></i>Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                    <br>
                  </tab>
                </tabs>
                <tabs class="tabs-default" :options="{ useUrlFragment: false }">
                  <tab name="Thông tin SEO">
                    <div class="col-lg-12 pl-0 pr-0">
                      <div class="form-group">
                        <label :style="errors.has('meta_title') ? 'color:red;' : ''">
                          {{errors.has('meta_title')
                          ? errors.first('meta_title') : 'Meta title *'}}
                        </label>
                        <input
                          v-model="settings.meta_title"
                          name="meta_title"
                          data-vv-as="Meta title"
                          v-validate="'required'"
                          type="text"
                          class="form-control"
                        >
                      </div>
                      <div class="form-group">
                        <label :style="errors.has('meta_description') ? 'color:red;' : ''">
                          {{errors.has('meta_description')
                          ? errors.first('meta_description') : 'Meta description *'}}
                        </label>
                        <textarea
                          rows="8"
                          v-model="settings.meta_description"
                          v-validate="'required'"
                          data-vv-as="Meta description"
                          name="meta_description"
                          type="text"
                          class="form-control"
                        ></textarea>
                      </div>
                      <div class="form-group">
                        <label :style="errors.has('meta_keywords') ? 'color:red;' : ''">
                          {{errors.has('meta_keywords')
                          ? errors.first('meta_keywords') : 'Meta keywords *'}}
                        </label>
                        <textarea
                          rows="3"
                          v-model="settings.meta_keywords"
                          v-validate="'required'"
                          data-vv-as="Meta description"
                          name="meta_keywords"
                          type="text"
                          class="form-control"
                        ></textarea>
                      </div>
                    </div>
                    <br>
                  </tab>
                </tabs>
              </div>
            </div>
            <button
              v-if="isUpdateSettings == 1"
              :disabled="arrImgHomepage.length < 1 || arrImgLogo.length < 1"
              @click.prevent="updateSettings"
              class="btn btn-primary">Cập nhật settings
            </button>
            <button
              v-else
              :disabled="arrImgHomepage.length < 1 || arrImgLogo.length < 1"
              @click.prevent="createSettings"
              class="btn btn-primary">Tạo settings
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import * as animationData from "../loading/material_wave_loading.json";
import Lottie from "vue-lottie";
import { Tabs, Tab } from "vue-tabs-component";
import Auth from "../../services/auth";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "vue2-dropzone/dist/vue2Dropzone.min.css";

export default {
  components: {
    Lottie,
    Tabs,
    Tab,
    quillEditor,
    vueDropzone: vue2Dropzone
  },
  data() {
    return {
      defaultOptions: {
        animationData: animationData
      },
      loading: true,
      settings: {
        name: "",
        address: "",
        homepage_image: null,
        image_logo: null,
        bank_account: [
          {
            account_name: "",
            account_number : "",
            bank_branch: "",
            status : true
          },
        ],
        contact_hotline : [
          {
            phone: null,
            status : 1
          },
        ],
        contact_email : [
          {
            email: null,
            status : 1
          },
        ],
        meta_title: "",
        meta_description: "",
        meta_keywords: ""
      },
      imageHomepage: {
        url: "https://httpbin.org/post",
        maxFilesize: 3,
        maxFiles: 1,
        addRemoveLinks: true,
        thumbnailWidth: 150,
        thumbnailHeight: 150,
        dictCancelUpload: "Cancel File",
        dictDefaultMessage:
          "<i class='icon-fa icon-fa-cloud-upload'/></i> Uploads Your Homepage's Here",
        headers: { "My-Awesome-Header": "header value" }
      },
      imageLogo: {
        url: "https://httpbin.org/post",
        maxFilesize: 3,
        maxFiles: 1,
        addRemoveLinks: true,
        thumbnailWidth: 150,
        thumbnailHeight: 150,
        dictCancelUpload: "Cancel File",
        dictDefaultMessage:
          "<i class='icon-fa icon-fa-cloud-upload'/></i> Uploads Your Logo's Here",
        headers: { "My-Awesome-Header": "header value" }
      },
      isUpdateSettings: 0,
      arrImgHomepage: [],
      arrImgLogo: [],
      loadedImages: 0,
    }
  },
  watch: {
    loadedImages: {
      handler(val) {
        if (this.isUpdateSettings == 1 && val == 2) {
          this.loading = false;
        }
      }
    },
  },
  methods: {
    setInitData(dataSettings) {
      if(dataSettings.homepage_image !== null) {
        this.getBase64ImageFromUrl(
          "https://s3-ap-southeast-1.amazonaws.com/d-beauty/"+ dataSettings.homepage_image)
        .then(result => {
          this.arrImgHomepage.push(result);
          this.loadedImages++;
         })
        .catch(err => console.error(err));
      }
      if(dataSettings.image_logo !== null) {
        this.getBase64ImageFromUrl(
          "https://s3-ap-southeast-1.amazonaws.com/d-beauty/"+ dataSettings.image_logo)
        .then(result => {
          this.arrImgLogo.push(result);
          this.loadedImages++;
         })
        .catch(err => console.error(err));
      }
    },
    async getSettings() {
      try {
        const response = await axios.get('settings');
        if(response.data.data.length) {
          this.isUpdateSettings = 1;
          this.settings = response.data.data[0];
          this.setInitData(response.data.data[0]);
        }
        else {
          this.loading = false;
        }
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu settings hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
        }
      }
    },
    async getBase64ImageFromUrl(imageUrl) {
      let res = await fetch(imageUrl);
      let blob = await res.blob();
      return new Promise((resolve, reject) => {
        let reader  = new FileReader();
        reader.addEventListener("load", function () {
            resolve(reader.result);
        }, false);
        reader.onerror = () => {
          return reject(this);
        };
        reader.readAsDataURL(blob);
      })
    },
    async createSettings() {
      let arrAccountName = this.settings.bank_account.map(item => item.account_name);
      let arrAccountNumber = this.settings.bank_account.map(item => item.account_number);
      let arrEmail = this.settings.contact_email.map(item => item.email);
      let arrPhone = this.settings.contact_hotline.map(item => item.phone);
      if(this.checkDistinctInArray(arrAccountName) == false) {
        window.toastr["error"]("Tên tài khoản ngân hàng trùng nhau", "Error");
      }
      else if(this.checkDistinctInArray(arrAccountNumber) == false) {
        window.toastr["error"]("Số tài khoản ngân hàng trùng nhau", "Error");
      }
      else if(this.checkDistinctInArray(arrEmail) == false) {
        window.toastr["error"]("Email trùng nhau", "Error");
      }
      else if(this.checkDistinctInArray(arrPhone) == false) {
        window.toastr["error"]("Số điện thoại trùng nhau", "Error");
      }
      else {
        const result = await this.$validator.validateAll();
        if (result) {
          try {
            this.settings.homepage_image = this.arrImgHomepage[0],
            this.settings.image_logo = this.arrImgLogo[0],
            this.$swal({
              title: "Bạn có muốn tạo settings này không ?",
              text: "",
              type: "warning",
              showCancelButton: true,
              showConfirmButton: true,
              confirmButtonText: "OK",
              cancelButtonText: "Cancel",
              showCloseButton: false,
              showLoaderOnConfirm: true,
              preConfirm: async () => {
                let response = await axios
                  .post("settings", this.settings)
                  .then(response => {
                    this.$swal(
                      "Thành công",
                      "Settings được tạo mới thành công",
                      "success"
                    );
                    window.toastr["success"]("Settings được tạo mới thành công", "Success");
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
            });
          } catch (error) {
            if (error) {
              this.$swal(
                "Xin lỗi",
                "Settings chưa được tạo mới, làm ơn kiểm tra lại thông tin",
                "error"
              );
            }
          }
        }
      }
    },
    async updateSettings() {
      let arrAccountName = this.settings.bank_account.map(item => item.account_name);
      let arrAccountNumber = this.settings.bank_account.map(item => item.account_number);
      let arrEmail = this.settings.contact_email.map(item => item.email);
      let arrPhone = this.settings.contact_hotline.map(item => item.phone);
      if(this.checkDistinctInArray(arrAccountName)) {
        window.toastr["error"]("Tên tài khoản ngân hàng trùng nhau", "Error");
        return window.scroll({
          top: 600,
          behavior: "smooth"
        });
      }
      else if(this.checkDistinctInArray(arrAccountNumber)) {
        window.toastr["error"]("Số tài khoản ngân hàng trùng nhau", "Error");
        return window.scroll({
          top: 600,
          behavior: "smooth"
        });
      }
      else if(this.checkDistinctInArray(arrPhone)) {
        window.toastr["error"]("Số điện thoại trùng nhau", "Error");
        return window.scroll({
          top: 900,
          behavior: "smooth"
        });
      }
      else if(this.checkDistinctInArray(arrEmail)) {
        window.toastr["error"]("Email trùng nhau", "Error");
        return window.scroll({
          top: 1100,
          behavior: "smooth"
        });
      }
      else {
        const result = await this.$validator.validateAll();
        if (result) {
          try {
            this.settings.homepage_image = this.arrImgHomepage[0],
            this.settings.image_logo = this.arrImgLogo[0],
            this.$swal({
              title: "Bạn có muốn cập nhật settings này không",
              text: "",
              type: "warning",
              showCancelButton: true,
              showConfirmButton: true,
              confirmButtonText: "OK",
              cancelButtonText: "Cancel",
              showCloseButton: false,
              showLoaderOnConfirm: true,
              preConfirm: async () => {
                let response = await axios
                  .put(`settings/1`, this.settings)
                  .then(response => {
                    this.$swal(
                      "Thành công",
                      "Settings được cập nhật thành công",
                      "success"
                    );
                    window.toastr["success"]("Settings được cập nhật thành công", "Success");
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
            });
          } catch (error) {
            if (error) {
              this.$swal(
                "Xin lỗi",
                "Settings chưa được cập nhật, làm ơn kiểm tra lại thông tin",
                "error"
              );
            }
          }
        }
      }
    },
    vmountedHomepage() {
      let arrImage = this.arrImgHomepage;
      arrImage.forEach(item => {
        let file = { name: "Ảnh Homepage", size: 12345, type: "image" };
        let url = item;
        this.$refs.myVueDropzone1.manuallyAddFile(file, url);
      });
    },
    vmountedLogo() {
      let arrImage = this.arrImgLogo;
      arrImage.forEach(item => {
        let file = { name: "Ảnh Logo", size: 12345, type: "image" };
        let url = item;
        this.$refs.myVueDropzone2.manuallyAddFile(file, url);
      });
    },
    afterCompleteImageHomepage(file) {
      if (file.dataURL) {
        this.arrImgHomepage = [];
        this.arrImgHomepage.push(file.dataURL);
      }
    },
    afterCompleteImageLogo(file) {
      if (file.dataURL) {
        this.arrImgLogo = [];
        this.arrImgLogo.push(file.dataURL);
      }
    },
    removedImageHomepage(file, error, xhr) {
      if(file.name === "Ảnh Homepage"){
        this.arrImgHomepage.pop();
      }
      else {
        let index = this.arrImgHomepage.findIndex(
          item => item === file.dataURL
        );
        if(index > -1) {
          this.arrImgHomepage.splice(index, 1);
        }
      }
    },
    removedImageLogo(file, error, xhr) {
      if(file.name === "Ảnh Logo"){
        this.arrImgLogo.pop();
      }
      else {
        let index = this.arrImgLogo.findIndex(
          item => item === file.dataURL
        );
        if(index > -1) {
          this.arrImgLogo.splice(index, 1);
        }
      }
    },
    checkDistinctInArray(array) {
      let findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) != index);
      let countDuplicates = findDuplicates(array).length;
      if(countDuplicates > 0) {
        return true;
      }
      else {
        return false;
      }
    },
    addNewAccountBank() {
      this.settings.bank_account.push({
        account_name: "",
        account_number : "",
        bank_branch: "",
        status : true
      });
    },
    deleteAccountBank(index) {
      this.settings.bank_account.splice(index, 1);
    },
    addNewPhone() {
      this.settings.contact_hotline.push({
        phone: null,
        status : 1
      });
    },
    deletePhone(index) {
      this.settings.contact_hotline.splice(index, 1);
    },
    addNewEmail() {
      this.settings.contact_email.push({
        email: null,
        status : 1
      });
    },
    deleteEmail(index) {
      this.settings.contact_email.splice(index, 1);
    },
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403");
          } else {
            this.getSettings();
          }
        });
      }
    });
  }
};
</script>

<style>
.custom-button-setting {
  float: right;
  position: relative;
  top: 24px;
  left: 31px;
  z-index: 5;
}
.customdropzone {
  height: 226px;
}
</style>

