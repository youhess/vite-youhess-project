<template>
  <div class="form-search">
    <div v-if="formItem && formItem.length > 0" class="search-table-header">
      <section class="form-search-body">
        <!-- 当垂直方向空间受限且表单较简单时，可以在一行内放置表单。通过设置 inline 属性为 true 可以让表单域变为行内的表单域 -->
        <el-form :inline="true" :model="form" label-width="120px" label-position="right">
          <el-row>
            <el-col v-for="(item, index) in formItem" :key="index" :span="item.width">
              <el-form-item :key="index" :label="item.label" :prop="item.value" style="width:100%">
                <!--选择器-->
                <el-select v-if="item.kind === 'select'" v-model="form[item.value]" :size="item.size"
                  :multiple="item.multiple" :placeholder="item.placeholder" clearable>
                  <el-option v-for="(option, i) in item.children" :key="i" :value="option.value"
                    :label="option.label" />
                </el-select>
                <!--输入框-->
                <el-input v-if="item.kind === 'text'" v-model="form[item.value]" :placeholder="item.placeholder"
                  :size="item.size" :suffix-icon="item.suffixIcon"  clearable />
                <!-- 日期时间选择器 -->
                <el-date-picker v-if="item.kind === 'datePicker'" v-model="form[item.value]" :type="item.type"
                  :placeholder="item.placeholder" :range-separator="item.rangeSeparator"
                  :start-placeholder="item.startPlaceholder" :end-placeholder="item.endPlaceholder" :size="item.size"
                  :format="item.format" clearable />
              </el-form-item>
            </el-col>
            <span class="button-list">
              <!-- 子组件处@searchForm调用，传出form即为val值 -->
              <el-button @click="emit('searchForm', form)" type="primary">查询</el-button>
              <el-button @click="clearData">重置</el-button>
            </span>
          </el-row>
        </el-form>
      </section>
    </div>
  </div>
</template>
<script setup>

import { getCurrentInstance, ref, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
// setup的执行时组件对象还没有创建，此时不能使用this来访问data/computed/methods/props
// 我们可以通过 getCurrentInstance这个函数来返回当前组件的实例对象，也就是当前vue这个实例对象
// isProxy() Checks if an object is a proxy created by reactive(), readonly(), shallowReactive() or shallowReadonly()
//proxy is kinda like pick up stuff which is created by reactive() and so on from currentInstance
const { proxy } = getCurrentInstance()

//等于vue2中的:
//props：{count:{
//         type:Number, /* 类型 */
//          default:100 , /* 外界没有传值 则默认值为100  */
//         required:false /*必填  */
//    },
//     msg:String  /* 没有默认值 可以这样写  只是可读属性 不能直接修改会报错 你可以把值转接到data属性中
//}
defineProps({
  // form查询项
  formItem: {
    type: Array,
    default: () => []
  },
  // form查询数据
  formData: {
    type: Object,
    default: () => { }
  }
})

//子组件向父组件事件传递
const emit = defineEmits(['searchForm', 'clearForm'])

// form为表单查询数据
// 利用以下方法可以深拷贝Array、Object类型数据，
// 但此方法有一个缺点，
// 如果原Array、Object数据里面含有function方法，
// 则function数据会被丢弃，无法完全拷贝。
let form = reactive(JSON.parse(JSON.stringify(proxy.formData)))

const clearData = () => {
  // 清空搜索栏
  //  Object.keys(form) 处理对象，返回可枚举的属性数组
  Object.keys(form).map(key => { form[key] = '' })
  emit('clearForm')
}


</script>
<style >
.el-select {
  width: 100%;
}

.button-list {
  /* margin-left: 1rem; */
}
</style>