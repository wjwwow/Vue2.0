<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="Date">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{ scope.row.displayTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="Author">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>


      <el-table-column min-width="300px" label="Title">
        <template slot-scope="{row}">
          <router-link :to="'/example/edit/'+row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="'/example/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit" style="margin-left:10px;">
              编辑
            </el-button>
          </router-link>
          <el-button  size="small" type="danger" icon="el-icon-delete" style="margin-left:10px;" @click="deleteblog(scope.$index,scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total"  />
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination },
  filters: {
    parseTime : parseTime
  },
  computed: {
    ...mapGetters([
      'name',
    ]),
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
         username : this.name
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.axios({
        method : "get",
        url : "http://46o2352s89.zicp.vip/vue-admin-template/article/list/"+this.name,
      }).then(res =>{
        this.list = res.data.items
        this.total = res.data.total
        this.listLoading = false
      })
    },
    deleteblog(index,id){
      this.$confirm('你确认要删除这篇文章吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.axios({
          method: "get",
          url : "http://46o2352s89.zicp.vip/vue-admin-template/article/delete/"+id,
        }).then(res =>{
          this.list.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
      })

    }
  },

}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
