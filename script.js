/* ════════════════════════════════════════════════════════════
   Portfolio interactions
   - Sidebar active state on click
   - Reveal-on-scroll for cards
═════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════
   Password gate — a single unlock for all work
   The home page hides every work title (menu + tiles) until the
   visitor clicks "See my work" and enters the password. Once
   unlocked, the flag is remembered and the work case-study pages
   open freely; landing on a work page while still locked sends the
   visitor back to the home page.
═════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var PASSWORD = "12340114";
  var UNLOCK_KEY = "portfolio-unlocked";
  var WORK_PAGES = {
    "eventstream.html": 1,
    "business-events.html": 1,
    "get-data.html": 1,
    "custom-connector.html": 1,
    "schematize.html": 1,
    "top20talent.html": 1,
    "asa.html": 1,
    "event-hub.html": 1,
  };

  function isUnlocked() {
    try {
      return localStorage.getItem(UNLOCK_KEY) === "1";
    } catch (e) {
      return false;
    }
  }
  function setUnlocked() {
    try {
      localStorage.setItem(UNLOCK_KEY, "1");
    } catch (e) {}
  }

  var page = (
    window.location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  // A work case-study page reached while still locked → go home.
  if (WORK_PAGES[page]) {
    if (!isUnlocked()) {
      window.location.replace("index.html");
    }
    return;
  }

  // Everything below only applies to the home page.
  if (page !== "index.html" && page !== "") return;

  function reveal() {
    document.documentElement.classList.remove("work-locked");
  }

  var overlay = document.createElement("div");
  overlay.className = "lock-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "lockTitle");
  overlay.innerHTML =
    '<div class="lock-card">' +
    '<button class="lock-close" type="button" aria-label="Close">×</button>' +
    '<div class="lock-icon" aria-hidden="true">🔒</div>' +
    '<h2 class="lock-title" id="lockTitle">This work is password protected</h2>' +
    '<p class="lock-desc">Enter the password to view my case studies.</p>' +
    '<form class="lock-form" novalidate>' +
    '<input class="lock-input" type="password" inputmode="numeric" autocomplete="off" placeholder="Password" aria-label="Password" />' +
    '<button class="lock-btn" type="submit" disabled>Unlock</button>' +
    "</form>" +
    '<p class="lock-error" role="alert" hidden>Incorrect password. Please try again.</p>' +
    "</div>";

  function openGate(onSuccess) {
    document.body.appendChild(overlay);
    document.body.classList.add("is-locked");

    var card = overlay.querySelector(".lock-card");
    var input = overlay.querySelector(".lock-input");
    var form = overlay.querySelector(".lock-form");
    var button = overlay.querySelector(".lock-btn");
    var error = overlay.querySelector(".lock-error");
    var closeBtn = overlay.querySelector(".lock-close");

    if (input) input.focus();

    function dismiss() {
      document.body.classList.remove("is-locked");
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }

    input.addEventListener("input", function () {
      button.disabled = input.value.length === 0;
    });

    closeBtn.addEventListener("click", dismiss);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (input.value.length === 0) return;
      if (input.value === PASSWORD) {
        setUnlocked();
        reveal();
        dismiss();
        if (typeof onSuccess === "function") onSuccess();
      } else {
        error.hidden = false;
        input.value = "";
        button.disabled = true;
        input.focus();
        card.classList.remove("shake");
        void card.offsetWidth; // restart the shake animation
        card.classList.add("shake");
      }
    });
  }

  function init() {
    if (isUnlocked()) reveal();

    var seeWork = document.querySelector(".intro__scroll");
    if (seeWork) {
      seeWork.addEventListener("click", function (e) {
        if (isUnlocked()) return; // already unlocked → normal scroll
        e.preventDefault();
        openGate(function () {
          var work = document.getElementById("work");
          if (work) work.scrollIntoView({ behavior: "smooth" });
        });
      });
    }
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();

(function () {
  "use strict";

  // ── Dark mode toggle ─────────────────────────────────────
  var root = document.documentElement;
  var toggles = document.querySelectorAll(".theme-switch");

  function syncToggle() {
    var isDark = root.getAttribute("data-theme") === "dark";
    toggles.forEach(function (toggle) {
      toggle.setAttribute("aria-pressed", isDark ? "true" : "false");
      var label = toggle.querySelector(".theme-switch__label");
      if (label) {
        label.textContent = isDark
          ? "Switch to light mode"
          : "Switch to dark mode";
      }
    });
  }
  syncToggle();

  toggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      var isDark = root.getAttribute("data-theme") === "dark";
      var next = isDark ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      syncToggle();
    });
  });

  // ── Language toggle (EN / 中文) ───────────────────────────
  // Dictionary-driven: each translatable element is matched by its normalized
  // English text and swapped to Traditional Chinese. Untranslated strings fall
  // back to English so nothing ever breaks. Choice persists across pages.
  var LANG_KEY = "lang";

  function normText(s) {
    return (s || "").replace(/\s+/g, " ").trim();
  }

  // Normalized English text  ->  Traditional-Chinese HTML
  var I18N_ZH = {
    "Product Design — a B2C job-search platform. Redesigning the apply & register flow to lift conversion and reduce drop-off.": "产品设计 —— 一个 B2C 求职平台。重新设计申请与注册流程，以提升转化率并降低流失。",
    "Context": "背景",
    "A B2C platform for job seekers": "一个面向求职者的 B2C 平台",
    "Top20Talent is a B2C platform I worked on at Cornerstone Global Partner, a head-hunting company. One of my main roles there was to support and enhance the design of Top20Talent — a portal where job seekers search for high-quality roles head-hunters are working on, manage their CV/profile, and easily apply and get contacted by head-hunters.": "Top20Talent 是我在猎头公司 Cornerstone Global Partner 参与的一个 B2C 平台。我在那里的主要职责之一，就是支持并提升 Top20Talent 的设计——这是一个让求职者搜索猎头正在处理的优质职位、管理自己的简历/档案，并轻松申请、被猎头联系的门户。",
    "This case study focuses on how I enhanced the application/register process — how I discovered UX problems based on user behavior, and how I designed the solutions using UX research methods and UI design.": "这个案例研究聚焦于我如何提升申请/注册流程——我如何根据用户行为发现体验问题，又如何运用用户体验研究方法与 UI 设计来设计解决方案。",
    "These strategies were designed under real constraints: a short-handed development team and a limited budget. The goal was to use the lowest cost to meet the must-have requirements.": "这些策略是在真实约束下设计的：一个人手不足的开发团队与有限的预算。目标是用最低的成本，满足那些「必须有」的需求。",
    "Low registration and low application conversion": "注册量低、申请转化率也低",
    "Top20Talent had a low registration count and a low conversion rate on applications. Stakeholders (partners/directors) wanted us to find a way to increase the conversion rate and the number of completed applications/registrations.": "Top20Talent 的注册数偏低，申请的转化率也偏低。利益相关者（合伙人/总监）希望我们想办法提高转化率，以及完成申请/注册的数量。",
    "I designed solutions to enhance three distinct conversion issues:": "我设计了方案，针对三个不同的转化问题进行改善：",
    "Application Start → Application Finish: redesign the application/registering flow.": "<strong>开始申请 → 完成申请：</strong>重新设计申请/注册流程。",
    "Job View → Application Start: enhance the job match/search quality.": "<strong>浏览职位 → 开始申请：</strong>提升职位匹配/搜索的质量。",
    "Internal job publishing rate: auto job-description display.": "<strong>内部职位发布率：</strong>自动显示职位描述。",
    "Problem defining": "定义问题",
    "Following the data to the drop-off": "顺着数据，追踪流失发生在哪里",
    "According to the data-tracking system, the main traffic to the job description page — where candidates register and apply — came from job floating EDMs. Over 80% of job seekers (64.3% from EDM campaigns + 16.3% from job-portal visitors) reached the job description page after receiving a job-ad EDM from the marketing team.": "根据数据追踪系统，职位描述页面（候选人在此注册与申请）的主要流量来自职位推送 EDM。超过 80% 的求职者（64.3% 来自 EDM 营销活动 + 16.3% 来自求职门户访客），是在收到营销团队发送的职位广告 EDM 之后，才到达职位描述页面的。",
    "Channels & sources — over 80% of candidates reach the job description page via job-ad EDMs.": "渠道与来源——超过 80% 的候选人是通过职位广告 EDM 到达职位描述页面的。",
    "Looking at the conversion rate (Jan 1 – Feb 26), I noticed three issues:": "观察转化率（1 月 1 日至 2 月 26 日）时，我注意到三个问题：",
    "Low conversion from viewing a job description to clicking apply.": "从浏览职位描述到点击申请的转化率偏低。",
    "Low conversion from the job overview page (the search engine) to a job description page.": "从职位总览页（即搜索引擎）到职位描述页的转化率偏低。",
    "High drop-off rate during the apply/register flow.": "在申请/注册流程中的流失率偏高。",
    "Views & conversion rates — surfacing the low apply conversion and high drop-off across the funnel.": "浏览量与转化率——揭示了整个漏斗中偏低的申请转化与偏高的流失。",
    "From here, I framed the research around three opportunities:": "由此，我把研究围绕三个机会点来展开：",
    "WHO — who are our EDM receivers? How do we select the right users to float job ads to, and define our target audience among a large database?": "<strong>WHO</strong>——我们的 EDM 接收者是谁？我们如何在庞大的数据库中，挑选合适的用户来推送职位广告，并定义我们的目标受众？",
    "WHAT — what jobs/ads are we sending? If we have the right users but they still don't apply, is it a matching issue, and how do we improve match quality?": "<strong>WHAT</strong>——我们发送的是什么职位/广告？如果我们找对了用户，他们却仍然不申请，这是不是匹配问题，我们又该如何提升匹配质量？",
    "HOW — the process of applying: the UI and UX from job description to register page. With the right people and right jobs, why is drop-off still high?": "<strong>HOW</strong>——申请的过程：从职位描述到注册页面的 UI 与 UX。当人对了、职位也对了，为什么流失还是这么高？",
    "Project planning": "项目规划",
    "A four-phase plan": "一个四阶段的计划",
    "Define — project goal, problem understanding, stakeholder expectations, timeline, background information.": "<strong>定义</strong>——项目目标、问题理解、利益相关者期望、时间表、背景信息。",
    "Research — Hotjar review (user-behavior study), competitive analysis, user interviews, persona/user-journey map, follow-up research.": "<strong>研究</strong>——Hotjar 回顾（用户行为研究）、竞品分析、用户访谈、人物画像/用户旅程图、后续研究。",
    "Design & groom features — design solutions, feature/user-story grooming, design + prototype, stakeholder feedback.": "<strong>设计与梳理功能</strong>——设计解决方案、功能/用户故事梳理、设计 + 原型、利益相关者反馈。",
    "Evaluate — usability testing, stakeholder feedback, event tracking, kickoff meeting with developers.": "<strong>评估</strong>——可用性测试、利益相关者反馈、事件追踪、与开发者的启动会议。",
    "The project plan outline — scoped and prioritized with WSJF.": "项目计划大纲——以 WSJF 界定范围并排定优先级。",
    "Research methods": "研究方法",
    "How I researched": "我是如何做研究的",
    "Competitive analysis — registered and applied on competitor sites like Talent Pair to study their workflows.": "<strong>竞品分析</strong>——在 Talent Pair 等竞品网站上注册并申请，以研究它们的工作流程。",
    "Hotjar recording — filtered visitor screen recordings by keywords like “job application” and reviewed 80+ of them.": "<strong>Hotjar 录屏</strong>——用「job application」等关键词筛选访客的屏幕录制，并回顾了其中 80 多段。",
    "User interviews / surveys — reached out to users for their experiences via phone interviews and surveys.": "<strong>用户访谈 / 问卷</strong>——通过电话访谈与问卷，向用户了解他们的体验。",
    "Usability tests — sat down with friends looking for jobs, family members, and new Cornerstone employees to run tests.": "<strong>可用性测试</strong>——与正在找工作的朋友、家人以及 Cornerstone 的新员工坐下来进行测试。",
    "I recorded all findings, observations, interpretations, and insights in Airtable:": "我把所有的发现、观察、诠释与洞察都记录在 Airtable 中：",
    "Findings & insights": "发现与洞察",
    "Five problems, five directions": "五个问题，五个方向",
    "1. Candidates got stuck when registering to apply": "1. 候选人在注册申请时被卡住了",
    "First-time users must finish registration while applying. The original flow skipped profile-filling and immediately redirected to the register page to land candidates quickly — but this created confusion. Looking at competitors like Career International and LinkedIn, one solution is to “slow down” the redirect and add explicit instructions like “currently at step 2 out of 2”.": "初次使用的用户必须在申请的同时完成注册。原本的流程跳过了填写档案，直接重定向到注册页面，好让候选人快速落地——但这造成了困惑。参考 Career International 与 LinkedIn 等竞品，一个解决方案是「放慢」这个重定向，并加入明确的指示，例如「目前在第 2 步，共 2 步」。",
    "2. Candidates were confused about getting “published”": "2. 候选人对「被发布」感到困惑",
    "Candidates are encouraged to complete as much of their profile as possible; consultants then review and make it public for clients to search. To be “published”, candidates must complete a certain amount of information — but they don't know which fields are required. The “required” vs. “optional” distinction wasn't obvious enough; the profile editing pages needed UI/UX improvements.": "我们鼓励候选人尽可能完整地填写档案；顾问接着会审核，并将其公开供客户搜索。要「被发布」，候选人必须完成一定数量的信息——但他们并不知道哪些字段是必填的。「必填」与「选填」的区别不够明显；档案编辑页面需要 UI/UX 上的改进。",
    "3. Candidates weren't followed up in time": "3. 候选人没有被及时跟进",
    "A repeated complaint was a lack of follow-up. Interviews with consultants revealed candidates often had no resume attached, didn't qualify, or the role was closed. Two fixes: improve job descriptions to be comprehensive on experience requirements, and optimize communications such as email and text messaging.": "一个反复出现的抱怨是缺乏跟进。与顾问的访谈揭示，候选人往往没有附上简历、不符合资格，或职位已关闭。两个修正方向：改进职位描述，让经验要求更完整；并优化沟通方式，例如电子邮件与短信。",
    "4. Candidates couldn't find a matching job": "4. 候选人找不到匹配的职位",
    "Search yielded few matches because the job publishing rate was low — 7,488 live job orders with no offer made yet, but only 1,285 (17%) displayed on the portal. Publishing takes time to write descriptions, and applications often don't match. One solution: AI pre-fill the job description based on the selected function/industry.": "搜索得到的匹配很少，因为职位发布率偏低——有 7,488 个尚未给出 offer 的在线职位订单，但门户上只显示了 1,285 个（17%）。发布需要时间来撰写描述，而申请又常常不匹配。一个解决方案：由 AI 根据所选的职能/行业，预先填写职位描述。",
    "5. Candidates didn't know if they had applied": "5. 候选人不知道自己是否已经申请",
    "A one-click apply for registered users showed an “applied successfully” toast that disappeared in 5 seconds with no review or confirmation. The fix: still record the one click as a successful application, but redirect to a CV-selecting/profile-editing page so candidates can update their profile and confirm their application.": "针对已注册用户的一键申请，会显示一个「申请成功」的提示，5 秒后消失，没有任何检视或确认。修正方式：仍然把这一次点击记录为一次成功申请，但重定向到一个选择简历/编辑档案的页面，好让候选人更新档案并确认自己的申请。",
    "Personas": "用户画像",
    "Who we designed for": "我们为谁而设计",
    "Jessie Lee": "Jessie Lee",
    "27, Production Engineer, Beijing, single, American-born Chinese. Bilingual developer with 5 years' experience, actively looking for a work-life-balanced role with a fair raise. Goals: search efficiently, find culturally-matched opportunities, stay updated on new matches. Frustrations: unclear company culture, no follow-up, confusing registration, and uncertainty about whether she's applied.": "27 岁，生产工程师，北京，单身，在美国出生的华人。拥有 5 年经验的双语开发者，正积极寻找一份工作与生活平衡、并有合理加薪的职位。目标：高效搜索、找到文化契合的机会、随时掌握新的匹配。困扰：不清楚公司文化、没有跟进、注册令人困惑，以及不确定自己是否已经申请。",
    "Simon Liu": "Simon Liu",
    "53, CTO, Chinese living overseas, married, relocating to Shanghai. 30 years in pharmaceuticals; approached directly by a consultant before registering. Goals: be matched and floated relevant jobs, and find a long-term career consultant familiar with the China market. Frustrations: didn't know how to apply to floated jobs and gave up when he got stuck.": "53 岁，CTO，旅居海外的华人，已婚，即将搬到上海。在制药业有 30 年经验；在注册之前就被顾问直接联系。目标：被匹配并被推送相关职位，并找到一位熟悉中国市场的长期职业顾问。困扰：不知道该如何申请被推送的职位，卡住之后就放弃了。",
    "The user journey map showed the core failure point: for a non-registered candidate, clicking apply immediately redirected to sign-up with no explanation; for a registered candidate, “one-click apply” submitted instantly without the user noticing. The flow was meant to streamline applying, but the big skip and lack of UI indication caused a major drop in conversion — users questioned the sudden redirect and lost track of where they were.": "用户旅程图揭示了核心的失败点：对未注册的候选人来说，点击申请会立即被重定向到注册，且没有任何说明；对已注册的候选人来说，「一键申请」会在用户毫无察觉的情况下立即提交。这个流程本意是想简化申请，但巨大的跳步与缺乏 UI 提示，造成了转化率的大幅下降——用户对突如其来的重定向感到疑惑，也搞不清楚自己身在何处。",
    "Solution & feature grooming": "解决方案与功能梳理",
    "Redesigning the register-to-apply workflow": "重新设计「从注册到申请」的工作流程",
    "After candidate interviews and reviewing competitor solutions, I redesigned the register-to-complete-application workflow to fix problems 1 and 5:": "在候选人访谈以及检视竞品方案之后，我重新设计了「从注册到完成申请」的工作流程，以修正问题 1 与问题 5：",
    "Include steps for registering, e.g. “step 2 out of 2”.": "为注册加入步骤，例如「第 2 步，共 2 步」。",
    "Add an explicit title for each step.": "为每一步加上明确的标题。",
    "Remove the misleading overlay-applying interaction.": "移除那个具有误导性的浮层申请交互。",
    "For registered candidates, after clicking apply, redirect to a “select a resume file” or “update your profile” page.": "对已注册的候选人，在点击申请之后，重定向到一个「选择简历文件」或「更新你的档案」的页面。",
    "I presented the UI prototype to stakeholders, and after approval, groomed features and user stories using an Agile product-management method.": "我向利益相关者展示了 UI 原型，在获得批准后，运用敏捷产品管理方法梳理了功能与用户故事。",
    "The UI prototype presented to stakeholders for sign-off.": "向利益相关者展示、供其签核的 UI 原型。",
    "The redesigned register-and-apply flow — candidates move through clear, explicit steps instead of an abrupt redirect.": "重新设计后的注册与申请流程——候选人依循清楚、明确的步骤前进，而不是被突兀地重定向。",
    "UI kit & design rules": "UI 组件库与设计规范",
    "Consistency through a shared system": "通过共享系统实现一致性",
    "Our UI kit includes UI symbols, typography rules, colors, and more. Once a design idea was sorted, we reused as many existing symbols and icons as possible. Using these rules, I created the final design in Sketch.": "我们的 UI 组件库包含 UI 符号、排版规则、颜色等等。一旦某个设计想法定案，我们就尽可能重用现有的符号与图标。依循这些规则，我在 Sketch 中完成了最终设计。",
    "My role also included managing the UI kit — owning the shared symbols, forms, and icons, and making sure the product's look and feel stayed consistent and followed the patterns we wanted across the whole candidate-facing experience.": "我的职责还包括管理 UI 组件库——负责共享的符号、表单与图标，并确保产品的外观与感受在整个面向候选人的体验中保持一致，遵循我们想要的模式。",
    "More about this platform": "关于这个平台的更多内容",
    "More screens": "更多画面",
    "A few more views from across the candidate-facing product.": "来自这个面向候选人产品的更多视图。",
    "3 Product managers": "3 位产品经理",
    "12 Developers": "12 位开发者",
    "Product designer + user researcher": "产品设计师 + 用户研究员",
    "Problem definition": "问题定义",
    "Users get blocked when a connector is missing or restricted": "当连接器缺失或受限时，用户就被卡住了",
    "Fabric users rely heavily on connectors to ingest real-time data from a wide range of distributed systems. Today, Real-Time hub provides a rich set of built-in streaming connectors across several major categories:": "Fabric 用户高度依赖连接器，从各种分布式系统中摄取实时数据。如今，实时中心（Real-Time hub）在几大类别中提供了丰富的内置流数据连接器：",
    "Cloud-native event streaming services — e.g., AWS Kinesis, Confluent Cloud for Apache Kafka.": "<strong>云原生事件流服务</strong>——例如 AWS Kinesis、Confluent Cloud for Apache Kafka。",
    "Azure messaging and event infrastructure — e.g., Azure Event Hubs, IoT Hub, Service Bus.": "<strong>Azure 消息与事件基础设施</strong>——例如 Azure Event Hubs、IoT Hub、Service Bus。",
    "Change Data Capture (CDC) from operational databases — e.g., SQL Database, MongoDB, Oracle Database.": "<strong>来自业务数据库的变更数据捕获（CDC）</strong>——例如 SQL Database、MongoDB、Oracle Database。",
    "API-based and protocol-driven ingestion — e.g., HTTP endpoints, Solace PubSub+.": "<strong>基于 API 与协议驱动的摄取</strong>——例如 HTTP 端点、Solace PubSub+。",
    "These connectors cover many common ingestion scenarios, but the streaming ecosystem is significantly broader and constantly evolving. When a team's source isn't covered, customers have to depend on Microsoft to build the connector for them — a long process gated by the platform roadmap. And some connectors can't be shipped at all due to licensing restrictions.": "这些连接器涵盖了许多常见的摄取场景，但流数据的生态系统要广阔得多，而且不断演进。当某个团队的数据来源不在覆盖范围内时，客户就只能依赖 Microsoft 来替他们打造连接器——这是一个受平台路线图制约的漫长过程。而有些连接器因为授权限制，根本无法交付。",
    "The real user pain: users are blocked from bringing data into Fabric when connectors are missing or restricted.": "<strong>真正的用户痛点：</strong>当连接器缺失或受限时，用户就无法把数据带进 Fabric。",
    "Data engineers build temporary APIs, middleware, or polling scripts when connectors don't exist.": "当连接器不存在时，数据工程师只能自行搭建临时的 API、中间件或轮询脚本。",
    "Organizations can't ingest critical data, leaving them blocked from using Fabric RTI.": "组织无法摄取关键数据，导致他们<strong>无法使用 Fabric RTI</strong>。",
    "The experience breaks the promise of “unified, real-time intelligence.”": "这样的体验，违背了「统一、实时智能」的承诺。",
    "Competitor study": "竞品研究",
    "How other streaming products solve this": "其他流数据产品如何解决这个问题",
    "Every major streaming platform faces the same truth: there are far more data systems in the world than the built-in connectors. We analyzed competitors like Confluent, Cribl, and StreamSets, and found a consistent pattern across the competitors — they each provide a bring-your-own-connector capability.": "每一个主流流数据平台都面对同一个事实：世界上的数据系统远远多于内置连接器。我们分析了 Confluent、Cribl、StreamSets 等竞品，发现它们有一个一致的共同点——它们都提供了「自带连接器（bring-your-own-connector）」的能力。",
    "Product": "产品",
    "Extensibility model": "扩展模型",
    "How users add a custom source": "用户如何新增自定义来源",
    "Confluent / Kafka Connect": "Confluent / Kafka Connect",
    "Pluggable Kafka Connect connector plugins (SourceConnector / SourceTask), with the Confluent Hub marketplace.": "可插拔的 Kafka Connect 连接器插件（SourceConnector / SourceTask），并配有 Confluent Hub 市集。",
    "Build a connector against the Connect API, package it as a ZIP/JAR plugin, then drop it on the worker plugin path — or upload it as a Custom Connector in Confluent Cloud and configure it through the UI.": "针对 Connect API 开发连接器，将其打包为 ZIP/JAR 插件，然后放到 worker 的插件路径上——或在 Confluent Cloud 中以自定义连接器的形式上传，并通过 UI 进行配置。",
    "Cribl Stream": "Cribl Stream",
    "Generic protocol sources plus configurable Collectors — no compiled plugin to ship.": "通用协议来源，加上可配置的 Collectors——无需编译、无需交付插件。",
    "Point an unsupported system at a Raw HTTP/TCP/UDP source, or use the REST/API and Script Collectors to pull from any endpoint or command; configs are editable and importable as JSON.": "把不受支持的系统指向 Raw HTTP/TCP/UDP 来源，或使用 REST/API 与脚本 Collectors，从任何端点或命令拉取数据；配置可编辑，也可以 JSON 形式导入。",
    "StreamSets (IBM)": "StreamSets (IBM)",
    "Broad origin library plus a custom-stage SDK and generic origins.": "广泛的 origin 库，加上自定义 stage 的 SDK 与通用 origins。",
    "Use the HTTP Client origin or scripting evaluators for ad-hoc sources, or build a custom origin with the Stage SDK and install it as a custom stage library.": "使用 HTTP Client origin 或脚本化的 evaluators 来处理临时来源，或用 Stage SDK 打造自定义 origin，并将其安装为自定义 stage 库。",
    "The study makes the path clear: a bring-your-own-connector capability lets users upload and reuse open-source connectors, and bypass the dependency on Microsoft — and the long wait — for a connector to be built.": "这项研究让方向变得清晰：一个「自带连接器」的能力，能让用户上传并重用开源连接器，摆脱对 Microsoft 打造连接器的依赖——以及漫长的等待。",
    "New \"Custom stream connector\" item in Fabric": "Fabric 中全新的「自定义流连接器」项目",
    "We did some interviews with clients and existing users to validate our approaches. With the goal to make this extensibility feel native and to make the custom sources indistinguishable from the regular first-party connectors, the PMs and I proposed the solution with a new Fabric item — Custom Stream Connector — with the visions of ability to upload connector packages, manage versions, and reuse the same connector across multiple Eventstreams:": "我们与客户及现有用户进行了一些访谈，以验证我们的方向。为了让这项扩展能力感觉起来是原生的、让自定义来源与一般的第一方连接器难以区分，产品经理和我提出了一个新的 Fabric 项目——<strong>自定义流连接器（Custom Stream Connector）</strong>——愿景是能够上传连接器套件、管理版本，并在多个 Eventstream 之间重用同一个连接器：",
    "Familiar add-source flow — the custom tile sits alongside managed sources and follows the same configuration pattern.": "<strong>熟悉的新增来源流程</strong>——自定义磁贴与受管理的来源并列，遵循相同的配置模式。",
    "Operable like any connector — once running, users can inspect its state, metrics, and runtime logs.": "<strong>像任何连接器一样可操作</strong>——一旦运行，用户就能查看它的状态、指标与运行日志。",
    "Lifecycle management — a dedicated Custom Stream Connector item lets users upload new versions, switch the default version, and edit the connector's name, icon, and description.": "<strong>生命周期管理</strong>——专属的「自定义流连接器」项目，让用户上传新版本、切换默认版本，并编辑连接器的名称、图标与说明。",
    "CRUD configuration — a visual editor that previews how the connector's form will render and supports friendly, in-place updates and fixes.": "<strong>CRUD 配置</strong>——一个可视化编辑器，预览连接器的表单会如何呈现，并支持友好、就地的更新与修正。",
    "Target users": "目标用户",
    "Who we're solving this for": "我们在为谁解决问题",
    "The feature is aimed at the people who already hit the edge of the managed catalog — and have the means to extend it themselves.": "这项功能瞄准的是那些已经触及受管理目录边界、并且有能力自行扩展的人。",
    "Data engineers & platform teams with a proprietary, internal, or niche streaming source that Fabric doesn't ship a connector for, who can't wait on the platform roadmap.": "<strong>数据工程师与平台团队</strong>——他们拥有 Fabric 没有内置连接器的专有、内部或小众流数据来源，无法坐等平台路线图。",
    "Developers with Kafka Connect skills — comfortable with Java, Maven, and the SourceConnector/SourceTask interfaces — who can build or adapt a plugin themselves.": "<strong>具备 Kafka Connect 技能的开发者</strong>——熟悉 Java、Maven 以及 SourceConnector/SourceTask 接口——能够自行打造或改写插件。",
    "ISV partners who want to package and distribute their own connector so their customers can stream that source into Fabric.": "<strong>ISV 合作伙伴</strong>——希望封装并分发自己的连接器，好让他们的客户把该来源串流进 Fabric。",
    "Teams reusing open-source connectors from GitHub or a vendor, who just need a supported place to upload and run them.": "<strong>重用开源连接器的团队</strong>——他们从 GitHub 或供应商取得连接器，只需要一个受支持的地方来上传并运行它们。",
    "Research & validation": "研究与验证",
    "Validating the experience with real users": "用真实用户验证这套体验",
    "I wrote the research plan and ran 5+ interviews with target users — developers building their own plugins and partners bringing existing ones — to test whether the upload-and-connect model held up end to end, and where the authoring experience needed work.": "我撰写了研究计划，并对目标用户进行了 <strong>5 场以上的访谈</strong>——包括自行打造插件的开发者，以及带来既有插件的合作伙伴——以测试「上传并连接」这套模型能否端到端成立，以及创作体验还有哪些需要打磨之处。",
    "Research goals": "研究目标",
    "Discover a missing connector and identify the path to bring or upload their own.": "发现某个缺失的连接器，并找出带来或上传自己连接器的路径。",
    "Understand item and connector naming — connector name vs. item name.": "理解项目与连接器的命名——连接器名称与项目名称之别。",
    "Read package-defined settings confidently — the configuration form extracted from the uploaded connector.": "能有信心地读懂套件所定义的设置——也就是从上传的连接器中提取出的配置表单。",
    "Grasp and trust versioning behavior (default version, impact on existing instances and Eventstreams), and surface needs for testing, lineage, and governance.": "掌握并信任版本行为（默认版本、对既有实例与 Eventstream 的影响），并呈现在测试、血缘与治理方面的需求。",
    "Identify UI content gaps (tooltips, documentation, search/filter/tags) and operational patterns — who uploads, who configures, and how they verify.": "找出 UI 内容缺口（工具提示、文件、搜索/筛选/标签）与操作模式——谁负责上传、谁负责配置、他们又如何验证。",
    "Method": "方法",
    "60-minute interviews combining open-ended validation with a 3-task prototype walkthrough:": "60 分钟的访谈，结合开放式验证与一段包含 3 个任务的原型走查：",
    "Task 1 — find and recognize the “upload custom connector” entry point in the Real-Time hub.": "<strong>任务 1</strong>——在实时中心里找到并辨识出「上传自定义连接器」的入口。",
    "Task 2 — upload and create a custom connector.": "<strong>任务 2</strong>——上传并创建一个自定义连接器。",
    "Task 3 — update and manage an existing connector.": "<strong>任务 3</strong>——更新并管理一个既有的连接器。",
    "I recruited 5 participants — 3 through the Fabric User Panel and 2 clients already in contact with the PM team who had expressed interest in the feature. Between sessions I iterated the prototype based on findings to reach full comprehension and overall satisfaction.": "我招募了 <strong>5 位参与者</strong>——3 位来自 Fabric 用户小组，2 位是已在与产品经理团队接触、并对此功能表达兴趣的客户。在每场访谈之间，我都会根据发现迭代原型，直到达成完全理解与整体满意。",
    "Participants": "参与者",
    "Role & org": "角色与组织",
    "Prior RTI experience": "先前的 RTI 经验",
    "Business Analyst / Data Analytics, Karinity (AU)": "商业分析师 / 数据分析，Karinity（澳大利亚）",
    "Uses Fabric pipelines; interested in RTI; builds API/RPA workarounds when no connector exists.": "使用 Fabric 管线；对 RTI 感兴趣；在没有连接器时会自行搭建 API/RPA 的变通方案。",
    "Director of Information Systems, Functional Devices (US)": "信息系统总监，Functional Devices（美国）",
    "Builds .NET middleware; uses Event Hub and Event Streams.": "打造 .NET 中间件；使用 Event Hub 与 Event Streams。",
    "Platform Lead / Manager, KPN (NL)": "平台负责人 / 经理，KPN（荷兰）",
    "High streaming maturity (Kafka/Confluent), beginner with Fabric RTI; huge scale (2,400 use cases).": "高度成熟的流数据能力（Kafka/Confluent），但对 Fabric RTI 是初学者；规模庞大（2,400 个使用场景）。",
    "Head of Data, Benfica (PT)": "数据主管，Benfica（葡萄牙）",
    "Operates stadium & fan-engagement use cases; heavy APIs + Kafka; believes Kusto is the differentiator.": "负责球场与球迷互动的使用场景；大量使用 API + Kafka；认为 Kusto 才是关键差异所在。",
    "Consultant, Axians": "顾问，Axians",
    "Uses Fabric; used the eventhouse get-data wizard; interested in a SAP HANA connector.": "使用 Fabric；用过 eventhouse 的 get-data 向导；对 SAP HANA 连接器感兴趣。",
    "What we found & the decisions they drove": "我们的发现，以及它们所驱动的决策",
    "Upload entry points were found successfully.": "上传入口都被顺利找到。",
    "Manage entry points were found successfully.": "管理入口都被顺利找到。",
    "Users were unsure how to build a connector.": "用户不确定该如何<em>打造</em>一个连接器。",
    "Users wanted clear indicators on self-uploaded connectors.": "用户希望对自行上传的连接器有清楚的标示。",
    "Users preferred the same name for the connector and the item.": "用户偏好连接器与项目使用同一个名称。",
    "Users understood the default version, but the “upgrade” path was missing.": "用户理解默认版本，但缺少了「升级」的路径。",
    "1. Building a connector is the biggest unknown.": "1. 打造连接器，是最大的未知数。",
    "All 5 participants were concerned about how to build a connector that Fabric would support — the “building the library” step was the part they were most interested in yet felt least covered by the flow. Every one of them asked for detailed documentation on getting a library ready.": "全部 5 位参与者都担心该如何打造一个 Fabric 会支持的连接器——「建立函数库」这一步，是他们最感兴趣、却觉得流程最少着墨的部分。他们每一个人都要求提供准备好函数库的详细文件。",
    "\"…it's about creating your own connectors. You've got your own connector which you create based upon an SDK or an open standard like Kafka itself, which you then can upload… But that's after I've already explored. There is no default connector out-of-the-box available.\"": "「……这关乎创建你自己的连接器。你有基于 SDK 或像 Kafka 这类开放标准所创建的连接器，接着就能上传……但那已经是我探索完之后的事了。目前并没有开箱即用的默认连接器可用。」",
    "— Platform Lead, KPN": "—— 平台负责人，KPN",
    "\"I don't know how the RTI part of the connector works, so I want to explore how this thing works… for me the first thing is I want to go to documentation.\"": "「我不知道连接器的 RTI 部分是怎么运作的，所以我想探索这东西是怎么运作的……对我来说，第一件事就是我想去看文件。」",
    "— Research participant": "—— 研究参与者",
    "Decision": "决策",
    "Treat documentation and build guidance as a first-class part of the experience — surface clear “how to build a connector” pathways and SDK/Kafka references at the entry point, not buried after upload.": "把文件与打造指引视为体验中的一等公民——在入口处就提供清楚的「如何打造连接器」路径与 SDK/Kafka 参考资料，而不是把它们埋藏在上传之后。",
    "2. One name, not two.": "2. 一个名称，而不是两个。",
    "In the first 4 studies we separated connector settings into an item name (save location) and a connector name (display alias). All 4 struggled to differentiate them: only 2 correctly guessed that the connector name is what shows on the Real-Time hub card while the item name is stored in the workspace — 1 assumed the item name was the Eventstream connecting the connector. Every participant suggested merging the two to make the item-to-connector correlation obvious. One noted a reason to keep an optional connector “label”: when a team has a strict item-naming structure, a friendly label makes the card easier to read.": "在前 4 场研究中，我们把连接器设置分成<em>项目名称</em>（保存位置）与<em>连接器名称</em>（显示别名）。4 位都难以区分两者：只有 2 位正确猜到连接器名称才是显示在实时中心磁贴上的，而项目名称则储存在工作区中——有 1 位以为项目名称是连接该连接器的 Eventstream。每一位参与者都建议把两者合并，让「项目对应连接器」的关系一目了然。有一位指出保留一个可选连接器「标签」的理由：当团队有严格的项目命名规范时，一个友好的标签能让磁贴更易于阅读。",
    "\"Connector 'label' might be more clear than connector 'name'… can be changed for easy to read when I have a complex naming structure for items.\"": "「连接器『标签』也许比连接器『名称』更清楚……当我的项目命名结构很复杂时，标签可以改成方便阅读的样子。」",
    "Merge connector name and item name into a single name by default, keeping an optional label override for teams with fixed naming conventions.": "默认将连接器名称与项目名称合并为单一名称，同时为有固定命名规范的团队保留一个可选的标签覆盖。",
    "3. Versioning is understood — upgrading is missing.": "3. 版本管理能被理解——但缺少了升级。",
    "Participants grasped what the default version meant, but expected a way to upgrade existing instances and wanted visible indicators distinguishing self-uploaded connectors from managed ones.": "参与者理解默认版本代表什么，但期待有一种方式来<em>升级</em>既有实例，并希望有明显的标示，把自行上传的连接器与受管理的连接器区分开来。",
    "\"Obviously if I change the default it's gonna change new event streams that I create, right? The only question in my mind is does that update existing event streams, or am I gonna have to go to the existing event streams to?\"": "「显然，如果我更改默认值，会影响我之后创建的新 event stream，对吧？我心里唯一的疑问是：这会更新既有的 event stream 吗，还是我得自己去既有的 event stream 里改？」",
    "\"It would be easier for it to go edit existing event streams automatically — but would it potentially break anything? So I think my preference is to upgrade in the Eventstream, but don't apply to existing Eventstreams by default.\"": "「让它自动去编辑既有的 event stream 会比较轻松——但这会不会有弄坏东西的风险？所以我想我的偏好是在 Eventstream 里升级，但默认不套用到既有的 Eventstream。」",
    "Add an explicit upgrade flow for the default version and visual indicators that mark connectors as self-uploaded.": "为默认版本新增一个明确的升级流程，并加入视觉标示，把连接器标记为自行上传。",
    "4. No one wanted to hand-edit configuration.": "4. 没有人想手动编辑配置。",
    "The clearest, most consistent signal: people didn't want to edit a raw config blob. They expected a familiar CRUD-style UI — create, read, update, and delete the connector's settings the same way they manage other Fabric resources. Defining which properties end users see, and what each one means, shouldn't require editing JSON. They asked to manage settings visually; add, edit, reorder, and remove them with clear fields; preview the form their end users will actually fill in; and keep an escape hatch to the underlying JSON for power users.": "最清楚、也最一致的讯号是：人们不想编辑一坨原始的配置。他们期待一个熟悉的 <strong>CRUD 风格的 UI</strong>——像管理其他 Fabric 资源一样，去创建、读取、更新与删除连接器的设置。定义最终用户会看到哪些属性、以及每个属性代表什么，不应该需要编辑 JSON。他们希望以可视化方式管理设置；用清楚的字段来新增、编辑、重新排序与移除它们；预览最终用户实际要填写的表单；同时为进阶用户保留一个通往底层 JSON 的后门。",
    "\"So when I'm uploading a new version, I want to compare the view from the old versions and see the 'preview and edit' form for the new version — I'm not only uploading the new code, I might be adding fields to the form as well. This is where I expect to do that work in one go.\"": "「所以当我上传新版本时，我想比对旧版本的视图，并看到新版本的『预览与编辑』表单——我不只是在上传新代码，我可能也在为表单新增字段。这正是我期待一次就把这些工作做完的地方。」",
    "After Private Preview, design a full CRUD experience for connector configuration — turning settings management from a manual, error-prone step into a first-class, guided screen.": "在私有预览（Private Preview）之后，为连接器配置设计一套完整的 CRUD 体验——把设置管理从一个手动、容易出错的步骤，变成一个一等公民、有引导的画面。",
    "Upload + CRUD connector": "上传 + CRUD 连接器",
    "Clickable prototype, from upload to manage.": "可点击的原型，从上传到管理。",
    "Manage connector with Custom stream connector item": "用「自定义流连接器」项目管理连接器",
    "Clickable prototype for managing a connector and its versions.": "用于管理连接器及其版本的可点击原型。",
    // Navigation + global UI
    "About me": "关于我",
    "Connect with me": "与我联系",
    "Resume (EN)": "履历（英文）",
    "Resume (CN)": "履历（中文）",
    "Email me": "寄信给我",
    "Eventstream in Microsoft Fabric": "Microsoft Fabric 中的 Eventstream",
    "Business Events in Microsoft Fabric": "Microsoft Fabric 中的商业事件",
    "Custom stream connector": "自订串流连接器",
    "Top20Talent Portal": "Top20Talent 门户网站",
    "Switch to dark mode": "切换至深色模式",
    "Switch to light mode": "切换至浅色模式",

    // Home — intro
    "Hi there! ✦": "你好！✦",
    "I am Fangying": "我是 Fangying",
    "See my work": "查看我的作品",
    "I'm a Product Designer at Microsoft focused on data, AI, and real-time analytics experiences. I design products that help organizations connect, process, and understand data at scale—from onboarding and data ingestion to streaming insights and AI-powered workflows. My work spans Microsoft Fabric, where I've helped build new experiences from 0→1, simplify complex technical concepts, and partner closely with engineering, research, and product teams to deliver customer impact.":
      "我是一名任职于 <strong>Microsoft</strong> 的<strong>产品设计师</strong>，专注于<strong>数据</strong>、<strong>AI</strong> 与<strong>即时分析</strong>体验。我设计的产品帮助组织大规模地连接、处理并理解数据——从上手与数据截取，到串流洞察与 AI 驱动的工作流程。<br /><br />我的工作横跨 Microsoft Fabric，在这里我从 0→1 打造全新体验、把复杂的技术概念变得简单，并与工程、研究与产品团队紧密合作，交付对客户的实际影响。",
    "My work is password protected. Click See my work above to unlock the case studies.":
      "我的作品受密码保护。请点击上方的<strong>「查看我的作品」</strong>以解锁案例研究。",

    // Home — tile descriptions
    "Build real-time data pipelines on a canvas — connect sources, transforms, and destinations, schema-aware end to end.":
      "在画布上创建即时数据管线——连接来源、转换与目的地，端到端支持结构描述（schema）。",
    "Turn raw streams into meaningful, business-critical signals — define, explore, and act on events with AI-assisted authoring.":
      "将原始串流转化为有意义、攸关业务的信号——通过 AI 辅助创建，定义、探索并对事件采取行动。",
    "Let developers bring their own streaming sources into Fabric with a configurable connector framework.":
      "让开发者通过可设置的连接器框架，把自己的串流来源带进 Fabric。",
    "A B2C job-search platform — redesigning the apply & register flow to lift conversion and reduce drop-off.":
      "一个 B2C 求职平台——重新设计申请与注册流程，以提升转换率并降低流失。",

    // ── Business Events page ──────────────────────────────
    "Turn raw streams into meaningful, business-critical signals. Business Events lets users define, explore, and act on the moments that matter — with AI-assisted authoring that makes the whole flow feel effortless.":
      "将原始串流转化为有意义、攸关业务的信号。商业事件（Business Events）让用户定义、探索并对关键时刻采取行动——通过 AI 辅助创建，让整个流程轻松自然。",
    "The problem": "问题",
    "Lots of data, not enough meaning": "数据很多，意义不足",
    "Every company today runs on a web of apps, devices, and systems that are constantly producing data — thousands of tiny status updates happening every second. But raw data doesn't tell you what to do. The hard part isn't collecting it; it's spotting the moments that matter and reacting fast enough to make a difference.":
      "如今每一家公司都运行在由各种应用程序、设备与系统交织而成的网络上，这些系统每秒都不断产生成千上万的细小状态更新。但原始数据本身并不会告诉你该<em>做什么</em>。真正困难的不是收集数据，而是辨识出那些重要的时刻，并够快地做出反应、带来改变。",
    "Before Business Events, there was no easy, built-in way for users to send out a clear \"an important thing just happened\" signal — like a flight is delayed or a bag was sent to the wrong place. Users had two bad options: settle for generic system alerts that didn't fit their business, or hand-build complicated plumbing to connect everything — slow, expensive, and easy to break.":
      "在商业事件出现之前，用户没有一个简单、内置的方式来发出清楚的「有重要的事情刚刚发生」信号——例如某个航班延误了，或是一件行李被送错了地方。用户只有两个不理想的选择：勉强接受不符合自身业务的通用系统警示，或是自行手动搭建复杂的串接管线——既慢、又贵，还容易出问题。",
    "The idea": "构想",
    "A clear announcement everyone can understand": "一则人人都能理解的清楚公告",
    "A business event is a short, meaningful \"heads-up\" that something important happened and is worth reacting to right away. It's less like a wall of numbers and more like a headline: \"Order Placed,\" \"Price Changed,\" \"Shipment Left the Warehouse.\" Business Events is a feature in Microsoft Fabric that lets users create these headlines, find them, and act on them — all in one place.":
      "商业事件是一则简短、有意义的「提醒」，告诉你有重要的事情发生了、值得立即做出反应。它不像一整面的数字墙，而更像一则标题：「订单已下单」、「价格已变动」、「货物已离开仓库」。商业事件是 Microsoft Fabric 中的一项功能，让用户创建这些标题、找到它们，并对它们采取行动——全部在同一个地方完成。",
    "The easiest way to picture it: imagine a busy airport. The flood of raw radar data is something no normal person could read. But the announcements — \"Flight 204 is delayed\" — are clear, standard, and instantly understood by everyone. Business events are the announcements for our users' systems. Instead of everyone squinting at raw data, they hear the same clear message and can respond.":
      "最容易理解的比喻是：想像一座繁忙的机场。原始雷达数据如洪水般涌来，一般人根本读不懂。但那些广播——「204 号班机延误」——清楚、标准，人人都能立刻听懂。商业事件就是用户系统的「广播」。大家不必再瞇着眼看原始数据，而是听到同一则清楚的消息，并能据此做出回应。",
    "How it works": "运作方式",
    "Publishers and consumers: a decoupled design": "发布者与消费者：一种解耦的设计",
    "The clever part of the design is that the announcers (publishers) and the listeners (consumers) never have to talk to each other directly.":
      "这个设计的巧妙之处在于：<strong>广播者（发布者）</strong>与<strong>聆听者（消费者）</strong>之间永远不需要直接对话。",
    "What's a \"publisher\"? A publisher is simply the announcer — the source that calls out the event and says \"this just happened.\" It could be a live data pipeline (Eventstream), a no-code rule (Activator), or a piece of custom code (a Notebook or User Data Function). Whichever one detects the moment is the publisher (the announcer); everything else that reacts is a consumer (a listener).":
      "什么是「发布者」？发布者其实就是<strong>广播者</strong>——<em>喊出事件、声明「这件事刚刚发生了」的来源</em>。它可以是一条即时数据管线（<strong>Eventstream</strong>）、一条无代码规则（<strong>Activator</strong>），或一段自订代码（<strong>Notebook</strong> 或 <strong>User Data Function</strong>）。侦测到该时刻的那一个就是<strong>发布者（广播者）</strong>；其他所有做出反应的都是<strong>消费者（聆听者）</strong>。",
    "Publishers (the announcers) — such as Eventstream, Activator, Notebooks, and User Data Functions — emit an event once.":
      "<strong>发布者（广播者）</strong>——例如 Eventstream、Activator、Notebook 与 User Data Function——只需发出一次事件。",
    "Consumers (the listeners) — like Activator (to trigger alerts and workflows), Eventhouse (to store and query history), and Real-Time Dashboards (to visualize) — can subscribe independently, without ever touching or coordinating with the original source.":
      "<strong>消费者（聆听者）</strong>——例如 Activator（触发警示与工作流程）、Eventhouse（保存与查找历史）以及即时仪表板（进行可视化）——可以各自独立订阅，完全不需碰触或协调原始来源。",
    "Because publishers (announcers) and consumers (listeners) are kept separate this way, a new client can start listening (consuming) to an existing event anytime — without disturbing whoever set it up in the first place. Think of it like a public address system: the publisher (the announcer) doesn't need to know who's listening, and new consumers (listeners) can tune in whenever they want.":
      "正因为发布者（广播者）与消费者（聆听者）像这样被分开，任何新的用户端都能随时开始<strong>聆听（消费）</strong>某个既有事件——而不会打扰到最初创建它的人。可以把它想成公共广播系统：<strong>发布者（广播者）</strong>不需要知道谁在听，而新的<strong>消费者（聆听者）</strong>也能随时加入收听。",
    "To make sure every consumer (listener) interprets an event the same way, there's a shared rulebook (called a Schema Registry) that defines exactly what information each event contains. That way, no one gets confused, and the events stay consistent as more of our users start relying on them.":
      "为了确保每一个<strong>消费者（聆听者）</strong>都以相同方式解读事件，这里有一本共用的<strong>规则手册</strong>（称为 Schema Registry），明确定义每个事件包含哪些信息。如此一来，没有人会混淆，而且随着愈来愈多用户开始依赖这些事件，它们也能保持一致。",
    "AI-guided setup": "AI 引导设置",
    "Creating one, with AI doing the heavy lifting": "创建事件，让 AI 承担繁重的工作",
    "Research showed that users didn't want to build one of these by hand — the setup involved too many technical steps and unfamiliar terms, and it felt overwhelming. So the experience is designed around one idea: describe what you want in plain English, and AI walks you through the rest.":
      "研究显示，用户并不想手动创建这些事件——过程牵涉太多技术步骤与陌生术语，令人不知所措。因此整个体验围绕一个内核构想设计：<em>用平常的话描述你想要的，剩下的交给 AI 一步步带你完成。</em>",
    "Here's how it feels to use, step by step:": "以下是实际使用时的逐步体验：",
    "Say what you want to track. For example: \"Let me know whenever a bag is sent to the wrong airport.\" The AI understands this and sets up the event for you, including the details it should carry (like flight number and bag ID).":
      "<strong>说出你想追踪的事。</strong>例如：<em>「每当有行李被送错机场时通知我。」</em>AI 会理解这句话，并为你创建好事件，包括它应携带的细节（例如航班编号与行李 ID）。",
    "AI sets up a place to keep the history. Every announcement is automatically saved so you can look back later and spot patterns. That storage spot — Eventhouse — is like a super-fast filing cabinet built for live data, and you don't have to set it up yourself; it just happens.":
      "<strong>AI 为你设好保存历史的地方。</strong>每一则公告都会自动被保存，方便你日后回顾、找出规律。那个保存处——<strong>Eventhouse</strong>——就像一个为即时数据打造的超高速文件柜，而且你不必自己设置，它自然就会就绪。",
    "AI suggests where the signal should come from. It recommends the best source for your announcement and connects it for you, so the information lines up correctly every time.":
      "<strong>AI 建议信号应该来自哪里。</strong>它会为你的公告推荐最合适的来源并替你连接好，让信息每次都能正确对应。",
    "AI helps decide what happens next. It wires up the reaction — like automatically sending an email or a Microsoft Teams message, or kicking off a follow-up task — the moment the event happens.":
      "<strong>AI 协助决定接下来要做什么。</strong>它会把后续反应串接好——例如自动寄出电子邮件、发送 Microsoft Teams 消息，或启动后续任务——在事件发生的那一刻立即运行。",
    "The result: a confusing, multi-step technical process becomes a simple, guided conversation. Even someone who's never heard the technical terms can set up a complete, working event, because AI quietly handles the complicated parts in the background.":
      "结果是：一个令人困惑、多步骤的技术流程，变成一段简单、有引导的对话。即使是从没听过那些技术术语的人，也能创建出一个完整、可运作的事件，因为 AI 已在背后默默处理好了复杂的部分。",
    "Why it matters": "为何重要",
    "From \"something happened\" to \"someone did something about it\"": "从「发生了某件事」到「有人采取了行动」",
    "Business Events turn passive data into real action. The benefits are simple:":
      "商业事件把被动的数据转化为实际的行动。好处很简单：",
    "React instantly. Users respond the moment something important happens, instead of finding out later.":
      "<strong>即时反应。</strong>用户能在重要事情发生的当下就做出回应，而不是事后才得知。",
    "Add new uses without breaking anything. Because announcers (publishers) and listeners (consumers) are independent, new clients can plug in anytime.":
      "<strong>添加用途而不破坏既有的一切。</strong>因为广播者（发布者）与聆听者（消费者）彼此独立，新的用户端可以随时接入。",
    "Everyone speaks the same language. One shared definition of each event means no confusion across users' organizations.":
      "<strong>大家说同一种语言。</strong>每个事件都有一份共用定义，让用户的整个组织不再有理解落差。",
    "Once an event is announced, it can do things automatically — send an alert, run a follow-up task, feed information to AI, or get saved for later review — all from a single signal. And because the announcements are easy to find, other users can reuse the same one instead of rebuilding their own, which saves time, avoids duplicate work, and keeps everyone in sync.":
      "事件一旦被公告，就能自动做许多事——发送警示、运行后续任务、把信息喂给 AI，或存下来供日后查看——全都源自同一个信号。而且因为这些公告很容易被找到，其他用户可以直接重用同一个，而不必自己重建，这能节省时间、避免重复工作，并让所有人保持同步。",
    "User validation": "用户验证",
    "What we learned from user study": "用户研究带给我们的发现",
    "This work was shaped by a study of 31 people — a mix of technical and non-technical roles across industries like manufacturing, logistics, retail, and hospitality. Their frustrations pointed straight to the problems Business Events solves:":
      "这项工作是根据一份针对 <strong>31 位受访者</strong>的研究塑造而成——涵盖制造、物流、零售、餐旅等产业中技术与非技术角色的组合。他们的挫折直指商业事件所要解决的问题：",
    "Silent failures break trust. The scariest thing wasn't data that was broken — it was data that looked fine but was quietly wrong or empty. Users needed an easy way to double-check that the right signals were arriving.":
      "<strong>无声的失败会摧毁信任。</strong>最可怕的不是明显坏掉的数据——而是<em>看起来</em>正常、却悄悄出错或根本是空的数据。用户需要一个简单的方式，来再次确认正确的信号确实有送达。",
    "Too many disconnected tools. Users were stuck manually stitching together several tools to get one job done — slow and easy to get wrong. A single shared system removes that busywork.":
      "<strong>太多彼此不相连的工具。</strong>用户被迫手动把好几个工具拼凑在一起才能完成一件事——既慢又容易出错。一个统一、共用的系统能消除这些琐碎的杂务。",
    "Non-technical folks need plain, useful signals. Users who make fast operational decisions aren't data experts; they need clear, meaningful \"headlines,\" not raw technical noise.":
      "<strong>非技术人员需要平实、实用的信号。</strong>那些需要快速做出营运决策的用户并不是数据专家；他们需要清楚、有意义的「标题」，而不是原始的技术杂讯。",
    "Too many alerts, too much cost. When users set up a separate alert for everything, it piled up. A shared event that many people can listen to cuts down the clutter.":
      "<strong>警示太多、成本太高。</strong>当用户为每件事都设置一个独立警示时，数量就会不断堆积。一个能让许多人共同聆听的共用事件，可以大幅减少这种杂乱。",
    "A follow-up usability test made the case for the AI-guided setup especially clear: users wanted to start from their own data (not a confusing menu), and asked for a plainer explanation of what a business event even is — none of the five participants understood the technical terms. Letting people describe what they want and having AI handle the rest directly fixes that.":
      "一次后续的可用性测试，让 <strong>AI 引导设置</strong>的价值格外清楚：用户希望从自己的数据出发（而不是一个令人困惑的菜单），并希望有人用更浅白的方式解释商业事件到底是什么——五位参与者中没有一个人看得懂那些技术术语。让人们用自己的话描述需求、其余交给 AI，正好直接解决了这个问题。",
    "Interactive prototype": "交互原型",
    "Try it end to end": "完整体验一遍",
    "Create business events with AI assistance": "通过 AI 辅助创建商业事件",
    "Define meaningful business events and turn raw streams into actionable signals with AI-assisted guidance. Prototype password: 1234denise":
      "在 AI 辅助引导下，定义有意义的商业事件，并把原始流数据转化为可行动的信号。原型密码：1234denise",
    "Open prototype ↗": "打开原型 ↗",

    // ── Eventstream page ──────────────────────────────────
    "A visual topology editor that lets data engineers build real-time pipelines on a canvas — ingest, transform with code and no code, and route data into destinations — schema-aware from source to destination.":
      "一个可视化的拓扑编辑器，让数据工程师在画布上创建即时管线——截取数据、以代码与无代码方式转换，并把数据路由到目的地——从来源到目的地全程支持结构描述（schema）。",
    "Team": "团队",
    "1 Product designer": "1 位产品设计师",
    "3 Product managers (Xu Jiang, Alex Lin, Wenyang Shi)": "3 位产品经理（Xu Jiang、Alex Lin、Wenyang Shi）",
    "20+ Engineers": "20+ 位工程师",
    "My role": "我的角色",
    "Sole designer 0→1": "唯一设计师，0→1",
    "UX researcher": "用户体验研究员",
    "Introduction": "简介",
    "What is Fabric?": "什么是 Fabric？",
    "Microsoft Fabric, one of Microsoft's fastest-growing analytics platforms, is a unified, cloud-based data platform that brings together everything needed to work with data — from data ingestion and transformation to data analytics and visualization — in a single experience.":
      "Microsoft Fabric 是 Microsoft 成长最快的分析平台之一，也是一个统一的云端数据平台，把处理数据所需的一切——从数据截取与转换，到数据分析与可视化——集成在单一体验中。",
    "It combines capabilities across data engineering, data science, real-time analytics, and business intelligence (including Power BI for reporting and insight sharing), all built on a shared data foundation.":
      "它集成了数据工程、数据科学、即时分析与商业智能（包括用于报表与洞察分享的 Power BI）等各方面的能力，全都创建在共用的数据基础之上。",
    "Fabric also integrates AI and Copilot experiences to help automate tasks, generate insights, and accelerate data workflows.":
      "Fabric 也集成了 AI 与 Copilot 体验，协助自动化工作、产生洞察并加速数据工作流程。",
    "By consolidating traditionally fragmented tools into one platform, Fabric enables teams to work on the same data without duplication or complex integrations. With AI assistance, Fabric empowers both technical and non-technical users to turn data into actionable insights faster.":
      "通过把过去零散的工具集成到单一平台，Fabric 让团队能在同一份数据上协作，不必重复作业或进行复杂的集成。在 AI 的协助下，Fabric 让技术与非技术用户都能更快把数据转化为可行动的洞察。",
    "Overview": "概览",
    "A native, real-time streaming experience in Fabric": "Fabric 中原生的即时串流体验",
    "Eventstream is one of Microsoft Fabric's foundational Real-Time Intelligence experiences, designed to help organizations ingest, process, transform, and route streaming data from a variety of sources into analytics destinations in real time. Built as a native Fabric experience, Eventstream enables users to create end-to-end streaming pipelines through a visual interface, reducing the complexity traditionally associated with real-time data systems.":
      "Eventstream 是 Microsoft Fabric 基础的即时智能（Real-Time Intelligence）体验之一，设计目的是协助组织即时地从各种来源截取、处理、转换并路由串流数据到分析目的地。作为 Fabric 的原生体验，Eventstream 让用户通过可视化接口创建端到端的串流管线，降低过去即时数据系统常见的复杂度。",
    "As one of the earliest workloads in Fabric, Eventstream played a critical role in establishing Fabric's vision of delivering a unified data platform where users can move seamlessly from data ingestion to analytics and business intelligence without leaving the ecosystem.":
      "作为 Fabric 最早的工作负载之一，Eventstream 在确立 Fabric 愿景上扮演了关键角色——打造一个统一的数据平台，让用户能从数据截取无缝衔接到分析与商业智能，全程不必离开这个生态系。",
    "Why we built it": "我们为何打造它",
    "Real-time data was powerful, but hard to reach": "即时数据很强大，却难以触及",
    "Modern organizations generate massive amounts of real-time data from applications, devices, databases, clickstreams, and cloud services. While this data holds significant business value, working with it often requires specialized expertise and multiple disconnected tools.":
      "现代组织会从应用程序、设备、数据库、点击流与云端服务产生大量即时数据。虽然这些数据具有庞大的商业价值，但处理它们往往需要专业技能与多个彼此不相连的工具。",
    "As Microsoft Fabric was being created as a unified data platform, there was an opportunity to rethink how users interacted with streaming data. Instead of forcing users to stitch together complex services and infrastructure, we wanted to create an experience where ingesting and moving real-time data could be as approachable as building a data report.":
      "在 Microsoft Fabric 被打造为统一数据平台的同时，我们有机会重新思考用户与串流数据交互的方式。与其逼用户把复杂的服务与基础架构拼凑起来，我们希望打造一种体验，让截取与移动即时数据就像制作一份数据报表一样平易近人。",
    "Eventstream was conceived as a foundational building block of Fabric — providing a simple, visual way to connect, transform, and route streaming data while integrating seamlessly with the rest of the platform.":
      "Eventstream 从一开始就被设想为 Fabric 的基础构建组件——提供一种简单、可视化的方式来连接、转换并路由串流数据，同时与平台的其余部分无缝集成。",
    "Product vision": "产品愿景",
    "Make real-time data accessible to everyone": "让即时数据人人皆可触及",
    "Our vision was to make real-time data accessible to more than just streaming specialists.":
      "我们的愿景，是让即时数据不再只属于串流专家，而是人人都能使用。",
    "We set out to create a low-code, visual experience that would allow data engineers, analysts, and developers to build streaming data pipelines without needing deep expertise in distributed systems or event processing technologies.":
      "我们着手打造一个低代码、可视化的体验，让数据工程师、分析师与开发者能创建串流数据管线，而不需具备分布式系统或事件处理技术的深厚专业。",
    "By embedding Eventstream directly within Fabric, users could:": "通过把 Eventstream 直接嵌入 Fabric，用户可以：",
    "Connect to live data sources": "连接即时数据源",
    "Transform and enrich streaming data": "转换并丰富串流数据",
    "Route events to multiple destinations": "将事件路由到多个目的地",
    "Analyze data in real time": "即时分析数据",
    "Surface insights through Power BI dashboards and reports": "通过 Power BI 仪表板与报表呈现洞察",
    "Leverage AI-powered capabilities across the Fabric ecosystem": "运用 Fabric 生态系中由 AI 驱动的各项能力",
    "Ultimately, the goal was to shorten the path from raw events to business insights and establish the real-time foundation for future Fabric experiences.":
      "最终目标，是缩短从原始事件到商业洞察的路径，并为未来的 Fabric 体验奠定即时基础。",
    "Designing a 0→1 product from the ground up": "从零到一，从头设计一项产品",
    "As a Product Designer on the Real-Time Intelligence team, I helped define and design the end-to-end Eventstream experience from the ground up.":
      "身为即时智能（Real-Time Intelligence）团队的产品设计师，我从头参与定义并设计了端到端的 Eventstream 体验。",
    "My responsibilities included:": "我的职责包括：",
    "Driving the product UX vision alongside PM and engineering partners": "与产品经理及工程伙伴一同推动产品的用户体验愿景",
    "Designing core workflows for creating and managing streaming pipelines": "设计创建与管理串流管线的内核工作流程",
    "Defining interaction patterns for sources, transformations, and destinations": "为来源、转换与目的地定义交互模式",
    "Conducting competitive analysis and customer research": "进行竞品分析与客户研究",
    "Iterating on concepts through prototyping and usability testing": "通过原型制作与可用性测试反复迭代概念",
    "Collaborating across multiple Fabric teams to ensure consistency within the broader platform": "跨多个 Fabric 团队协作，确保在整个平台中的一致性",
    "Because Eventstream was a 0→1 product, many interaction patterns, terminology, and mental models had to be established from scratch.":
      "由于 Eventstream 是一项从 0 到 1 的产品，许多交互模式、术语与心智模型都必须从零开始创建。",
    "Business scale": "业务规模",
    "Eventstream business scale": "支撑一项具规模的业务",
    "Within the Eventstream item, we deliver real-time data streaming capabilities that power a fast-growing business, driving meaningful impact across adoption, customer reach, and revenue.":
      "在 Eventstream 这项产品中，我们提供的即时数据串流能力，支撑着一项快速成长的业务，并在采用率、客户触及与营收等方面带来实质影响。",
    "Features": "功能",
    "Explore the design": "探索设计",
    "Explore eventstream": "探索 Eventstream",
    "Follow events across the topology in real time, monitor the health of every source, transform, and destination, and edit the stream to transform and enrich data as it flows.":
      "即时追踪事件在拓扑中的流动，监控每个来源、转换与目的地的健康状态，并在数据流动的同时编辑串流以进行转换与丰富。",
    "Open prototype →": "打开原型 →"
  };

  var I18N_SELECTOR = [
    ".nav__item",
    ".theme-switch__label",
    ".intro__eyebrow",
    ".intro__title",
    ".intro__lede",
    ".intro__scroll span:first-child",
    ".work-locked-note p",
    ".card__name",
    ".card__desc",
    ".proj-kicker",
    ".proj-title",
    ".proj-tagline",
    ".proj-section h2",
    ".proj-section h3",
    ".proj-section > p",
    ".proj-list li",
    ".proj-highlights li",
    ".proj-subhead",
    ".proj-quote p",
    ".proj-quote cite",
    ".proj-finding-title",
    ".proj-takeaway-note__label",
    ".proj-takeaway-note p",
    ".proj-figure__cap",
    ".proj-compare thead th",
    ".proj-compare tbody th",
    ".proj-compare td",
    ".proj-compare-takeaway",
    ".proj-credits dt",
    ".proj-credits dd",
    ".feature__name",
    ".feature__desc",
    ".feature__cta"
  ].join(", ");

  function translateEls(lang) {
    var els = document.querySelectorAll(I18N_SELECTOR);
    els.forEach(function (el) {
      if (el.__i18nEn === undefined) {
        el.__i18nEn = el.innerHTML;
        el.__i18nKey = normText(el.textContent);
      }
      if (lang === "zh" && I18N_ZH[el.__i18nKey] != null) {
        el.innerHTML = I18N_ZH[el.__i18nKey];
      } else {
        el.innerHTML = el.__i18nEn;
      }
    });
  }

  function updateWarning(lang) {
    var host = document.querySelector("main.proj") || document.querySelector("main");
    var existing = document.querySelector(".ai-translation-warning");
    if (lang === "zh" && host) {
      if (!existing) {
        var w = document.createElement("div");
        w.className = "ai-translation-warning";
        w.setAttribute("role", "note");
        w.innerHTML =
          '<span aria-hidden="true">⚠️</span><span>此页面的中文内容为 AI 翻译，仅供参考。</span>';
        host.insertBefore(w, host.firstChild);
      }
    } else if (existing) {
      existing.remove();
    }
  }

  function getLang() {
    try {
      return localStorage.getItem(LANG_KEY) === "zh" ? "zh" : "en";
    } catch (e) {
      return "en";
    }
  }

  function applyLang(lang) {
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang === "zh" ? "zh-Hans" : "en");
    translateEls(lang);
    updateWarning(lang);
    var lbl = document.querySelector(".lang-switch__label");
    if (lbl) lbl.textContent = lang === "zh" ? "EN" : "中文";
    var btn = document.querySelector(".lang-switch");
    if (btn) {
      btn.setAttribute(
        "aria-label",
        lang === "zh" ? "Switch to English" : "切换为中文"
      );
    }
  }

  // Inject the language button, grouped with the theme switch.
  (function initLangSwitch() {
    var themeSwitch = document.querySelector(".theme-switch");
    if (!themeSwitch) return;
    var bar = document.createElement("div");
    bar.className = "top-controls";
    themeSwitch.parentNode.insertBefore(bar, themeSwitch);
    var langBtn = document.createElement("button");
    langBtn.type = "button";
    langBtn.className = "lang-switch";
    langBtn.innerHTML =
      '<span class="lang-switch__icon" aria-hidden="true">🌐</span>' +
      '<span class="lang-switch__label"></span>';
    bar.appendChild(langBtn);
    bar.appendChild(themeSwitch);
    langBtn.addEventListener("click", function () {
      var next = getLang() === "zh" ? "en" : "zh";
      try {
        localStorage.setItem(LANG_KEY, next);
      } catch (e) {}
      applyLang(next);
    });
  })();

  applyLang(getLang());

  // ── Sidebar collapse ─────────────────────────────────────
  var app = document.querySelector(".app");
  var collapseBtn = document.querySelector(".nav-collapse");
  var reopenBtn = document.querySelector(".nav-reopen");

  function isMobileNav() {
    try {
      return window.matchMedia("(max-width: 880px)").matches;
    } catch (e) {
      return false;
    }
  }

  if (app) {
    // On mobile the menu is a full-screen overlay, so always start
    // closed. On desktop, restore the saved collapse preference.
    try {
      if (isMobileNav()) {
        app.setAttribute("data-nav-collapsed", "true");
      } else if (localStorage.getItem("nav-collapsed") === "true") {
        app.setAttribute("data-nav-collapsed", "true");
      }
    } catch (e) {}

    function setNav(collapsed) {
      app.setAttribute("data-nav-collapsed", collapsed ? "true" : "false");
      // Don't persist the mobile overlay's open/closed state — it would
      // leak into the desktop sidebar preference.
      if (!isMobileNav()) {
        try {
          localStorage.setItem("nav-collapsed", collapsed ? "true" : "false");
        } catch (e) {}
      }
      if (collapsed && reopenBtn) {
        reopenBtn.focus();
      } else if (!collapsed && collapseBtn) {
        collapseBtn.focus();
      }
    }

    if (collapseBtn) {
      collapseBtn.addEventListener("click", function () {
        setNav(true);
      });
    }
    if (reopenBtn) {
      reopenBtn.addEventListener("click", function () {
        setNav(false);
      });
    }
  }

  // ── Sidebar active state ─────────────────────────────────
  var items = document.querySelectorAll(".nav__item");

  // Highlight the nav item matching the current page on load.
  var currentPage = (
    window.location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();
  var onIndex = currentPage === "" || currentPage === "index.html";
  items.forEach(function (item) {
    var href = (item.getAttribute("href") || "").toLowerCase();
    var file = href.split("#")[0].split("?")[0];
    if (onIndex) {
      if (href === "#about") item.classList.add("is-active");
    } else if (file && file === currentPage) {
      item.classList.add("is-active");
    }
  });

  items.forEach(function (item) {
    item.addEventListener("click", function () {
      // Only toggle for in-page section links, not mailto/external.
      var href = item.getAttribute("href") || "";
      // Close the full-screen overlay menu on mobile after a selection.
      if (app && isMobileNav()) {
        app.setAttribute("data-nav-collapsed", "true");
      }
      if (href.charAt(0) !== "#") return;
      items.forEach(function (el) {
        el.classList.remove("is-active");
      });
      item.classList.add("is-active");
    });
  });

  // ── Floating engine: a light spring gives each prop an elastic "wave" when
  //    you scroll (a quick ripple that settles), props gently bump apart if
  //    they drift into each other, and everything always floats back to its
  //    starting spot. On phones, tilting the device nudges them toward the
  //    low edge (without overlapping). The props own their full transform
  //    here, so nothing fights a CSS keyframe.
  var fReduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fReduce) {
    // Per-prop personality:
    // [selector, ampY, ampX, period, phase, kickY, kickX, radius, tilt]
    //  kickY/kickX signs+sizes differ → each rides the scroll wave in its own
    //  direction/speed; radius is the soft collision size; tilt scales the
    //  device-orientation nudge on mobile.
    var fConfig = [
      [".conn-hov--laptop", 6, 4, 6.6, 0.0, 0.10, 0.05, 46, 0.9],
      [".conn-hov--box", 8, 6, 5.2, 2.1, -0.17, -0.09, 40, 1.25],
      [".conn-hov--hud", 5, 6, 7.6, 4.0, 0.075, 0.14, 28, 1.1],
    ];
    var fStates = [];
    document
      .querySelectorAll(".card__media--connector:not(.proj-banner)")
      .forEach(function (scene) {
        fConfig.forEach(function (cfg) {
          scene.querySelectorAll(cfg[0]).forEach(function (el) {
            fStates.push({
              el: el,
              ampY: cfg[1], ampX: cfg[2], period: cfg[3], phase: cfg[4],
              kickY: cfg[5], kickX: cfg[6], radius: cfg[7], tilt: cfg[8],
              // spring offset + velocity
              x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0,
              // resting center (measured once); live center = rest + offset
              rcx: 0, rcy: 0, measured: false,
            });
          });
        });
      });

    if (fStates.length) {
      var fVisible = false;
      var fRunning = false;
      var fPrevT = 0;
      var fStartT = 0;
      var fLastScroll = window.scrollY || window.pageYOffset || 0;
      // Device-orientation nudge target (set on mobile by tilting).
      var fTiltX = 0, fTiltY = 0;

      function fClamp(v, m) {
        return v < -m ? -m : v > m ? m : v;
      }

      // Measure each prop's resting center once (offset must be ~0 here).
      function fMeasure() {
        fStates.forEach(function (s) {
          var prev = s.el.style.transform;
          s.el.style.transform = "none";
          var b = s.el.getBoundingClientRect();
          s.el.style.transform = prev;
          s.rcx = b.left + b.width / 2;
          s.rcy = b.top + b.height / 2;
          s.measured = true;
        });
      }

      function fTick(t) {
        if (!fStartT) {
          fStartT = t;
          fPrevT = t;
        }
        var dt = Math.min(0.04, (t - fPrevT) / 1000) || 0.016;
        fPrevT = t;
        var elapsed = (t - fStartT) / 1000;

        // 1) Spring each prop toward its resting float target. The target is a
        //    slow idle drift (+ the device-tilt nudge on mobile). Light damping
        //    leaves a subtle elastic overshoot = the "wave" feel.
        fStates.forEach(function (s) {
          var driftY =
            Math.sin((elapsed / s.period) * Math.PI * 2 + s.phase) * s.ampY;
          var driftX =
            Math.cos((elapsed / (s.period * 1.3)) * Math.PI * 2 + s.phase) *
            s.ampX;
          var targetY = driftY + fTiltY * s.tilt;
          var targetX = driftX + fTiltX * s.tilt;
          // Underdamped spring (k≈90, ζ≈0.4) → quick, lively, slight bounce.
          var k = 90, c = 7.6;
          s.vy += ((targetY - s.y) * k - s.vy * c) * dt;
          s.vx += ((targetX - s.x) * k - s.vx * c) * dt;
          s.vr += ((0 - s.r) * 70 - s.vr * 7) * dt;
          s.y += s.vy * dt;
          s.x += s.vx * dt;
          s.r += s.vr * dt;
        });

        // 2) Gentle collision: if two props drift into each other, ease them a
        //    little apart with a soft bounce + tiny spin. The spring above then
        //    floats them back to rest — 轻轻的弹开一点点，然后恢复初始位置.
        for (var p = 0; p < fStates.length; p++) {
          for (var q = p + 1; q < fStates.length; q++) {
            var A = fStates[p], B = fStates[q];
            var dx = B.rcx + B.x - (A.rcx + A.x);
            var dy = B.rcy + B.y - (A.rcy + A.y);
            var dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
            var minDist = A.radius + B.radius;
            if (dist < minDist) {
              var overlap = (minDist - dist) / minDist;
              var nx = dx / dist, ny = dy / dist;
              // Soft positional separation (small, not a hard shove).
              var sep = overlap * 24;
              A.x -= nx * sep * dt;
              A.y -= ny * sep * dt;
              B.x += nx * sep * dt;
              B.y += ny * sep * dt;
              // A light bounce so they spring apart a touch, then settle back.
              var rvn = (B.vx - A.vx) * nx + (B.vy - A.vy) * ny;
              if (rvn < 0) {
                var imp = -0.6 * rvn; // gentle restitution
                A.vx -= nx * imp; A.vy -= ny * imp;
                B.vx += nx * imp; B.vy += ny * imp;
              }
              A.vr -= overlap * 8;
              B.vr += overlap * 8;
            }
          }
        }

        // 3) Clamp + render.
        fStates.forEach(function (s) {
          s.x = fClamp(s.x, 46);
          s.y = fClamp(s.y, 46);
          s.r = fClamp(s.r, 8);
          s.el.style.transform =
            "translate(" +
            s.x.toFixed(2) +
            "px," +
            s.y.toFixed(2) +
            "px) rotate(" +
            s.r.toFixed(2) +
            "deg)";
        });

        if (fVisible) {
          requestAnimationFrame(fTick);
        } else {
          fRunning = false;
        }
      }

      function fStartLoop() {
        if (!fRunning && fVisible) {
          if (!fStates[0].measured) fMeasure();
          fRunning = true;
          fPrevT = 0;
          fStartT = 0;
          requestAnimationFrame(fTick);
        }
      }

      // Scroll sends a velocity impulse (the wave kick) — opposite the scroll,
      // sized/signed per prop so they ripple in their own direction & speed.
      window.addEventListener(
        "scroll",
        function () {
          var y = window.scrollY || window.pageYOffset || 0;
          var delta = y - fLastScroll;
          fLastScroll = y;
          if (!fVisible) return;
          // Cap a single delta so a jump-scroll can't fling them off.
          var d = fClamp(delta, 60);
          fStates.forEach(function (s) {
            s.vy += -d * s.kickY * 16;
            s.vx += -d * s.kickX * 16;
            s.vr += -d * s.kickX * 4;
          });
          fStartLoop();
        },
        { passive: true }
      );

      // Re-measure rest centers after layout changes.
      var fResizeT;
      window.addEventListener(
        "resize",
        function () {
          clearTimeout(fResizeT);
          fResizeT = setTimeout(fMeasure, 150);
        },
        { passive: true }
      );

      // Mobile: tilt the phone → props flow toward the low edge/corner.
      function fOrient(e) {
        if (e.gamma == null && e.beta == null) return;
        // gamma: left/right tilt (-90..90), beta: front/back (-180..180).
        // Map to a bounded nudge; beta neutral ~45° (phone held up).
        // (fClamp(v, m) clamps to ±m, so pass 1 to clamp the ratio to ±1.)
        fTiltX = fClamp((e.gamma || 0) / 35, 1) * 26;
        fTiltY = fClamp(((e.beta || 45) - 45) / 35, 1) * 26;
        fStartLoop();
      }
      function fEnableTilt() {
        if (
          typeof DeviceOrientationEvent !== "undefined" &&
          typeof DeviceOrientationEvent.requestPermission === "function"
        ) {
          // iOS 13+ needs a user gesture to grant permission.
          DeviceOrientationEvent.requestPermission()
            .then(function (res) {
              if (res === "granted")
                window.addEventListener("deviceorientation", fOrient);
            })
            .catch(function () {});
        } else if ("DeviceOrientationEvent" in window) {
          window.addEventListener("deviceorientation", fOrient);
        }
      }
      if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
        // Try immediately; if permission is required, retry on first touch.
        fEnableTilt();
        window.addEventListener("touchstart", fEnableTilt, { once: true });
      }

      // Only animate while the scene is on screen (saves work + jank).
      if ("IntersectionObserver" in window) {
        var fIo = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (en) {
              var wasVisible = fVisible;
              fVisible = en.isIntersecting;
              if (fVisible && !wasVisible) {
                fLastScroll = window.scrollY || window.pageYOffset || 0;
                fStartLoop();
              }
            });
          },
          { threshold: 0.05, rootMargin: "10% 0px 10% 0px" }
        );
        document
          .querySelectorAll(".card__media--connector:not(.proj-banner)")
          .forEach(function (s) {
            fIo.observe(s);
          });
      } else {
        fVisible = true;
        fStartLoop();
      }
    }
  }

  // ── Embedded prototype modal ─────────────────────────────
  // A button with [data-embed-modal="<id>"] opens the matching
  // .embed-modal full-screen, lazily loading its iframe (data-embed-src).
  (function () {
    var openers = document.querySelectorAll("[data-embed-modal]");
    if (!openers.length) return;
    var lastFocus = null;

    // Ensure a loading overlay exists inside the modal panel and return it.
    function ensureLoader(modal) {
      var panel = modal.querySelector(".embed-modal__panel");
      if (!panel) return null;
      var loader = panel.querySelector(".embed-modal__loader");
      if (!loader) {
        loader = document.createElement("div");
        loader.className = "embed-modal__loader";
        loader.setAttribute("aria-hidden", "true");
        loader.innerHTML =
          '<div class="embed-modal__spinner"></div>' +
          '<p class="embed-modal__loading-text">Loading prototype…</p>';
        panel.appendChild(loader);
      }
      return loader;
    }

    function openModal(modal) {
      var frame = modal.querySelector("[data-embed-src]");
      var loader = ensureLoader(modal);
      if (frame && !frame.src) {
        // First open: show the loader until the embedded prototype loads.
        if (loader) modal.classList.add("is-loading");
        frame.addEventListener(
          "load",
          function () {
            modal.classList.remove("is-loading");
          },
          { once: true }
        );
        frame.src = frame.getAttribute("data-embed-src");
      }
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      var closeBtn = modal.querySelector(".embed-modal__close");
      if (closeBtn) closeBtn.focus();
    }

    function closeModal(modal) {
      modal.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }

    openers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var modal = document.getElementById(
          btn.getAttribute("data-embed-modal")
        );
        if (!modal) return;
        lastFocus = btn;
        openModal(modal);
      });
    });

    document.querySelectorAll(".embed-modal").forEach(function (modal) {
      modal.querySelectorAll("[data-embed-close]").forEach(function (el) {
        el.addEventListener("click", function () {
          closeModal(modal);
        });
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      document.querySelectorAll(".embed-modal").forEach(function (modal) {
        if (!modal.hidden) closeModal(modal);
      });
    });
  })();

  // ── Reveal on scroll ─────────────────────────────────────
  var reveals = document.querySelectorAll(".reveal");

  // Stagger card reveals for a cascading entrance.
  var cardReveals = document.querySelectorAll(".cards .card.reveal");
  cardReveals.forEach(function (card, i) {
    card.style.transitionDelay = (i * 0.08).toFixed(2) + "s";
  });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // ── Hover motion prefs (used by card + photo effects) ────
  var finePointer =
    window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Card hover (a light lift + gentle image zoom) is now handled purely in CSS,
  // which is lighter and smoother than the previous per-frame 3D tilt.
  // Keep only a subtle cursor-following glow: update the spotlight position
  // (CSS vars) on move — no transforms, no rAF, so it stays lightweight.
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".cards .card__link").forEach(function (link) {
      link.addEventListener("pointermove", function (e) {
        var rect = link.getBoundingClientRect();
        link.style.setProperty(
          "--mx",
          (((e.clientX - rect.left) / rect.width) * 100).toFixed(1) + "%"
        );
        link.style.setProperty(
          "--my",
          (((e.clientY - rect.top) / rect.height) * 100).toFixed(1) + "%"
        );
      });
    });
  }

  // ── Intro photo parallax (mouse + scroll) ────────────────
  var photoWrap = document.querySelector(".intro__media");
  if (photoWrap && !reduceMotion) {
    var targetX = 0; // from mouse
    var targetY = 0;
    var curX = 0;
    var curY = 0;
    var scrollY = 0; // from scroll
    var pRaf = null;
    var mouseActive = finePointer;

    function renderPhoto() {
      pRaf = null;
      // Ease current toward target for smooth follow.
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      photoWrap.style.setProperty("--px", curX.toFixed(2) + "px");
      photoWrap.style.setProperty("--py", (curY + scrollY).toFixed(2) + "px");
      // Keep animating while easing hasn't settled.
      if (
        Math.abs(targetX - curX) > 0.1 ||
        Math.abs(targetY - curY) > 0.1
      ) {
        pRaf = requestAnimationFrame(renderPhoto);
      }
    }
    function requestRender() {
      if (!pRaf) pRaf = requestAnimationFrame(renderPhoto);
    }

    if (mouseActive) {
      window.addEventListener("pointermove", function (e) {
        // Range −1..1 from viewport center, scaled to pixels.
        var nx = e.clientX / window.innerWidth - 0.5;
        var ny = e.clientY / window.innerHeight - 0.5;
        targetX = nx * 12;
        targetY = ny * 12;
        requestRender();
      });
    }
  }

  // ── Lightbox (images + embeds) ───────────────────────────
  var zoomImgs = document.querySelectorAll(
    ".proj-figure__img, .proj-gallery__img"
  );
  var embeds = document.querySelectorAll(".proj-embed");

  if (zoomImgs.length || embeds.length) {
    // Build overlay once.
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("aria-hidden", "true");
    lb.innerHTML =
      '<div class="lightbox__backdrop" data-close></div>' +
      '<button class="lightbox__close" type="button" aria-label="Close" data-close>×</button>' +
      '<button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous image">‹</button>' +
      '<button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next image">›</button>' +
      '<div class="lightbox__stage"></div>' +
      '<div class="lightbox__zoom" role="group" aria-label="Zoom controls">' +
      '<button class="lightbox__zbtn" type="button" data-zoom="out" aria-label="Zoom out">−</button>' +
      '<input class="lightbox__zrange" type="range" min="1" max="4" step="0.1" value="1" aria-label="Zoom level" />' +
      '<button class="lightbox__zbtn" type="button" data-zoom="in" aria-label="Zoom in">+</button>' +
      '<button class="lightbox__zbtn lightbox__zreset" type="button" data-zoom="reset" aria-label="Reset zoom">Reset</button>' +
      "</div>";
    document.body.appendChild(lb);
    var stage = lb.querySelector(".lightbox__stage");
    var zoomBar = lb.querySelector(".lightbox__zoom");
    var range = lb.querySelector(".lightbox__zrange");
    var navPrev = lb.querySelector(".lightbox__nav--prev");
    var navNext = lb.querySelector(".lightbox__nav--next");
    var lastFocus = null;
    var currentImg = null;

    // ── Image collection for prev/next ─────────────────────
    var imgList = Array.prototype.slice.call(zoomImgs);
    var currentIndex = -1;

    // ── Zoom + pan state ───────────────────────────────────
    var scale = 1;
    var panX = 0;
    var panY = 0;
    var MIN = 1;
    var MAX = 4;

    function applyTransform() {
      if (!currentImg) return;
      currentImg.style.transform =
        "translate(" + panX + "px," + panY + "px) scale(" + scale + ")";
      currentImg.style.cursor =
        scale > 1 ? "grab" : "zoom-in";
    }

    function setScale(next, originX, originY) {
      var clamped = Math.min(MAX, Math.max(MIN, next));
      if (clamped === scale) return;
      // Zoom toward a focal point (defaults to center).
      if (currentImg && originX != null) {
        var rect = currentImg.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = originX - cx;
        var dy = originY - cy;
        var ratio = clamped / scale;
        panX -= dx * (ratio - 1);
        panY -= dy * (ratio - 1);
      }
      scale = clamped;
      if (scale === 1) {
        panX = 0;
        panY = 0;
      }
      range.value = String(scale);
      applyTransform();
    }

    function resetZoom() {
      scale = 1;
      panX = 0;
      panY = 0;
      range.value = "1";
      applyTransform();
    }

    function openLightbox(node, isImage) {
      stage.innerHTML = "";
      stage.appendChild(node);
      currentImg = isImage ? node : null;
      resetZoom();
      zoomBar.style.display = isImage ? "" : "none";
      updateNav(isImage);
      lb.classList.add("is-open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function updateNav(isImage) {
      var multi = isImage && imgList.length > 1;
      navPrev.style.display = multi ? "" : "none";
      navNext.style.display = multi ? "" : "none";
    }

    function showImageAt(index) {
      if (!imgList.length) return;
      // Wrap around.
      currentIndex = (index + imgList.length) % imgList.length;
      var source = imgList[currentIndex];
      var big = new Image();
      big.src = source.currentSrc || source.src;
      big.alt = source.alt || "";
      big.className = "lightbox__img";
      openLightbox(big, true);
    }

    function closeLightbox() {
      lb.classList.remove("is-open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      stage.innerHTML = "";
      currentImg = null;
      currentIndex = -1;
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    // Zoom controls.
    zoomBar.addEventListener("click", function (e) {
      var act = e.target.getAttribute("data-zoom");
      if (!act) return;
      if (act === "in") setScale(scale + 0.5);
      else if (act === "out") setScale(scale - 0.5);
      else if (act === "reset") resetZoom();
    });
    range.addEventListener("input", function () {
      setScale(parseFloat(range.value));
    });

    // Wheel to zoom over the image.
    stage.addEventListener(
      "wheel",
      function (e) {
        if (!currentImg) return;
        e.preventDefault();
        var delta = e.deltaY < 0 ? 0.2 : -0.2;
        setScale(scale + delta, e.clientX, e.clientY);
      },
      { passive: false }
    );

    // Drag to pan when zoomed in.
    var dragging = false;
    var startX = 0;
    var startY = 0;
    stage.addEventListener("pointerdown", function (e) {
      if (!currentImg || scale <= 1) return;
      dragging = true;
      startX = e.clientX - panX;
      startY = e.clientY - panY;
      currentImg.style.cursor = "grabbing";
      stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      panX = e.clientX - startX;
      panY = e.clientY - startY;
      applyTransform();
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      if (currentImg) currentImg.style.cursor = scale > 1 ? "grab" : "zoom-in";
    }
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);

    // Double-click to toggle zoom.
    stage.addEventListener("dblclick", function (e) {
      if (!currentImg) return;
      if (scale > 1) resetZoom();
      else setScale(2.5, e.clientX, e.clientY);
    });

    zoomImgs.forEach(function (img, idx) {
      img.classList.add("is-zoomable");
      img.addEventListener("click", function () {
        lastFocus = img;
        showImageAt(idx);
      });
    });

    // Prev / next navigation.
    navPrev.addEventListener("click", function (e) {
      e.stopPropagation();
      showImageAt(currentIndex - 1);
    });
    navNext.addEventListener("click", function (e) {
      e.stopPropagation();
      showImageAt(currentIndex + 1);
    });

    embeds.forEach(function (embed) {
      var iframe = embed.querySelector("iframe");
      if (!iframe) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "proj-embed__expand";
      btn.innerHTML = "⤢ Expand";
      embed.appendChild(btn);
      btn.addEventListener("click", function () {
        lastFocus = btn;
        var frame = document.createElement("iframe");
        frame.src = iframe.src;
        frame.title = iframe.title || "Embedded view";
        frame.className = "lightbox__iframe";
        openLightbox(frame, false);
      });
    });

    lb.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-close")) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      else if (currentImg && e.key === "ArrowLeft") showImageAt(currentIndex - 1);
      else if (currentImg && e.key === "ArrowRight") showImageAt(currentIndex + 1);
      else if (currentImg && (e.key === "+" || e.key === "=")) setScale(scale + 0.5);
      else if (currentImg && (e.key === "-" || e.key === "_")) setScale(scale - 0.5);
      else if (currentImg && e.key === "0") resetZoom();
    });
  }

  // ── Interactive mouse-following aura on the intro ─────────
  var intro = document.querySelector(".intro");
  var prefersReduced = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  if (intro && !prefersReduced) {
    // Target (where the cursor is) and current (eased) positions, in %
    var tx = 50, ty = 40, cx = 50, cy = 40;
    var rafId = null;
    var active = false;

    function render() {
      // Ease current toward target for a smooth, trailing motion
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      intro.style.setProperty("--mx", cx.toFixed(2) + "%");
      intro.style.setProperty("--my", cy.toFixed(2) + "%");

      // Keep animating while the cursor is present or still settling
      if (active || Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = null;
      }
    }

    function ensureRaf() {
      if (rafId === null) rafId = requestAnimationFrame(render);
    }

    intro.addEventListener("pointermove", function (e) {
      var rect = intro.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width) * 100;
      ty = ((e.clientY - rect.top) / rect.height) * 100;
      ensureRaf();
    });

    intro.addEventListener("pointerenter", function () {
      active = true;
      intro.classList.add("is-pointer");
      ensureRaf();
    });

    intro.addEventListener("pointerleave", function () {
      active = false;
      intro.classList.remove("is-pointer");
      // Drift the glow gently back toward center
      tx = 50;
      ty = 40;
      ensureRaf();
    });
  }

  // ── 3D tilt + sheen on the "See my work" button ──────────
  var scrollBtn = document.querySelector(".intro__scroll");
  if (scrollBtn && !prefersReduced) {
    var MAX_TILT = 16; // degrees

    scrollBtn.addEventListener("pointermove", function (e) {
      var rect = scrollBtn.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width; // 0..1
      var py = (e.clientY - rect.top) / rect.height; // 0..1
      // Tilt away from the cursor for a "pressed corner" feel
      var ry = (px - 0.5) * 2 * MAX_TILT;
      var rx = -(py - 0.5) * 2 * MAX_TILT;
      scrollBtn.classList.add("is-tilting");
      scrollBtn.style.setProperty("--rx", rx.toFixed(2) + "deg");
      scrollBtn.style.setProperty("--ry", ry.toFixed(2) + "deg");
      scrollBtn.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
      scrollBtn.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
    });

    scrollBtn.addEventListener("pointerleave", function () {
      scrollBtn.classList.remove("is-tilting");
      scrollBtn.style.setProperty("--rx", "0deg");
      scrollBtn.style.setProperty("--ry", "0deg");
    });
  }
})();
