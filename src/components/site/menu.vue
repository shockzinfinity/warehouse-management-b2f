<template lang="pug">
  div
    v-list
      v-list-item
        v-list-item-content
          v-list-item-title.title Application
          v-list-item-subtitle subtext
      v-divider
      v-list
        v-list-group(
          v-for="(item, i) in items"
          :key="i"
          v-model="item.active"
          :prepend-icon="item.icon"
          no-action
        )
          template(v-slot:activator)
            v-list-item-content
              v-list-item-title(v-text="item.title")
            v-list-item-action
              v-btn(icon @click="openDialogItem(i)") <v-icon>mdi-pencil</v-icon>

          v-list-item(
            v-for="(subItem, j) in item.subItems"
            :key="j"
            :to="subItem.to"
          )
            v-list-item-content
              v-list-item-title(v-text="subItem.title")
          v-list-item
            v-list-item-icon <v-icon>mdi-plus</v-icon>
            v-list-item-content
              v-list-item-title 서브추가하기
        v-list-item(@click="openDialogItem(-1)")
          v-list-item-icon <v-icon>mdi-plus</v-icon>
          v-list-item-content
            v-list-item-title 추가하기
    v-dialog(v-model="dialogItem" max-width="400")
      v-card
        v-card-title 수정하기
          v-spacer
          v-btn(icon @click="saveItem") <v-icon>mdi-content-save</v-icon>
        v-card-text
          v-text-field(v-model="formItem.title")
</template>

<script>
export default {
  props: ['items'],
  data () {
    return {
      dialogItem: false,
      dialogSubItem: false,
      formItem: {
        icon: '',
        title: ''
      },
      selectedItemIndex: -1
    }
  },
  methods: {
    openDialogItem (index) {
      // 메인 메뉴 아이템 추가

      this.selectedItemIndex = index
      this.dialogItem = true

      if (index < 0) {
        this.formItem.title = ''
      } else {
        this.formItem.title = this.items[index].title
      }
    },
    saveItem () {
      if (this.selectedItemIndex < 0) {
        this.items.push(this.formItem)
      } else {
        this.items[this.selectedItemIndex] = this.formItem
      }
      this.save()
    },
    async save () {
      try {
        await this.$firebase.database().ref().child('site').update({
          menu: this.items
        })
      } finally {
        this.dialogItem = false
      }
    }
  }
}
</script>
