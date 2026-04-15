const DEFAULT_CODES = [
  { code: "161725", label: "161725 白酒指数" },
  { code: "110027", label: "110027 债基样例" },
  { code: "513100", label: "513100 纳指 ETF" }
];

const HISTORY_GLOBAL_KEYS = [
  "fS_name",
  "fS_code",
  "Data_netWorthTrend",
  "Data_assetAllocation",
  "Data_fundSharesPositions",
  "syl_1n",
  "syl_6y",
  "syl_3y",
  "syl_1y"
];

const STORAGE_KEYS = {
  recentCodes: "fund-valuation-tool-recent-codes",
  lookback: "fund-valuation-tool-lookback",
  activeSector: "fund-valuation-tool-active-sector",
  autoRefreshEnabled: "fund-valuation-tool-auto-refresh-enabled",
  compareCodes: "fund-valuation-tool-compare-codes",
  watchlistCodes: "fund-valuation-tool-watchlist-codes",
  positions: "fund-valuation-tool-positions",
  params: "fund-valuation-tool-params",
  signalHistory: "fund-valuation-tool-signal-history",
  signalState: "fund-valuation-tool-signal-state",
  valuationOverrides: "fund-valuation-tool-valuation-overrides"
};

const LOOKBACK_OPTIONS = {
  "1y": { key: "1y", label: "近 1 年", shortLabel: "1 年", days: 240 },
  "3y": { key: "3y", label: "近 3 年", shortLabel: "3 年", days: 720 },
  "5y": { key: "5y", label: "近 5 年", shortLabel: "5 年", days: 1200 },
  all: { key: "all", label: "全部历史", shortLabel: "全部历史", days: null }
};

const DEFAULT_PARAMS = {
  lowThreshold: 65,
  highThreshold: 35,
  maMultiplier: 1,
  zMultiplier: 1,
  heatSensitivity: 1,
  volatilitySensitivity: 1
};

const SIGNAL_HISTORY_LIMIT = 80;
const AUTO_RESEARCH_POOL_SIZE = 4;
const AUTO_REFRESH_INTERVAL_MS = 30 * 60 * 1000;
const AUTO_BENCHMARK_CACHE_TTL_MS = 12 * 60 * 60 * 1000;

const BENCHMARK_HINTS = [
  {
    key: "CSI300",
    label: "沪深300",
    family: "A 股宽基",
    keywords: ["沪深300", "300etf", "300指数"],
    factsheetCode: "000300",
    autoBands: { pe: [10, 18], pb: [1.1, 1.9], dividendYield: [1.8, 4] }
  },
  {
    key: "CSI500",
    label: "中证500",
    family: "A 股宽基",
    keywords: ["中证500", "500etf", "500指数"],
    factsheetCode: "000905",
    autoBands: { pe: [16, 34], pb: [1.4, 3], dividendYield: [0.9, 2.4] }
  },
  {
    key: "CSI1000",
    label: "中证1000",
    family: "A 股宽基",
    keywords: ["中证1000", "1000etf", "1000指数"],
    factsheetCode: "000852",
    autoBands: { pe: [20, 45], pb: [1.6, 3.8], dividendYield: [0.5, 1.8] }
  },
  {
    key: "STAR50",
    label: "科创50",
    family: "A 股宽基",
    keywords: ["科创50", "科创板50"],
    factsheetCode: "000688",
    autoBands: { pe: [20, 55], pb: [2.2, 5.5], dividendYield: [0.3, 1.3] }
  },
  { key: "CHINEXT", label: "创业板指", family: "成长宽基", keywords: ["创业板", "创业板指"] },
  {
    key: "SSE50",
    label: "上证50",
    family: "A 股宽基",
    keywords: ["上证50", "50etf"],
    factsheetCode: "000016",
    autoBands: { pe: [8, 15], pb: [0.9, 1.7], dividendYield: [2, 5] }
  },
  {
    key: "CSI_DIVIDEND",
    label: "中证红利",
    family: "红利风格",
    keywords: ["中证红利", "红利低波", "红利"],
    factsheetCode: "000922",
    autoBands: { pe: [6, 12], pb: [0.8, 1.5], dividendYield: [3.5, 7] }
  },
  { key: "LIQUOR", label: "中证白酒", family: "行业指数", keywords: ["白酒", "酒指数"] },
  { key: "SEMICONDUCTOR", label: "中华半导体芯片", family: "行业指数", keywords: ["半导体", "芯片"] },
  { key: "MEDICAL", label: "中证医疗", family: "行业指数", keywords: ["医疗", "医药", "创新药"] },
  { key: "CSI_TECH", label: "科技成长", family: "行业指数", keywords: ["科技", "科创", "互联网科技"] },
  { key: "HSTECH", label: "恒生科技", family: "港股科技", keywords: ["恒生科技", "恒生互联网", "恒生科技指数"] },
  { key: "HSI", label: "恒生指数", family: "港股宽基", keywords: ["恒生指数", "香港恒生"] },
  { key: "NASDAQ100", label: "纳斯达克100", family: "美股科技", keywords: ["纳斯达克100", "纳指", "纳斯达克"] },
  { key: "SP500", label: "标普500", family: "美股宽基", keywords: ["标普500", "标普"] },
  { key: "DOWJONES", label: "道琼斯", family: "美股宽基", keywords: ["道琼斯"] },
  { key: "NIKKEI225", label: "日经225", family: "日本宽基", keywords: ["日经225", "日经"] },
  { key: "DAX", label: "德国DAX", family: "欧洲宽基", keywords: ["德国dax", "dax"] }
];

const PROFILE_SETTINGS = {
  index_equity: {
    familyLabel: "指数基金 / ETF",
    familySummary: "指数基金最适合把净值位置和底层指数估值拆开看，否则很容易把低位走势误当成真正便宜。",
    rawTypeFallback: "指数型",
    confidenceBase: 82,
    movingAverageBands: { ma20: 0.06, ma60: 0.1, ma120: 0.15 },
    zBand: 1.8,
    heatBands: { oneMonth: 8, threeMonth: 18, sixMonth: 30, oneYear: 45 },
    volatility: { drawdownBand: 0.18, volRatioCap: 1.8, dayShockBand: 2.8 },
    overallWeights: {
      range: 0.14,
      moving_average: 0.14,
      z_score: 0.11,
      percentile: 0.11,
      index_real_valuation: 0.2,
      heat: 0.18,
      volatility_filter: 0.12
    }
  },
  active_equity: {
    familyLabel: "主动权益 / 偏股混合",
    familySummary: "主动权益更接近基金经理风格代理，所以位置分可以参考，但不能把它当成底层资产的内在价值。",
    rawTypeFallback: "偏股混合",
    confidenceBase: 64,
    movingAverageBands: { ma20: 0.05, ma60: 0.09, ma120: 0.14 },
    zBand: 1.6,
    heatBands: { oneMonth: 7, threeMonth: 16, sixMonth: 28, oneYear: 42 },
    volatility: { drawdownBand: 0.16, volRatioCap: 1.7, dayShockBand: 2.5 },
    overallWeights: {
      range: 0.17,
      moving_average: 0.15,
      z_score: 0.12,
      percentile: 0.12,
      heat: 0.24,
      volatility_filter: 0.2
    }
  },
  bond: {
    familyLabel: "债券基金",
    familySummary: "债基不适合用股票那套热度口径，核心是偏离是否够大，以及这次波动是不是超出了债基应有的稳定带。",
    rawTypeFallback: "债券型",
    confidenceBase: 76,
    movingAverageBands: { ma20: 0.015, ma60: 0.025, ma120: 0.04 },
    zBand: 1.1,
    overallWeights: {
      range: 0.18,
      moving_average: 0.14,
      z_score: 0.12,
      percentile: 0.12,
      bond_mean_reversion: 0.22,
      bond_stability: 0.22
    }
  },
  qdii: {
    familyLabel: "QDII / 海外权益",
    familySummary: "QDII 的位置波动往往掺着海外市场和汇率因素，最好同时看净值位置、指数估值和波动过滤。",
    rawTypeFallback: "QDII",
    confidenceBase: 60,
    movingAverageBands: { ma20: 0.08, ma60: 0.13, ma120: 0.18 },
    zBand: 2.1,
    heatBands: { oneMonth: 10, threeMonth: 22, sixMonth: 36, oneYear: 55 },
    volatility: { drawdownBand: 0.22, volRatioCap: 1.9, dayShockBand: 3.5 },
    overallWeights: {
      range: 0.12,
      moving_average: 0.12,
      z_score: 0.1,
      percentile: 0.1,
      index_real_valuation: 0.18,
      heat: 0.19,
      volatility_filter: 0.19
    }
  },
  money: {
    familyLabel: "货币基金",
    familySummary: "货币基金的净值波动太小，不适合做买低卖高式估值。这类更应该看 7 日年化、流动性和申赎规则。",
    rawTypeFallback: "货币型",
    confidenceBase: 30
  }
};

const state = {
  requestId: 0,
  recentCodes: loadRecentCodes(),
  lookbackKey: loadLookbackKey(),
  activeSector: loadActiveSector(),
  autoRefreshEnabled: loadAutoRefreshEnabled(),
  lastAutoRefreshAt: null,
  nextAutoRefreshAt: null,
  benchmarkAutoCache: {},
  benchmarkAutoPending: {},
  benchmarkAutoErrors: {},
  currentCode: null,
  currentSnapshot: null,
  payloadCache: {},
  compareCodes: loadStringArray(STORAGE_KEYS.compareCodes),
  compareSnapshots: {},
  watchlistCodes: loadStringArray(STORAGE_KEYS.watchlistCodes),
  watchlistSnapshots: {},
  positions: loadJsonObject(STORAGE_KEYS.positions, {}),
  params: sanitizeParams(loadJsonObject(STORAGE_KEYS.params, DEFAULT_PARAMS)),
  signalHistory: loadJsonObject(STORAGE_KEYS.signalHistory, []),
  signalState: loadJsonObject(STORAGE_KEYS.signalState, {}),
  valuationOverrides: loadJsonObject(STORAGE_KEYS.valuationOverrides, {})
};

const refs = {};
let historicalFetchChain = Promise.resolve();
let autoRefreshTimerId = null;

document.addEventListener("DOMContentLoaded", () => {
  cacheRefs();
  bindEvents();
  initializeInterface();
});

function cacheRefs() {
  refs.lookupForm = document.getElementById("lookup-form");
  refs.sectorLinks = Array.from(document.querySelectorAll("[data-sector-target]"));
  refs.pageSectors = Array.from(document.querySelectorAll(".page-sector"));
  refs.codeInput = document.getElementById("code-input");
  refs.lookbackSelect = document.getElementById("lookback-select");
  refs.lookupBtn = document.getElementById("lookup-btn");
  refs.quickCodes = document.getElementById("quick-codes");
  refs.statusBox = document.getElementById("status-box");
  refs.summaryPane = document.getElementById("summary-pane");
  refs.overallBanner = document.getElementById("overall-banner");
  refs.modelsGrid = document.getElementById("models-grid");
  refs.reasonPane = document.getElementById("reason-pane");
  refs.factsPane = document.getElementById("facts-pane");
  refs.compareCurrentBtn = document.getElementById("compare-current-btn");
  refs.watchlistCurrentBtn = document.getElementById("watchlist-current-btn");
  refs.compareInput = document.getElementById("compare-input");
  refs.compareFetchBtn = document.getElementById("compare-fetch-btn");
  refs.compareClearBtn = document.getElementById("compare-clear-btn");
  refs.comparePane = document.getElementById("compare-pane");
  refs.watchlistRefreshBtn = document.getElementById("watchlist-refresh-btn");
  refs.autoRefreshToggleBtn = document.getElementById("auto-refresh-toggle-btn");
  refs.autoRefreshStatus = document.getElementById("auto-refresh-status");
  refs.watchlistClearBtn = document.getElementById("watchlist-clear-btn");
  refs.watchlistPane = document.getElementById("watchlist-pane");
  refs.positionForm = document.getElementById("position-form");
  refs.positionCostInput = document.getElementById("position-cost-input");
  refs.positionSharesInput = document.getElementById("position-shares-input");
  refs.positionTargetValueInput = document.getElementById("position-target-value-input");
  refs.positionNoteInput = document.getElementById("position-note-input");
  refs.positionClearBtn = document.getElementById("position-clear-btn");
  refs.positionPane = document.getElementById("position-pane");
  refs.paramsForm = document.getElementById("params-form");
  refs.paramLowThresholdInput = document.getElementById("param-low-threshold-input");
  refs.paramHighThresholdInput = document.getElementById("param-high-threshold-input");
  refs.paramMaMultiplierInput = document.getElementById("param-ma-multiplier-input");
  refs.paramZMultiplierInput = document.getElementById("param-z-multiplier-input");
  refs.paramHeatSensitivityInput = document.getElementById("param-heat-sensitivity-input");
  refs.paramVolatilitySensitivityInput = document.getElementById("param-volatility-sensitivity-input");
  refs.paramsResetBtn = document.getElementById("params-reset-btn");
  refs.paramsPane = document.getElementById("params-pane");
  refs.exportCurrentBtn = document.getElementById("export-current-btn");
  refs.exportCompareBtn = document.getElementById("export-compare-btn");
  refs.exportWorkspaceBtn = document.getElementById("export-workspace-btn");
  refs.exportPane = document.getElementById("export-pane");
  refs.benchmarkPane = document.getElementById("benchmark-pane");
  refs.confidencePane = document.getElementById("confidence-pane");
  refs.signalHistoryPane = document.getElementById("signal-history-pane");
}

function bindEvents() {
  refs.sectorLinks.forEach((button) => {
    button.addEventListener("click", () => {
      const sectorId = button.getAttribute("data-sector-target") || "";
      setActiveSector(sectorId);
    });
  });

  refs.lookupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    lookupFund(refs.codeInput.value);
  });

  refs.lookbackSelect.addEventListener("change", () => {
    state.lookbackKey = normalizeLookbackKey(refs.lookbackSelect.value);
    persistValue(STORAGE_KEYS.lookback, state.lookbackKey);
    rebuildSnapshotsFromCache({ recordSignals: false });
    if (state.currentSnapshot) {
      setStatus("已切换到 " + state.currentSnapshot.lookback.label + "，并基于本地缓存重算全部结果。", "info");
    } else {
      setStatus("已切换估值窗口，下一次抓取会按这个窗口计算。", "info");
    }
  });

  refs.quickCodes.addEventListener("click", (event) => {
    const button = event.target.closest("[data-code]");
    if (!button) {
      return;
    }
    const code = button.getAttribute("data-code") || "";
    refs.codeInput.value = code;
    lookupFund(code);
  });

  refs.compareCurrentBtn.addEventListener("click", () => {
    if (!state.currentSnapshot) {
      return;
    }
    addCodesToCompare([state.currentSnapshot.code], false);
    setActiveSector("sector-research");
  });

  refs.watchlistCurrentBtn.addEventListener("click", () => {
    if (!state.currentSnapshot) {
      return;
    }
    addCodeToWatchlist(state.currentSnapshot.code);
    setActiveSector("sector-research");
  });

  refs.compareFetchBtn.addEventListener("click", () => {
    fetchAndAddCompareCodes(refs.compareInput.value);
  });

  refs.compareClearBtn.addEventListener("click", () => {
    state.compareCodes = [];
    state.compareSnapshots = {};
    persistValue(STORAGE_KEYS.compareCodes, state.compareCodes);
    renderComparePane();
    renderExportPane();
    setStatus("已清空对比区。", "info");
  });

  refs.comparePane.addEventListener("click", (event) => {
    const button = event.target.closest("[data-code][data-action]");
    if (!button) {
      return;
    }
    const code = button.getAttribute("data-code") || "";
    const action = button.getAttribute("data-action") || "";
    if (action === "remove-compare") {
      state.compareCodes = state.compareCodes.filter((item) => item !== code);
      delete state.compareSnapshots[code];
      persistValue(STORAGE_KEYS.compareCodes, state.compareCodes);
      renderComparePane();
      renderExportPane();
      return;
    }
    if (action === "use-current") {
      openCodeFromCache(code);
      return;
    }
    if (action === "pin-compare") {
      addCodesToCompare([code], true);
    }
  });

  refs.watchlistRefreshBtn.addEventListener("click", () => {
    refreshWatchlist({ source: "manual" });
  });

  refs.autoRefreshToggleBtn.addEventListener("click", () => {
    state.autoRefreshEnabled = !state.autoRefreshEnabled;
    persistValue(STORAGE_KEYS.autoRefreshEnabled, state.autoRefreshEnabled);
    syncAutoRefreshTimer();
    renderAutoRefreshStatus();
    setStatus(state.autoRefreshEnabled ? "已开启自动刷新。" : "已关闭自动刷新。", "info");
  });

  refs.watchlistClearBtn.addEventListener("click", () => {
    state.watchlistCodes = [];
    state.watchlistSnapshots = {};
    persistValue(STORAGE_KEYS.watchlistCodes, state.watchlistCodes);
    renderWatchlistPane();
    renderSignalHistory();
    renderExportPane();
    updateCurrentActionButtons();
    setStatus("已清空观察名单。", "info");
  });

  refs.watchlistPane.addEventListener("click", (event) => {
    const button = event.target.closest("[data-code][data-action]");
    if (!button) {
      return;
    }
    const code = button.getAttribute("data-code") || "";
    const action = button.getAttribute("data-action") || "";
    if (action === "remove-watch") {
      state.watchlistCodes = state.watchlistCodes.filter((item) => item !== code);
      delete state.watchlistSnapshots[code];
      persistValue(STORAGE_KEYS.watchlistCodes, state.watchlistCodes);
      renderWatchlistPane();
      renderExportPane();
      updateCurrentActionButtons();
      return;
    }
    if (action === "use-current") {
      openCodeFromCache(code);
      return;
    }
    if (action === "pin-watch") {
      addCodeToWatchlist(code);
    }
  });

  refs.positionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveCurrentPosition();
  });

  refs.positionClearBtn.addEventListener("click", () => {
    if (!state.currentSnapshot) {
      return;
    }
    delete state.positions[state.currentSnapshot.code];
    persistValue(STORAGE_KEYS.positions, state.positions);
    populatePositionForm(state.currentSnapshot.code);
    rebuildSnapshotsFromCache({ recordSignals: false });
    setStatus("已清除当前基金的持仓参数。", "info");
  });

  refs.paramsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveParams();
  });

  refs.paramsResetBtn.addEventListener("click", () => {
    state.params = sanitizeParams(DEFAULT_PARAMS);
    persistValue(STORAGE_KEYS.params, state.params);
    populateParamsForm();
    rebuildSnapshotsFromCache({ recordSignals: false });
    setStatus("已恢复默认参数。", "info");
  });

  refs.exportCurrentBtn.addEventListener("click", exportCurrentSnapshot);
  refs.exportCompareBtn.addEventListener("click", exportCompareCsv);
  refs.exportWorkspaceBtn.addEventListener("click", exportWorkspace);

  refs.benchmarkPane.addEventListener("submit", (event) => {
    const form = event.target.closest("#benchmark-form");
    if (!form) {
      return;
    }
    event.preventDefault();
    saveBenchmarkOverride(form);
  });

  refs.benchmarkPane.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) {
      return;
    }
    const action = button.getAttribute("data-action") || "";
    if (action === "clear-benchmark") {
      clearBenchmarkOverride();
    }
  });
}

