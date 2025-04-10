<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
import { useNav } from "@/layout/hooks/useNav";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { initRouter, getTopMenu } from "@/router/utils";
import { bg, logo, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
import axios from "axios";
defineOptions({
  name: "Login"
});
const router = useRouter();
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();

const { initStorage } = useLayout();
initStorage();

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title } = useNav();

const ruleForm = reactive({
  username: "",
  password: ""
});

const gotoRegister = () => {
  useUserStoreHook()
    .loginByUsername({ username: ruleForm.username, password: "admin123" })
    .then(res => {
      if (res.success) {
        // 获取后端路由
        return initRouter().then(() => {
          router.push("/register").then(() => {
            message("注册页面", { type: "success" });
          });
        });
      } else {
        message("跳转失败", { type: "error" });
      }
    })
    .finally(() => (loading.value = false));
};

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true; //http://121.36.9.36:5959
      const response = await axios.post("http://121.36.9.36:8000/login/", {
        username: ruleForm.username,
        password: ruleForm.password
      });
      if (response.data.success) {
        useUserStoreHook().loginByUsername({
          username: ruleForm.username,
          password: ruleForm.password
          // username: response.data.data_user.user.name,
          // password: response.data.data_user.user.user_password
        });
        console.log(response);
        useUserStoreHook()
          .loginByUsername({
            username: ruleForm.username,
            password: "admin123"
          })
          .then(res => {
            if (res.success) {
              // 获取后端路由
              return initRouter().then(() => {
                router.push(getTopMenu(true).path).then(() => {
                  message("登录成功", { type: "success" });
                });
              });
            } else {
              message("登录失败", { type: "error" });
            }
          })
          .finally(() => (loading.value = false));
      } else {
        message("登录失败", { type: "error" });
      }
    }
  });
};

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (["Enter", "NumpadEnter"].includes(code)) {
    onLogin(ruleFormRef.value);
  }
}

onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <!-- <avatar class="avatar" /> -->
          <img :src="logo" alt="Logo" class="logo" />
          <Motion>
            <h2 class="outline-none">{{ title }}</h2>
          </Motion>

          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
          >
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                  }
                ]"
                prop="username"
              >
                <el-input
                  v-model="ruleForm.username"
                  clearable
                  placeholder="账号"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  v-model="ruleForm.password"
                  clearable
                  show-password
                  placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-4"
                style="background-color: #b381ae; border-color: #cec3ec"
                size="default"
                type="primary"
                :loading="loading"
                @click="onLogin(ruleFormRef)"
              >
                登录
              </el-button>
            </Motion>
          </el-form>
          <Motion :delay="250">
            <el-button
              class="w-full mt-4"
              style="background-color: #b381ae; border-color: #cec3ec"
              size="default"
              type="primary"
              @click="gotoRegister"
            >
              注册
            </el-button></Motion
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-input) {
  font-size: 16px;
  height: 48px;

  .el-input__wrapper {
    padding: 8px 15px;
  }
}

:deep(.el-button) {
  font-size: 16px;
  padding: 12px 20px;
  height: auto;
  margin-top: 20px;
}
</style>
