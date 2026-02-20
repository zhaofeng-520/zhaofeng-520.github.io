(function () {
  document.addEventListener("DOMContentLoaded", function () {
    // 获取容器，不存在则直接返回
    const container = document.getElementById("welcome-info");
    if (!container) return;

    // 渲染终端卡片结构
    container.innerHTML = `
      <div class="terminal-card">
        <div id="terminal-output"></div>
        <div id="hitokoto-line"></div>
      </div>
    `;

    const output = document.getElementById("terminal-output");
    const hitokotoLine = document.getElementById("hitokoto-line");

    // 打字机核心函数
    function typeWriter(text, element, speed = 35, callback) {
      let i = 0;
      function typing() {
        if (i < text.length) {
          element.innerHTML += text.charAt(i);
          i++;
          setTimeout(typing, speed);
        } else {
          if (callback) callback();
        }
      }
      typing();
    }

    // 根据时间段生成问候语的函数
    function getGreeting() {
      const hour = new Date().getHours();
      if (hour < 6) return ">>> 深夜模式已启动...";
      if (hour < 12) return ">>> 早安，愿代码无 bug...";
      if (hour < 18) return ">>> 下午好，保持专注...";
      return ">>> 夜色降临，灵感上线...";
    }

    // 恢复紧凑版文本行（去掉横线，保留单空行分隔）
    const lines = [
      ">>> ──系统连接成功──", 
      "", 
      getGreeting(), 
      "", 
      ">>> 今日一言："
    ];

    // 打印文本的函数
    let index = 0;
    function printNextLine() {
      if (index >= lines.length) {
        fetchHitokoto();
        return;
      }

      const line = document.createElement("div");
      line.className = "gradient-text";
      output.appendChild(line);

      if (lines[index] === "") {
        line.innerHTML = "&nbsp;";
        index++;
        printNextLine();
      } else {
        typeWriter(lines[index], line, 35, () => {
          index++;
          printNextLine();
        });
      }
    }

    // 一言功能（仅增大欢迎语间距）
    function fetchHitokoto() {
      fetch("https://v1.hitokoto.cn/")
        .then(res => res.json())
        .then(data => {
          // 打印一言内容
          const hitokotoLine1 = document.createElement("div");
          hitokotoLine1.className = "gradient-text";
          output.appendChild(hitokotoLine1);
          typeWriter(">>> " + data.hitokoto, hitokotoLine1, 40, () => {
            // 欢迎语单独加间距样式
            const welcomeLine = document.createElement("div");
            welcomeLine.className = "gradient-text welcome-text"; // 新增专属类
            output.appendChild(welcomeLine);
            typeWriter(">>> Welcome to my blog", welcomeLine, 35);
          });
        })
        .catch(() => {
          // 接口失败时的兜底
          const hitokotoLine1 = document.createElement("div");
          hitokotoLine1.className = "gradient-text";
          output.appendChild(hitokotoLine1);
          hitokotoLine1.innerHTML = ">>> 人生如逆旅，我亦是行人.";
          
          // 欢迎语加间距
          const welcomeLine = document.createElement("div");
          welcomeLine.className = "gradient-text welcome-text"; // 新增专属类
          output.appendChild(welcomeLine);
          typeWriter(">>> Welcome to my blog", welcomeLine, 35);
        });
    }

    printNextLine();

  });
})();

// ===== 样式（仅新增欢迎语间距，其他不变）=====
const style = document.createElement("style");
style.innerHTML = `
/* 公告标题“欢迎访问”渐变 */
.card-widget.card-announcement .item-headline span{
  background: linear-gradient(
    90deg,
    #00ffe5,
    #00c3ff,
    #00ffe5
  );
  background-size:300% 300%;
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  animation: gradientMove 6s ease infinite;
}

.terminal-card{
  background: #0d1117;
  padding:14px 18px;
  border-radius:10px;
  font-size:13px;
  line-height:1.5;
  font-family: "Courier New", monospace;
  border:1px solid rgba(0,255,200,0.3);
  box-shadow: 0 0 25px rgba(0,255,200,0.15);
  overflow:hidden;
}

/* 所有文字渐变 */
.gradient-text{
  margin-bottom:2px;
  font-weight:600;
  background: linear-gradient(
    90deg,
    #00ffe5,
    #00c3ff,
    #00ffe5
  );
  background-size:300% 300%;
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  animation: gradientMove 6s ease infinite;
}

/* 仅增大Welcome to my blog的上边距 */
.welcome-text {
  margin-top: 23.5px !important; /* 核心调整：增加与一言的间距 */
}

/* 渐变流动动画 */
@keyframes gradientMove{
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
`;
document.head.appendChild(style);