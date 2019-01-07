<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Chi tiết Bộ sưu tập</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Trang chủ</a></li>
        <li class="breadcrumb-item">
          <router-link :to="{ name: 'collections.list'}">
            <a>Bộ sưu tập</a>
          </router-link>
        </li>
        <li class="breadcrumb-item active"><a href="#">Chi tiết bộ sưu tập</a></li>
      </ol>
    </div>

    <div class="card">
      <div class="card-body row">
        <div class="col-sm-7">
          <img
            src="http://westay.org/storage/collections/2018_09_24_77b7fa7eb9.jpeg"
            alt="loaing..."
            class="img-fluid img-thumbnail">
        </div>
        <div class="col-sm-5">
          <div class="card">
            <div class="card-body">
              <h3>Thông tin bộ sưu tập</h3>

              <tabs class="tabs-default">
                <tab id="vi" name="Tiếng việt">
                  <p>
                    <b><h4>{{collection.vi.name}}</h4></b>
                  </p>
                  <p v-html="collection.vi.description">
                  </p>
                </tab>
                <tab id="en" name="Tiếng anh">
                  <p>
                    <b><h4>{{collection.en.name}}</h4></b>
                  </p>
                  <p v-html="collection.en.description">
                  </p>
                </tab>
              </tabs>

              <div class="col-sm-12 row">
                <p class="col-sm-4">
                  <i :class="collection.status == 1? 'icon-fa icon-fa-check-square color-green' : 'icon-fa icon-fa-times color-red'"></i>
                  Trạng thái
                </p>
                <p class="col-sm-4">
                  <i :class="collection.hot == 1? 'icon-fa icon-fa-check-square color-green' : 'icon-fa icon-fa-times color-red'"></i>
                  Nổi bật
                </p>
                <p class="col-sm-4">
                  <i :class="collection.new == 1? 'icon-fa icon-fa-check-square color-green' : 'icon-fa icon-fa-times color-red'"></i>
                  Mới nhất
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-12 mt-5">
          <div class="card-body my-gallery" style="padding-left: 0px">
            <h4>Danh sách phòng</h4>
            <gallery
              :images="images"
              :index="imgIndex"
              :options="{
                closeOnEscape: true,
                closeOnSlideClick: true,
                closeOnSwipeUpOrDown: true,
                startSlideshow: true,
                fullScreen: false
              }"
              @close="imgIndex = null"/>
            <div class="image-gallery">
              <div class="row">
                <figure
                  v-for="(image, bindex) in images"
                  :key="bindex"
                  class="col-xl-4 col-lg-4 col-md-6 col-xs-12"
                >
                  <img
                    :src="image"
                    class="demo image img-fluid"
                    @click="imgIndex = bindex"
                  >
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Auth from "../../../services/auth";
import { chain } from "lodash";
import Multiselect from "vue-multiselect";
import VueGallery from "vue-gallery";
import { Tabs, Tab } from "vue-tabs-component";
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  components: {
    tabs: Tabs,
    tab: Tab,
    gallery: VueGallery
  },
  data() {
    return {
      images: [
        "/assets/img/demo/gallery/1.jpg",
        "/assets/img/demo/gallery/2.jpg",
        "/assets/img/demo/gallery/3.jpg",
        "/assets/img/demo/gallery/4.jpg",
        "/assets/img/demo/gallery/5.jpg",
        "/assets/img/demo/gallery/6.jpg"
      ],
      imgIndex: null,
      collection: {
        image: "",
        hot: 0,
        status: 0,
        new: 0,
        vi: {
          name: "",
          description: "",
          lang: "vi"
        },
        en: {
          name: "",
          description: "",
          lang: "en"
        }
      },
      permission: "collection.view"
    };
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permission).then(response => {
          if (!response) {
            this.$router.push("/permission-denied-403");
          } else {
            this.getCollection();
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  },
  methods: {
    setInitData(dataCollection) {
      this.collection.image = dataCollection.image;
      this.collection.hot = dataCollection.hot;
      this.collection.status = dataCollection.status;
      this.collection.new = dataCollection.new;
      if (dataCollection.details.data[0].lang === "vi") {
        this.collection.vi = dataCollection.details.data[0];
        this.collection.en = dataCollection.details.data[1];
      } else if (dataCollection.details.data[0].lang === "en") {
        this.collection.en = dataCollection.details.data[0];
        this.collection.vi = dataCollection.details.data[1];
      }
    },
    async getCollection() {
      try {
        const response = await axios.get(
          `collections/${this.$route.params.collectionId}`,
          {
            params: {
              include: "details"
            }
          }
        );

        this.setInitData(response.data.data);
      } catch (error) {
        if (error) {
          window.toastr["error"](
            "Dữ liệu danh sách collection hiện thời chưa có sẵn, vui lòng thử lại sau",
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
.color-green {
  color: green;
}
.color-red {
  color: red;
}
</style>
