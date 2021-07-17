<template>
  <div v-loading="loading">
    <div v-if="auth.isLogging">
      <el-button @click="signout">Выйти</el-button>
    </div>
    <div v-if="!auth.isLogging">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="Авторизация" name="login">Авторизация</el-tab-pane>
        <el-tab-pane label="Регистрация" name="registation"
          >Регистрация</el-tab-pane
        >
      </el-tabs>
      <el-alert
        v-for="(e, i) in errors('non_field_errors')"
        :key="i"
        :title="e"
        type="error"
        closable
      >
      </el-alert>
      <el-form
        :model="formdata"
        status-icon
        :rules="rules"
        ref="form"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item ref="username" label="Username" prop="username">
          <el-input
            type="text"
            v-model="formdata.username"
            autocomplete="off"
          ></el-input>
          <el-alert
            v-for="(e, i) in errors('username')"
            :key="i"
            :title="e"
            type="error"
            closable
          >
          </el-alert>
        </el-form-item>
        <el-form-item
          v-if="activeName === 'registation'"
          label="Email"
          prop="email"
        >
          <el-input v-model="formdata.email" autocomplete="off"></el-input>
          <el-alert
            v-for="(e, i) in errors('email')"
            :key="i"
            :title="e"
            type="error"
            closable
          >
          </el-alert>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            type="password"
            v-model="formdata.password"
            autocomplete="off"
          ></el-input>
          <el-alert
            v-for="(e, i) in errors('password')"
            :key="i"
            :title="e"
            type="error"
            closable
          >
          </el-alert>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">{{
            activeName == "login" ? "Войти" : "Зарегистрироваться"
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import api, { IAuthData } from "@/plugin/api";
import { Options, Vue } from "vue-class-component";
import { mapState, mapMutations, mapActions } from "vuex";
@Options({
  computed: {
    ...mapState(["auth"]),
  },
  methods: {
    ...mapMutations(["setLogined", "signout"]),
    ...mapActions(["checkAuth"]),
  },
})
export default class Auth extends Vue {
  checkAuth!: () => Promise<void>;
  setLogined!: (token: string[]) => void;
  signout!: () => void;
  auth!: {
    token: string;
    isLogging: boolean;
  };
  loading = false;
  declare $refs: {
    form: HTMLFormElement;
  };
  info: Record<string, string[]> = {};
  activeName = "login";
  formdata: IAuthData = {
    username: "",
    email: "",
    password: "",
  };

  toLogin = false;
  async register(): Promise<void> {
    this.loading = true;
    const data = await api.users.create(this.formdata);
    if (data.status >= 400) {
      this.info = data.data;
      console.log(this.info);
    }
    console.log(data);
    this.loading = false;
    if (data.status == 200) {
      this.setLogined(data.data.token);
      this.resetForm();
    }
  }
  async login(): Promise<void> {
    this.loading = true;
    const data = await api.users.login(this.formdata);
    if (data.status >= 400) {
      this.info = data.data;
      console.log(this.info);
    }
    console.log(data);
    this.loading = false;
    if (data.status == 200) {
      this.setLogined(data.data.token);
      this.resetForm();
      this.$router.push("/");
    }
  }
  submitForm(): void {
    this.$refs.form.validate((valid: boolean, data: IAuthData) => {
      console.log(valid, data);
      console.log(this.$refs.form);
      if (valid) {
        if (this.activeName == "login") this.login();
        else this.register();
        return true;
      } else {
        return false;
      }
    });
  }
  resetForm(): void {
    this.$refs.form.resetFields();
  }
  rules = {
    username: [
      {
        required: true,
        message: "Введите имя пользователя",
        trigger: "blur",
      },
    ],
    email: [
      {
        message: "Введите имя",
        trigger: "change",
      },
    ],
    password: [
      {
        required: true,
        message: "Введите пароль",
        trigger: "blur",
      },
    ],
  };
  errors(name: string): string[] {
    return this.info[name];
  }
  async mounted(): Promise<void> {
    if (!this.auth.isLogging) await this.checkAuth();
    if (this.auth.isLogging) this.$router.push("/");
  }
}
</script>
