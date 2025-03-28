<template>
  <div class="register-wrapper">
    <div class="register-container">
      <div class="form-header">
        <h2>创建账号</h2>
      </div>
      <form class="floating-form" @submit.prevent="handleRegister">
        <!-- <div class="ID-style">
                  ID：{{ userID }}
                </div> -->
        <!-- <div class="input-group">
                    <input type="number" id="userID" v-model="userID" />
                    <label for="userID">ID</label>
                    <span class="highlight"></span>
                </div> -->
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
          <!-- <RouterLink to="/login" active-class="active">立即登录</RouterLink> -->
          <!-- <a href="/login">立即登录</a> -->
          <RouterLink to="/login">立即登录</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref } from "vue";
import axios from "axios";
import { RouterLink } from "vue-router";

const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const email = ref("");
const category = ref("");

const handleRegister = async () => {
  console.log({
    username: username.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
    email: email.value,
    category: category.value
  });
  // 检查密码和确认密码是否相同
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
    // 发送 POST 请求到后端
    const response = await axios.post(
      "http://121.36.9.36:8000/register/", //"http://121.36.9.36:5959/register/"
      data
    );
    if (response.data.status == "ok") {
      console.log("注册成功:", response.data);

      // 注册成功后跳转到登录页面
      window.location.href = "/login";
    } else {
      alert(response.data.message);
      return;
    }
  } catch (error) {
    console.error("注册失败:", error);
    console.log(response.data.message);
    alert(response.data.message);
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
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
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

.form-header p {
  color: #95a5a6;
  font-size: 16px;
}

.floating-form .input-group {
  position: relative;
  margin-bottom: 30px;
}

.input-group input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
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
  border-color: #3498db;
}

.input-group input:focus + label,
.input-group input:valid + label {
  top: 0;
  font-size: 14px;
  color: #3498db;
}

.verification-group {
  display: flex;
  gap: 10px;
}

.verification-group input {
  flex: 1;
}

.send-code-btn {
  padding: 0 20px;
  background: #e8f5fe;
  color: #3498db;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.send-code-btn:hover {
  background: #d0e9fd;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(to right, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
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
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
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
}

.form-footer a {
  color: #3498db;
  text-decoration: none;
  margin-left: 5px;
  font-weight: 600;
}

.form-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-container {
    padding: 20px;
  }

  .form-header h2 {
    font-size: 24px;
  }

  .input-group input {
    padding: 12px;
  }
}

@media (max-width: 768px) {
  .register-container {
    max-width: 400px;
    padding: 30px;
  }

  .form-header h2 {
    font-size: 28px;
  }

  .form-header p {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 20px;
    margin: 10px;
    max-width: 100%;
  }

  .form-header h2 {
    font-size: 24px;
  }

  .form-header p {
    font-size: 14px;
  }

  .input-group input {
    padding: 12px;
    font-size: 14px;
  }

  .input-group label {
    font-size: 14px;
  }

  .verification-group {
    flex-direction: column;
    gap: 5px;
  }

  .send-code-btn {
    width: 100%;
    padding: 12px;
  }

  .submit-btn {
    padding: 12px;
    font-size: 16px;
  }
}

@media (max-width: 320px) {
  .register-container {
    padding: 15px;
  }

  .form-header h2 {
    font-size: 20px;
  }

  .input-group {
    margin-bottom: 20px;
  }
}

.category-group {
  display: flex;
  margin-bottom: 30px;
  font-family: inherit;
  gap: 48px;
}

.option {
  margin-left: 10px;
  margin-right: 10px;
  flex: 1;
  text-align: center;
  position: center;
  overflow: hidden;
  border-radius: 8px;
  background: #f5f7fa;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.option input[type="radio"] {
  display: none;
}

.option label {
  display: block;
  padding: 10px 15px;
  font-size: 14px;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option:hover {
  background: #e0e9f5;
  border-color: #3498db;
}

.option input[type="radio"]:checked + label {
  background: #3498db;
  color: white;
  border-radius: 6px;
}
</style>
