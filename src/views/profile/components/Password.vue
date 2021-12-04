<template>
  <div>
  <el-form v-if="ruleForm.step===1" ref="ruleForm" :rules="rules" class="demo-ruleForm" :model="ruleForm" label-width="120px">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="ruleForm.username"/>
    </el-form-item>
    <el-form-item label="原密码" prop="password" type="password">
      <el-input type="password" v-model="ruleForm.password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary"  @click="handleLogin()">下一步</el-button>
    </el-form-item>
  </el-form>
  <el-form v-if="ruleForm.step===2" :rules="newrule" :model="newruleForm" class="demo-ruleForm" ref="newruleForm" label-width="120px">
    <el-form-item label="新密码" prop="newpassword">
      <el-input v-model="newruleForm.newpassword" />
    </el-form-item>
    <el-form-item label="确认密码" prop="repassword">
      <el-input v-model="newruleForm.repassword"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"  @click="handupdate()">提交</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data(){
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.newruleForm.newpassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6个字符'))
      } else {
        callback()
      }
    }
    return{
      ruleForm: {
        username : '',
        password: '',
        step: 1,

      },
      newruleForm : {
        repassword : '',
        newpassword : '',
      },
      rules : {
        password: [
          {
            required: true,
            message: '请输入原密码',
            trigger: 'blur',
          },
          {
            validator: validatePassword,
            message: '密码长度过短',
            trigger: 'blur',
          },
        ],
        username: [
          {
            required : true,
            message : "请输入用户名",
            trigger : 'blur'
          }
        ],

      },
      newrule : {
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
        newpassword: [
          {
            required:true,
            message : "请输入新密码",
            trigger : 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.ruleForm).then(() => {
            this.$message.success("验证通过")
            this.ruleForm.step++
          },()=>{
            this.$message.error("用户名或密码错误，请重新输入！")
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handupdate(){
      this.$refs.newruleForm.validate(valid=> {
        if (valid) {
          this.axios({
            method: 'post',
            url: "http://10.11.2.51:8080/vue-admin-template/updateUser",
            data: {
              "username": this.name,
              "password": this.newruleForm.newpassword
            }
          }).then(res => {
            if (res.data==="success"){
              this.$message.success("修改成功")
              this.$store.dispatch('user/resetToken')
              this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            }else {
              this.$message.error("修改失败")
            }

          })
        }
      })
    }
  },
  computed:{
    ...mapGetters([
      'name',
    ]),
  }
}
</script>

<style scoped>

</style>
