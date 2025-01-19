export default function Keyboard({ inputMethod }) {
  switch (inputMethod) {
    case "cangjie":
      return (
        <div>
          <h3>手 田 水 口 廿 卜 山 戈 人 心</h3>
          <h3>日 尸 木 火 土 竹 十 大 中</h3>
          <h3>重 難 金 女 月 弓 一</h3>
        </div>
      )
    case "wubi":
      return (
        <div>
          <h3>金 人 月 白 禾 言 立 水 火 之</h3>
          <h3>工 木 大 土 王 目 日 口 田</h3>
          <h3>纟 又 女 子 已 山</h3>
        </div>
      )
    default:
      return (
        <div>
          <h3>Q W E R T Y U I O P</h3>
          <h3>A S D F G H J K L</h3>
          <h3>Z X C V N M</h3>
        </div>
      )
  }
}