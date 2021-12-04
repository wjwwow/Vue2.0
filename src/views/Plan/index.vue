<template>
  <div class="app-container">

    <div class="filter-container">
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:63% ;margin-bottom: 20px" @change="tableKey=tableKey+1">
        重要性
      </el-checkbox>
      <el-button class="filter-item" style="margin-left: 400px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加计划
      </el-button>
    </div>

    <el-table

      :data="list"

      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>

      <el-table-column label="计划内容">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>

      <el-table-column v-if="showReviewer" label="重要性" width="80px">
        <template slot-scope="scope">
          <svg-icon v-for="n in + scope.row.imp" :key="n" icon-class="star"  class="meta-item__icon" />
        </template>
      </el-table-column>

      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="scope">
          <div class="cell" v-if="scope.row.endTime<new Date()">
            <span  class="el-tag el-tag--danger el-tag--medium">逾期</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at"  label="结束时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            编辑
          </el-button>
          <el-button  size="mini" type="danger" @click="handleDelete(scope.$index,scope.row)">
            完成
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="计划内容" prop="content" >
          <el-input v-model="temp.content"  />
        </el-form-item>
        <el-form-item label="重要性">
          <el-rate v-model="temp.imp" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime"  style="width: 100px">
          <el-date-picker v-model="temp.endTime" type="datetime" placeholder="Please pick a date" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>



  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'

import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      showReviewer: false,
      list: null,
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        id: '',
        endTime: new Date(),
        content: '',
        username : this.name,
        imp: "",
      },
      importanceOptions: [1, 2, 3],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        endTime: [{ type: 'date', required: true, message: '请指定结束时间', trigger: 'change' }],
        content: [{ required: true, message: '请输入计划内容', trigger: 'blur' }]
      },

    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.fetchData()
  },
  filters : {
    parseTime : parseTime
  },
  methods: {

    fetchData() {
      var vm = this;
      this.axios({
        Method : 'get',
        url : "http://46o2352s89.zicp.vip/vue-admin-template/plan/"+ this.name
      }).then(function (resp){
        console.log(resp.data)
          vm.list = resp.data
      })
    },
    editPlan(id){
      this.$router.push("/editPlan/index/"+id)
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.endTime= +new Date(this.temp.endTime)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(index,row)  {
      this.$confirm('你确认要完成此计划吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method : "GET",
          url : "http://46o2352s89.zicp.vip/vue-admin-template/delete/"+row.id
        }).then(() => {
          this.list.splice(index, 1)
          this.$message({
            type: 'success',
            message: '完成计划!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    resetTemp() {
      this.temp = {
        id: Math.floor(Math.random() * 1000000),
        content:'',
        endTime: new Date(),
        username: this.name,
        imp :1
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.axios({
            method:'POST',
            url : "http://46o2352s89.zicp.vip/vue-admin-template/createPlan/",
            data : this.temp
          }).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.endTime = +new Date(tempData.endTime)
          this.axios({
            method: "POST",
            url : "http://46o2352s89.zicp.vip/vue-admin-template/updatePlan/",
            data : tempData
          }).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },

    },


}
</script>
