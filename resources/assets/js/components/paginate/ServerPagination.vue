<template>
  
</template>

<script>
export default {
  props: {
    pagination: {
      type: Object,
      default: () => {
        return {
          count: 25,
          totalPages: 1,
          currentPage: 1
        };
      }
    },
    apiUrl: {
      type: String,
      default: ""
    }
  },
  methods: {
    async fetchData({ page, filter, sort }) {
      try {
        const response = await axios.get(
          `http://ws-api.lc/api/${this.apiUrl}/&page=${page}`
        );
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
    }
  }
};
</script>

<style>
</style>
