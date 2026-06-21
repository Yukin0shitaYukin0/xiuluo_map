# 修罗武神图鉴 — 3D 星图

基于 React Three Fiber 的 3D 交互式星图，可视化玄幻小说的世界宇宙观层级结构。

## 世界观层级

```
太古神域（银核）
  └─ 8道天河（螺旋悬臂）
       ├─ 星域
       │    ├─ 上界（金色）
       │    ├─ 凡界（紫色）
       │    └─ 下界（绿色）
       └─ ...
```

- **太古神域**：宇宙中心，金色光球，带三层符文法阵环
- **天河**：8 条彩色螺旋悬臂，从中心辐射而出，呈对数螺旋线
- **星域 / 上界 / 凡界 / 下界**：天河上的节点，构成树形层级关系

## 技术栈

| 层 | 库 | 版本 |
|---|---|---|
| 构建 | Vite 8 | `^8.0.12` |
| UI | React 19 | `^19.2.6` |
| 3D | Three.js | `^0.184.0` |
| React 绑定 | @react-three/fiber | `^9.6.1` |
| 工具库 | @react-three/drei | `^10.7.7` |
| 后处理 | @react-three/postprocessing | `^3.0.4` |

纯 JSX/JS，ES Module，无 TypeScript。

## 启动

```bash
npm install
npm run dev
```

## 项目结构

```
src/
├── main.jsx                    # React 入口
├── App.jsx                     # 主应用：全局状态、UI 浮层、3D Canvas 编排
├── index.css                   # 全局样式重置
├── App.css                     # 未使用（Vite 模板残留）
│
├── data/
│   ├── worldData.js            # 世界观数据（taigu + 8 tianhe + 递归子节点树）
│   ├── colorSystem.js          # 颜色常量、天河色表、类型色、Bloom 强度
│   ├── layoutEngine.js         # 3D 布局引擎：将树形数据计算为 {nodeId: {x,y,z}}
│   ├── relationshipUtils.js    # 父子关系图、连线生成、连线颜色
│   └── starTexture.js          # 程序化星点纹理（Canvas 2D → THREE.CanvasTexture）
│
└── components/
    ├── GalaxyBackground.jsx     # 螺旋银河背景：银核 + 悬臂粒子 + 悬臂线
    ├── TaiguCore.jsx            # 太古神域：5 层结构（圣核→混沌→法阵→源环→星海）
    ├── TianheArm.jsx            # 单条天河臂：天河主节点 + 所有子节点 + 名称标签
    ├── StarNode.jsx             # 单个星图节点：球体 + GLSL 着色器 + 悬停光晕
    ├── ConnectionLines.jsx      # 节点间连线：螺线曲线管道
    ├── NodeLabels.jsx           # 节点浮动文字标签（选中后显示）
    ├── FocusController.jsx      # 聚焦模式相机动画（点击节点 → 相机推近）
    └── OrbitTargetController.jsx # 未使用（平滑跟踪 orbit target）
```

## 文件职责详解

### `src/data/worldData.js`

导出 `worldData` 对象，结构：

```js
{
  taigu: { id:'taigu', name:'太古神域', type:'taigu' },
  tianhe: [
    { id, name, region, color, children: [...] },
    ...  // 共 8 条
  ]
}
```

辅助函数：`countNodes(data)` 统计节点总数，`flattenNodes(data)` 扁平化含深度/父节点信息。

### `src/data/layoutEngine.js`

导出 `computeLayout(worldData) → { [nodeId]: {x, y, z} }`。

- 天河节点等角分布在半径 ~28 的圆上（基础角偏移 -1.35 rad）
- 子节点沿螺线臂分布，距离 14→34，带确定性的哈希抖动
- 孙节点用高斯散布在父节点周围（sigma 按类型：上界 1.2 / 凡界 1.5 / 下界 1.8）
- 螺线公式 `spiral = max(0, r-5)/48 * 2.0` 与 GalaxyBackground 的悬臂线匹配

### `src/data/relationshipUtils.js`

- `buildRelationshipMap(worldData) → { parentMap, childrenMap, nodeMap }`
- `getConnectionLines(selectedNodeId, relMap) → [{from, to}]`：选中 taigu 时不显示连线
- `getConnectionColor(id1, id2, nodeMap)`：取较低层级节点的颜色

### `src/data/colorSystem.js`

- `TIANHE_COLORS`：8 条天河各自专属色
- `SHANGJIE`, `FANJIE`, `XIAJIE`：三类世界的颜色
- `BLOOM_BOOST`：各类型 Bloom 强度系数
- `getNodeColor(type, tianheColor)`：获取节点渲染颜色

### `src/data/starTexture.js`

导出 `getStarTexture()`，返回一个 64×64 Canvas 生成的 `THREE.CanvasTexture`：
- 锐利亮核（中心 10% 半径全白 → 快速衰减）
- 柔和宽光晕（暖色调，0-50% 半径）
- 模块级单例缓存

### `src/App.jsx`

主组件。管理 4 个状态：
- `hoveredNode`：鼠标悬停的节点信息
- `selectedNodeId`：探索模式下选中的节点 ID
- `isFocusMode`：聚焦模式开关
- `focusedNodeId`：聚焦模式下的目标节点 ID

3D Canvas 结构：

