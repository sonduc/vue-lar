<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Bài viết</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Trang chủ</a></li>
        <li class="breadcrumb-item">
          <router-link :to="{ name: 'blog.list'}">
            <a>Bài viết</a>
          </router-link>
        </li>
        <li class="breadcrumb-item active"><a href="#">Chi tiết bài viết</a></li>
      </ol>
    </div>
    <div class="card">
      <div class="card-body row img-wapper">
        <div class="col-sm-9" v-if="blog" style="padding-left: 350px;">
          <h3>{{ blog.title }}</h3>
          <div class="col-sm-12 row" style="padding: 0 0;">
            <p class="col-sm-4">
              <i class="icon-fa icon-fa-user"/>
              Người đăng: {{ blog.user.data.name }}
            </p>
            <p class="col-sm-4">
              <i class="icon-fa icon-fa-envelope-o"/>
                {{ blog.user.data.email }}
            </p>
            <p class="col-sm-4">
              <i class="icon-fa icon-fa-clock-o"/>
                {{ blog.created_at | formatDateBlog }}
            </p>
          </div>
          <div class="col-sm-12 row">
            <div style="font-size:19px; font-weight: 500px;padding-bottom: 10px;"
              v-html="blog.description">
            </div>
          </div>
          <div class="col-sm-12 row">
            <div v-html="blog.content"></div>
          </div>
          <div class="col-sm-12 row"">
            <i class="icon-fa icon-fa-tag" style="padding-top: 5px;"/>
              &ensp;
              <span v-for="(tag,idx) in blog.tags.data" :key="'tag'+idx">
                <span class="custom-tag">{{ tag.name }}</span>
                <span v-if="idx != (blog.tags.data.length - 1)"
                  style="margin-right: 4px;">
                  &frasl;
                </span>
              </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Auth from "../../../services/auth";
import { format } from "../../../helpers/mixins";
export default {
  mixins: [format],
  data() {
    return {
      blog: null,
      permission: "blog.view"
    };
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permission).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403");
          } else {
            this.getDetailBlog();
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  },
  methods: {
    async getDetailBlog() {
      try {
        const response = await axios.get(
          `blogs/${this.$route.params.blogId}`,
          {
            params: {
              include: "details,user,categories,tags"
            }
          }
        );
        this.blog = response.data.data;
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu bài viết hiện thời chưa có sẵn, vui lòng thử lại sau",
            "Error"
          );
        }
      }
    },
    hideSidebarOnMobile() {
      let self = this;
      window.onresize = function() {
        if (window.innerWidth <= 992) {
          self.isLeftSidebarVisible = false;
        }
      };
    }
  }
};
</script>
<style scoped>
.custom-tag {
  background-color: lightseagreen;
  color: white;
  padding: 0px 8px 2px 8px;
  border-radius: 3px;
}
</style>
