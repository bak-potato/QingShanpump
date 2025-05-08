<template>
  <el-tree
    style="max-width: 600px"
    :data="data"
    :props="defaultProps"
    @node-click="handleNodeClick"
    class="custom-tree"
  />
</template>

<script setup>
const handleNodeClick = (data) => {
  console.log(data);
};

const data = [
  {
    label: '全部',

  }
];

const defaultProps = {
  children: 'children',
  label: 'label',
};
</script>

<style >
/* 全局样式 */
.custom-tree {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  background-color: #ffffff;
  /* border: 1px solid #e4e7ed; */
  border-radius: 8px;
  padding: 10px;
}

.custom-tree .el-tree-node__content {
  height: 40px !important;
  line-height: 40px !important;
  margin-bottom: 5px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.custom-tree .el-tree-node__content:hover {
  background-color: #ffffff !important;
}

.custom-tree .el-tree-node__expand-icon {
  font-size: 16px !important;
  color: #666 !important;
}

.custom-tree .el-tree-node__expand-icon.is-leaf {
  color: transparent !important;
}

.custom-tree .el-tree-node.is-current > .el-tree-node__content {
  background-color: #b3e5fc !important;
  color: #1890ff !important;
}
</style>
