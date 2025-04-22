<template>
    <div class="button-add">
        <el-button type="primary" @click="addScoring(appId)">创建策略</el-button>
    </div>
    <el-card v-for="(policy, index) in editPolicies" :key="index" class="card">
        <p>结果名称: {{ policy.resultName }}</p>
        <p>结果描述: {{ policy.resultDesc }}</p>
        <p v-if="policy.resultScoreRange">分数范围: {{ policy.resultScoreRange }}</p>
        <p v-if="policy.resultProp">属性: {{ policy.resultProp}}</p>
        <div class="button-group">
            <el-button type="primary" @click="viewPolicy(policy.id)">查看</el-button>
            <el-button type="danger" @click="deletePolicy(policy.id)">删除</el-button>
        </div>
    </el-card>
</template>

<script setup>
import { listMyScoringResultVOByPage, deleteScoringResult } from "@/api/scoring";
import { ref ,onMounted} from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
const router = useRouter();
// 接收路由传的应用id
const appId = router.currentRoute.value.query.id;
console.log(appId);
// 添加策略
const addScoring = (appId) => {
    router.push({ path: "/SoftwareManagement", query: { appId: appId } }); 
}
// 获取应用策略列表
const editPolicies = ref([]);
const getScoringList = async () => {
    const res = await listMyScoringResultVOByPage({ appId: appId });
    const scoringList = res.data.data.records;
    editPolicies.value = scoringList.map((record) => ({
        id: record.id,
        resultScoreRange: record.resultScoreRange,
        resultName: record.resultName,
        resultProp: record.resultProp,
        resultDesc: record.resultDesc,
    }));
    console.log(editPolicies.value);
};
onMounted(() => {
    getScoringList();
});
// 查看策略
const viewPolicy = (id) => {
    router.push({ path: "/ScoringContent", query: { id: id } });
};
// 删除策略
const deletePolicy = async (id) => {
    try {
        await deleteScoringResult({id:id});
        ElMessage.success("删除成功");
        getScoringList(); 
    }catch (error) {
        ElMessage.error("删除失败",error);
    }
};
</script>

<style scoped>
.el-card {
    width: 300px;
    height: 300px;
    margin-top: 60px;
    margin-left: 10px;
    padding: 16px;
}

.button-group {
    margin-top: 16px;
    display: flex;
    justify-content: space-around;
}
.button-add {
    width: 100px;
    height: 30px;
    position: relative;
    .el-button {
        position: absolute;
        top: 10px;
        left: 110px;
    }
}
</style>    