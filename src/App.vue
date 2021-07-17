<template>
  <el-container>
    <el-header style="text-align: right">
      <el-button v-show="$route.path !== '/'" @click="this.$router.push('/')"
        ><i class="el-icon-s-home"></i
      ></el-button>
      <el-button @click="authBtnHandler">{{
        auth.isLogined ? "Выйти" : "Войти"
      }}</el-button>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { mapState, mapMutations, mapActions } from "vuex";
@Options({
  computed: {
    ...mapState(["auth"]),
  },
  methods: {
    ...mapMutations(["signout"]),
    ...mapActions(["checkAuth"]),
  },
})
export default class App extends Vue {
  checkAuth!: () => void;
  signout!: () => void;
  auth!: {
    token: string;
    isLogined: boolean;
  };
  authBtnHandler(): void {
    if (this.auth.isLogined) this.signout();
    else this.$router.push("/auth");
  }
  created(): void {
    if (!this.auth.isLogined) this.checkAuth();
  }
}
</script>
<style lang="scss"></style>
