/* eslint-disable @typescript-eslint/no-explicit-any */
import { reactive, ref } from 'vue'

// 分页钩子函数
export function usePagination(loadData: () => Promise<any>, initalPageSize = 10) {
  // 使用 ref 创建一个响应式的总数变量
  const totals = ref<number>(0)

  // 使用 reactive 创建一个响应式的分页信息对象
  const pageInfo = reactive({
    current: 1, // 当前页码
    pageSize: initalPageSize, // 每页显示的数量
  })

  // 处理每页显示数量变化的函数
  const handleSizeChange = (size: number) => {
    pageInfo.pageSize = size // 更新每页显示数量
    loadData() // 重新加载数据
  }

  // 处理当前页码变化的函数
  const handleCurrentChange = (page: number) => {
    pageInfo.current = page // 更新当前页码
    loadData() // 重新加载数据
  }

  // 重置分页信息的函数
  const resetPagination = () => {
    pageInfo.current = 1 // 重置当前页码为 1
    pageInfo.pageSize = initalPageSize // 重置每页显示数量为初始值
  }

  // 设置总数的函数
  const setTotals = (all: number) => {
    totals.value = all // 更新总数
  }

  return {
    totals,
    pageInfo,
    handleSizeChange,
    handleCurrentChange,
    resetPagination,
    setTotals,
  }
}
