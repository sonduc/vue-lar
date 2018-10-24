<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Chi tiết collections</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item">
          <router-link :to="{ name: 'collections.list'}">
            <a>Collections</a>
          </router-link>
        </li>
        <li class="breadcrumb-item active"><a href="#">Chi tiết collections</a></li>
      </ol>
    </div>
  </div>
</template>
<script>
import Auth from "../../../services/auth";
import { chain } from 'lodash'
import Multiselect from "vue-multiselect";
import { Tabs, Tab } from 'vue-tabs-component'
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default{

}
</script>
