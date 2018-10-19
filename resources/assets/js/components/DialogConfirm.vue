<template>
<!-- The Modal -->
  <div class="modal" v-model="value">
    <div class="modal-dialog">
      <div class="modal-content">

        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Modal Heading</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          Modal body..
        </div>

        <!-- Modal footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" @click="accept">Delete</button>
          <button type="button" class="btn btn-danger" @click="cancel">Close</button>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
export default{
  name: 'DialogConfirm',
  props: ['value'],
  methods: {
    accept () {
      this.$emit('input', true)
    },
    cancel () {
      this.$emit('input', false)
    }
  }
}
</script>
