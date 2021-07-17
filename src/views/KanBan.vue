<template>
  <el-row :gutter="30" justify="center">
    <CardList
      v-for="(e, i) in kanban"
      :key="i"
      :title="e.title"
      :color="e.color"
      :list="e.items"
      @add="add"
      :rowid="`${i}`"
    />
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import CardList from "@/components/CardList.vue"; // @ is an alias to /src
import { mapActions, mapState } from "vuex";
import { IKanBan } from "@/store/types";
@Options({
  components: {
    CardList,
  },
  methods: {
    ...mapActions(["add", "getCards", "loadKanBan"]),
  },
  computed: {
    ...mapState(["kanban", "auth"]),
  },
})
export default class KanBan extends Vue {
  loadKanBan!: () => Promise<void>;
  kanban!: IKanBan;
  add!: () => void;
  auth!: {
    token: string;
    isLogined: boolean;
  };
  created(): void {
    this.loadKanBan();
  }
}
</script>
