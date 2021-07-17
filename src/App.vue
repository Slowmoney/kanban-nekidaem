<template>
  <el-container>
    <el-header style="text-align: right">
      <el-button v-show="$route.path !== '/'" @click="this.$router.push('/')"
        ><i class="el-icon-s-home"></i
      ></el-button>
      <el-button @click="authBtnHandler">{{
        auth.isLogging ? "Выйти" : "Войти"
      }}</el-button>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { mapState, mapMutations } from "vuex";
@Options({
  computed: {
    ...mapState(["auth"]),
  },
  methods: {
    ...mapMutations(["signout"]),
  },
})
export default class App extends Vue {
  signout!: () => void;
  auth!: {
    token: string;
    isLogging: boolean;
  };
  authBtnHandler(): void {
    if (this.auth.isLogging) this.signout();
    else this.$router.push("/auth");
  }
  created(): void {
    if (!this.auth.isLogging) {
      //this.$router.push("auth");
    }
  }
}
</script>
<style lang="scss"></style>
