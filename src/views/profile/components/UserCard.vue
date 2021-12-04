<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>关于我</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb v-if="avatar!=null" v-model="avatar" :image="avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>Hello</div>
          {{ name }}
        </pan-thumb>
      </div>

      <div class="box-center">
        <el-button type="primary" icon="el-icon-upload" style="bottom: 15px;" @click="imagecropperShow=true">
          修改头像
        </el-button>
      </div>

      <div class="box-center">
        <div class="user-name text-center"> {{ name }}</div>
      </div>
      <div class="box-center">
        <div class="user-role text-center text-muted">{{ email }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>个人简介</span></div>
        <div class="user-bio-section-body">
          <template v-if="edit">
          <div class="text-muted">
            <el-input v-model="introduction" class="edit-input" type="textarea" size="small" rows="6" autosize="autosize"/>
          </div>
          <el-button
            class="cancel-btn"
            size="small"
            icon="el-icon-refresh"
            type="warning"
            @click="cancelEdit()"
          >
            cancel
          </el-button>
          </template>

            <textarea v-else style="text-indent: 15px;width: 100%;
              height: 100%;
              border: none;
              resize: none;
              cursor: pointer;
" rows="5">
              {{ introduction }}
            </textarea>


          <el-button
            v-if="edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit()"
          >
            Ok
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit=!edit"
          >
            修改简介
          </el-button>
        </div>
      </div>
    </div>
    <div>
    </div>

          <image-cropper
            v-show="imagecropperShow"
            :key="imagecropperKey"
            :width="300"
            :height="300"
            url="http://46o2352s89.zicp.vip/vue-admin-template/upload"
            lang-type="en"
            @close="close"
            @crop-upload-success="cropSuccess"
          />
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import ImageCropper from '@/components/ImageCropper'
import { mapGetters } from 'vuex'
import user from '@/store/modules/user'

export default {
  components: { PanThumb ,ImageCropper},
  data() {
    return{
      edit : false,
      imagecropperShow: false,
      imagecropperKey: 0,
    }
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          role: ''
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
    ]),
    introduction : {
      get(){
        return this.user.introduction
      },
      set(v){
        this.user.introduction = v
      }
    },
    email:{
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
    confirmEdit() {
      this.edit = false
      this.orgintro = this.introduction
      this.axios({
        method : "POST",
        url : "http://46o2352s89.zicp.vip/vue-admin-template/updateUser",
        data : {
          username : this.name,
          introduction : this.introduction
        }
      }).then(res =>{
        this.$message({
          message: 'The title has been edited',
          type: 'success'
        })
      })
    },
    cancelEdit() {
      this.edit = false
      this.introduction = this.orgintro
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.avatar = "http://46o2352s89.zicp.vip/vue-admin-template/static/upload/"+resData
      location.reload()
      this.axios({
          url : "http://46o2352s89.zicp.vip/vue-admin-template/updateimg",
          method : "post",
        data : {
          username : this.name,
          avatar : this.avatar
        }
      }).then()

    },
    close() {
      this.imagecropperShow = false
    }
  }

}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
