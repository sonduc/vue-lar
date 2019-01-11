<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Bài viết</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#">Trang chủ</a>
        </li>
        <li class="breadcrumb-item active">Danh sách bài viết</li>
      </ol>
      <div class="page-actions">
        <router-link class="btn btn-primary" :to="{ name: 'blog.create'}">
          <i class="icon-fa icon-fa-plus"/> Viết bài
        </router-link>
      </div>
    </div>

    <div class="mailbox">
      <div class="card">
        <div class="card-header">Bộ lọc</div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group row">
                <label for="firstName" class="col-sm-2 col-form-label">Tìm kiếm</label>
                <div class="col-sm-10">
                  <input
                    v-model="tags"
                    id="firstName"
                    type="text"
                    class="form-control"
                    placeholder="Nhập vào tên bài viết,tags..."
                  >
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group row">
                <label for="email" class="col-sm-2 col-form-label">Người viết</label>
                <div class="col-sm-4">
                  <multiselect
                    id="inputUserName"
                    v-model="user"
                    label="name"
                    :options="users"
                    :searchable="true"
                    :show-labels="false"
                  />
                </div>
                <label for="email" class="col-sm-2 col-form-label">Bộ sưu tập</label>
                <div class="col-sm-4">
                  <multiselect
                    id="inputUserName"
                    v-model="category"
                    label="name"
                    :options="list_categories"
                    :searchable="true"
                    :show-labels="false"
                  />
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group row">
                <label for="email" class="col-sm-2 col-form-label">Hiển thị</label>
                <div class="col-sm-10 mt-2">
                  <div class="form-check form-check-inline">
                    <input
                      id="inlineCheckbox1"
                      class="form-check-input"
                      type="checkbox"
                      v-model.number="hot_blog"
                      true-value="1"
                      false-value="0"
                    >
                    <label class="form-check-label" for="inlineCheckbox1">Hot</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      id="inlineCheckbox2"
                      class="form-check-input"
                      type="checkbox"
                      v-model.number="new_blog"
                      true-value="1"
                      false-value="0"
                    >
                    <label class="form-check-label" for="inlineCheckbox2">New</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      id="inlineCheckbox3"
                      class="form-check-input"
                      type="checkbox"
                      v-model.number="status_blog"
                      true-value="1"
                      false-value="0"
                    >
                    <label class="form-check-label" for="inlineCheckbox3">Status</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group row">
                <label for="lastName" class="col-sm-1 col-form-label">Từ</label>
                <div class="col-sm-5">
                  <datepicker v-model="date_start" :format="format" input-class="form-control"/>
                </div>
                <label for="lastName" class="col-sm-1 col-form-label">Đến</label>
                <div class="col-sm-5">
                  <datepicker
                    :disabled-dates="disabledDate"
                    v-model="date_end"
                    :format="format"
                    input-class="form-control"
                  />
                </div>
              </div>
            </div>
          </div>
          <button @click="applyFilter(1)" class="btn btn-success btn-sm">Áp dụng</button>
          <button @click="resetFilter(1)" class="btn btn-info btn-sm">Làm mới</button>
        </div>
      </div>
      <div class="mailbox-content">
        <lottie v-if="loading" :options="defaultOptions" :height="150" :width="150"></lottie>
        <table class="table" v-else>
          <thead>
            <tr>
              <th>#</th>
              <td>Ảnh</td>
              <th>Tên</th>
              <th>Bộ sưu tập</th>
              <th colspan="2">Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(blog,index) in blogs" :key="index" :class="{'read' : blog.status }">
              <td>{{index + 1}}</td>
              <td class="cell-content" width="160">
                <img :src="blog.image" height="150px" width="150px">
              </td>
              <td class="cell-content">
                <div class="content">
                  <div class="content-name mb-2">
                    <p>{{blog.title}}</p>
                  </div>
                  <div class="content-subject mb-2">
                    <i class="icon-fa icon-fa-user"/>
                    &ensp; Người đăng: {{ blog.user.data.name }}
                  </div>
                </div>
              </td>
              <td width="15%" class="cell-content">
                <div
                  class="content-subject mb-2"
                  v-for="category in blog.categories.data"
                  :key="category.details.data[0].slug"
                >
                  <i class="icon-fa icon-fa-tasks"/>
                  &ensp;{{ category.details.data[0].name }}
                </div>
              </td>
              <td width="10%">
                <div class="mb-3">Bài mới</div>
                <div class="mb-3">Bài hot</div>
                <div class="mb-3">Trạng thái</div>
              </td>
              <td class="cell-fav">
                <div class="content-subject mb-3">
                  <button
                    @click="updateMinorBlog('new',blog)"
                    type="button"
                    :class="blog.new == 1 ? 'btn btn-xs btn-icon btn-success mailbox-action' :'btn btn-xs btn-icon btn-light mailbox-action'"
                  >
                    <i :class="blog.new == 1 ? 'icon-fa icon-fa-check' : 'icon-fa icon-fa-times'"></i>
                  </button>
                </div>
                <div class="content-subject mb-3">
                  <button
                    @click="updateMinorBlog('hot',blog)"
                    type="button"
                    :class="blog.hot == 1 ? 'btn btn-xs btn-icon btn-success mailbox-action' :'btn btn-xs btn-icon btn-light mailbox-action'"
                  >
                    <i :class="blog.hot == 1? 'icon-fa icon-fa-check' : 'icon-fa icon-fa-times'"></i>
                  </button>
                </div>
                <div class="content-subject mb-3">
                  <button
                    type="button"
                    :class="blog.status == 1 ? 'btn btn-xs btn-icon btn-success mailbox-action' :'btn btn-xs btn-icon btn-danger mailbox-action'"
                  >
                    <i :class="blog.status == 1? 'icon-fa icon-fa-check' : 'icon-fa icon-fa-times'"></i>
                  </button>
                </div>
              </td>
              <td width="10%" style="text-align:center">
                <div class="btn-group mb-3" role="group" aria-label="First group">
                  <button
                    v-tooltip.top-center="'Chi tiết'"
                    type="button"
                    class="btn btn-sm btn-icon btn-outline-info"
                  >
                    <i class="icon-fa icon-fa-search"/>
                  </button>
                  <button
                    @click="openUpdateBlogModal(blog.id)"
                    v-tooltip.top-center="'Chỉnh sửa'"
                    type="button"
                    class="btn btn-sm btn-icon btn-outline-info"
                  >
                    <i class="icon-fa icon-fa-pencil"/>
                  </button>
                  <button
                    v-tooltip.top-center="'Xóa'"
                    type="button"
                    class="btn btn-sm btn-icon btn-outline-info"
                  >
                    <i class="icon-fa icon-fa-times"/>
                  </button>
                </div>

                <button
                  @click="updateMinorBlog('status',blog)"
                  v-if="blog.status == 0"
                  class="btn btn-success btn-sm"
                >Duyệt bài</button>
                <button
                  @click="updateMinorBlog('status',blog)"
                  v-else
                  class="btn btn-danger btn-sm"
                >Ẩn bài viết</button>
              </td>
            </tr>
          </tbody>
        </table>
        <pagination @clicked="reloadData" :total-pages="totalPages" :current-page="currentPage"/>
      </div>
    </div>
  </div>
