<template >
  <div id="app"
       style="-webkit-app-region: drag"
       @mouseenter.prevent="action('mouseenter')"
       @mouseleave.prevent="action('mouseout')">
    <div>
      <ul>
        <li>
          <!--      所有-->
          <span>所有</span>
        </li>
        <li>
          <!--      文本-->
          <span>文本</span>
        </li>
        <li>
          <!--      图像-->
          <span>图像</span>
        </li>
        <li>
          <!--      文件-->
          <span>文件</span>
        </li>
      </ul>
    </div>
    <audio src="./res/16038905241968.mp3" ref="play_mp3"></audio>
    <router-view></router-view>
  </div>
</template>

<script>
  // 禁止页面放大缩小
  document.addEventListener('mousewheel',(e)=>{
    e.preventDefault();
    return false
  })

  export default {
    name: 'cv_tool',

    created() {
      this.$electron.ipcRenderer.on("play_mp3", () => {
        let {play_mp3} = this.$refs;
        play_mp3.play()
      });
    },
    methods:{
      action(action){
        // 发送事件 控制窗体变宽
        this.$electron.ipcRenderer.send("action",action)
      }
    }
  }
</script>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
    font-family: "PingFang SC";
  }
  body {
    background: transparent;
    padding-top: 4px;
  }
  div {
    width: 100%;
  }

  ul {
    list-style: none;
    height: 100%;
    width: 20px;

    user-select: none;


    display: flow-root;

    li {
      float: left;
      height: 60px;
      width: 100%;
      text-align: center;
      line-height: 60px;
      overflow: hidden;

      transition: all 0.2s;

      span {
        display: inline-block;
        color: transparent;
        cursor: default
      }
    }

    li:hover {
      width: 100px;
      /*box-shadow: ;*/
    }
  }

  ul li:nth-child(1) {
    background-color: #CCCCCC;
    color: rgb(47, 62, 78);
  }
  ul li:nth-child(2) {
    background-color: #FF6666;
    color: rgb(233, 238, 239);
  }
  ul li:nth-child(3) {
    background-color: #FF9966;
    color: rgb(47, 62, 78);
  }
  ul li:nth-child(4) {
    background-color: #CC9999;
    color: rgb(233, 238, 239);
  }

  li:hover span{
    animation: span 0.1s linear 0.1s 1 normal forwards;
  }

  @keyframes span{
    100% {
      color: inherit;
    }
  }
  /* CSS */
</style>
