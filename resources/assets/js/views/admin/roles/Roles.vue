<template>
  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Mailbox</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item"><a href="#">Apps</a></li>
        <li class="breadcrumb-item active">Mailbox</li>
      </ol>
    </div>
    <div class="mailbox">

      <div class="mailbox-content">
        <div class="mailbox-content-header">
          <div class="mailbox-actions">
            <div class="custom-control custom-checkbox mailbox-action" style="display:inline-block">
              <input id="customCheckAll" v-model="selectAll" type="checkbox" class="custom-control-input">
              <label class="custom-control-label" for="customCheckAll" />
            </div>

            <v-dropdown active-url="/admin/dashboard" theme-light class="mailbox-action">
              <a slot="activator" href="#" @click.prevent>
                <button class="btn btn-light dropdown-toggle" type="button">
                  Actions
                </button>
              </a>

              <v-dropdown-item>
                <a href="#" @click.prevent>Edit</a>
              </v-dropdown-item>
              <v-dropdown-item>
                <a href="#" @click.prevent>Delete</a>
              </v-dropdown-item>
              <v-dropdown-item>
                <a href="#" @click.prevent>Forward</a>
              </v-dropdown-item>
            </v-dropdown>

            <button type="button" class="btn btn-icon btn-light mailbox-action">
              <i class="icon-fa icon-fa-tag" />
            </button>
          </div>

          <div class="mailbox-filters">
            <div class="mail-search">
              <input id="inputEmailTo" v-model="searchText" type="email" placeholder="Search" class="form-control">
            </div>
          </div>
        </div>
        <table class="table table-hover">
          <tbody>
            <tr v-for="(mail,index) in filteredMails" :key="index" :class="{'read' : mail.read }" @click="openMailModal(mail)">
              <td class="cell-checkbox" @click.stop>
                <div class="custom-control custom-checkbox">
                  <input :id="index" v-model="selectedMails" :value="mail.id" type="checkbox" class="custom-control-input">
                  <label :for="index" class="custom-control-label" />
                </div>
              </td>
              <td class="cell-fav">
                <a href="#" class="btn-favorite" @click.prevent.stop="mail.favorite = !mail.favorite">
                  <i v-if="mail.favorite" class="icon-fa icon-fa-star active" />
                  <i v-else class="icon-fa icon-fa-star-o" />
                </a>
              </td>
              <td class="cell-user">
                <a class="user">
                  <img :src="mail.from.avatar" class="user-avatar">
                </a>
              </td>
              <td class="cell-content">
                <div class="content">
                  <div class="content-name">
                    {{ mail.from.name }}
                  </div>
                  <div class="content-subject">
                    {{ mail.title }}
                  </div>
                </div>
              </td>
              <td class="cell-attachment">
                <i class="icon-fa icon-fa-paperclip attachment-icon" />
              </td>
              <td class="cell-time">
                2 hours ago
              </td>
            </tr>
          </tbody>
        </table>
        <pagination @clicked="reloadData" :total-pages="totalPages" :current-page="currentPage" />
      </div>
      <transition name="fade">
        <mailbox-modal v-show="isModalVisible" :is-visible="isModalVisible" @close="closeMailModal" />
      </transition>

    </div>
  </div>
</template>