```
<Canvas camera={[0,18,85]} fov=55 near=0.5 far=200 dpr=[1, devicePixelRatio]>
  <group rotation={[PI, 0, 0]}>     ← 翻转 Y/Z
    <GalaxyBackground />             ← 先渲染（被其他物体遮挡）
    <TaiguCore />
    <TianheArm ×8 />
    <RegionLabels />
    <ConnectionLines />
    <NodeLabels />
  </group>
  <FocusController />                ← 在 group 外，使用 worldPositions
  <EffectComposer>                   ← 双 Bloom
  <OrbitControls />
</Canvas>
```

**重要**：`group rotation={[Math.PI, 0, 0]}` 使 Y 轴和 Z 轴翻转。`worldPositions`（App.jsx 内计算）对 Y 和 Z 取负以补偿此旋转，供 FocusController（在 group 外）使用。

UI 浮层：模式切换按钮、悬停信息面板、图例、操作提示。

### `src/components/GalaxyBackground.jsx`

三部分，渲染顺序：

1. **GalaxyCore**（银核）— 20,000 粒子椭球，金色温白
2. **GalaxyArms**（悬臂）— 两层粒子：
   - L1 密脊：40,000/臂，size 0.045，opacity 0.95
   - L2 扩散：8,000/臂，size 0.080，opacity 0.55，高斯亮度衰减
   - 粒子沿对数螺线分布：`r = A × e^(B×θ)`，A=5.0, B=0.50（~0.9 圈）
   - 径向密度指数衰减：`exp(-r/32)`，逆 CDF 采样
   - 臂宽 σ(r) 钟形曲线：两端收束
3. **ArmTraces**（悬臂线）— 8 条彩色曲线，opacity 0.15

**关键常数**：`A=5, B=0.50, R_MIN=0.5, R_MAX=85, K=32, ARM_COUNT=8`

### `src/components/TaiguCore.jsx`

太古神域 5 层结构（从外到内）：
1. **StarOcean** — 24,000 金色粒子球（r~5.8）
2. **OriginRing** — 8 个小球在 r=3.3，在天河起点处脉动
3. **DaoArray** — 3 个旋转符文环，GLSL 着色器绘制符文段
4. **ChaosEnergy** — 4 层同心粒子壳，多色旋转
5. **SacredCore** — 球体（r=1.05），3D FBM 噪声着色器 + 菲涅尔边缘光

### `src/components/TianheArm.jsx`

Props：`{ data, index, total, positions, onHover, onClick }`

- 渲染天河主节点（StarNode size=0.22）和名称标签（Text fontSize=1.2）
- 渲染所有子节点，size 按类型：星域 0.14 / 上界 0.09 / 凡界 0.07 / 其他 0.06

### `src/components/StarNode.jsx`

单个星图节点的完整渲染：GLSL 自定义着色器球体 + 3 层 Fresnel 光晕壳 + 火花粒子。悬停时缩放到 1.8x。

### `src/components/ConnectionLines.jsx`

节点间关系连线管道（tube radius 0.02），从原点出发沿螺线走，节点间用贝塞尔曲线。

### `src/components/NodeLabels.jsx`

选中节点时显示浮动标签（Billboard + Text），`depthTest={false}` 确保不被星星遮挡。

### `src/components/FocusController.jsx`

聚焦模式相机动画：点击节点 → 保存相机 → 计算目标位置 → ease-in-out lerp。CLOSE_DIST 按类型：taigu=14 / tianhe=12 / xingyu=10 / shangjie=7 / fanjie=6 / xiajie=5。

### `src/components/OrbitTargetController.jsx`

**未使用**。用于平滑跟随 OrbitControls target 到指定节点。

## 坐标系说明

所有世界对象在 `<group rotation={[Math.PI, 0, 0]}>` 内。此旋转翻转 Y 轴和 Z 轴：
- **布局空间**：XZ 为盘面，Y 为高度（`computeLayout` 输出、`FocusController` 的 `worldPositions`）
- **世界空间**：group 内 Y/Z 被翻转
- `worldPositions` 对 Y 和 Z 取负以补偿旋转（供 group 外的 FocusController 使用）

## 交互模式

- **聚焦模式**（默认）：点击节点 → 相机推近，显示父子标签和连线
- **探索模式**：自由浏览，点击高亮连线，再点取消

## 悬臂宽度调参

`GalaxyBackground.jsx` 中 `armWidth(r)` 控制悬臂截面：

```js
function armWidth(r) {
  const x = r / R_MAX;
  return baseW + peakW * pow(x, risePow) * pow(1 - x, fallPow);
}
```

| 参数 | 含义 | 当前值 |
|------|------|--------|
| `baseW` | 末端收束基线 | 0.15 |
| `peakW` | 峰值高度 | 14 |
| `risePow` | 中心升起速度（<1 快） | 0.35 |
| `fallPow` | 末端衰减速度（>0.35 快） | 0.42 |

## 注意事项

- 所有随机使用确定性哈希（`rng()`, `hashId()`），确保每次渲染一致
- `App.css` 和 `OrbitTargetController.jsx` 是遗留代码，未使用
- `getStarTexture()` 需浏览器环境（`document.createElement('canvas')`）
- Bloom 双通道：阈值 0.45 + 0.70，只让高亮恒星触发模糊
