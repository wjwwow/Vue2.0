<template>
  <el-form   ref="ruleForm" :rules="rules" class="demo-ruleForm" :model="ruleForm" label-width="120px">
    <el-form-item label="Name">
      <el-input v-model="name" disabled="disabled"/>
    </el-form-item>
    <el-form-item label="Email" prop="email">
      <el-input v-model="ruleForm.email" placeholder="请输入要修改的邮箱"/>
      <el-input v-model="ruleForm.email" placeholder="请输入要修改的邮箱"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"  @click="submit('ruleForm')">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data(){
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
    return {
      ruleForm: {
        email:'',
      },
      rules : {
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
      }
    }
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {

        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
    ]),
    email : {
      get(){
        return this.user.email
      },
      set(v){
        this.user.email = v
      }
    },
    avatar:{
      get(){
        return this.user.avatar
      },
      set(v){
        this.user.avatar = v
      }
    }

  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.foo();
        } else {
          return false;
        }
      })},
    foo(){
      this.axios({
        url : "http://10.11.2.51:8080/vue-admin-template/updateEmail",
        method : "post",
        data : {
          username : this.name,
          email : this.ruleForm.email
        }
      }).then(r =>{
        location.reload()
        this.$message({
          message: '邮箱已经成功修改',
          type: 'success',
          duration: 5 * 1000
        })
      })
    }
  }
}
</script>