<script>
import MailboxModal from "../apps/mailbox/MailboxModal";
import Auth from "../../../services/auth";
import Pagination from "../../../components/paginate/ServerPagination";
export default {
  components: {
    MailboxModal,
    Pagination
  },
  data() {
    return {
      mails: [
        {
          id: "1",
          categories: ["inbox", "trash"],
          from: {
            avatar: "/assets/img/avatars/avatar.png",
            name: "Ashton White"
          },
          title:
            "Among going manor who did. Do ye is celebrated it sympathize considered..",
          favorite: false,
          read: false
        },
        {
          id: "2",
          categories: ["inbox", "important"],
          from: {
            avatar: "/assets/img/avatars/avatar1.png",
            name: "Ben Solo"
          },
          title: "Did shy say mention enabled through elderly improve.",
          favorite: false,
          read: false
        },
        {
          id: "3",
          categories: ["inbox", "sent"],
          from: {
            avatar: "/assets/img/avatars/avatar2.png",
            name: "Mark Futo"
          },
          title: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
          favorite: false,
          read: true
        },
        {
          id: "4",
          categories: ["inbox", "sent"],
          from: {
            avatar: "/assets/img/avatars/avatar.png",
            name: "Charlie Brown"
          },
          title: "Yet bed any for travelling assistance indulgence unpleasing.",
          favorite: false,
          read: true
        },
        {
          id: "5",
          categories: ["inbox", "trash"],
          from: {
            avatar: "/assets/img/avatars/avatar1.png",
            name: "Evan Sharma"
          },
          title: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
          favorite: false,
          read: true
        },
        {
          id: "6",
          categories: ["inbox", "trash"],
          from: {
            avatar: "/assets/img/avatars/avatar2.png",
            name: "Mercy Joseph"
          },
          title:
            "At engage simple father of period others except. My giving do summer of though ...",
          favorite: false,
          read: true
        },
        {
          id: "7",
          categories: ["inbox", "important"],
          from: {
            avatar: "/assets/img/avatars/avatar.png",
            name: "Shobha Thumpy"
          },
          title:
            "Whole front do of plate heard oh ought. His defective nor convinced residence own.",
          favorite: false,
          read: true
        },
        {
          id: "8",
          categories: ["inbox", "important"],
          from: {
            avatar: "/assets/img/avatars/avatar1.png",
            name: "Phoebe Richard"
          },
          title: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
          favorite: false,
          read: true
        },
        {
          id: "9",
          categories: ["inbox", "important"],
          from: {
            avatar: "/assets/img/avatars/avatar2.png",
            name: "Mark Futo"
          },
          title: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
          favorite: false,
          read: true
        },
        {
          id: "10",
          categories: ["inbox"],
          from: {
            avatar: "/assets/img/avatars/avatar.png",
            name: "Ben Solo"
          },
          title: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
          favorite: false,
          read: true
        }
      ],
      roles: null,
      isModalVisible: false,
      isLeftSidebarVisible: true,
      selectedMails: [],
      searchText: "",
      permissions: "role.view",
      totalPages: null,
      currentPage: null,
      count: null
    };
  },
  computed: {
    selectAll: {
      get: function() {
        return this.mails
          ? this.selectedMails.length === this.mails.length
          : false;
      },
      set: function(value) {
        let selectedMails = [];

        if (value) {
          this.mails.forEach(function(mail) {
            selectedMails.push(mail.id);
          });
        }

        this.selectedMails = selectedMails;
      }
    },
    filteredMails() {
      return this.mails.filter(mail => {
        let nameValid = true;

        if (this.searchText) {
          let searchText = this.searchText.toLowerCase();
          nameValid =
            mail.title.toLowerCase().includes(searchText) ||
            mail.from.name.toLowerCase().includes(searchText);
        }

        return nameValid;
      });
    }
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("permission-denied-403");
          } else {
            this.getRoles({});
          }
        });
      }
    });
    this.hideSidebarOnMobile();
  },
  methods: {
    onClickChild(value) {
      console.log(value); // someValue
    },
    async getRoles({ page, filter, sort }) {
      try {
        const response = await axios.get(
          `http://ws-api.lc/api/users?page=${page}`
        );
        let paginate = response.data.meta.pagination;
        console.log(response.data.data);
        this.currentPage = paginate.current_page;
        this.totalPages = paginate.total_pages;
        this.count = paginate.count;
        this.roles = {
          data: response.data.data,
          pagination: {
            totalPages: paginate.total_pages,
            currentPage: paginate.current_page,
            count: paginate.count
          }
        };
        return {
          data: response.data.data,
          pagination: {
            totalPages: paginate.total_pages,
            currentPage: page,
            count: paginate.count
          }
        };
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
    reloadData(page) {
      this.getRoles({ page });
    },
    openMailModal(mail) {
      mail.read = true;
      this.isModalVisible = true;
    },
    closeMailModal() {
      this.isModalVisible = false;
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
