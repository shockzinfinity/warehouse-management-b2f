<template lang="pug">
  board-index(v-if="collection === 'board' && document === 'list'")
  board-content(v-else-if="collection === 'board' && !action" :document="document")
  board-form(v-else-if="collection === 'board'" :document="document" :action="action")
  page-index(v-else-if="collection === 'page' && document === 'list'")
  page-content(v-else-if="collection === 'page'" :document="document")
  error-page(v-else)
</template>

<script>
import BoardIndex from './board/index'
import BoardContent from './board/content'
import BoardForm from './board/form'
import PageIndex from './page/index'
import PageContent from './page/content'
import ErrorPage from './404'

export default {
  components: {
    BoardIndex,
    BoardContent,
    BoardForm,
    PageIndex,
    PageContent,
    ErrorPage
  },
  computed: {
    collection () {
      return this.$route.params.collection
    },
    document () {
      return this.$route.params.document
    },
    action () {
      return this.$route.params.action
    }
  }
}
</script>
