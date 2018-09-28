<template>
  <div class="mailbox-content-footer">
    <ul class="pagination">
      <li class="page-item">
        <button :class="currentPage == 1 ? 'page-link disabled' : 'page-link'" :disabled="currentPage == 1" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
          <span class="sr-only">Previous</span>
        </button>
      </li>
      <li v-for="pageNumber in totalPages" :key="pageNumber+'a'" v-if="Math.abs(pageNumber - currentPage) < 3 || pageNumber == totalPages - 1 || totalPages == 0"
        :class=" pageNumber == currentPage ? 'page-item active' : 'page-item'">
        <button @click="updatePage(pageNumber)" :disabled="pageNumber == currentPage" class="page-link">{{pageNumber}}</button>
      </li>
      <li class="page-item">
        <button :class="currentPage == totalPages ? 'page-link disabled' : 'page-link'" :disabled="currentPage == totalPages"
          aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
          <span class="sr-only">Next</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      totalPages: null,
      currentPage: null
    },
    methods: {
      updatePage(page) {
        this.$emit("clicked", page);
      }
    }
  };

</script>

<style>
</style>
