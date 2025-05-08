<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl transition-all duration-300 hover:shadow-xl">
            <!-- 标题优化 -->
            <div class="mb-8 text-center space-y-2">
                <h1 class="text-3xl font-bold text-gray-800 flex items-center justify-center">
                    <el-icon class="mr-2 text-blue-500"><Document /></el-icon>
                    策略详情管理
                </h1>
                <p class="text-gray-500 text-sm">请填写或修改策略相关信息</p>
            </div>

            <!-- 表单布局优化 -->
            <el-form
                :model="form"
                label-width="120px"
                label-position="left"
                class="space-y-6"
                :rules="rules"
            >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- 分数范围 -->
                    <el-form-item label="分数范围" prop="resultScoreRange">
                        <el-input
                            v-model="form.resultScoreRange"
                            placeholder="示例：80-100"
                            clearable
                            class="input-with-icon"
                        >
                            <template #prefix>
                                <el-icon class="text-gray-400"><TrendCharts /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>

                    <!-- 属性设置 -->
                    <el-form-item label="属性设置" prop="resultProp">
                        <el-input
                            v-model="form.resultProp"
                            placeholder="多个属性用逗号分隔"
                            clearable
                            class="input-with-icon"
                        >
                            <template #prefix>
                                <el-icon class="text-gray-400"><CollectionTag /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                </div>

                <!-- 结果名称 -->
                <el-form-item label="结果名称" prop="resultName">
                    <el-input
                        v-model="form.resultName"
                        placeholder="请输入测试结果名称"
                        clearable
                        class="input-with-icon"
                    >
                        <template #prefix>
                            <el-icon class="text-gray-400"><Tickets /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <!-- 结果描述 -->
                <el-form-item label="结果描述" prop="resultDesc">
                    <el-input
                        v-model="form.resultDesc"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入详细的测试结果描述"
                        resize="none"
                        class="rounded-lg custom-textarea"
                    />
                </el-form-item>

                <!-- 按钮组优化 -->
                <div class="flex justify-end space-x-4 mt-8 pt-6 border-t">
                    <el-button
                        type="info"
                        @click="router.push('/applist')"
                        class="action-btn"
                    >
                        <el-icon class="mr-1"><ArrowLeft /></el-icon>
                        返回列表
                    </el-button>
                    <el-button
                        type="primary"
                        @click="submitForm"
                        class="action-btn"
                    >
                        <el-icon class="mr-1"><Check /></el-icon>
                        提交更改
                    </el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script setup>
import { Document, TrendCharts, CollectionTag, Tickets, ArrowLeft, Check } from '@element-plus/icons-vue'
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
/* 输入框优化 */
.input-with-icon {
    :deep(.el-input__inner) {
        padding-left: 40px;
        border-radius: 8px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid #e5e7eb;

        &:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
    }

    :deep(.el-input__prefix) {
        left: 12px;
        display: flex;
        align-items: center;
    }
}

/* 文本域优化 */
.custom-textarea {
    :deep(.el-textarea__inner) {
        border-radius: 8px;
        padding: 12px 16px;
        line-height: 1.6;
        border: 1px solid #e5e7eb;

        &:focus {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
    }
}

/* 按钮样式 */
.action-btn {
    @apply px-5 py-2.5 rounded-lg font-medium;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
    }

    &:active {
        transform: translateY(0);
    }
}

/* 表单标签样式 */
:deep(.el-form-item__label) {
    @apply text-gray-600 font-medium;
    padding-right: 20px !important;
}

/* 卡片入场动画 */
@keyframes card-entrance {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.bg-white {
    animation: card-entrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 验证错误提示优化 */
:deep(.el-form-item__error) {
    @apply text-red-500 text-sm mt-1;
}
</style>
