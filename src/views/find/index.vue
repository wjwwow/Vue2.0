<template>
  <div class="find-container">

    <el-form ref="findForm" :model="findForm" :rules="findRules" class="find-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">找回密码</h3>
      </div>
      <div style="color: white ;" class="title-container">已知密码？<router-link to="/login"><span style="color: red;margin-bottom: 10px">返回登入</span></router-link></div>
      <el-form-item prop="username" label="用户名">
        <el-input
          ref="username"
          v-model="findForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="email" label="邮箱">
        <el-input
          ref="email"
          v-model="findForm.email"
          placeholder="email"
          name="email"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleFind"
        />

      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleFind">找回密码</el-button>


    </el-form>

  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    return{
      findForm:{
        username : '',
        email : ''
      },
      findRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        email: [{ required: true, trigger: 'blur', validator: checkEmail }]
      },
      loading: false,
    }
  },
  methods : {
    handleFind(){
      this.$refs.findForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.axios({
            method : "post",
            url : "http://46o2352s89.zicp.vip/vue-admin-template/findPass",
            data : this.findForm
          }).then((data) => {
            console.log(data)
            if (data.data==="success"){
              this.$router.push("/login")
              this.$message({
                message: '邮件发送成功',
                type: 'success'
              });
            }else {
              this.$message({
                message: '邮件发送失败，请检查用户名和邮箱是否输入正确',
                type: 'error'
              });
            }
            this.loading = false
          })
        }
      })
    }
  }
}
</script>


<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.find-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .find-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }



}
</style>

