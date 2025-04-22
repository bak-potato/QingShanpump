<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
            <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">策略详情</h1>
            <el-form :model="form" label-width="auto" class="space-y-4">
                <el-form-item label="分数">
                    <el-input v-model="form.resultScoreRange" class="w-full" />
                </el-form-item>
                <el-form-item label="属性">
                    <el-input v-model="form.resultProp" class="w-full" />
                </el-form-item>
                <el-form-item label="结果名称">
                    <el-input v-model="form.resultName" class="w-full" />
                </el-form-item>
                <el-form-item label="结果描述">
                    <el-input v-model="form.resultDesc" type="textarea" class="w-full" />
                </el-form-item>
                <el-form-item class="flex justify-center">
                    <el-button type="primary" @click="submitForm" class="px-6 py-2">提交更改</el-button>
                </el-form-item>
                <el-form-item class="flex justify-center" style="position: relative;left: 100px;top: -50px;">
                    <el-button type="primary" @click="router.push('/applist')" class="px-6 py-2">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { getScoringResultVOById, editScoringResult } from '@/api/scoring';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();
const id = router.currentRoute.value.query.id;
const form = ref({});

const getScoringResult = async () => {
    try {
        const res = await getScoringResultVOById({ id });
        form.value = res.data.data;
    } catch (error) {
        console.error(error);
    }
};

const submitForm = async () => {
    const ScoringResult = {
        resultScoreRange: form.value.resultScoreRange || null,
        resultName: form.value.resultName || '',
        resultDesc: form.value.resultDesc || '',
        id: id
    };

    // 确保 resultProp 是数组形式
    if (Array.isArray(form.value.resultProp)) {
        ScoringResult.resultProp = form.value.resultProp;
    } else if (typeof form.value.resultProp === 'string') {
        ScoringResult.resultProp = form.value.resultProp.split(',').map(item => item.trim());
    } else {
        ScoringResult.resultProp = [];
    }

    try {
        const { data: { code } } = await editScoringResult(ScoringResult);
        if (code === 0) {
            ElMessage.success("提交成功");
            router.push({ path: "/applist" });
        } else {
            ElMessage.error("提交失败");
        }
    } catch (error) {
        console.error(error);
    }
};

onMounted(() => {
    getScoringResult();
});
</script>

<style scoped>
.el-input__inner {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px 12px;
    transition: border-color 0.3s ease;
}

.el-input__inner:focus {
    border-color: #2563eb;
    outline: none;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.el-button {
    transition: background-color 0.3s ease;
}

.el-button:hover {
    background-color: #1d4ed8;
}
</style>