</template>

<script>
import Auth from "../../../services/auth";
import Lottie from "vue-lottie";
import * as animationData from "../../loading/material_wave_loading.json";
import { format, constant, location } from "../../../helpers/mixins";
import Datepicker from "vuejs-datepicker";
import Multiselect from "vue-multiselect";
import Pagination from "../../../components/paginate/ServerPagination";
export default {
  components: {
    Pagination,
    Multiselect,
    Datepicker,
    Lottie
  },
  data() {
    return {
      defaultOptions: {
        animationData: animationData
      },
      list_categories: [],
      format: "yyyy-MM-dd",
      permissions: "blog.view",
      totalPages: null,
      currentPage: null,
      count: null,
      loading: true,
      user: {
        id: ""
      },
      tags: "",
      status: null,
      category: {
        id: ""
      },
      hot_blog: null,
      new_blog: null,
      status_blog: null,
      date_start: null,
      date_end: null,
      categories: [],
      blogs: [],
      users: [],
      disabledDate: {
        to: ""
      }
    };
  },
  methods: {
    async getBlogs({ page, filter, sort }) {
      let date_start =
        this.date_start !== null
          ? this.date_start.toISOString().substr(0, 10)
          : "";
      let date_end =
        this.date_end !== null ? this.date_end.toISOString().substr(0, 10) : "";
      try {
        const response = await axios.get(`blogs`, {
          params: {
            include: "user,categories.details,tags",
            page: page,
            limit: 5,
            date_start: date_start,
            date_end: date_end,
            user_id: this.user.id,
            tag: this.tags,
            status: this.status,
            hot: this.hot_blog,
            new: this.new_blog,
            status: this.status_blog,
            category: this.category.id
          }
        });

        let paginate = response.data.meta.pagination;
        this.currentPage = paginate.current_page;
        this.totalPages = paginate.total_pages;
        this.count = paginate.count;
        this.blogs = response.data.data;
        this.loading = false;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async getUsers() {
      try {
        const response = await axios.get(`users`, {
          params: {
            limit: -1,
            type: 2
          }
        });
        this.users = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async getCategories() {
      try {
        const response = await axios.get(`categories`, {
          params: {
            limit: -1,
            include: "details"
          }
        });
        this.categories = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    async updateMinorBlog(option, blog) {
      if (option === "hot") {
        let response = await axios
          .put(`blogs/single-update/${blog.id}?option=${option}`, {
            hot: blog.hot == 1 ? 0 : 1
          })
          .then(result => {
            if (result) {
              this.reloadData(this.currentPage);

              window.toastr["success"]("Updated Hot Room!", "Success");
            } else {
              window.toastr["error"]("Something wrong!", "Error");
            }
          });
      } else if (option === "new") {
        let response = await axios
          .put(`blogs/single-update/${blog.id}?option=${option}`, {
            new: blog.new == 1 ? 0 : 1
          })
          .then(result => {
            if (result) {
              this.reloadData(this.currentPage);

              window.toastr["success"]("Updated New Room!", "Success");
            } else {
              window.toastr["error"]("Something wrong!", "Error");
            }
          });
      } else if (option === "status") {
        let response = await axios
          .put(`blogs/single-update/${blog.id}?option=${option}`, {
            status: blog.status == 1 ? 0 : 1
          })
          .then(result => {
            if (result) {
              this.reloadData(this.currentPage);
              window.toastr["success"]("Updated Status!", "Success");
            } else {
              window.toastr["error"]("Something wrong!", "Error");
            }
          });
      }
    },
    openUpdateBlogModal(blog_id) {
      this.$router.push({
        name: "blog.update",
        params: {
          blogId: blog_id
        }
      });
    },
    reloadData(page) {
      this.getBlogs({
        page
      });
    },
    applyFilter(page) {
      this.getBlogs({
        page
      });
    },
    resetFilter(page) {
      this.tags = "";
      this.user = {
        id: ""
      };
      this.category = {
        id: ""
      };
      this.date_start = null;
      this.date_end = null;
      this.hot_blog = null;
      this.new_blog = null;
      this.status_blog = null;
      this.getBlogs({
        page
      });
    },
    hideSidebarOnMobile() {
      let self = this;
      window.onresize = function() {
        if (window.innerWidth <= 992) {
          self.isLeftSidebarVisible = false;
        }
      };
    }
  },
  watch: {
    categories: {
      handler(val) {
        val.forEach(element => {
          this.list_categories.push({
            id: element.id,
            name: element.details.data[0].name
          });
        });
      },
      deep: true
    }
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403");
          } else {
            this.getBlogs({});
            this.getUsers();
            this.getCategories();
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  }
};
</script>

<style>
</style>
