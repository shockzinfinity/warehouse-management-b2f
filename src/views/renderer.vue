<template lang="pug">
  warehouse-form(v-if="collection === 'warehouse' && document === 'modify'")

  //- board-index(v-else-if="collection === 'board' && document === 'list'")
  board-content(v-else-if="collection === 'board' && !action" :document="document")
  board-form(v-else-if="collection === 'board' && action === 'board-write'" :document="document" :action="action")
  board-article-form(v-else-if="collection === 'board' && action === 'article-write'" :document="document" :action="action")

  rack-index(v-else-if="collection === 'rack' && document === 'list'")
  rack-content(v-else-if="collection === 'rack' && !action" :document="document")
  rack-form(v-else-if="collection === 'rack' && action === 'rack-write'" :document="document" :action="action")

  box-index(v-else-if="collection === 'box' && document === 'list'")
  box-content(v-else-if="collection === 'box' && !action" :document="document")
  box-form(v-else-if="collection === 'box' && action === 'box-write'" :document="document" :action="action")
  box-sample-form(v-else-if="collection === 'box' && action === 'sample-write'" :document="document" :action="action")

  //- page-index(v-else-if="collection === 'page' && document === 'list'")
  //- page-content(v-else-if="collection === 'page'" :document="document")
  error-page(v-else)
</template>

<script>
import BoardIndex from './board/index'
import BoardContent from './board/content'
import BoardForm from './board/form'
import BoardArticleForm from './board/article/form'
import WarehouseForm from './warehouse/form'
import RackIndex from './rack/index'
import RackContent from './rack/content'
import RackForm from './rack/form'
import BoxIndex from './box/index'
import BoxContent from './box/content'
import BoxForm from './box/form'
import BoxSampleForm from './box/sample/form'
import PageIndex from './page/index'
import PageContent from './page/content'
import ErrorPage from './404'

export default {
  components: {
    BoardIndex,
    BoardContent,
    BoardForm,
    BoardArticleForm,
    WarehouseForm,
    RackIndex,
    RackContent,
    RackForm,
    BoxIndex,
    BoxContent,
    BoxForm,
    BoxSampleForm,
    PageIndex,
    PageContent,
    ErrorPage,
  },
  computed: {
    collection() {
      return this.$route.params.collection
    },
    document() {
      return this.$route.params.document
    },
    action() {
      return this.$route.params.action
    },
  },
}
</script>
