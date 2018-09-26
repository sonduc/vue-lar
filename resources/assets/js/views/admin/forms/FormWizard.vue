<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Users</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item"><a href="#">Users</a></li>
        <li class="breadcrumb-item active">Users</li>
      </ol>
      <div class="page-actions">
        <a @click="$refs.dark_html_modal.open()" style="color:white" class="btn btn-primary">
          <i class="icon-fa icon-fa-plus" /> New User
        </a>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <form-wizard>
            <tab-content title="Personal details">

              <section>
                <div class="row">
                  <div class="col-lg-6">
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
                                <br/>
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
            <tab-content title="Additional Info">
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

                  <div class="actions">
                    <button @click="addItem" class="btn btn-primary btn-sm"><i class="icon-fa icon-fa-plus"></i> Add
                    </button>
                  </div>
                </div>
                <div class="card-body">
                  <div class="row" v-for="(l,index) in list" :key="index">
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label>Name</label>
                        <input v-model="list[index].name" :ref="`lists[${index}]name`" type="email" class="form-control">
                      </div>
                    </div>
                    <div class="col-lg-5">
                      <div class="form-group">
                        <label>Value</label>
                        <input v-model="list[index].value" :ref="`lists[${index}]value`" type="email" class="form-control">
                      </div>
                    </div>

                    <div class="col-lg-1">
                      <div class="form-group">
                        <label>&ensp;</label>
                        <button v-tooltip="{content: 'Xóa',classes: ['danger'],targetClasses: ['it-has-a-tooltip']}" @click="removeItem(index)" class="form-control btn btn-danger btn-pressable"><i class="icon-fa icon-fa-close"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </tab-content>
            <tab-content title="Last step">
              Yuhuuu! This seems pretty damn simple
            </tab-content>
          </form-wizard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FormWizard, TabContent } from "vue-form-wizard";
import { Tabs, Tab } from "vue-tabs-component";
import { quillEditor } from "vue-quill-editor";
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
    quillEditor
  },
  data() {
    return {
      list: [
        {
          name: null,
          value: null
        }
      ]
    };
  },
  methods: {
    addItem() {
      this.list.push({
        name: null,
        value: null
      });
      let index = this.list.length - 1;
      // this.$nextTick(() => {
      //   this.$refs[`lists[${index}]name`][0].focus();
      // });
    },
    removeItem(index) {
      this.list.splice(index, 1);
    }
  }
};
</script>

<style>
</style>
