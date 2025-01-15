import { pushClick } from "../state";

export default function NavBar({hskLevel, characterSet, inputMethod}) {
  return (
    <>
			<h1>wubr</h1>
      <div>
        <select value={hskLevel} onChange={e => pushClick(e)}>
          {[1,2,3,4,5,6].map(x => (<option value={x}>HSK Level {x}</option>))}
        </select>
        <select value={characterSet} onChange={e => pushClick(e)}>
          <option value="simplified">Simplified (简体)</option>
          <option value="traditional">Traditional (繁体)</option>
        </select>
        <select value={inputMethod} onChange={e => pushClick(e)}>
          <option value="pinyin">Pinyin (拼音)</option>
          <option value="jyutping">Jyutping (粤拼)</option>
          <option value="cangjie">Cangjie (倉頡)</option>
          <option value="wubi">Wubi (五笔)</option>
        </select>
      </div>
    </>
	)
}