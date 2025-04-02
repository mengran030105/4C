<template>
  <div class="register-wrapper">
    <img :src="bg" class="wave" />
    <div class="register-container">
      <div class="illustration-container">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="form-container">
        <div class="form-header">
          <h2>创建账号</h2>
        </div>
        <form class="floating-form" @submit.prevent="handleRegister">
          <div class="input-group">
            <input
              id="username"
              v-model="username"
              type="text"
              required
              maxlength="20"
            />
            <label for="username">昵称</label>
            <span class="highlight" />
          </div>
          <div class="input-group">
            <input
              id="password"
              v-model="password"
              type="password"
              required
              minlength="6"
              maxlength="20"
            />
            <label for="password">密码</label>
            <span class="highlight" />
          </div>
          <div class="input-group">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              minlength="6"
              maxlength="20"
            />
            <label for="confirmPassword">确认密码</label>
            <span class="highlight" />
          </div>
          <div class="input-group">
            <input id="email" v-model="email" type="email" required />
            <label for="email">邮箱地址</label>
            <span class="highlight" />
          </div>
          <div class="category-group">
            <div class="option">
              <input
                id="enterprise"
                v-model="category"
                type="radio"
                name="category"
                value="enterprise"
              />
              <label for="enterprise">企业</label>
            </div>
            <div class="option">
              <input
                id="personal"
                v-model="category"
                type="radio"
                name="category"
                value="personal"
              />
              <label for="personal">个人</label>
            </div>
            <div class="option">
              <input
                id="bank"
                v-model="category"
                type="radio"
                name="category"
                value="bank"
              />
              <label for="bank">银行</label>
            </div>
          </div>

          <button type="submit" class="submit-btn">
            <span>立即注册</span>
            <i class="arrow-icon" />
          </button>
          <div class="form-footer">
            <span>已有账号？</span>
            <RouterLink to="/login">立即登录</RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref } from "vue";
import axios from "axios";
import { RouterLink } from "vue-router";
import { toRaw } from "vue";
import { bg, illustration } from "../login/utils/static";

const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const email = ref("");
const category = ref("");

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert("密码和确认密码不匹配，请重新输入！");
    return;
  }

  const data = {
    username: username.value,
    password: password.value,
    email: email.value,
    category: category.value,
    ConfirmPassword: confirmPassword.value
  };

  try {
    const response = await axios.post(
      "http://121.36.9.36:8000/register/",
      data
    );
    if (response.data.status == "ok") {
      window.location.href = "/login";
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error("注册失败:", error);
    alert(error.response?.data?.message || "注册失败，请稍后重试");
  }
};
</script>

<style scoped>
.register-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
}

.wave {
  position: absolute;
  height: 100%;
  left: 0;
  bottom: 0;
  z-index: 0;
}

.register-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.illustration-container {
  flex: 1;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.illustration-container svg {
  width: 100%;
  max-width: 500px;
  height: auto;
}

.form-container {
  flex: 1;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-header h2 {
  color: #2c3e50;
  font-size: 32px;
  margin-bottom: 10px;
  font-weight: 700;
}

.floating-form {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.input-group {
  position: relative;
  margin-bottom: 25px;
}

.input-group input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: transparent;
}

.input-group label {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 0 5px;
  color: #95a5a6;
  font-size: 16px;
  transition: all 0.3s ease;
  pointer-events: none;
}

.input-group input:focus,
.input-group input:valid {
  border-color: #b381ae;
  outline: none;
}

.input-group input:focus + label,
.input-group input:valid + label {
  top: 0;
  font-size: 14px;
  color: #b381ae;
}

.category-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  gap: 10px;
}

.option {
  flex: 1;
  position: relative;
}

.option input[type="radio"] {
  position: absolute;
  opacity: 0;
}

.option label {
  display: block;
  padding: 12px;
  text-align: center;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option input[type="radio"]:checked + label {
  border-color: #b381ae;
  background-color: #f5e9f4;
  color: #b381ae;
  font-weight: 500;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(to right, #c19dbe, #b381ae);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(179, 129, 174, 0.3);
}

.arrow-icon {
  border: solid white;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(-45deg);
}

.form-footer {
  text-align: center;
  margin-top: 20px;
  color: #95a5a6;
  font-size: 14px;
}

.form-footer a {
  color: #b381ae;
  text-decoration: none;
  margin-left: 5px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.form-footer a:hover {
  color: #9a6b96;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .register-container {
    flex-direction: column;
    max-width: 600px;
  }
  
  .illustration-container {
    padding: 30px;
  }
  
  .form-container {
    padding: 40px 30px;
  }
}

@media (max-width: 768px) {
  .register-container {
    border-radius: 0;
    min-height: 100vh;
  }
  
  .category-group {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .form-container {
    padding: 30px 20px;
  }
  
  .form-header h2 {
    font-size: 28px;
  }
  
  .input-group input {
    padding: 12px;
  }
  
  .submit-btn {
    padding: 12px;
    font-size: 15px;
  }
}
</style>