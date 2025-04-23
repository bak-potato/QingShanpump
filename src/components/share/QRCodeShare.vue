<template>
  <div>
    <el-button
      type="primary"
      size="small"
      @click="showQRCodeDialog"
      style="position: absolute; right: 10px;"
    >
      <el-icon><Share /></el-icon>
    </el-button>

    <el-dialog v-model="qrDialogVisible" title="分享当前配置" width="300px">
      <div style="text-align: center;">
        <p>扫描二维码分享当前配置</p>
        <canvas ref="qrCanvas" style="width: 200px; height: 200px; margin: 0 auto;"></canvas>
        <p class="share-url">{{ shareUrl }}</p>
        <el-button type="primary" @click="copyShareUrl" style="margin-top: 10px;">
          <el-icon><DocumentCopy /></el-icon> 复制链接
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import QRCode from 'qrcode'
import { Share, DocumentCopy } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  config: {
    type: Object,
    required: true
  }
})

const qrDialogVisible = ref(false)
const qrCanvas = ref(null)
const shareUrl = ref('')

const showQRCodeDialog = async () => {
  shareUrl.value = generateShareUrl()
  qrDialogVisible.value = true

  await nextTick()

  if (qrCanvas.value) {
    QRCode.toCanvas(qrCanvas.value, shareUrl.value, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    }, (error) => {
      if (error) {
        console.error('生成二维码失败:', error)
        ElMessage.error('生成二维码失败')
      }
    })
  }
}

const generateShareUrl = () => {
  return `${window.location.origin}${window.location.pathname}?config=${encodeURIComponent(JSON.stringify(props.config))}`
}

const copyShareUrl = () => {
  navigator.clipboard.writeText(shareUrl.value)
    .then(() => {
      ElMessage.success('链接已复制到剪贴板')
    })
    .catch(() => {
      ElMessage.error('复制失败，请手动复制')
    })
}
</script>

<style scoped>
.share-url {
  word-break: break-all;
  font-size: 12px;
  color: #666;
  margin: 10px 0;
  padding: 5px;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>
