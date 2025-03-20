<template>
  <div class="lastguide">
    <div class="lastguidein">
      <div class="topf clickable">&nbsp;&nbsp;&nbsp;关注</div>
      <div class="topf2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;网站公告 </div>

      <div class="lastf">
        <LastRightViewone />

      </div>
      <div class="lasts">

        <PublicNotice v-if="!isShow" />
      </div>
    </div>
  </div>
</template>

<script setup>
import LastRightViewone from './LastRightViewone.vue';
import PublicNotice from '../../components/PublicNotice.vue';


</script>

<style scoped>
/* 修复：只有不包含 l21 类名的元素才有 hover 效果 */
.l2a:not(.l21):hover {
  background-color: #d7d8df;
}

.l21 {
  background-color: white;
}

.l2a {
  width: 60px;
  height: 20px;
  border-radius: 5px;
  font-size: 12px;
  margin-top: 3px;
  float: left;
  text-align: center;
  cursor: pointer; /* 添加手型光标 */
}

.lastf1 {
  display: flex;
  align-content: center;
  justify-content: space-evenly;
  width: 126px;
  height: 26px;
  background-color: #e6e8f2;
  border-radius: 6px;
  margin-top: 20px;
  margin-left: 20px;
}

.topf2 {
  width: 50%;
  float: left;
  font-size: 20px;
}

.topf {
  width: 50%;
  float: left;
  font-size: 20px;
}

.lasts {
  width: 49%;
  margin-left: 1%;
  float: left;
    border: #e7e7ec 1px solid;
  background-color: #ffffff;
  border-radius: 20px;
  height: 700px;
}

.lastf {
  width: 49%;
  float: left;
  margin-right: 1%;


  margin-top: 10px;
  height: auto;
  border-radius: 20px;
}

.lastguidein {
  width: 1400px;
  margin-top: 30px;
}

.lastguide {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
