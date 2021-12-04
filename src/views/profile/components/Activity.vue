<template>
  <div class="user-activity">
    <div class="post">
      <div class="user-block box-center">
        <div v-if="planCount===0">
          <h1>当前没有未完成的计划</h1>
        </div>
        <div v-if="planCount!==0">
        <h1>你还有{{ planCount }}条计划未完成</h1>
        </div>
      </div>
      <div class="box-center">
        <el-button type="primary" style="position: center" @click="jump">前往处理</el-button>
      </div>
    </div>
    <div class="post">
      <div class="user-block box-center">
        <div v-if="blogCount===0">
          <h1>你还没有发表任何文章</h1>
        </div>
        <div v-if="blogCount!==0">
          <h1>你已发表{{ blogCount }}篇博客</h1>
        </div>
      </div>
      <div class="box-center ">
        <router-link to="/example/list">
        <el-button type="primary" style="margin-left:20px;">前往查看</el-button>
        </router-link>
        <router-link to="/example/create">
          <el-button type="primary" style="margin-left:20px;" >发布博客</el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>


import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      planCount:"",
      blogCount:"",
  }
},
  created() {
    this.getPlanCount();
    this.getBlogCount()
  },
  methods:{
    getPlanCount(){
      this.axios({
        method : 'GET',
        url : "http://10.11.2.51:8080/vue-admin-template/countPlan/"+this.name
      }).then(res =>{
        this.planCount = res.data
      })
    },
    jump(){
      this.$router.push("/plan")
    },
    getBlogCount(){
      this.axios({
        method : 'GET',
        url : "http://10.11.2.51:8080/vue-admin-template/article/count/"+this.name
      }).then(res =>{
        this.blogCount = res.data
      })
    },
  },
  computed: {
    ...mapGetters([
      'name',
    ])
  },
}
</script>

<style lang="scss" scoped>
.user-activity {
  .user-block {

    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }

    .username{
      font-size: 16px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: #666;

    .image {
      width: 100%;
      height: 100%;

    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {

      &:hover,
      &:focus {
        color: #999;
      }
    }
  }

}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}
</style>
