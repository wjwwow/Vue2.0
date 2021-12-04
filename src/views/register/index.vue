<template>

  <div class="register-container">

      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="register-form"
        auto-complete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">注册</h3>
        </div>
        <div style="color: white ;" class="title-container">已有账号？<router-link to="/login"><span style="color: red">前往登入</span></router-link></div>
        <el-form-item label="用户名" prop="username" >
          <el-input v-model="ruleForm.username" placeholder="请输入用户名" type="text" tabindex="1" auto-complete="on"></el-input>
        </el-form-item>
        <el-form-item label="密码"  prop="password">
          <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"  tabindex="2" auto-complete="on"></el-input>
        </el-form-item>
        <el-form-item label="确认密码"  prop="repassword">
          <el-input type="password" v-model="ruleForm.repassword" placeholder="请输入确认密码" tabindex="3" auto-complete="on"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" >
          <el-input v-model="ruleForm.email" placeholder="请输入邮箱" tabindex="4" auto-complete="on"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm.code" placeholder="请输入验证码" style="width: 150px; " tabindex="5" auto-complete="on"></el-input>
          <span style="display: inline-block;width: 150px;height: 40px;border: 1px solid #D7D7D7; margin-left: 25px" @click="changeImgCode()">
            <img :src="imgCode" style="width: 100%;height: 100%;cursor: pointer;"/>
        </span>
        </el-form-item>

          <el-button type="primary" @click="submitForm('ruleForm')" style="width:100%;margin-bottom:30px;">注册</el-button>

      </el-form>
    </div>


</template>

<script>
export default {
  name: "register",
  data() {
    var validatePass2 = (rule, value, callback) => {
     if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
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
    var checkUserName = (rule, value, callback) => {
      if (value !== '') {
        this.usernameRules().then(res=>{
          if(res) {
            callback(new Error('用户名已存在'))
          }else {
            callback()
          }
        })
      }
    }
    return {
      ruleForm: {
        username: '',
        password: '',
        repassword:'',
        email:'',
        code : ''
      },
      imgCode: 'http://46o2352s89.zicp.vip/vue-admin-template/kaptcha/1',
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 8,
            message: '用户名的长度为3到8个字符串',
            trigger: 'blur',
          },
          {
            validator: checkUserName,
            message: '用户名已存在',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: 'blur',
          },
          {
            min: 5,
            max: 16,
            message: '密码的长度为5到16个字符串',
            trigger: 'blur',
          }
        ],
        repassword: [
          {
            required: true,
            message: "请输入确认密码",
            trigger: 'blur',
          },
          {
            validator: validatePass2,
            message: '两次输入的密码不一致',
            trigger: 'blur',
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur',
          },
          {
            validator: checkEmail,
            message: '邮箱的格式不正确',
            trigger: 'blur',
          },
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur',
          },

        ],
      }
    }
  },
  methods:{
    submitForm(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.foo();
      } else {
        return false;
      }
      })},

      foo(){
      this.axios({
        method:"POST",
        url:"http://46o2352s89.zicp.vip/vue-admin-template/register",
        data:{
          "username": this.ruleForm.username,
          "password": this.ruleForm.password,
          "email": this.ruleForm.email,
          "code": this.ruleForm.code
        }
      }).then((response)=>{
        if("success"===response.data){
          this.$message({
            message: '注册成功',
            type: 'success'
          });
          this.$router.push("/login")
        }else if("验证码错误"===response.data){
          this.$message.error('验证码错误');
        }else if ("error"===response.data){
          this.$message.error('注册失败');
        }
      })
    },
     async usernameRules() {
       const {data: res} = await this.axios.get("http://46o2352s89.zicp.vip/vue-admin-template/checkUserName/" + this.ruleForm.username);
       return res === "exist";
     },
    changeImgCode() {
      var num=Math.ceil(Math.random()*10);//生成一个随机数（防止缓存）
      this.imgCode = "http://46o2352s89.zicp.vip/vue-admin-template/kaptcha/"+num;
    },
  },




}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.register-container {
  .el-input {

    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;

  }
  .el-form-item__label{
    text-align: center;
    font-size: 16px;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .register-form {
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

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
