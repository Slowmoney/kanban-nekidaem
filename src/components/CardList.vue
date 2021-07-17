<template>
  <el-col :xs="24" :sm="6" :xl="4" :span="6" class="card-list">
    <el-card :body-style="{ padding: '0px' }">
      <div class="card-list__title" :style="{ backgroundColor: color }">
        {{ title }} {{ count }}
      </div>
      <draggable
        :disabled="!auth.isLogined"
        :list="list"
        group="card"
        item-key="name"
        @change="change"
      >
        <template #item="{ element }">
          <el-row class="card-list-item">
            <el-col :span="20">
              <div><big>id: </big>{{ element.id }}</div>
              <div style="word-break: break-word">{{ element.text }}</div>
            </el-col>
            <el-col :span="4">
              <el-button
                v-if="auth.isLogined"
                @click="deleteItem(element.id)"
                icon="el-icon-delete"
                circle
              ></el-button>
            </el-col>
          </el-row>
        </template>

        <template #footer>
          <el-row style="padding: 16px" v-if="auth.isLogined">
            <el-col :span="18"><el-input v-model="newtext" /></el-col>
            <el-col :span="6"
              ><el-button style="margin-left: 10px" @click="add"
                >Add</el-button
              ></el-col
            >
          </el-row>
        </template>
      </draggable>
    </el-card>
  </el-col>
</template>

<script lang="ts">
import { ICard, IKanBanItem } from "@/store/types";
import { Options, Vue } from "vue-class-component";
import draggable, { ChangeEvent } from "vuedraggable";
import { mapActions, mapState } from "vuex";
import type { Row, UpdateData } from "@/plugin/api";
@Options({
  props: {
    title: String,
    color: String,
    list: { type: Array, default: [] },
    rowid: String,
  },
  components: {
    draggable,
  },
  methods: {
    ...mapActions(["getCards", "deleteItem", "updateItem"]),
  },
  computed: {
    ...mapState(["auth"]),
  },
})
export default class CardList extends Vue {
  updateItem!: (data: UpdateData) => Promise<void>;
  deleteItem!: (id: number) => Promise<void>;
  getCards!: (row: Row) => void;
  auth!: {
    token: string;
    isLogined: boolean;
  };
  title!: string;
  color!: string;
  list!: IKanBanItem[];
  newtext = "";
  rowid!: Row;
  get count(): number {
    return this.list.length;
  }
  add(): void {
    if (!this.newtext) return;
    this.$emit("add", { row: this.rowid.toString(), text: this.newtext });
    this.newtext = "";
  }
  mounted(): void {
    this.getCards(this.rowid);
  }
  change(e: ChangeEvent<ICard>): void {
    if (e && e.added)
      this.updateItem({ item: e.added.element, row: this.rowid });
  }
}
</script>
<style scoped lang="scss">
.card-list {
  &-item {
    padding: 1em;
  }
  &__title {
    padding: 1em;
  }
}
</style>
