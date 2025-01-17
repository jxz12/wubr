import { select } from "../controller/controller";

export default function NavBar({hskLevel, characterSet, inputMethod}) {
  return (
    <>
			<h1>wubr</h1>
      <div>
        <select name="hskLevel" value={hskLevel} onChange={select}>
          {[1,2,3,4,5,6].map(x => (<option key={x} value={x}>HSK Level {x}</option>))}
        </select>
        <select name="characterSet" value={characterSet} onChange={select}>
          <option value="simplified">Simplified (简体)</option>
          <option value="traditional">Traditional (繁体)</option>
        </select>
        <select name="inputMethod" value={inputMethod} onChange={select}>
          <option value="pinyin">Pinyin (拼音)</option>
          <option value="jyutping">Jyutping (粤拼)</option>
          <option value="cangjie">Cangjie (倉頡)</option>
          <option value="wubi">Wubi (五笔)</option>
        </select>
      </div>
    </>
	)
}