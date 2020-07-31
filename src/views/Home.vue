<template lang="pug">
  v-container(fluid)
    warehouse-info
</template>

<script>
import WarehouseInfo from '@/components/site/warehouseInfo'

export default {
  name: 'Home',
  components: {
    WarehouseInfo,
  },
}
</script>
