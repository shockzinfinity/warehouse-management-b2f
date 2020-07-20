<template lang="pug">
  v-container(fluid)
    cover-upload(:currentSrc="temp" type="racks")
</template>

<script>
import CoverUpload from '@/components/CoverUpload'

export default {
  components: {
    CoverUpload
  },
  data () {
    return {
      temp: 'https://firebasestorage.googleapis.com/v0/b/warehouse-management-b2f.appspot.com/o/racks%2Frack-3%2Fcover%2Fp1232400712.jpg?alt=media&token=6d7f4599-efba-4bb3-a173-b21cd1e8441a'
    }
  }
}
</script>