function initializeInterface() {
  setActiveSector(state.activeSector);
  refs.lookbackSelect.value = state.lookbackKey;
  populateParamsForm();
  renderQuickCodes();
  renderComparePane();
  renderWatchlistPane();
  renderPositionPane();
  renderParamsPane();
  renderBenchmarkPane();
  renderConfidencePane();
  renderSignalHistory();
  renderExportPane();
  renderAutoRefreshStatus();
  updateCurrentActionButtons();
  syncAutoRefreshTimer();

  const defaultCode = state.recentCodes[0] || DEFAULT_CODES[0].code;
  refs.codeInput.value = defaultCode;
  lookupFund(defaultCode);
}

async function lookupFund(rawCode) {
  const code = sanitizeFundCode(rawCode);
  if (!code) {
    setStatus("请输入 6 位基金代码，例如 161725。", "bad");
    refs.codeInput.focus();
    return;
  }

  const requestId = ++state.requestId;
  state.currentCode = code;
  setActiveSector("sector-live");
  refs.codeInput.value = code;
  renderBusyState(code);
  setStatus("正在抓取 " + code + " 的元信息、盘中估算和历史净值。", "loading");

  try {
    await fetchFundBundle(code, { force: true });
    if (requestId !== state.requestId) {
      return;
    }

    rememberCode(code);
    renderQuickCodes();
    rebuildSnapshotsFromCache({ recordSignals: true, source: "current" });
    void warmAutomaticResearchPool(code);
    if (!state.currentSnapshot) {
      throw new Error("未能生成估值快照。");
    }
    setStatus(buildSuccessMessage(state.currentSnapshot, Boolean(state.currentSnapshot.estimate)), "good");
  } catch (error) {
    if (requestId !== state.requestId) {
      return;
    }
    state.currentSnapshot = null;
    const message = error instanceof Error ? error.message : "抓取失败，请稍后再试。";
    renderErrorState(code, message);
    renderPositionPane();
    renderBenchmarkPane();
    renderConfidencePane();
    renderExportPane();
    updateCurrentActionButtons();
    setStatus(message, "bad");
  } finally {
    if (requestId === state.requestId) {
      refs.lookupBtn.disabled = false;
      refs.lookbackSelect.disabled = false;
      refs.lookupBtn.textContent = "抓取并估值";
    }
  }
}

async function fetchFundBundle(rawCode, options) {
  const config = { force: false, ...options };
  const code = sanitizeFundCode(rawCode);
  if (!code) {
    throw new Error("基金代码格式无效。");
  }

  if (!config.force && state.payloadCache[code]) {
    return state.payloadCache[code];
  }

  const [historyResult, estimateResult, metaResult] = await Promise.allSettled([
    fetchHistoricalData(code),
    fetchEstimateData(code),
    fetchFundMetaData(code)
  ]);

  if (historyResult.status !== "fulfilled") {
    throw historyResult.reason;
  }

  const bundle = {
    code,
    history: historyResult.value,
    estimate: estimateResult.status === "fulfilled" ? estimateResult.value : null,
    meta: metaResult.status === "fulfilled" ? metaResult.value : null,
    fetchedAt: new Date().toISOString()
  };

  state.payloadCache[code] = bundle;
  return bundle;
}

function rebuildSnapshotsFromCache(options) {
  const config = { recordSignals: false, source: "local" , ...options };

  if (state.currentCode && state.payloadCache[state.currentCode]) {
    state.currentSnapshot = buildSnapshot({
      ...state.payloadCache[state.currentCode],
      lookbackKey: state.lookbackKey,
      params: state.params
    });
    renderSnapshot(state.currentSnapshot);
    populatePositionForm(state.currentSnapshot.code);
    if (config.recordSignals) {
      recordSignalIfNeeded(state.currentSnapshot, config.source);
    }
  } else if (!state.currentSnapshot) {
    updateCurrentActionButtons();
  }

  state.compareSnapshots = buildSnapshotMap(state.compareCodes, state.params, state.lookbackKey);
  state.watchlistSnapshots = buildSnapshotMap(state.watchlistCodes, state.params, state.lookbackKey);

  renderComparePane();
  renderWatchlistPane();
  renderPositionPane();
  renderParamsPane();
  renderBenchmarkPane();
  renderConfidencePane();
  renderSignalHistory();
  renderExportPane();
  updateCurrentActionButtons();
  scheduleAutomaticBenchmarkValuation();
}

function buildSnapshotMap(codes, params, lookbackKey) {
  return codes.reduce((result, code) => {
    const bundle = state.payloadCache[code];
    if (!bundle) {
      return result;
    }
    result[code] = buildSnapshot({
      ...bundle,
      lookbackKey,
      params
    });
    return result;
  }, {});
}

function scheduleAutomaticBenchmarkValuation() {
  const snapshots = [
    state.currentSnapshot,
    ...Object.values(state.compareSnapshots),
    ...Object.values(state.watchlistSnapshots)
  ].filter(Boolean);

  snapshots.forEach((snapshot) => {
    if (!snapshot.benchmark || hasManualBenchmarkOverride(snapshot.benchmark)) {
      return;
    }
    void ensureAutomaticBenchmarkValuation(snapshot.benchmark);
  });
}

function getAutomaticResearchCodes() {
  const explicitCodes = new Set([...state.compareCodes, ...state.watchlistCodes]);
  const orderedCodes = uniqueCodes([
    state.currentCode,
    ...state.recentCodes,
    ...Object.keys(state.payloadCache),
    ...DEFAULT_CODES.map((item) => item.code)
  ]);

  const currentFamily = state.currentSnapshot ? state.currentSnapshot.profile.key : "";
  const snapshots = orderedCodes
    .map((code) => {
      const bundle = state.payloadCache[code];
      if (!bundle) {
        return null;
      }
      return buildSnapshot({
        ...bundle,
        lookbackKey: state.lookbackKey,
        params: state.params
      });
    })
    .filter(Boolean);

  snapshots.sort((left, right) => {
    const leftFamilyBoost = left.profile.key === currentFamily ? 1 : 0;
    const rightFamilyBoost = right.profile.key === currentFamily ? 1 : 0;
    if (leftFamilyBoost !== rightFamilyBoost) {
      return rightFamilyBoost - leftFamilyBoost;
    }
    const leftRecent = state.recentCodes.indexOf(left.code);
    const rightRecent = state.recentCodes.indexOf(right.code);
    return normalizeSortIndex(leftRecent) - normalizeSortIndex(rightRecent);
  });

  return snapshots
    .filter((snapshot) => !explicitCodes.has(snapshot.code))
    .slice(0, AUTO_RESEARCH_POOL_SIZE);
}

async function warmAutomaticResearchPool(primaryCode) {
  const candidates = uniqueCodes([
    ...state.recentCodes,
    ...DEFAULT_CODES.map((item) => item.code)
  ])
    .filter((code) => code && code !== primaryCode)
    .slice(0, AUTO_RESEARCH_POOL_SIZE);

  if (!candidates.length) {
    return;
  }

  let changed = false;
  for (const code of candidates) {
    if (state.payloadCache[code]) {
      continue;
    }
    try {
      await fetchFundBundle(code, { force: false });
      changed = true;
    } catch (error) {
      // Ignore warmup failures. Manual lookup can still fetch later.
    }
  }

  if (changed && !state.compareCodes.length && !state.watchlistCodes.length) {
    rebuildSnapshotsFromCache({ recordSignals: false });
  }
}

async function fetchAndAddCompareCodes(rawInput) {
  const codes = parseCodeList(rawInput);
  if (!codes.length) {
    setStatus("请输入至少一个基金代码。", "bad");
    refs.compareInput.focus();
    return;
  }

  refs.compareFetchBtn.disabled = true;
  refs.compareFetchBtn.textContent = "抓取中...";

  try {
    for (const code of codes) {
      await fetchFundBundle(code, { force: true });
    }
    addCodesToCompare(codes, true);
    refs.compareInput.value = "";
    setStatus("已抓取并加入 " + codes.length + " 只基金到对比区。", "good");
  } catch (error) {
    const message = error instanceof Error ? error.message : "对比抓取失败。";
    setStatus(message, "bad");
  } finally {
    refs.compareFetchBtn.disabled = false;
    refs.compareFetchBtn.textContent = "手动补充";
  }
}

function addCodesToCompare(codes, rebuild) {
  const next = [...state.compareCodes];
  codes.forEach((code) => {
    const clean = sanitizeFundCode(code);
    if (clean && !next.includes(clean)) {
      next.push(clean);
    }
  });
  state.compareCodes = next;
  persistValue(STORAGE_KEYS.compareCodes, state.compareCodes);
  if (rebuild) {
    rebuildSnapshotsFromCache({ recordSignals: false });
  } else {
    state.compareSnapshots = buildSnapshotMap(state.compareCodes, state.params, state.lookbackKey);
    renderComparePane();
    renderExportPane();
  }
  updateCurrentActionButtons();
}

function addCodeToWatchlist(code) {
  const clean = sanitizeFundCode(code);
  if (!clean) {
    return;
  }
  if (!state.watchlistCodes.includes(clean)) {
    state.watchlistCodes = [...state.watchlistCodes, clean];
    persistValue(STORAGE_KEYS.watchlistCodes, state.watchlistCodes);
  }
  state.watchlistSnapshots = buildSnapshotMap(state.watchlistCodes, state.params, state.lookbackKey);
  renderWatchlistPane();
  renderExportPane();
  updateCurrentActionButtons();
  setStatus(clean + " 已加入观察名单。", "good");
}

