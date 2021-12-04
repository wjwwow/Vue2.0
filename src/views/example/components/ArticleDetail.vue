<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
        <el-button v-loading="loading" style="margin-left: 85%;margin-top: 2%" type="success" @click="submitForm">
          发表博客
        </el-button>
      <div class="createPost-main-container">
        <el-row>

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                标题：
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="60px" label="作者:" class="postInfo-container-item">
                    <el-input v-text="this.name" disabled="disabled"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label-width="120px" label="编辑时间:" class="postInfo-container-item">
                    <el-date-picker v-model="displayTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Select date and time" />
                  </el-form-item>
                </el-col>

              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="70px" label="简介:">
          <el-input v-model="postForm.content_short" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>


      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件

import { fetchArticle } from '@/api/article'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
import { mapGetters } from 'vuex'

const defaultForm = {
  title: '', // 文章题目
  content: '', // 文章内容
  content_short: '', // 文章摘要
  image_uri: '', // 文章图片
  display_time: +new Date(), // 前台展示时间
  id: '',
  comment_disabled: false,
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Upload, Sticky, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    },
    ...mapGetters([
      'name',
    ]),
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchArticle(id).then(response => {
        // just for test
        console.log(response)
        this.postForm.title = response.title
        this.postForm.content_short = response.contentShort
        this.postForm.content = response.content
        this.postForm.display_time = +new Date()
        this.postForm.id = id
        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑博客'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑博客'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit){
            this.axios({
              method : "post",
              url : "http://46o2352s89.zicp.vip/vue-admin-template/article/update",
              data : {
                "title": this.postForm.title, // 文章题目
                "content": this.postForm.content, // 文章内容
                "contentShort": this.postForm.content_short, // 文章摘要
                "imageUri": this.postForm.image_uri, // 文章图片
                "displayTime": +new Date(), // 前台展示时间
                "id": this.postForm.id,
                "username": this.name
              }
            }).then(res =>{
              this.$router.push("/example/list")
              if (res.data === "success"){
                this.$notify({
                  title: '成功',
                  message: '修改文章成功',
                  type: 'success',
                  duration: 2000
                })
                this.loading = false
              }else {
                console.log('error submit!!')
                return false
              }
            })
          }else {
            this.axios({
              method : "post",
              url : "http://46o2352s89.zicp.vip/vue-admin-template/article/create",
              data : {
                "title": this.postForm.title, // 文章题目
                "content": this.postForm.content, // 文章内容
                "contentShort": this.postForm.content_short, // 文章摘要
                "imageUri": this.postForm.image_uri, // 文章图片
                "displayTime": +new Date(), // 前台展示时间
                "id": '',
                "username": this.name
              }
            }).then(res =>{
              this.$router.push("/example/list")
              if (res.data === "success"){
                this.$notify({
                  title: '成功',
                  message: '发布文章成功',
                  type: 'success',
                  duration: 2000
                })
                this.loading = false
              }else {
                console.log('error submit!!')
                return false
              }
            })
          }

        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 0px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