async function refreshWatchlist(options) {
  const config = { source: "manual", ...options };
  const targetCodes = state.watchlistCodes.length
    ? state.watchlistCodes
    : getAutomaticResearchCodes().map((snapshot) => snapshot.code);

  if (!targetCodes.length) {
    setStatus("自动观察池还没有足够样本，先抓几只基金。", "info");
    return;
  }

  refs.watchlistRefreshBtn.disabled = true;
  refs.watchlistRefreshBtn.textContent = "刷新中...";

  try {
    for (const code of targetCodes) {
      await fetchFundBundle(code, { force: true });
    }
    rebuildSnapshotsFromCache({ recordSignals: false });
    targetCodes.forEach((code) => {
      const snapshot = state.watchlistSnapshots[code] || getAutomaticResearchCodes().find((item) => item.code === code);
      if (snapshot) {
        recordSignalIfNeeded(snapshot, "watchlist");
      }
    });
    renderSignalHistory();
    renderExportPane();
    if (state.currentCode && state.payloadCache[state.currentCode]) {
      state.currentSnapshot = buildSnapshot({
        ...state.payloadCache[state.currentCode],
        lookbackKey: state.lookbackKey,
        params: state.params
      });
      renderSnapshot(state.currentSnapshot);
      renderPositionPane();
      renderBenchmarkPane();
      renderConfidencePane();
      updateCurrentActionButtons();
    }
    state.lastAutoRefreshAt = new Date().toISOString();
    state.nextAutoRefreshAt = state.autoRefreshEnabled
      ? new Date(Date.now() + AUTO_REFRESH_INTERVAL_MS).toISOString()
      : null;
    renderAutoRefreshStatus();
    setStatus(
      (config.source === "auto" ? "自动刷新已完成，" : "") +
        (state.watchlistCodes.length ? "观察名单" : "自动观察池") +
        "已刷新，共 " +
        targetCodes.length +
        " 只基金；当前基金的可信度也已同步更新。",
      "good"
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "观察名单刷新失败。";
    setStatus(message, "bad");
  } finally {
    refs.watchlistRefreshBtn.disabled = false;
    refs.watchlistRefreshBtn.textContent = "刷新观察池";
    syncAutoRefreshTimer();
  }
}

function openCodeFromCache(rawCode) {
  const code = sanitizeFundCode(rawCode);
  if (!code) {
    return;
  }
  refs.codeInput.value = code;
  state.currentCode = code;
  setActiveSector("sector-live");
  if (!state.payloadCache[code]) {
    lookupFund(code);
    return;
  }
  rebuildSnapshotsFromCache({ recordSignals: false });
  setStatus("已载入 " + code + " 的本地缓存结果。", "info");
}

function saveCurrentPosition() {
  if (!state.currentSnapshot) {
    setStatus("先抓一只基金，再录入持仓参数。", "bad");
    return;
  }

  const position = sanitizePositionInput({
    cost: refs.positionCostInput.value,
    shares: refs.positionSharesInput.value,
    targetValue: refs.positionTargetValueInput.value,
    note: refs.positionNoteInput.value
  });

  state.positions[state.currentSnapshot.code] = position;
  persistValue(STORAGE_KEYS.positions, state.positions);
  rebuildSnapshotsFromCache({ recordSignals: false });
  setStatus("已保存 " + state.currentSnapshot.code + " 的持仓参数。", "good");
}

function saveParams() {
  const nextParams = sanitizeParams({
    lowThreshold: refs.paramLowThresholdInput.value,
    highThreshold: refs.paramHighThresholdInput.value,
    maMultiplier: refs.paramMaMultiplierInput.value,
    zMultiplier: refs.paramZMultiplierInput.value,
    heatSensitivity: refs.paramHeatSensitivityInput.value,
    volatilitySensitivity: refs.paramVolatilitySensitivityInput.value
  });

  if (nextParams.lowThreshold <= nextParams.highThreshold) {
    setStatus("偏低阈值必须高于偏高阈值。", "bad");
    return;
  }

  state.params = nextParams;
  persistValue(STORAGE_KEYS.params, state.params);
  rebuildSnapshotsFromCache({ recordSignals: false });
  setStatus("模型参数已保存，并已重算当前页面、对比区和观察名单。", "good");
}

function saveBenchmarkOverride(form) {
  if (!state.currentSnapshot || !state.currentSnapshot.benchmark) {
    setStatus("当前基金没有可保存的指数估值层。", "bad");
    return;
  }

  const storageKey = state.currentSnapshot.benchmark.storageKey;
  const override = sanitizeBenchmarkOverride({
    overallPercentile: form.querySelector('[name="overallPercentile"]').value,
    pePercentile: form.querySelector('[name="pePercentile"]').value,
    pbPercentile: form.querySelector('[name="pbPercentile"]').value,
    dividendPercentile: form.querySelector('[name="dividendPercentile"]').value,
    erpPercentile: form.querySelector('[name="erpPercentile"]').value,
    sourceNote: form.querySelector('[name="sourceNote"]').value,
    benchmarkLabel: state.currentSnapshot.benchmark.label,
    benchmarkFamily: state.currentSnapshot.benchmark.family,
    updatedAt: new Date().toISOString()
  });

  if (!countOverrideMetrics(override)) {
    setStatus("至少录入一个估值分位字段。", "bad");
    return;
  }

  state.valuationOverrides[storageKey] = override;
  persistValue(STORAGE_KEYS.valuationOverrides, state.valuationOverrides);
  rebuildSnapshotsFromCache({ recordSignals: false });
  setActiveSector("sector-valuation");
  setStatus("已保存 " + state.currentSnapshot.benchmark.label + " 的指数估值层参数。", "good");
}

function clearBenchmarkOverride() {
  if (!state.currentSnapshot || !state.currentSnapshot.benchmark) {
    return;
  }
  delete state.valuationOverrides[state.currentSnapshot.benchmark.storageKey];
  persistValue(STORAGE_KEYS.valuationOverrides, state.valuationOverrides);
  rebuildSnapshotsFromCache({ recordSignals: false });
  setActiveSector("sector-valuation");
  setStatus("已清除当前指数估值层录入。", "info");
}

function exportCurrentSnapshot() {
  if (!state.currentSnapshot) {
    setStatus("当前没有可导出的基金快照。", "bad");
    return;
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    snapshot: state.currentSnapshot,
    position: state.positions[state.currentSnapshot.code] || null
  };

  downloadTextFile(
    "fund-" + state.currentSnapshot.code + "-snapshot.json",
    JSON.stringify(payload, null, 2),
    "application/json"
  );
  setStatus("已导出当前基金 JSON。", "good");
}

function exportCompareCsv() {
  const rows = state.compareCodes
    .map((code) => state.compareSnapshots[code])
    .filter(Boolean);

  if (!rows.length) {
    setStatus("对比区还没有可导出的结果。", "bad");
    return;
  }

  const header = [
    "fund_code",
    "fund_name",
    "profile",
    "lookback",
    "overall_score",
    "overall_label",
    "confidence_score",
    "confidence_label",
    "current_nav",
    "benchmark",
    "benchmark_model_score"
  ];

  const lines = rows.map((snapshot) => {
    const benchmarkModel = snapshot.models.find((model) => model.id === "index_real_valuation");
    return [
      snapshot.code,
      snapshot.name,
      snapshot.profile.familyLabel,
      snapshot.lookback.label,
      formatScore(snapshot.overall.score),
      snapshot.overall.label,
      formatScore(snapshot.confidence.score),
      snapshot.confidence.label,
      formatNav(snapshot.currentNav),
      snapshot.benchmark ? snapshot.benchmark.label : "",
      benchmarkModel && Number.isFinite(benchmarkModel.score) ? formatScore(benchmarkModel.score) : ""
    ]
      .map(csvEscape)
      .join(",");
  });

  downloadTextFile(
    "fund-compare-" + formatDateForFile(new Date()) + ".csv",
    [header.join(","), ...lines].join("\n"),
    "text/csv;charset=utf-8"
  );
  setStatus("已导出对比 CSV。", "good");
}

function exportWorkspace() {
  const payload = {
    exportedAt: new Date().toISOString(),
    lookbackKey: state.lookbackKey,
    recentCodes: state.recentCodes,
    compareCodes: state.compareCodes,
    watchlistCodes: state.watchlistCodes,
    positions: state.positions,
    params: state.params,
    signalHistory: state.signalHistory,
    signalState: state.signalState,
    valuationOverrides: state.valuationOverrides
  };

  downloadTextFile(
    "fund-valuation-workspace-" + formatDateForFile(new Date()) + ".json",
    JSON.stringify(payload, null, 2),
    "application/json"
  );
  setStatus("已导出本地工作区 JSON。", "good");
}

function renderBusyState(code) {
  refs.lookupBtn.disabled = true;
  refs.lookbackSelect.disabled = true;
  refs.lookupBtn.textContent = "抓取中...";
  const lookback = getLookbackOption(state.lookbackKey);

  refs.summaryPane.innerHTML =
    '<p class="section-kicker">SUMMARY</p>' +
    "<h2>正在抓取 " +
    escapeHtml(code) +
    "</h2>" +
    "<p>会先识别基金类型，再按 " +
    escapeHtml(lookback.label) +
    " 的窗口计算估值，并刷新对比 / 观察相关视图。</p>";

  refs.overallBanner.className = "overall-banner tone-loading";
  refs.overallBanner.innerHTML =
    "<strong>模型准备中</strong><span>这次会同步更新类型模型、指数估值层和可信度。</span>";

  refs.modelsGrid.innerHTML = "";
  refs.reasonPane.innerHTML =
    '<p class="section-kicker">READING</p><h3>如何读这个结果</h3><p>加载完成后，这里会解释为什么当前基金使用这套框架，以及不同模型有没有同向。</p>';
  refs.factsPane.innerHTML =
    '<p class="section-kicker">DATA</p><h3>数据细节</h3><p>抓取完成后，这里会展示核心净值、波动、指数映射和可信度细节。</p>';
  updateCurrentActionButtons();
}

function renderErrorState(code, message) {
  refs.summaryPane.innerHTML =
    '<p class="section-kicker">SUMMARY</p>' +
    "<h2>未能抓取 " +
    escapeHtml(code) +
    "</h2>" +
    "<p>" +
    escapeHtml(message) +
    "</p>";

  refs.overallBanner.className = "overall-banner tone-bad";
  refs.overallBanner.innerHTML =
    "<strong>没有结果</strong><span>常见原因是基金代码无效，或者东方财富接口临时不可用。</span>";

  refs.modelsGrid.innerHTML = "";
  refs.reasonPane.innerHTML =
    '<p class="section-kicker">READING</p><h3>如何读这个结果</h3><p>先修正基金代码或稍后重试。只有抓到历史净值，模型和可信度才会生成。</p>';
  refs.factsPane.innerHTML =
    '<p class="section-kicker">DATA</p><h3>数据细节</h3><p>当前没有可展示的数据样本。</p>';
}

function renderSnapshot(snapshot) {
  renderSummary(snapshot);
  renderOverall(snapshot);
  renderModels(snapshot);
  renderReason(snapshot);
  renderFacts(snapshot);
}

function renderSummary(snapshot) {
  const metaTags = [
    snapshot.profile.rawType,
    snapshot.meta.company ? "公司 " + snapshot.meta.company : "",
    snapshot.meta.manager ? "经理 " + snapshot.meta.manager : "",
    snapshot.benchmark ? "指数 " + snapshot.benchmark.label : "",
    snapshot.meta.themes.length ? "主题 " + snapshot.meta.themes.join(" / ") : ""
  ].filter(Boolean);
  const overallDisplay = snapshot.profile.key === "money" ? "N/A" : formatScore(snapshot.overall.score);

  refs.summaryPane.innerHTML =
    '<p class="section-kicker">SUMMARY</p>' +
    '<div class="summary-meta">' +
    "<div>" +
    '<h2 class="fund-title">' +
    escapeHtml(snapshot.name) +
    "</h2>" +
    '<p class="fund-code">' +
    escapeHtml(snapshot.code) +
    " · " +
    escapeHtml(snapshot.timeLabel) +
    "</p>" +
    "</div>" +
    '<span class="source-pill">' +
    escapeHtml(snapshot.profile.familyLabel) +
    "</span>" +
    "</div>" +
    '<div class="fact-list">' +
    metaTags.map((tag) => '<span class="mini-pill">' + escapeHtml(tag) + "</span>").join("") +
    "</div>" +
    (snapshot.lookback.notice
      ? '<p class="subtle-text">' + escapeHtml(snapshot.lookback.notice) + "</p>"
      : "") +
    '<div class="metric-strip">' +
    buildMetricCard("当前口径", formatNav(snapshot.currentNav), snapshot.currentLabel) +
    buildMetricCard("综合估值分", overallDisplay, snapshot.overall.label) +
    buildMetricCard("估值窗口", snapshot.lookback.label, snapshot.lookback.sampleLabel) +
    buildMetricCard("可信度", formatScore(snapshot.confidence.score), snapshot.confidence.label) +
    "</div>" +
    '<div class="spark-shell">' +
    '<p class="section-kicker">TREND</p>' +
    "<h3>" +
    escapeHtml(snapshot.lookback.sparklineTitle) +
    "</h3>" +
    buildSparkline(snapshot.sparkline) +
    '<div class="trend-labels"><span>低点 ' +
    formatNav(snapshot.sparkline.min) +
    "</span><span>高点 " +
    formatNav(snapshot.sparkline.max) +
    "</span></div>" +
    "</div>" +
    '<div class="score-band ' +
    snapshot.overall.toneClass +
    '">' +
    "<h3>" +
    escapeHtml(snapshot.overall.label) +
    "</h3>" +
    "<p>" +
    escapeHtml(snapshot.overall.summary) +
    "</p>" +
    "</div>";
}

function renderOverall(snapshot) {
  refs.overallBanner.className = "overall-banner " + snapshot.overall.toneClass;
  refs.overallBanner.innerHTML =
    "<strong>综合结论：" +
    escapeHtml(snapshot.overall.label) +
    "</strong>" +
    "<span>" +
    escapeHtml(snapshot.overall.bannerText) +
    "</span>";
}

function renderModels(snapshot) {
  refs.modelsGrid.innerHTML = snapshot.models
    .map((model, index) => {
      return (
        '<article class="model-card">' +
        '<div class="model-head">' +
        '<p class="model-index">MODEL 0' +
        (index + 1) +
        "</p>" +
        '<span class="score-chip ' +
        model.toneClass +
        '">' +
        escapeHtml(model.label) +
        "</span>" +
        "</div>" +
        "<h3>" +
        escapeHtml(model.title) +
        "</h3>" +
        '<div class="score-row">' +
        '<div class="score-card"><span>估值分</span><strong>' +
        escapeHtml(model.displayScore) +
        "</strong></div>" +
        '<div class="score-subline">' +
        escapeHtml(model.sideNote) +
        "</div>" +
        "</div>" +
        '<p class="model-summary">' +
        escapeHtml(model.summary) +
        "</p>" +
        '<div class="fact-list">' +
        model.facts.map((fact) => '<span class="mini-pill">' + escapeHtml(fact) + "</span>").join("") +
        "</div>" +
        "</article>"
      );
    })
    .join("");
}

function renderReason(snapshot) {
  const hints = snapshot.models
    .map((model) => '<span class="mini-pill">' + escapeHtml(model.title + "：" + model.label) + "</span>")
    .join("");

  refs.reasonPane.innerHTML =
    '<p class="section-kicker">READING</p>' +
    "<h3>为什么是这个结论</h3>" +
    "<p>当前按 " +
    escapeHtml(snapshot.lookback.label) +
    " 作为主估值窗口。</p>" +
    "<p>" +
    escapeHtml(snapshot.profile.familySummary) +
    "</p>" +
    "<p>" +
    escapeHtml(snapshot.overall.summary) +
    "</p>" +
    (snapshot.benchmark && snapshot.profile.key !== "active_equity"
      ? "<p>指数估值层当前" +
        escapeHtml(snapshot.benchmark.autoMapped ? "已自动映射到 " + snapshot.benchmark.label : "还未自动识别具体指数") +
        "，如果你补充 PE / PB / 股息率分位，综合分会更接近真正的底层资产估值。</p>"
      : "") +
    '<div class="fact-list">' +
    hints +
    "</div>" +
    '<p class="subtle-text">上方“模型说明”页已经把基础模型、指数估值层和可信度的计算口径拆开写清楚了。</p>';
}

function renderFacts(snapshot) {
  const benchmarkModel = snapshot.models.find((model) => model.id === "index_real_valuation");
  const autoBenchmark = snapshot.benchmark && snapshot.benchmark.autoValuation ? snapshot.benchmark.autoValuation : null;
  const items = [
    ["基金大类", snapshot.profile.familyLabel],
    ["估值回看窗口", snapshot.lookback.label],
    ["接口 FTYPE", snapshot.profile.rawType],
    ["基金公司", snapshot.meta.company || "未返回"],
    ["基金经理", snapshot.meta.manager || "未返回"],
    ["可申购", snapshot.meta.isBuy == null ? "未返回" : snapshot.meta.isBuy ? "是" : "否"],
    ["盘中估算净值", snapshot.estimate ? formatNav(snapshot.estimate.estimatedNav) : "未返回"],
    ["最新正式净值", formatNav(snapshot.officialNav)],
    ["估算相对正式净值", snapshot.estimate ? formatSignedPercent(snapshot.estimate.estimateGap) : "未返回"],
    ["1 月收益率", snapshot.returns.oneMonth != null ? formatPlainPercent(snapshot.returns.oneMonth) : "未返回"],
    ["3 月收益率", snapshot.returns.threeMonth != null ? formatPlainPercent(snapshot.returns.threeMonth) : "未返回"],
    ["6 月收益率", snapshot.returns.sixMonth != null ? formatPlainPercent(snapshot.returns.sixMonth) : "未返回"],
    ["1 年收益率", snapshot.returns.oneYear != null ? formatPlainPercent(snapshot.returns.oneYear) : "未返回"],
    [snapshot.lookback.shortLabel + "最高", formatNav(snapshot.range.high)],
    [snapshot.lookback.shortLabel + "最低", formatNav(snapshot.range.low)],
    ["20 日均线偏离", formatSignedPercent(snapshot.movingAverage.ma20Gap)],
    ["60 日均线偏离", formatSignedPercent(snapshot.movingAverage.ma60Gap)],
    ["120 日均线偏离", formatSignedPercent(snapshot.movingAverage.ma120Gap)],
    ["20 日年化波动", formatPercent(snapshot.statistics.annualVol20)],
    ["60 日年化波动", formatPercent(snapshot.statistics.annualVol60)],
    ["短波动 / 中波动", formatRatio(snapshot.statistics.volRatio20To60)],
    ["60 日当前回撤", formatSignedPercent(snapshot.statistics.currentDrawdown60)],
    ["股票占净比", formatPlainPctValue(snapshot.allocation.stockPct)],
    ["债券占净比", formatPlainPctValue(snapshot.allocation.bondPct)],
    ["现金占净比", formatPlainPctValue(snapshot.allocation.cashPct)],
    ["股票仓位测算", formatPlainPctValue(snapshot.allocation.stockPositionPct)],
    ["指数映射", snapshot.benchmark ? snapshot.benchmark.label : "不适用"],
    ["指数估值层", benchmarkModel ? benchmarkModel.displayScore + " / " + benchmarkModel.label : "不适用"],
    ["自动指数 PE", autoBenchmark ? formatMetricNumber(autoBenchmark.pe) : "未自动补充"],
    ["自动指数 PB", autoBenchmark ? formatMetricNumber(autoBenchmark.pb) : "未自动补充"],
    ["自动指数股息率", autoBenchmark ? formatMetricPercent(autoBenchmark.dividendYield) : "未自动补充"],
    ["可信度", formatScore(snapshot.confidence.score) + " / " + snapshot.confidence.label],
    ["有效样本", snapshot.lookback.sampleLabel]
  ];

  refs.factsPane.innerHTML =
    '<p class="section-kicker">DATA</p>' +
    "<h3>数据细节</h3>" +
    '<div class="kv-grid">' +
    items
      .map((item) => {
        return (
          '<div class="kv-item"><span class="fact-key">' +
          escapeHtml(item[0]) +
          '</span><strong class="fact-value">' +
          escapeHtml(item[1]) +
          "</strong></div>"
        );
      })
      .join("") +
    "</div>";
}

function renderComparePane() {
  const usingAutomaticPool = !state.compareCodes.length;
  const rows = usingAutomaticPool
    ? getAutomaticResearchCodes()
    : state.compareCodes.map((code) => state.compareSnapshots[code] || null);

  if (!rows.length) {
    refs.comparePane.className = "table-shell empty-state";
    refs.comparePane.textContent = "当前还没有足够样本，先抓几只基金，系统会自动生成对比池。";
    return;
  }

  refs.comparePane.className = "table-shell";
  refs.comparePane.innerHTML =
    (usingAutomaticPool
      ? '<p class="table-caption">当前没有手动固定的对比区，下面先按最近查看和本地样本自动生成一个对比池。</p>'
      : '<p class="table-caption">这里显示你手动固定的对比基金池。</p>') +
    '<table class="mini-table">' +
    "<thead><tr>" +
    "<th>基金</th>" +
    "<th>类型</th>" +
    "<th>综合分</th>" +
    "<th>可信度</th>" +
    "<th>指数层</th>" +
    "<th>操作</th>" +
    "</tr></thead>" +
    "<tbody>" +
    rows
      .map((snapshot, index) => {
        const code = usingAutomaticPool ? snapshot.code : state.compareCodes[index];
        if (!snapshot) {
          return (
            "<tr>" +
            "<td>" +
            escapeHtml(code) +
            "</td>" +
            '<td colspan="4">还没有本地快照，重新抓取后会显示。</td>' +
            '<td class="table-actions">' +
            '<button class="button button-subtle table-button" type="button" data-code="' +
            escapeHtml(code) +
            '" data-action="remove-compare">移除</button>' +
            "</td>" +
            "</tr>"
          );
        }
        const benchmarkModel = snapshot.models.find((model) => model.id === "index_real_valuation");
        return (
          "<tr>" +
          "<td><strong>" +
          escapeHtml(snapshot.code) +
          "</strong><span class=\"table-subline\">" +
          escapeHtml(snapshot.name) +
          "</span></td>" +
          "<td>" +
          escapeHtml(snapshot.profile.familyLabel) +
          "</td>" +
          "<td><strong>" +
          escapeHtml(formatScore(snapshot.overall.score)) +
          "</strong><span class=\"table-subline\">" +
          escapeHtml(snapshot.overall.label) +
          "</span></td>" +
          "<td><strong>" +
          escapeHtml(formatScore(snapshot.confidence.score)) +
          "</strong><span class=\"table-subline\">" +
          escapeHtml(snapshot.confidence.label) +
          "</span></td>" +
          "<td>" +
          escapeHtml(benchmarkModel ? benchmarkModel.displayScore + " / " + benchmarkModel.label : "不适用") +
          "</td>" +
          '<td class="table-actions">' +
          '<button class="button button-subtle table-button" type="button" data-code="' +
          escapeHtml(snapshot.code) +
          '" data-action="use-current">载入</button>' +
          (usingAutomaticPool
            ? '<button class="button button-subtle table-button" type="button" data-code="' +
              escapeHtml(snapshot.code) +
              '" data-action="pin-compare">固定</button>'
            : '<button class="button button-subtle table-button" type="button" data-code="' +
              escapeHtml(snapshot.code) +
              '" data-action="remove-compare">移除</button>') +
          "</td>" +
          "</tr>"
        );
      })
      .join("") +
    "</tbody>" +
    "</table>";
}

function renderWatchlistPane() {
  const automaticSnapshots = getAutomaticResearchCodes();
  const usingAutomaticPool = !state.watchlistCodes.length;
  const codes = usingAutomaticPool ? automaticSnapshots.map((snapshot) => snapshot.code) : state.watchlistCodes;

  if (!codes.length) {
    refs.watchlistPane.className = "card-stack empty-state";
    refs.watchlistPane.textContent = "当前还没有足够样本，先抓几只基金，系统会自动生成观察池。";
    return;
  }

  refs.watchlistPane.className = "card-stack";
  refs.watchlistPane.innerHTML =
    (usingAutomaticPool
      ? '<article class="mini-card auto-note"><h3>自动观察池</h3><p>当前没有手动观察名单，系统先按最近查看和本地样本生成一个自动观察池。</p></article>'
      : "") +
    codes
    .map((code) => {
      const snapshot = usingAutomaticPool
        ? automaticSnapshots.find((item) => item.code === code)
        : state.watchlistSnapshots[code];
      if (!snapshot) {
        return (
          '<article class="mini-card">' +
          "<h3>" +
          escapeHtml(code) +
          "</h3>" +
          "<p>已加入观察名单，但本轮还没有刷新到新数据。</p>" +
          '<div class="stack-actions">' +
          '<button class="button button-subtle table-button" type="button" data-code="' +
          escapeHtml(code) +
          '" data-action="' +
          (usingAutomaticPool ? "pin-watch" : "remove-watch") +
          '">' +
          (usingAutomaticPool ? "加入观察" : "移除") +
          "</button>" +
          "</div>" +
          "</article>"
        );
      }
      const benchmarkModel = snapshot.models.find((model) => model.id === "index_real_valuation");
      return (
        '<article class="mini-card">' +
        '<div class="mini-card-head">' +
        "<div><h3>" +
        escapeHtml(snapshot.name) +
        '</h3><p class="mini-card-meta">' +
        escapeHtml(snapshot.code + " · " + snapshot.profile.familyLabel) +
        "</p></div>" +
        '<span class="score-chip ' +
        snapshot.overall.toneClass +
        '">' +
        escapeHtml(snapshot.overall.label) +
        "</span>" +
        "</div>" +
        '<div class="mini-metrics">' +
        '<span class="mini-pill">综合 ' +
        escapeHtml(formatScore(snapshot.overall.score)) +
        "</span>" +
        '<span class="mini-pill">可信度 ' +
        escapeHtml(formatScore(snapshot.confidence.score)) +
        "</span>" +
        '<span class="mini-pill">窗口 ' +
        escapeHtml(snapshot.lookback.shortLabel) +
        "</span>" +
        (benchmarkModel ? '<span class="mini-pill">指数层 ' + escapeHtml(benchmarkModel.displayScore) + "</span>" : "") +
        "</div>" +
        "<p>" +
        escapeHtml(snapshot.overall.bannerText) +
        "</p>" +
        '<div class="stack-actions">' +
        '<button class="button button-subtle table-button" type="button" data-code="' +
        escapeHtml(snapshot.code) +
        '" data-action="use-current">载入</button>' +
        '<button class="button button-subtle table-button" type="button" data-code="' +
        escapeHtml(snapshot.code) +
        '" data-action="' +
        (usingAutomaticPool ? "pin-watch" : "remove-watch") +
        '">' +
        (usingAutomaticPool ? "加入观察" : "移除") +
        "</button>" +
        "</div>" +
        "</article>"
      );
    })
    .join("");
}

function renderAutoRefreshStatus() {
  refs.autoRefreshToggleBtn.textContent = "自动刷新：" + (state.autoRefreshEnabled ? "开" : "关");

  if (!state.autoRefreshEnabled) {
    refs.autoRefreshStatus.textContent = "自动刷新已关闭。当前基金可信度会在你手动刷新观察池或重新抓取基金时更新。";
    return;
  }

  const parts = ["页面打开期间会定时刷新观察池，并同步重算当前基金可信度。"];
  if (state.lastAutoRefreshAt) {
    parts.push("上次刷新 " + formatDateTime(state.lastAutoRefreshAt));
  }
  if (state.nextAutoRefreshAt) {
    parts.push("下次预计 " + formatDateTime(state.nextAutoRefreshAt));
  } else {
    parts.push("将在约 30 分钟后进行下一次自动刷新");
  }
  refs.autoRefreshStatus.textContent = parts.join(" ");
}

function renderPositionPane() {
  if (!state.currentSnapshot) {
    refs.positionPane.className = "card-stack empty-state";
    refs.positionPane.textContent = "先抓一只基金，再填写你的成本和仓位信息。";
    clearPositionForm();
    return;
  }

  const position = state.positions[state.currentSnapshot.code];
  populatePositionForm(state.currentSnapshot.code);

  if (!position) {
    refs.positionPane.className = "card-stack empty-state";
    refs.positionPane.textContent = "当前基金还没有保存持仓参数。";
    return;
  }

  const insight = buildPositionInsight(state.currentSnapshot, position, state.params);
  refs.positionPane.className = "card-stack";
  refs.positionPane.innerHTML =
    '<article class="mini-card">' +
    "<h3>持仓拆解</h3>" +
    '<div class="mini-metrics">' +
    '<span class="mini-pill">成本 ' +
    escapeHtml(formatNav(position.cost)) +
    "</span>" +
    '<span class="mini-pill">份额 ' +
    escapeHtml(formatQuantity(position.shares)) +
    "</span>" +
    (position.targetValue != null ? '<span class="mini-pill">目标市值 ' + escapeHtml(formatCurrency(position.targetValue)) + "</span>" : "") +
    "</div>" +
    '<div class="kv-grid compact-grid">' +
    buildKvItem("当前市值", formatCurrency(insight.marketValue)) +
    buildKvItem("浮动盈亏", formatCurrency(insight.pnlValue)) +
    buildKvItem("收益率", formatSignedPercent(insight.pnlPct)) +
    buildKvItem("距目标", insight.targetGapPct == null ? "未设置" : formatSignedPercent(insight.targetGapPct)) +
    "</div>" +
    "<p>" +
    escapeHtml(insight.message) +
    "</p>" +
    (position.note ? '<p class="subtle-text">备注：' + escapeHtml(position.note) + "</p>" : "") +
    "</article>";
}

function renderParamsPane() {
  refs.paramsPane.className = "card-stack";
  refs.paramsPane.innerHTML =
    '<article class="mini-card">' +
    "<h3>当前参数</h3>" +
    '<div class="mini-metrics">' +
    '<span class="mini-pill">偏低阈值 ' +
    escapeHtml(formatScore(state.params.lowThreshold)) +
    "</span>" +
    '<span class="mini-pill">偏高阈值 ' +
    escapeHtml(formatScore(state.params.highThreshold)) +
    "</span>" +
    '<span class="mini-pill">均线带宽 ' +
    escapeHtml(formatRatio(state.params.maMultiplier)) +
    "</span>" +
    '<span class="mini-pill">Z 系数 ' +
    escapeHtml(formatRatio(state.params.zMultiplier)) +
    "</span>" +
    '<span class="mini-pill">热度敏感度 ' +
    escapeHtml(formatRatio(state.params.heatSensitivity)) +
    "</span>" +
    '<span class="mini-pill">波动敏感度 ' +
    escapeHtml(formatRatio(state.params.volatilitySensitivity)) +
    "</span>" +
    "</div>" +
    "<p>这些参数会同时影响当前页、对比区和观察名单。敏感度越高，模型越容易把高热度或高波动判成扣分项。</p>" +
    "</article>";
}

function renderBenchmarkPane() {
  if (!state.currentSnapshot) {
    refs.benchmarkPane.className = "card-stack empty-state";
    refs.benchmarkPane.textContent = "当前基金抓取完成后，这里会显示自动映射到的指数和估值录入入口。";
    return;
  }

  if (!state.currentSnapshot.benchmark) {
    refs.benchmarkPane.className = "card-stack";
    refs.benchmarkPane.innerHTML =
      '<article class="mini-card">' +
      "<h3>当前类型不启用指数估值层</h3>" +
      "<p>主动权益和债基不会强行映射到底层指数。对这两类基金，当前页主要保留净值位置和风险过滤。</p>" +
      "</article>";
    return;
  }

  const benchmark = state.currentSnapshot.benchmark;
  const override = benchmark.override || {};
  const autoValuation = benchmark.autoValuation || null;
  const autoPending = Boolean(state.benchmarkAutoPending[benchmark.storageKey]);
  const model = state.currentSnapshot.models.find((item) => item.id === "index_real_valuation");

  refs.benchmarkPane.className = "card-stack";
  refs.benchmarkPane.innerHTML =
    '<article class="mini-card">' +
    '<div class="mini-card-head">' +
    "<div><h3>" +
    escapeHtml(benchmark.label) +
    '</h3><p class="mini-card-meta">' +
    escapeHtml(benchmark.family + " · " + (benchmark.autoMapped ? "自动映射" : "待你确认")) +
    "</p></div>" +
    '<span class="score-chip ' +
    (model ? model.toneClass : "tone-info") +
    '">' +
    escapeHtml(model ? model.label : "待录入") +
    "</span>" +
    "</div>" +
    "<p>" +
    escapeHtml(
      benchmark.autoMapped
        ? "当前根据基金名称和类型自动映射到了这个指数。常见国内指数会优先尝试官方 factsheet 自动补充；手动录入会覆盖自动结果。"
        : "当前没有自动识别出具体指数。你仍然可以按自己确认过的跟踪标的手动录入分位。"
    ) +
    "</p>" +
    '<div class="mini-metrics">' +
    '<span class="mini-pill">模型结果 ' +
    escapeHtml(model ? model.displayScore : "待录入") +
    "</span>" +
    '<span class="mini-pill">录入项 ' +
    escapeHtml(String(countOverrideMetrics(override))) +
    "</span>" +
    (benchmark.supportsAutomaticValuation ? '<span class="mini-pill">自动补充支持</span>' : "") +
    (autoPending ? '<span class="mini-pill">正在抓取官方 factsheet</span>' : "") +
    (override.updatedAt ? '<span class="mini-pill">更新于 ' + escapeHtml(formatDateTime(override.updatedAt)) + "</span>" : "") +
    (autoValuation && autoValuation.asOfLabel ? '<span class="mini-pill">自动口径日 ' + escapeHtml(autoValuation.asOfLabel) + "</span>" : "") +
    "</div>" +
    (autoValuation
      ? '<div class="kv-grid compact-grid">' +
        buildKvItem("自动 PE", formatMetricNumber(autoValuation.pe)) +
        buildKvItem("自动 PB", formatMetricNumber(autoValuation.pb)) +
        buildKvItem("自动股息率", formatMetricPercent(autoValuation.dividendYield)) +
        buildKvItem("自动来源", autoValuation.sourceLabel) +
        "</div>"
      : "") +
    (benchmark.autoError ? '<p class="subtle-text">自动抓取失败：' + escapeHtml(benchmark.autoError) + "</p>" : "") +
    '<form id="benchmark-form" class="stack-form">' +
    '<div class="inline-fields">' +
    buildBenchmarkField("整体估值分位", "overallPercentile", override.overallPercentile) +
    buildBenchmarkField("PE 分位", "pePercentile", override.pePercentile) +
    "</div>" +
    '<div class="inline-fields">' +
    buildBenchmarkField("PB 分位", "pbPercentile", override.pbPercentile) +
    buildBenchmarkField("股息率分位", "dividendPercentile", override.dividendPercentile) +
    "</div>" +
    '<div class="inline-fields">' +
    buildBenchmarkField("ERP 分位", "erpPercentile", override.erpPercentile) +
    '<div class="control-group">' +
    '<label class="field-label" for="benchmark-source-note">来源备注</label>' +
    '<input id="benchmark-source-note" class="code-input" name="sourceNote" type="text" placeholder="例如 手工录入自某指数估值表" value="' +
    escapeHtml(override.sourceNote || "") +
    '" />' +
    "</div>" +
    "</div>" +
    '<div class="batch-row batch-row-tight">' +
    '<button class="button button-solid" type="submit">保存指数估值层</button>' +
    '<button class="button button-subtle" type="button" data-action="clear-benchmark">清空录入</button>' +
    "</div>" +
    "</form>" +
    "</article>";
}

function renderConfidencePane() {
  if (!state.currentSnapshot) {
    refs.confidencePane.className = "card-stack empty-state";
    refs.confidencePane.textContent = "当前基金抓取完成后，这里会显示可信度评分和原因。";
    return;
  }

  const confidence = state.currentSnapshot.confidence;
  refs.confidencePane.className = "card-stack";
  refs.confidencePane.innerHTML =
    '<article class="mini-card">' +
    '<div class="mini-card-head">' +
    "<div><h3>可信度 " +
    escapeHtml(confidence.label) +
    '</h3><p class="mini-card-meta">分数 ' +
    escapeHtml(formatScore(confidence.score)) +
    " / 100</p></div>" +
    '<span class="score-chip ' +
    confidence.toneClass +
    '">' +
    escapeHtml(confidence.label) +
    "</span>" +
    "</div>" +
    "<p>" +
    escapeHtml(confidence.summary) +
    "</p>" +
    '<div class="card-stack-inline">' +
    confidence.reasons.map((reason) => '<span class="mini-pill">' + escapeHtml(reason) + "</span>").join("") +
    "</div>" +
    "</article>";
}

function renderSignalHistory() {
  if (!Array.isArray(state.signalHistory) || !state.signalHistory.length) {
    refs.signalHistoryPane.className = "card-stack empty-state";
    refs.signalHistoryPane.textContent = "还没有检测到明显的信号变化。";
    return;
  }

  refs.signalHistoryPane.className = "card-stack";
  refs.signalHistoryPane.innerHTML = state.signalHistory
    .slice(0, 18)
    .map((entry) => {
      return (
        '<article class="mini-card">' +
        '<div class="mini-card-head">' +
        "<div><h3>" +
        escapeHtml(entry.code + " " + entry.name) +
        '</h3><p class="mini-card-meta">' +
        escapeHtml(formatDateTime(entry.recordedAt) + " · " + entry.sourceLabel) +
        "</p></div>" +
        '<span class="score-chip ' +
        entry.toneClass +
        '">' +
        escapeHtml(entry.label) +
        "</span>" +
        "</div>" +
        "<p>" +
        escapeHtml(entry.message) +
        "</p>" +
        "</article>"
      );
    })
    .join("");
}

function renderExportPane() {
  refs.exportPane.className = "card-stack";
  refs.exportPane.innerHTML =
    '<article class="mini-card">' +
    "<h3>当前工作区</h3>" +
    '<div class="mini-metrics">' +
    '<span class="mini-pill">当前基金 ' +
    escapeHtml(state.currentSnapshot ? state.currentSnapshot.code : "--") +
    "</span>" +
    '<span class="mini-pill">对比 ' +
    escapeHtml(String(state.compareCodes.length)) +
    "</span>" +
    '<span class="mini-pill">观察 ' +
    escapeHtml(String(state.watchlistCodes.length)) +
    "</span>" +
    '<span class="mini-pill">持仓参数 ' +
    escapeHtml(String(Object.keys(state.positions).length)) +
    "</span>" +
    '<span class="mini-pill">信号记录 ' +
    escapeHtml(String(state.signalHistory.length)) +
    "</span>" +
    '<span class="mini-pill">指数录入 ' +
    escapeHtml(String(Object.keys(state.valuationOverrides).length)) +
    "</span>" +
    "</div>" +
    "<p>工作区导出会把观察名单、对比区、持仓参数、自定义模型参数、指数估值层录入和信号变化记录一起带出去。</p>" +
    "</article>";
}

function uniqueCodes(values) {
  return Array.from(new Set(values.map((item) => sanitizeFundCode(item)).filter(Boolean)));
}

function normalizeSortIndex(value) {
  return value === -1 ? Number.MAX_SAFE_INTEGER : value;
}

function updateCurrentActionButtons() {
  const snapshot = state.currentSnapshot;
  refs.compareCurrentBtn.disabled = !snapshot;
  refs.watchlistCurrentBtn.disabled = !snapshot;

  if (!snapshot) {
    refs.compareCurrentBtn.textContent = "加入对比";
    refs.watchlistCurrentBtn.textContent = "加入观察";
    return;
  }

  refs.compareCurrentBtn.textContent = state.compareCodes.includes(snapshot.code) ? "已在对比区" : "加入对比";
  refs.watchlistCurrentBtn.textContent = state.watchlistCodes.includes(snapshot.code) ? "已在观察名单" : "加入观察";
}

function populatePositionForm(code) {
  const position = code ? state.positions[code] : null;
  refs.positionCostInput.value = position && position.cost != null ? String(position.cost) : "";
  refs.positionSharesInput.value = position && position.shares != null ? String(position.shares) : "";
  refs.positionTargetValueInput.value = position && position.targetValue != null ? String(position.targetValue) : "";
  refs.positionNoteInput.value = position && position.note ? position.note : "";
}

function clearPositionForm() {
  refs.positionCostInput.value = "";
  refs.positionSharesInput.value = "";
  refs.positionTargetValueInput.value = "";
  refs.positionNoteInput.value = "";
}

function populateParamsForm() {
  refs.paramLowThresholdInput.value = String(state.params.lowThreshold);
  refs.paramHighThresholdInput.value = String(state.params.highThreshold);
  refs.paramMaMultiplierInput.value = String(state.params.maMultiplier);
  refs.paramZMultiplierInput.value = String(state.params.zMultiplier);
  refs.paramHeatSensitivityInput.value = String(state.params.heatSensitivity);
  refs.paramVolatilitySensitivityInput.value = String(state.params.volatilitySensitivity);
}

function recordSignalIfNeeded(snapshot, source) {
  const summary = {
    score: roundNumber(snapshot.overall.score, 1),
    label: snapshot.overall.label,
    confidenceLabel: snapshot.confidence.label,
    confidenceScore: roundNumber(snapshot.confidence.score, 1),
    benchmarkReady: Boolean(snapshot.benchmark && snapshot.benchmark.override && countOverrideMetrics(snapshot.benchmark.override)),
    lookbackKey: snapshot.lookback.key
  };

  const previous = state.signalState[snapshot.code];
  state.signalState[snapshot.code] = {
    ...summary,
    name: snapshot.name,
    updatedAt: new Date().toISOString()
  };
  persistValue(STORAGE_KEYS.signalState, state.signalState);

  if (!previous) {
    return;
  }

  const scoreDelta = Math.abs(summary.score - previous.score);
  const changes = [];

  if (summary.label !== previous.label) {
    changes.push("综合结论从 " + previous.label + " 变成 " + summary.label);
  }
  if (summary.confidenceLabel !== previous.confidenceLabel) {
    changes.push("可信度从 " + previous.confidenceLabel + " 变成 " + summary.confidenceLabel);
  }
  if (summary.benchmarkReady !== previous.benchmarkReady) {
    changes.push(summary.benchmarkReady ? "指数估值层已补齐" : "指数估值层又变成缺失");
  }
  if (scoreDelta >= 8) {
    changes.push("综合分变化 " + formatSignedNumber(summary.score - previous.score, 1));
  }

  if (!changes.length) {
    return;
  }

  const verdict = classifyScore(summary.score, state.params);
  state.signalHistory = [
    {
      code: snapshot.code,
      name: snapshot.name,
      recordedAt: new Date().toISOString(),
      label: verdict.label,
      toneClass: verdict.toneClass,
      sourceLabel: source === "watchlist" ? "观察名单刷新" : "当前基金刷新",
      message: changes.join("；")
    },
    ...state.signalHistory
  ].slice(0, SIGNAL_HISTORY_LIMIT);
  persistValue(STORAGE_KEYS.signalHistory, state.signalHistory);
}

function buildSnapshot(input) {
  const history = input.history;
  const estimate = input.estimate;
  const params = sanitizeParams(input.params || state.params);
  const meta = input.meta || {
    code: input.code,
    name: "",
    ftype: "",
    shortName: "",
    company: "",
    manager: "",
    isBuy: null,
    themes: []
  };

  const series = history.series;
  const officialPoint = series[series.length - 1];
  const lookback = resolveLookbackWindow(series, input.lookbackKey);
  const currentNav =
    estimate && Number.isFinite(estimate.estimatedNav) && estimate.estimatedNav > 0
      ? estimate.estimatedNav
      : officialPoint.nav;
  const officialNav =
    estimate && Number.isFinite(estimate.officialNav) && estimate.officialNav > 0
      ? estimate.officialNav
      : officialPoint.nav;

  const windows = {
    window20: takeLastPoints(series, 20),
    window60: takeLastPoints(series, 60),
    window120: takeLastPoints(series, 120),
    valuationWindow: lookback.series
  };

  const navs20 = windows.window20.map((point) => point.nav);
  const navs60 = windows.window60.map((point) => point.nav);
  const navs120 = windows.window120.map((point) => point.nav);
  const valuationNavs = windows.valuationWindow.map((point) => point.nav);
  const ma20 = average(navs20);
  const ma60 = average(navs60);
  const ma120 = average(navs120);

  const profile = resolveFundProfile(meta, history);
  const benchmark = resolveBenchmark(meta, history, profile, input.code);
  const benchmarkOverride = benchmark ? getBenchmarkOverride(benchmark.storageKey) : null;
  const benchmarkAutoValuation = benchmark ? getAutomaticBenchmarkValuation(benchmark.storageKey) : null;
  const benchmarkAutoErrorRecord = benchmark ? state.benchmarkAutoErrors[benchmark.storageKey] || null : null;
  const movingAverageBands = scaleBands(
    profile.settings.movingAverageBands || { ma20: 0.06, ma60: 0.1, ma120: 0.15 },
    params.maMultiplier
  );

  const range = {
    low: Math.min(...valuationNavs),
    high: Math.max(...valuationNavs)
  };
  range.position = clamp(ratioWithinRange(currentNav, range.low, range.high), 0, 1);
  range.drawdownFromHigh = currentNav / range.high - 1;
  range.distanceFromLow = currentNav / range.low - 1;

  const movingAverage = {
    ma20,
    ma60,
    ma120,
    ma20Gap: currentNav / ma20 - 1,
    ma60Gap: currentNav / ma60 - 1,
    ma120Gap: currentNav / ma120 - 1
  };

  const statistics = {
    valuationMean: average(valuationNavs),
    valuationStd: standardDeviation(valuationNavs, average(valuationNavs)),
    percentile60: percentileOfValue(navs60, currentNav),
    percentile120: percentileOfValue(navs120, currentNav),
    percentileLookback: percentileOfValue(valuationNavs, currentNav),
    annualVol20: annualizedNavVolatility(navs20),
    annualVol60: annualizedNavVolatility(navs60),
    annualVol120: annualizedNavVolatility(navs120),
    currentDrawdown60: currentNav / Math.max(...navs60) - 1,
    maxDrawdown60: maxDrawdown(navs60),
    sampleDays: valuationNavs.length
  };
  statistics.zValue =
    statistics.valuationStd > 0 ? (currentNav - statistics.valuationMean) / statistics.valuationStd : 0;
  statistics.volRatio20To60 =
    statistics.annualVol60 > 0 ? statistics.annualVol20 / statistics.annualVol60 : 1;

  const inputs = {
    code: input.code,
    currentNav,
    officialNav,
    estimate,
    history,
    meta,
    profile,
    lookback,
    params,
    range,
    movingAverage,
    statistics,
    benchmark: benchmark
      ? {
          ...benchmark,
          override: benchmarkOverride,
          autoValuation: benchmarkAutoValuation,
          autoError: benchmarkAutoErrorRecord ? benchmarkAutoErrorRecord.message : ""
        }
      : null,
    allocation: {
      stockPct: history.assetAllocation.stockPct,
      bondPct: history.assetAllocation.bondPct,
      cashPct: history.assetAllocation.cashPct,
      stockPositionPct: history.stockPositionPct
    },
    returns: history.returns
  };

  const models = profile.key === "money" ? [buildMoneyModel(profile)] : buildModelsByProfile(inputs, movingAverageBands);
  const overall = buildOverallVerdict(profile, models, lookback, params);
  const confidence = buildConfidence(inputs, models, params);
  const position = buildPositionInsight(
    {
      currentNav,
      overallScore: overall.score
    },
    state.positions[input.code] || null,
    params
  );

  const sparklineValues = buildSparklineSeries(lookback.series, 180);
  const lastSparklineValue = sparklineValues[sparklineValues.length - 1];
  if (
    estimate &&
    Number.isFinite(currentNav) &&
    currentNav > 0 &&
    (!Number.isFinite(lastSparklineValue) || Math.abs(lastSparklineValue - currentNav) > 0.000001)
  ) {
    sparklineValues.push(currentNav);
  }

  return {
    code: input.code,
    name: meta.name || history.name || estimateNameFallback(estimate, input.code),
    currentNav,
    currentLabel: estimate ? "盘中估算净值" : "当前使用最新正式净值",
    officialNav,
    timeLabel:
      estimate && estimate.estimateTime
        ? "估算时间 " + estimate.estimateTime
        : "正式净值日 " + formatDateFromTimestamp(officialPoint.time),
    meta,
    profile,
    lookback,
    estimate: estimate
      ? {
          estimatedNav: currentNav,
          estimateGap: currentNav / officialNav - 1,
          estimateChangePct: estimate.estimateChangePct,
          estimateTime: estimate.estimateTime
        }
      : null,
    returns: history.returns,
    allocation: inputs.allocation,
    range,
    movingAverage,
    statistics,
    benchmark: inputs.benchmark,
    params,
    models,
    overall,
    confidence,
    position,
    sparkline: {
      values: sparklineValues,
      min: Math.min(...sparklineValues),
      max: Math.max(...sparklineValues)
    }
  };
}

function buildModelsByProfile(inputs, movingAverageBands) {
  const baseModels = [
    buildRangeModel(inputs),
    buildMovingAverageModel(inputs, movingAverageBands),
    buildZScoreModel(inputs),
    buildPercentileModel(inputs)
  ];

  if (inputs.profile.key === "bond") {
    return [...baseModels, buildBondMeanReversionModel(inputs), buildBondStabilityModel(inputs)];
  }

  if (inputs.profile.key === "index_equity" || inputs.profile.key === "qdii") {
    return [...baseModels, buildIndexValuationModel(inputs), buildHeatModel(inputs), buildVolatilityFilterModel(inputs)];
  }

  return [...baseModels, buildHeatModel(inputs), buildVolatilityFilterModel(inputs)];
}

function buildRangeModel(inputs) {
  const score = (1 - inputs.range.position) * 100;
  return createModel(
    "range",
    inputs.lookback.shortLabel + "区间模型",
    score,
    "看 " + inputs.lookback.label + " 净值落点",
    "当前净值落在" +
      inputs.lookback.label +
      "区间的 " +
      formatPercent(inputs.range.position) +
      " 位置，离高点 " +
      formatSignedPercent(inputs.range.drawdownFromHigh) +
      "。",
    [
      "区间位置 " + formatPercent(inputs.range.position),
      "高点 " + formatNav(inputs.range.high),
      "低点 " + formatNav(inputs.range.low)
    ],
    inputs.params
  );
}

function buildMovingAverageModel(inputs, bands) {
  const score =
    (0.4 * discountScore(inputs.movingAverage.ma20Gap, bands.ma20) +
      0.35 * discountScore(inputs.movingAverage.ma60Gap, bands.ma60) +
      0.25 * discountScore(inputs.movingAverage.ma120Gap, bands.ma120)) *
    100;

  return createModel(
    "moving_average",
    "均线偏离模型",
    score,
    "均线带宽已按当前参数缩放",
    "当前净值相对 20 日、60 日、120 日均线分别为 " +
      formatSignedPercent(inputs.movingAverage.ma20Gap) +
      "、" +
      formatSignedPercent(inputs.movingAverage.ma60Gap) +
      "、" +
      formatSignedPercent(inputs.movingAverage.ma120Gap) +
      "。",
    [
      "MA20 " + formatSignedPercent(inputs.movingAverage.ma20Gap),
      "MA60 " + formatSignedPercent(inputs.movingAverage.ma60Gap),
      "MA120 " + formatSignedPercent(inputs.movingAverage.ma120Gap)
    ],
    inputs.params
  );
}

function buildZScoreModel(inputs) {
  const baseZBand = defaultNumber(inputs.profile.settings.zBand, 1.8);
  const zBand = baseZBand * inputs.params.zMultiplier;
  const score = clamp((zBand - inputs.statistics.zValue) / (zBand * 2), 0, 1) * 100;

  return createModel(
    "z_score",
    inputs.lookback.shortLabel + " Z-Score 模型",
    score,
    "Z 阈值已乘上当前参数系数",
    "当前净值相对" +
      inputs.lookback.label +
      "均值的偏离为 " +
      formatSignedSigma(inputs.statistics.zValue) +
      "，均值 " +
      formatNav(inputs.statistics.valuationMean) +
      "。",
    [
      "Z 值 " + formatSignedSigma(inputs.statistics.zValue),
      "均值 " + formatNav(inputs.statistics.valuationMean),
      "标准差 " + formatNav(inputs.statistics.valuationStd)
    ],
    inputs.params
  );
}

function buildPercentileModel(inputs) {
  const score =
    (1 -
      (0.3 * inputs.statistics.percentile60 +
        0.3 * inputs.statistics.percentile120 +
        0.4 * inputs.statistics.percentileLookback)) *
    100;

  return createModel(
    "percentile",
    "多周期分位模型",
    score,
    "看 60 日 / 120 日 / 所选窗口分位",
    "当前净值在最近 60 日、120 日和" +
      inputs.lookback.label +
      "中的分位分别是 " +
      formatPercent(inputs.statistics.percentile60) +
      "、" +
      formatPercent(inputs.statistics.percentile120) +
      "、" +
      formatPercent(inputs.statistics.percentileLookback) +
      "。",
    [
      "60 日 " + formatPercent(inputs.statistics.percentile60),
      "120 日 " + formatPercent(inputs.statistics.percentile120),
      inputs.lookback.shortLabel + " " + formatPercent(inputs.statistics.percentileLookback)
    ],
    inputs.params
  );
}

function buildIndexValuationModel(inputs) {
  if (!inputs.benchmark) {
    return createUnavailableModel(
      "index_real_valuation",
      "指数真实估值层",
      "不适用",
      "主动权益和债基不会强行映射指数",
      "当前基金类型不启用这层模型。",
      [inputs.profile.familyLabel]
    );
  }

  const override = inputs.benchmark.override;
  const autoValuation = inputs.benchmark.autoValuation;
  if ((!override || !countOverrideMetrics(override)) && autoValuation) {
    const score = weightedAverage(
      [
        Number.isFinite(autoValuation.peScore) ? { weight: 0.42, value: autoValuation.peScore } : null,
        Number.isFinite(autoValuation.pbScore) ? { weight: 0.36, value: autoValuation.pbScore } : null,
        Number.isFinite(autoValuation.dividendScore) ? { weight: 0.22, value: autoValuation.dividendScore } : null
      ].filter(Boolean),
      50
    );

    return createModel(
      "index_real_valuation",
      "指数真实估值层",
      score,
      "官方 factsheet 自动补充",
      "当前映射指数为 " +
        inputs.benchmark.label +
        "。这层用了官方 factsheet 的最新 PE / PB / 股息率，再按本地带宽口径换成自动估值分。",
      [
        "PE " + formatMetricNumber(autoValuation.pe),
        "PB " + formatMetricNumber(autoValuation.pb),
        "股息率 " + formatMetricPercent(autoValuation.dividendYield),
        autoValuation.asOfLabel ? "口径日 " + autoValuation.asOfLabel : "",
        "来源 官方 factsheet"
      ].filter(Boolean),
      inputs.params
    );
  }

  if (!override || !countOverrideMetrics(override)) {
    return createPendingModel(
      "index_real_valuation",
      "指数真实估值层",
      "待录入",
      inputs.benchmark.supportsAutomaticValuation ? "正在尝试自动补充；也可手动覆盖" : "需要补充指数 PE / PB / 股息率分位",
      "当前已映射到 " +
        inputs.benchmark.label +
        "，但还没有拿到可用的指数估值数据，所以综合分暂时只能靠净值位置和波动模型。",
      [
        inputs.benchmark.label,
        inputs.benchmark.autoMapped ? "自动映射" : "手动确认后录入",
        inputs.benchmark.autoError ? "自动抓取失败" : "",
        inputs.benchmark.supportsAutomaticValuation ? "支持官方 factsheet 自动补充" : ""
      ].filter(Boolean)
    );
  }

  const items = [];
  if (Number.isFinite(override.overallPercentile)) {
    items.push({
      weight: 0.28,
      value: 100 - override.overallPercentile,
      fact: "整体分位 " + formatRawPercentile(override.overallPercentile)
    });
  }
  if (Number.isFinite(override.pePercentile)) {
    items.push({
      weight: 0.24,
      value: 100 - override.pePercentile,
      fact: "PE 分位 " + formatRawPercentile(override.pePercentile)
    });
  }
  if (Number.isFinite(override.pbPercentile)) {
    items.push({
      weight: 0.22,
      value: 100 - override.pbPercentile,
      fact: "PB 分位 " + formatRawPercentile(override.pbPercentile)
    });
  }
  if (Number.isFinite(override.dividendPercentile)) {
    items.push({
      weight: 0.14,
      value: override.dividendPercentile,
      fact: "股息率分位 " + formatRawPercentile(override.dividendPercentile)
    });
  }
  if (Number.isFinite(override.erpPercentile)) {
    items.push({
      weight: 0.12,
      value: override.erpPercentile,
      fact: "ERP 分位 " + formatRawPercentile(override.erpPercentile)
    });
  }

  const score = weightedAverage(items, 50);
  return createModel(
    "index_real_valuation",
    "指数真实估值层",
    score,
    "按底层指数估值分位反向打分",
    "当前映射指数为 " +
      inputs.benchmark.label +
      "。低估值分位会给高分，股息率和 ERP 分位则直接视为越高越便宜。",
    [...items.map((item) => item.fact), override.sourceNote ? "备注 " + override.sourceNote : ""].filter(Boolean),
    inputs.params
  );
}

function buildHeatModel(inputs) {
  const baseBands = inputs.profile.settings.heatBands;
  const multiplier = inputs.params.heatSensitivity > 0 ? 1 / inputs.params.heatSensitivity : 1;
  const bands = {
    oneMonth: baseBands.oneMonth * multiplier,
    threeMonth: baseBands.threeMonth * multiplier,
    sixMonth: baseBands.sixMonth * multiplier,
    oneYear: baseBands.oneYear * multiplier
  };
  const returnValues = [
    { value: inputs.returns.oneMonth, band: bands.oneMonth, weight: 0.2, label: "1 月" },
    { value: inputs.returns.threeMonth, band: bands.threeMonth, weight: 0.25, label: "3 月" },
    { value: inputs.returns.sixMonth, band: bands.sixMonth, weight: 0.25, label: "6 月" },
    { value: inputs.returns.oneYear, band: bands.oneYear, weight: 0.3, label: "1 年" }
  ];

  const score = weightedAverage(
    returnValues
      .filter((item) => item.value != null)
      .map((item) => {
        return {
          weight: item.weight,
          value: discountScore(item.value / 100, item.band / 100) * 100
        };
      }),
    50
  );

  return createModel(
    "heat",
    "热度 / 拥挤度模型",
    score,
    "热度敏感度越高，扣分越快",
    "近 1 月、3 月、6 月、1 年收益率越高，说明它越可能处在拥挤区。这个模型会把过热回报视为估值扣分。",
    returnValues
      .filter((item) => item.value != null)
      .map((item) => item.label + " " + formatPlainPercent(item.value)),
    inputs.params
  );
}

function buildVolatilityFilterModel(inputs) {
  const baseConfig = inputs.profile.settings.volatility;
  const multiplier = inputs.params.volatilitySensitivity > 0 ? 1 / inputs.params.volatilitySensitivity : 1;
  const config = {
    drawdownBand: baseConfig.drawdownBand * multiplier,
    volRatioCap: baseConfig.volRatioCap * multiplier,
    dayShockBand: baseConfig.dayShockBand * multiplier
  };

  const drawdownScore = clamp((-inputs.statistics.currentDrawdown60) / config.drawdownBand, 0, 1) * 100;
  const volRatioScore = clamp((config.volRatioCap - inputs.statistics.volRatio20To60) / config.volRatioCap, 0, 1) * 100;
  const shockScore =
    inputs.estimate && Number.isFinite(inputs.estimate.estimateChangePct)
      ? clamp((config.dayShockBand - Math.abs(inputs.estimate.estimateChangePct)) / config.dayShockBand, 0, 1) * 100
      : 50;
  const exposureBase =
    inputs.allocation.stockPositionPct != null ? inputs.allocation.stockPositionPct : inputs.allocation.stockPct;
  const exposureScore = exposureBase != null ? clamp(exposureBase / 95, 0, 1) * 100 : 50;
  const score = 0.4 * drawdownScore + 0.3 * volRatioScore + 0.15 * shockScore + 0.15 * exposureScore;

  return createModel(
    "volatility_filter",
    "波动过滤模型",
    score,
    "波动敏感度越高，过滤越严",
    "这个模型会把 60 日回撤、短中期波动比和单日估算冲击放在一起看。位置低，但波动还在急剧放大时，分数不会给太高。",
    [
      "60 日回撤 " + formatSignedPercent(inputs.statistics.currentDrawdown60),
      "20 日波动 " + formatPercent(inputs.statistics.annualVol20),
      "波动比 " + formatRatio(inputs.statistics.volRatio20To60)
    ],
    inputs.params
  );
}

function buildBondMeanReversionModel(inputs) {
  const score =
    (0.45 * discountScore(inputs.movingAverage.ma20Gap, 0.012 * inputs.params.maMultiplier) +
      0.35 * discountScore(inputs.movingAverage.ma60Gap, 0.022 * inputs.params.maMultiplier) +
      0.2 * discountScore(inputs.movingAverage.ma120Gap, 0.035 * inputs.params.maMultiplier)) *
    100;

  return createModel(
    "bond_mean_reversion",
    "债基窄带回归模型",
    score,
    "债基带宽也会跟参数同步调整",
    "债基的净值波动比权益基金小得多，所以这个模型会用更窄的均线带宽，专门识别是否已经偏离到值得观察的位置。",
    [
      "MA20 " + formatSignedPercent(inputs.movingAverage.ma20Gap),
      "MA60 " + formatSignedPercent(inputs.movingAverage.ma60Gap),
      "MA120 " + formatSignedPercent(inputs.movingAverage.ma120Gap)
    ],
    inputs.params
  );
}

function buildBondStabilityModel(inputs) {
  const purityScore =
    inputs.allocation.bondPct != null
      ? clamp((inputs.allocation.bondPct - defaultNumber(inputs.allocation.stockPct, 0) + 20) / 120, 0, 1) * 100
      : 50;
  const stabilityCap = 0.05 / Math.max(inputs.params.volatilitySensitivity, 0.5);
  const drawdownCap = 0.035 / Math.max(inputs.params.volatilitySensitivity, 0.5);
  const stabilityScore = clamp((stabilityCap - inputs.statistics.annualVol20) / stabilityCap, 0, 1) * 100;
  const discountScoreValue = clamp((-inputs.statistics.currentDrawdown60) / drawdownCap, 0, 1) * 100;
  const score = 0.4 * stabilityScore + 0.35 * discountScoreValue + 0.25 * purityScore;

  return createModel(
    "bond_stability",
    "债基稳态过滤模型",
    score,
    "看波动、回撤和债券纯度",
    "债基就算处在低位，也要先确认它不是信用或权益暴露导致的异常波动。这个模型会用波动和仓位纯度做一道过滤。",
    [
      "20 日波动 " + formatPercent(inputs.statistics.annualVol20),
      "债券占比 " + formatPlainPctValue(inputs.allocation.bondPct),
      "股票占比 " + formatPlainPctValue(inputs.allocation.stockPct)
    ],
    inputs.params
  );
}

function buildMoneyModel(profile) {
  return {
    id: "money_notice",
    title: "货币基金说明",
    score: NaN,
    displayScore: "N/A",
    label: "不适用",
    toneClass: "tone-info",
    sideNote: "货币基金不做净值位置估值",
    summary: "货币基金的净值通常围绕 1 附近缓慢变化，这页的低位 / 高位模型不适合拿来判断它。",
    facts: ["更该看 7 日年化", "更该看申赎规则", profile.familyLabel]
  };
}

function buildOverallVerdict(profile, models, lookback, params) {
  if (profile.key === "money") {
    return {
      score: 50,
      label: "不适用",
      toneClass: "tone-info",
      summary: profile.familySummary,
      bannerText: "货币基金不做买低卖高式估值，这页只保留说明信息。"
    };
  }

  const weightedItems = models
    .filter((model) => Number.isFinite(model.score))
    .map((model) => {
      return {
        weight: defaultNumber(profile.settings.overallWeights[model.id], 0),
        value: model.score
      };
    })
    .filter((item) => item.weight > 0);

  const score = weightedAverage(weightedItems, 50);
  const verdict = classifyScore(score, params);
  const lowVotes = models.filter((model) => Number.isFinite(model.score) && model.score >= params.lowThreshold).length;
  const highVotes = models.filter((model) => Number.isFinite(model.score) && model.score <= params.highThreshold).length;
  const validModels = models.filter((model) => Number.isFinite(model.score)).length;

  let consensus = "";
  if (validModels && lowVotes >= Math.ceil(validModels * 0.6)) {
    consensus = "多数模型都认为当前位置偏低，说明它相对自己的历史和当前热度都不算贵。";
  } else if (validModels && highVotes >= Math.ceil(validModels * 0.6)) {
    consensus = "多数模型都认为当前位置偏高，说明它不只是站在高位，热度和波动层面也没有给你太多安全边际。";
  } else {
    consensus = "模型分歧比较明显，说明它并不是那种一眼看上去就很便宜或很贵的位置。";
  }

  return {
    score,
    label: verdict.label,
    toneClass: verdict.toneClass,
    summary: profile.familySummary + " " + consensus,
    bannerText:
      profile.familyLabel +
      " 框架 · 综合分 " +
      formatScore(score) +
      " · 窗口 " +
      lookback.label +
      " · 低位票数 " +
      lowVotes +
      " / " +
      validModels +
      "。"
  };
}

function buildConfidence(inputs, models) {
  if (inputs.profile.key === "money") {
    return {
      score: 30,
      label: "低",
      toneClass: "tone-info",
      summary: "货币基金不使用这套估值，因此可信度评分只保留说明用途。",
      reasons: ["货币基金不适用净值位置估值"]
    };
  }

  let score = defaultNumber(inputs.profile.settings.confidenceBase, 60);
  const reasons = [];

  if (inputs.statistics.sampleDays >= 1200) {
    score += 8;
    reasons.push("可用样本接近 5 年或以上");
  } else if (inputs.statistics.sampleDays >= 720) {
    score += 5;
    reasons.push("可用样本超过 3 年");
  } else if (inputs.statistics.sampleDays < 180) {
    score -= 12;
    reasons.push("可用样本偏短");
  }

  if (inputs.lookback.notice) {
    score -= 6;
    reasons.push("当前窗口样本不足，已退回全部可得历史");
  }

  if (inputs.estimate) {
    score += 4;
    reasons.push("有盘中估算数据");
  } else {
    reasons.push("当前只拿到正式净值");
  }

  if (inputs.meta.company) {
    score += 2;
  }
  if (inputs.meta.manager) {
    score += 2;
  }
  if (!inputs.meta.company || !inputs.meta.manager) {
    reasons.push("部分元信息未完整返回");
  }

  const availableModels = models.filter((model) => Number.isFinite(model.score)).length;
  if (availableModels < models.length) {
    score -= (models.length - availableModels) * 4;
    reasons.push("部分模型未参与加权");
  }

  if (inputs.profile.key === "index_equity" || inputs.profile.key === "qdii") {
    if (inputs.benchmark && inputs.benchmark.override && countOverrideMetrics(inputs.benchmark.override)) {
      score += 10;
      reasons.push("已补充指数估值分位");
    } else if (inputs.benchmark && inputs.benchmark.autoValuation) {
      score += 6;
      reasons.push("已自动补充官方指数估值");
    } else {
      score -= 12;
      reasons.push("指数真实估值层仍为空");
    }
  }

  if (inputs.profile.key === "active_equity") {
    score -= 4;
    reasons.push("主动基金更接近风格代理，不是底层资产直接估值");
  }

  const finalScore = clamp(score, 20, 95);
  const label = finalScore >= 80 ? "高" : finalScore >= 60 ? "中" : "低";
  const toneClass = finalScore >= 80 ? "tone-good" : finalScore >= 60 ? "tone-info" : "tone-loading";

  return {
    score: finalScore,
    label,
    toneClass,
    summary:
      label === "高"
        ? "当前结果的数据长度和模型完备度都比较好，可以作为较稳妥的研究参考。"
        : label === "中"
          ? "当前结果可用，但仍然有一层明显的不确定性，最好配合自己的仓位纪律一起看。"
          : "当前结果更适合当筛查提示，不适合把它当成强结论。",
    reasons
  };
}

function createModel(id, title, score, sideNote, summary, facts, params) {
  const verdict = classifyScore(score, params);
  return {
    id,
    title,
    score,
    displayScore: formatScore(score),
    label: verdict.label,
    toneClass: verdict.toneClass,
    sideNote,
    summary,
    facts,
    lookback: null
  };
}

function createPendingModel(id, title, label, sideNote, summary, facts) {
  return {
    id,
    title,
    score: NaN,
    displayScore: "待录入",
    label,
    toneClass: "tone-info",
    sideNote,
    summary,
    facts
  };
}

function createUnavailableModel(id, title, label, sideNote, summary, facts) {
  return {
    id,
    title,
    score: NaN,
    displayScore: "N/A",
    label,
    toneClass: "tone-info",
    sideNote,
    summary,
    facts
  };
}

function resolveFundProfile(meta, history) {
  const typeText = String(meta.ftype || "");
  const name = String(meta.name || history.name || "");
  const stockPct = defaultNumber(history.assetAllocation.stockPct, 0);
  const bondPct = defaultNumber(history.assetAllocation.bondPct, 0);

  let key = "active_equity";
  if (typeText.includes("货币")) {
    key = "money";
  } else if (typeText.includes("QDII") || typeText.includes("海外")) {
    key = "qdii";
  } else if (typeText.includes("债") || (bondPct >= 45 && stockPct <= 25)) {
    key = "bond";
  } else if (typeText.includes("指数") || /ETF|LOF|联接|指数/.test(name)) {
    key = "index_equity";
  } else if (typeText.includes("股票") || typeText.includes("混合") || stockPct >= 50) {
    key = "active_equity";
  }

  const settings = PROFILE_SETTINGS[key];
  return {
    key,
    settings,
    familyLabel: settings.familyLabel,
    familySummary: settings.familySummary,
    rawType: typeText || settings.rawTypeFallback,
    frameworkHint:
      key === "bond"
        ? "位置 + 债基稳态过滤"
        : key === "money"
          ? "说明模式"
          : key === "active_equity"
            ? "位置 + 热度 + 波动过滤"
            : "位置 + 指数估值 + 热度 + 波动过滤"
  };
}

function resolveBenchmark(meta, history, profile, code) {
  if (profile.key !== "index_equity" && profile.key !== "qdii") {
    return null;
  }

  const text = [meta.name, meta.shortName, history.name, ...(meta.themes || [])].join(" ").toLowerCase();
  const match = BENCHMARK_HINTS.find((item) => item.keywords.some((keyword) => text.includes(keyword.toLowerCase())));

  if (match) {
    return {
      key: match.key,
      label: match.label,
      family: match.family,
      autoMapped: true,
      storageKey: "benchmark:" + match.key,
      factsheetCode: match.factsheetCode || "",
      autoBands: match.autoBands || null,
      supportsAutomaticValuation: Boolean(match.factsheetCode && match.autoBands)
    };
  }

  return {
    key: "fund:" + code,
    label: profile.key === "qdii" ? "待确认海外指数" : "待确认跟踪指数",
    family: profile.key === "qdii" ? "海外 / 跨境指数" : "指数待确认",
    autoMapped: false,
    storageKey: "fund:" + code,
    factsheetCode: "",
    autoBands: null,
    supportsAutomaticValuation: false
  };
}

function hasManualBenchmarkOverride(benchmark) {
  return Boolean(benchmark && benchmark.override && countOverrideMetrics(benchmark.override));
}

function getAutomaticBenchmarkValuation(storageKey) {
  const cached = storageKey ? state.benchmarkAutoCache[storageKey] : null;
  if (!cached || !cached.fetchedAt) {
    return null;
  }
  const age = Date.now() - new Date(cached.fetchedAt).getTime();
  if (Number.isFinite(age) && age <= AUTO_BENCHMARK_CACHE_TTL_MS) {
    return cached;
  }
  return cached;
}

async function ensureAutomaticBenchmarkValuation(benchmark) {
  if (!benchmark || !benchmark.supportsAutomaticValuation || hasManualBenchmarkOverride(benchmark)) {
    return;
  }

  const errorRecord = state.benchmarkAutoErrors[benchmark.storageKey];
  if (
    errorRecord &&
    errorRecord.failedAt &&
    Date.now() - new Date(errorRecord.failedAt).getTime() <= AUTO_BENCHMARK_CACHE_TTL_MS
  ) {
    return;
  }

  const cached = getAutomaticBenchmarkValuation(benchmark.storageKey);
  const freshEnough =
    cached && cached.fetchedAt && Date.now() - new Date(cached.fetchedAt).getTime() <= AUTO_BENCHMARK_CACHE_TTL_MS;
  if (freshEnough || state.benchmarkAutoPending[benchmark.storageKey]) {
    return;
  }

  state.benchmarkAutoPending[benchmark.storageKey] = true;

  try {
    const autoValuation = await fetchOfficialBenchmarkAutoValuation(benchmark);
    state.benchmarkAutoCache[benchmark.storageKey] = autoValuation;
    delete state.benchmarkAutoErrors[benchmark.storageKey];
    rebuildSnapshotsFromCache({ recordSignals: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : "官方指数估值抓取失败";
    state.benchmarkAutoErrors[benchmark.storageKey] = {
      message,
      failedAt: new Date().toISOString()
    };
    if (
      state.currentSnapshot &&
      state.currentSnapshot.benchmark &&
      state.currentSnapshot.benchmark.storageKey === benchmark.storageKey
    ) {
      state.currentSnapshot.benchmark.autoError = message;
      renderBenchmarkPane();
      renderConfidencePane();
    }
  } finally {
    delete state.benchmarkAutoPending[benchmark.storageKey];
  }
}

async function fetchOfficialBenchmarkAutoValuation(benchmark) {
  if (!benchmark.factsheetCode || !benchmark.autoBands) {
    throw new Error("当前指数暂不支持自动估值。");
  }

  await ensurePdfJsLib();
  const url = buildCsindexFactsheetUrl(benchmark.factsheetCode);
  const text = await extractPdfText(url);
  const metrics = parseCsindexFactsheetMetrics(text);

  if (!Number.isFinite(metrics.pe) && !Number.isFinite(metrics.pb) && !Number.isFinite(metrics.dividendYield)) {
    throw new Error("官方 factsheet 中没有解析到可用估值指标。");
  }

  return {
    source: "official_factsheet_auto",
    sourceLabel: "官方 factsheet 自动补充",
    url,
    fetchedAt: new Date().toISOString(),
    asOfLabel: metrics.asOfLabel || "",
    pe: metrics.pe,
    pb: metrics.pb,
    dividendYield: metrics.dividendYield,
    peScore: Number.isFinite(metrics.pe) ? scoreLowerBetterMetric(metrics.pe, benchmark.autoBands.pe[0], benchmark.autoBands.pe[1]) : NaN,
    pbScore: Number.isFinite(metrics.pb) ? scoreLowerBetterMetric(metrics.pb, benchmark.autoBands.pb[0], benchmark.autoBands.pb[1]) : NaN,
    dividendScore: Number.isFinite(metrics.dividendYield)
      ? scoreHigherBetterMetric(metrics.dividendYield, benchmark.autoBands.dividendYield[0], benchmark.autoBands.dividendYield[1])
      : NaN
  };
}

function buildCsindexFactsheetUrl(indexCode) {
  return (
    "https://oss-ch.csindex.com.cn/static/html/csindex/public/uploads/indices/detail/files/zh_CN/" +
    indexCode +
    "factsheet.pdf"
  );
}

async function ensurePdfJsLib() {
  if (window.pdfjsLib) {
    return;
  }

  await loadRemoteScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js", 12000);
  if (!window.pdfjsLib) {
    throw new Error("PDF 解析组件加载失败。");
  }
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

async function extractPdfText(url) {
  const loadingTask = window.pdfjsLib.getDocument({
    url,
    withCredentials: false
  });
  const pdf = await loadingTask.promise;
  const pageCount = Math.min(pdf.numPages, 2);
  const texts = [];

  for (let pageIndex = 1; pageIndex <= pageCount; pageIndex += 1) {
    const page = await pdf.getPage(pageIndex);
    const content = await page.getTextContent();
    texts.push(buildOrderedPdfText(content.items));
  }

  return texts.join("\n").replace(/[ \t]+/g, " ");
}

function parseCsindexFactsheetMetrics(text) {
  const normalized = String(text || "").replace(/\s+/g, " ");
  return {
    asOfLabel: extractDateLabel(normalized),
    pe: extractNumberByPatterns(normalized, [
      /(?:滚动|静态|市盈率\(TTM\)|PE|P\/E)?市盈率\s*([0-9]+(?:\.[0-9]+)?)/i,
      /P\/E\s*([0-9]+(?:\.[0-9]+)?)/i
    ]),
    pb: extractNumberByPatterns(normalized, [
      /市净率\s*([0-9]+(?:\.[0-9]+)?)/i,
      /([0-9]+(?:\.[0-9]+)?)\s*市净率/i,
      /P\/B\s*([0-9]+(?:\.[0-9]+)?)/i
    ]),
    dividendYield: extractNumberByPatterns(normalized, [
      /股息率\s*([0-9]+(?:\.[0-9]+)?)\s*%/i,
      /([0-9]+(?:\.[0-9]+)?)\s*%\s*股息率/i,
      /Dividend Yield\s*([0-9]+(?:\.[0-9]+)?)\s*%/i
    ])
  };
}

function buildOrderedPdfText(items) {
  const normalizedItems = (items || [])
    .map((item) => {
      return {
        text: String(item.str || "").trim(),
        x: Array.isArray(item.transform) ? defaultNumber(item.transform[4], 0) : 0,
        y: Array.isArray(item.transform) ? defaultNumber(item.transform[5], 0) : 0
      };
    })
    .filter((item) => item.text);

  normalizedItems.sort((left, right) => {
    if (Math.abs(left.y - right.y) > 2) {
      return right.y - left.y;
    }
    return left.x - right.x;
  });

  const lines = [];
  normalizedItems.forEach((item) => {
    const line = lines.find((entry) => Math.abs(entry.y - item.y) <= 2);
    if (line) {
      line.items.push(item);
      line.y = average([line.y, item.y]);
      return;
    }
    lines.push({ y: item.y, items: [item] });
  });

  return lines
    .map((line) => line.items.sort((left, right) => left.x - right.x).map((item) => item.text).join(" "))
    .join("\n");
}

function extractDateLabel(text) {
  const match = String(text || "").match(/(20\d{2}[年\-/.]\d{1,2}[月\-/.]\d{1,2}日?)/);
  return match ? match[1] : "";
}

function extractNumberByPatterns(text, patterns) {
  for (const pattern of patterns) {
    const match = String(text || "").match(pattern);
    if (match && match[1]) {
      const value = Number(match[1]);
      if (Number.isFinite(value)) {
        return value;
      }
    }
  }
  return NaN;
}

function scoreLowerBetterMetric(value, cheap, expensive) {
  if (!Number.isFinite(value)) {
    return NaN;
  }
  if (value <= cheap) {
    return 100;
  }
  if (value >= expensive) {
    return 0;
  }
  return (1 - (value - cheap) / (expensive - cheap)) * 100;
}

function scoreHigherBetterMetric(value, low, high) {
  if (!Number.isFinite(value)) {
    return NaN;
  }
  if (value <= low) {
    return 0;
  }
  if (value >= high) {
    return 100;
  }
  return ((value - low) / (high - low)) * 100;
}

function buildPositionInsight(inputsOrSnapshot, position, params) {
  const currentNav = inputsOrSnapshot ? inputsOrSnapshot.currentNav : NaN;
  const overallScore = inputsOrSnapshot && Number.isFinite(inputsOrSnapshot.overallScore)
    ? inputsOrSnapshot.overallScore
    : inputsOrSnapshot && inputsOrSnapshot.overall
      ? inputsOrSnapshot.overall.score
      : 50;
  if (!position || !Number.isFinite(position.cost) || !Number.isFinite(position.shares) || !Number.isFinite(currentNav)) {
    return null;
  }

  const marketValue = currentNav * position.shares;
  const costValue = position.cost * position.shares;
  const pnlValue = marketValue - costValue;
  const pnlPct = costValue > 0 ? marketValue / costValue - 1 : 0;
  const targetGapPct =
    Number.isFinite(position.targetValue) && position.targetValue > 0 ? marketValue / position.targetValue - 1 : null;

  let message = "当前仓位和估值都处在中性区域，继续观察节奏更合理。";
  if (overallScore >= params.lowThreshold && targetGapPct != null && targetGapPct < -0.08) {
    message = "当前估值偏低，而且市值仍低于你的目标仓位，可以考虑继续分批补到目标附近。";
  } else if (overallScore >= params.lowThreshold) {
    message = "当前估值偏低，但目标仓位信息不足或你已经接近目标仓位，更像是继续观察中的低位。";
  } else if (overallScore <= params.highThreshold && pnlPct > 0.12) {
    message = "当前估值已经不便宜，而且你已有一定浮盈。如果你本来就按纪律做仓位控制，可以考虑往目标仓位回收。";
  } else if (overallScore <= params.highThreshold) {
    message = "当前估值偏高，继续追高的性价比一般，更适合等它回落或等待别的机会。";
  }

  return {
    marketValue,
    costValue,
    pnlValue,
    pnlPct,
    targetGapPct,
    message
  };
}

async function fetchFundMetaData(code) {
  const payload = await loadJsonp(
    "https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=1&key=" + encodeURIComponent(code),
    "callback",
    9000
  );

  const results = Array.isArray(payload && payload.Datas) ? payload.Datas : [];
  const match =
    results.find((item) => item && item.CODE === code && item.FundBaseInfo) ||
    results.find((item) => item && item.FundBaseInfo);

  if (!match || !match.FundBaseInfo) {
    throw new Error("基金元信息接口没有返回有效类型。");
  }

  return {
    code,
    name: String(match.NAME || match.FundBaseInfo.SHORTNAME || ""),
    ftype: String(match.FundBaseInfo.FTYPE || ""),
    shortName: String(match.FundBaseInfo.SHORTNAME || ""),
    company: String(match.FundBaseInfo.JJGS || ""),
    manager: String(match.FundBaseInfo.JJJL || ""),
    isBuy: parseOptionalBoolean(match.FundBaseInfo.ISBUY),
    themes: Array.isArray(match.ZTJJInfo)
      ? match.ZTJJInfo.map((item) => String(item.TTYPENAME || "")).filter(Boolean).slice(0, 4)
      : []
  };
}

async function fetchEstimateData(code) {
  const payload = await loadJsonp(
    "https://fund.eastmoney.com/data/funddataforgznew.aspx?fc=" + encodeURIComponent(code) + "&t=basewap",
    "cb",
    9000
  );

  if (!payload || !payload.fundcode) {
    throw new Error("估算接口没有返回有效数据。");
  }

  return {
    code: String(payload.fundcode || code),
    name: String(payload.name || ""),
    officialDate: String(payload.jzrq || ""),
    officialNav: toNumber(payload.dwjz),
    estimatedNav: toNumber(payload.gsz),
    estimateChangePct: toNumber(payload.gszzl),
    estimateTime: String(payload.gztime || "")
  };
}

function fetchHistoricalData(code) {
  historicalFetchChain = historicalFetchChain.catch(() => undefined).then(async () => {
    clearHistoricalGlobals();
    await loadRemoteScript("https://fund.eastmoney.com/pingzhongdata/" + code + ".js?v=" + buildVersionStamp(), 12000);

    const rawSeries = Array.isArray(window.Data_netWorthTrend) ? window.Data_netWorthTrend : [];
    const series = rawSeries
      .map((point) => {
        return {
          time: Number(point.x),
          nav: toNumber(point.y)
        };
      })
      .filter((point) => Number.isFinite(point.time) && Number.isFinite(point.nav))
      .sort((left, right) => left.time - right.time);

    if (!series.length) {
      throw new Error("历史净值为空，可能是基金代码无效。");
    }

    return {
      code: String(window.fS_code || code),
      name: String(window.fS_name || ""),
      series,
      assetAllocation: parseAssetAllocation(window.Data_assetAllocation),
      stockPositionPct: parseStockPosition(window.Data_fundSharesPositions),
      returns: {
        oneMonth: parseOptionalNumber(window.syl_1y),
        threeMonth: parseOptionalNumber(window.syl_3y),
        sixMonth: parseOptionalNumber(window.syl_6y),
        oneYear: parseOptionalNumber(window.syl_1n)
      }
    };
  });

  return historicalFetchChain;
}

function parseAssetAllocation(raw) {
  const result = {
    stockPct: null,
    bondPct: null,
    cashPct: null
  };

  if (!raw || !Array.isArray(raw.series)) {
    return result;
  }

  raw.series.forEach((series) => {
    const latest = Array.isArray(series.data) ? toNumber(series.data[series.data.length - 1]) : NaN;
    if (!Number.isFinite(latest)) {
      return;
    }

    const name = String(series.name || "");
    if (name.includes("股票占净比")) {
      result.stockPct = latest;
    } else if (name.includes("债券占净比")) {
      result.bondPct = latest;
    } else if (name.includes("现金占净比")) {
      result.cashPct = latest;
    }
  });

  return result;
}

function parseStockPosition(raw) {
  if (!Array.isArray(raw) || !raw.length) {
    return null;
  }

  const last = raw[raw.length - 1];
  if (!Array.isArray(last) || last.length < 2) {
    return null;
  }

  const value = toNumber(last[1]);
  return Number.isFinite(value) ? value : null;
}

function loadJsonp(url, callbackParamName, timeoutMs) {
  return new Promise((resolve, reject) => {
    const callbackName = "__fundValuationJsonp_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
    const script = document.createElement("script");
    let finished = false;

    function cleanup() {
      script.remove();
      window.clearTimeout(timer);
      try {
        delete window[callbackName];
      } catch (error) {
        window[callbackName] = undefined;
      }
    }

    const timer = window.setTimeout(() => {
      if (finished) {
        return;
      }
      finished = true;
      cleanup();
      reject(new Error("远端接口响应超时。"));
    }, timeoutMs);

    window[callbackName] = (payload) => {
      if (finished) {
        return;
      }
      finished = true;
      cleanup();
      resolve(payload);
    };

    script.async = true;
    script.referrerPolicy = "no-referrer";
    script.src = url + "&" + callbackParamName + "=" + callbackName + "&_=" + Date.now();
    script.onerror = () => {
      if (finished) {
        return;
      }
      finished = true;
      cleanup();
      reject(new Error("远端接口加载失败。"));
    };

    document.head.appendChild(script);
  });
}

function loadRemoteScript(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    let finished = false;

    function cleanup() {
      script.remove();
      window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      if (finished) {
        return;
      }
      finished = true;
      cleanup();
      reject(new Error("历史净值接口响应超时。"));
    }, timeoutMs);

    script.async = true;
    script.referrerPolicy = "no-referrer";
    script.src = url;
    script.onload = () => {
      if (finished) {
        return;
      }
      finished = true;
      cleanup();
      resolve();
    };
    script.onerror = () => {
      if (finished) {
        return;
      }
      finished = true;
      cleanup();
      reject(new Error("历史净值接口加载失败。"));
    };

    document.head.appendChild(script);
  });
}

function clearHistoricalGlobals() {
  HISTORY_GLOBAL_KEYS.forEach((key) => {
    try {
      delete window[key];
    } catch (error) {
      window[key] = undefined;
    }
  });
}

function renderQuickCodes() {
  const unique = [];
  [...state.recentCodes.map((code) => ({ code, label: code })), ...DEFAULT_CODES].forEach((item) => {
    if (!unique.find((entry) => entry.code === item.code)) {
      unique.push(item);
    }
  });

  refs.quickCodes.innerHTML = unique
    .slice(0, 6)
    .map((item) => {
      return (
        '<button type="button" data-code="' +
        escapeHtml(item.code) +
        '">' +
        escapeHtml(item.label) +
        "</button>"
      );
    })
    .join("");
}

function rememberCode(code) {
  const next = [code, ...state.recentCodes.filter((item) => item !== code)].slice(0, 6);
  state.recentCodes = next;
  persistValue(STORAGE_KEYS.recentCodes, next);
}

function loadRecentCodes() {
  return loadStringArray(STORAGE_KEYS.recentCodes);
}

function loadLookbackKey() {
  const stored = loadStoredValue(STORAGE_KEYS.lookback);
  return normalizeLookbackKey(stored);
}

function loadActiveSector() {
  const stored = String(loadStoredValue(STORAGE_KEYS.activeSector) || "").trim();
  return ["sector-live", "sector-research", "sector-discipline", "sector-valuation"].includes(stored)
    ? stored
    : "sector-live";
}

function loadAutoRefreshEnabled() {
  const stored = loadStoredValue(STORAGE_KEYS.autoRefreshEnabled);
  if (stored == null) {
    return true;
  }
  return String(stored) !== "false";
}

function normalizeLookbackKey(value) {
  const key = String(value || "").trim();
  return LOOKBACK_OPTIONS[key] ? key : "3y";
}

function setActiveSector(sectorId) {
  const target = refs.pageSectors.find((item) => item.id === sectorId) ? sectorId : "sector-live";
  state.activeSector = target;
  persistValue(STORAGE_KEYS.activeSector, target);

  refs.pageSectors.forEach((section) => {
    section.classList.toggle("is-active", section.id === target);
  });

  refs.sectorLinks.forEach((button) => {
    const isActive = button.getAttribute("data-sector-target") === target;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function syncAutoRefreshTimer() {
  if (autoRefreshTimerId) {
    window.clearTimeout(autoRefreshTimerId);
    autoRefreshTimerId = null;
  }

  if (!state.autoRefreshEnabled) {
    state.nextAutoRefreshAt = null;
    renderAutoRefreshStatus();
    return;
  }

  state.nextAutoRefreshAt = new Date(Date.now() + AUTO_REFRESH_INTERVAL_MS).toISOString();
  renderAutoRefreshStatus();

  autoRefreshTimerId = window.setTimeout(() => {
    if (document.visibilityState === "hidden") {
      syncAutoRefreshTimer();
      return;
    }
    void refreshWatchlist({ source: "auto" });
  }, AUTO_REFRESH_INTERVAL_MS);
}

function getLookbackOption(key) {
  return LOOKBACK_OPTIONS[normalizeLookbackKey(key)];
}

function resolveLookbackWindow(series, key) {
  const option = getLookbackOption(key);
  const selectedSeries = option.days ? takeLastPoints(series, option.days) : series.slice();
  const usingFullHistory = selectedSeries.length === series.length;
  const sampleLabel = selectedSeries.length + " 个净值点";

  return {
    ...option,
    series: selectedSeries,
    sampleLabel,
    shortLabel: option.shortLabel,
    sparklineTitle: option.label + "走势",
    notice:
      usingFullHistory && option.key !== "all"
        ? "可用历史不足 " + option.label + "，当前已自动使用全部可得样本。"
        : ""
  };
}

function buildMetricCard(label, value, note) {
  return (
    '<div class="metric-card"><span>' +
    escapeHtml(label) +
    "</span><strong>" +
    escapeHtml(value) +
    "</strong><span>" +
    escapeHtml(note) +
    "</span></div>"
  );
}

function buildSparklineSeries(series, maxPoints) {
  if (!series.length) {
    return [0, 0];
  }
  if (series.length <= maxPoints) {
    return series.map((point) => point.nav);
  }

  const result = [];
  const step = (series.length - 1) / (maxPoints - 1);
  for (let index = 0; index < maxPoints; index += 1) {
    const pointIndex = Math.round(index * step);
    const point = series[Math.min(pointIndex, series.length - 1)];
    result.push(point.nav);
  }
  return result;
}

function buildSparkline(sparkline) {
  const width = 520;
  const height = 160;
  const padding = 10;
  const values = sparkline.values.length ? sparkline.values : [0, 0];
  const denominator = sparkline.max - sparkline.min || 1;
  const points = values
    .map((value, index) => {
      const x = padding + (index / Math.max(values.length - 1, 1)) * (width - padding * 2);
      const y = height - padding - ((value - sparkline.min) / denominator) * (height - padding * 2);
      return roundNumber(x, 2) + "," + roundNumber(y, 2);
    })
    .join(" ");
  const current = points.split(" ").pop().split(",");

  return (
    '<svg class="sparkline" viewBox="0 0 ' +
    width +
    " " +
    height +
    '" aria-hidden="true">' +
    '<line class="sparkline-track" x1="' +
    padding +
    '" y1="' +
    (height - padding) +
    '" x2="' +
    (width - padding) +
    '" y2="' +
    (height - padding) +
    '"></line>' +
    '<polyline class="sparkline-line" points="' +
    points +
    '"></polyline>' +
    '<circle class="sparkline-current" cx="' +
    current[0] +
    '" cy="' +
    current[1] +
    '" r="5"></circle>' +
    "</svg>"
  );
}

function scaleBands(bands, multiplier) {
  return Object.keys(bands || {}).reduce((result, key) => {
    result[key] = bands[key] * multiplier;
    return result;
  }, {});
}

function loadStringArray(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((item) => sanitizeFundCode(String(item))).filter(Boolean);
  } catch (error) {
    return [];
  }
}

function loadJsonObject(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

function loadStoredValue(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function persistValue(key, value) {
  try {
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    // Ignore storage failures.
  }
}

function sanitizeParams(raw) {
  const merged = {
    ...DEFAULT_PARAMS,
    ...(raw || {})
  };

  return {
    lowThreshold: clamp(toFiniteNumber(merged.lowThreshold, DEFAULT_PARAMS.lowThreshold), 50, 95),
    highThreshold: clamp(toFiniteNumber(merged.highThreshold, DEFAULT_PARAMS.highThreshold), 5, 50),
    maMultiplier: clamp(toFiniteNumber(merged.maMultiplier, DEFAULT_PARAMS.maMultiplier), 0.5, 2),
    zMultiplier: clamp(toFiniteNumber(merged.zMultiplier, DEFAULT_PARAMS.zMultiplier), 0.5, 2),
    heatSensitivity: clamp(toFiniteNumber(merged.heatSensitivity, DEFAULT_PARAMS.heatSensitivity), 0.5, 2),
    volatilitySensitivity: clamp(
      toFiniteNumber(merged.volatilitySensitivity, DEFAULT_PARAMS.volatilitySensitivity),
      0.5,
      2
    )
  };
}

function sanitizePositionInput(raw) {
  return {
    cost: toNullableNumber(raw.cost),
    shares: toNullableNumber(raw.shares),
    targetValue: toNullableNumber(raw.targetValue),
    note: String(raw.note || "").trim()
  };
}

function sanitizeBenchmarkOverride(raw) {
  return {
    overallPercentile: toNullableBoundedPercentile(raw.overallPercentile),
    pePercentile: toNullableBoundedPercentile(raw.pePercentile),
    pbPercentile: toNullableBoundedPercentile(raw.pbPercentile),
    dividendPercentile: toNullableBoundedPercentile(raw.dividendPercentile),
    erpPercentile: toNullableBoundedPercentile(raw.erpPercentile),
    sourceNote: String(raw.sourceNote || "").trim(),
    benchmarkLabel: String(raw.benchmarkLabel || "").trim(),
    benchmarkFamily: String(raw.benchmarkFamily || "").trim(),
    updatedAt: String(raw.updatedAt || "")
  };
}

function countOverrideMetrics(override) {
  if (!override) {
    return 0;
  }
  return ["overallPercentile", "pePercentile", "pbPercentile", "dividendPercentile", "erpPercentile"].filter((key) =>
    Number.isFinite(override[key])
  ).length;
}

function getBenchmarkOverride(storageKey) {
  return storageKey ? state.valuationOverrides[storageKey] || null : null;
}

function parseCodeList(raw) {
  return Array.from(
    new Set(
      String(raw || "")
        .split(/[\s,，、;；]+/)
        .map((item) => sanitizeFundCode(item))
        .filter(Boolean)
    )
  );
}

function buildBenchmarkField(label, name, value) {
  return (
    '<div class="control-group">' +
    '<label class="field-label" for="benchmark-' +
    escapeHtml(name) +
    '">' +
    escapeHtml(label) +
    "</label>" +
    '<input id="benchmark-' +
    escapeHtml(name) +
    '" class="code-input" name="' +
    escapeHtml(name) +
    '" type="number" min="0" max="100" step="0.1" value="' +
    escapeHtml(Number.isFinite(value) ? String(value) : "") +
    '" />' +
    "</div>"
  );
}

function buildKvItem(label, value) {
  return (
    '<div class="kv-item"><span class="fact-key">' +
    escapeHtml(label) +
    '</span><strong class="fact-value">' +
    escapeHtml(value) +
    "</strong></div>"
  );
}

function buildVersionStamp() {
  const now = new Date();
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
  ].join("");
}

function estimateNameFallback(estimate, code) {
  return estimate && estimate.name ? estimate.name : "基金 " + code;
}

function buildSuccessMessage(snapshot, hasEstimate) {
  if (hasEstimate && snapshot.estimate) {
    return (
      "已抓取 " +
      snapshot.name +
      "，识别为" +
      snapshot.profile.familyLabel +
      "，当前窗口为" +
      snapshot.lookback.label +
      "。当前使用盘中估算净值，时间 " +
      snapshot.estimate.estimateTime +
      "。"
    );
  }

  return (
    "已抓取 " +
    snapshot.name +
    "，识别为" +
    snapshot.profile.familyLabel +
    "，当前窗口为" +
    snapshot.lookback.label +
    "。估算接口未返回盘中数据，当前用最新正式净值。"
  );
}

function sanitizeFundCode(raw) {
  const digits = String(raw || "")
    .replace(/\D/g, "")
    .slice(0, 6);
  return digits.length === 6 ? digits : "";
}

function takeLastPoints(series, count) {
  return series.slice(-Math.min(series.length, count));
}

function average(values) {
  if (!values.length) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values, mean) {
  if (values.length < 2) {
    return 0;
  }
  const variance = average(values.map((value) => (value - mean) ** 2));
  return Math.sqrt(variance);
}

function annualizedNavVolatility(values) {
  if (values.length < 3) {
    return 0;
  }
  const returns = [];
  for (let index = 1; index < values.length; index += 1) {
    const previous = values[index - 1];
    const current = values[index];
    if (previous > 0 && current > 0) {
      returns.push(current / previous - 1);
    }
  }

  if (returns.length < 2) {
    return 0;
  }

  const mean = average(returns);
  return standardDeviation(returns, mean) * Math.sqrt(252);
}

function maxDrawdown(values) {
  if (!values.length) {
    return 0;
  }
  let peak = values[0];
  let drawdown = 0;
  values.forEach((value) => {
    if (value > peak) {
      peak = value;
    }
    drawdown = Math.min(drawdown, value / peak - 1);
  });
  return drawdown;
}

function percentileOfValue(values, currentValue) {
  if (!values.length) {
    return 0.5;
  }
  const count = values.filter((value) => value <= currentValue).length;
  return count / values.length;
}

function ratioWithinRange(value, low, high) {
  if (high <= low) {
    return 0.5;
  }
  return (value - low) / (high - low);
}

function discountScore(gap, band) {
  return clamp((band - gap) / (band * 2), 0, 1);
}

function weightedAverage(items, fallback) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (!totalWeight) {
    return fallback;
  }
  return items.reduce((sum, item) => sum + item.weight * item.value, 0) / totalWeight;
}

function classifyScore(score, params) {
  const config = sanitizeParams(params || state.params);
  const deepLow = Math.min(config.lowThreshold + 15, 95);
  const deepHigh = Math.max(config.highThreshold - 10, 5);

  if (!Number.isFinite(score)) {
    return { label: "待录入", toneClass: "tone-info" };
  }
  if (score >= deepLow) {
    return { label: "明显低位", toneClass: "tone-good" };
  }
  if (score >= config.lowThreshold) {
    return { label: "偏低", toneClass: "tone-good" };
  }
  if (score <= deepHigh) {
    return { label: "较高", toneClass: "tone-bad" };
  }
  if (score <= config.highThreshold) {
    return { label: "偏高", toneClass: "tone-loading" };
  }
  return { label: "中性", toneClass: "tone-info" };
}

function setStatus(text, tone) {
  refs.statusBox.className = "status-box tone-" + tone;
  refs.statusBox.textContent = text;
}

function formatNav(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }
  return value.toFixed(4);
}

function formatScore(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }
  return value.toFixed(1);
}

function formatPercent(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }
  return (value * 100).toFixed(1) + "%";
}

function formatSignedPercent(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }
  const prefix = value > 0 ? "+" : "";
  return prefix + (value * 100).toFixed(2) + "%";
}

function formatPlainPercent(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }
  const prefix = value > 0 ? "+" : "";
  return prefix + value.toFixed(2) + "%";
}

function formatPlainPctValue(value) {
  if (!Number.isFinite(value)) {
    return "未返回";
  }
  return value.toFixed(2) + "%";
}

function formatSignedSigma(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }
  const prefix = value > 0 ? "+" : "";
  return prefix + value.toFixed(2) + "σ";
}

function formatRatio(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }
  return value.toFixed(2) + "x";
}

function formatMetricNumber(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }
  return value.toFixed(2);
}

function formatMetricPercent(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }
  return value.toFixed(2) + "%";
}

function formatCurrency(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }
  return "¥" + value.toFixed(2);
}

function formatQuantity(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }
  return value.toFixed(2);
}

function formatDateFromTimestamp(timestamp) {
  if (!Number.isFinite(timestamp)) {
    return "--";
  }
  const date = new Date(timestamp);
  return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "--";
  }
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    " " +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}

function formatDateForFile(date) {
  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    "-" +
    pad(date.getHours()) +
    pad(date.getMinutes())
  );
}

function formatRawPercentile(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }
  return value.toFixed(1) + "%";
}

function formatSignedNumber(value, digits) {
  if (!Number.isFinite(value)) {
    return "--";
  }
  const prefix = value > 0 ? "+" : "";
  return prefix + value.toFixed(digits);
}

function parseOptionalBoolean(value) {
  if (value == null || value === "") {
    return null;
  }
  const normalized = String(value).trim();
  if (normalized === "1" || normalized.toLowerCase() === "true") {
    return true;
  }
  if (normalized === "0" || normalized.toLowerCase() === "false") {
    return false;
  }
  return null;
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function parseOptionalNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function defaultNumber(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

function toFiniteNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toNullableNumber(value) {
  const trimmed = String(value == null ? "" : value).trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function toNullableBoundedPercentile(value) {
  const parsed = toNullableNumber(value);
  return parsed == null ? null : clamp(parsed, 0, 100);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function roundNumber(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function csvEscape(value) {
  const text = String(value == null ? "" : value);
  if (/[",\n]/.test(text)) {
    return '"' + text.replace(/"/g, '""') + '"';
  }
  return text;
}

function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
