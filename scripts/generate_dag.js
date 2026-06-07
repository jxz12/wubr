#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const pl = require('nodejs-polars');
const hanzi = require('hanzi');

hanzi.start();

const INPUT_CSV = path.resolve(__dirname, '..', 'remembering_the_hanzi.csv');
const OUTPUT_CSV = path.resolve(__dirname, '..', 'public', 'character_components.csv');

function readCharactersWithPolars(csvPath) {
  const text = fs.readFileSync(csvPath, 'utf8');
  const df = pl.readCSV(text);
  // Column name 'SH' contains the character (as in remembering_the_hanzi.csv)
  const series = df.getColumn('SH');
  // Series is iterable
  return [...series].filter(v => v != null && String(v).trim() !== '').map(String);
}

function buildDAG(seedChars) {
  // Collect seed characters and their immediate components, then decompose each
  const allChars = new Set(seedChars);
  for (const ch of seedChars) {
    try {
      const dec = hanzi.decompose(ch) || {};
      const comps1 = dec['components1'] || [];
      const comps2 = dec['components2'] || [];
      const comps3 = dec['components3'] || [];
      for (const c of [...comps1, ...comps2, ...comps3]) {
        const s = String(c);
        allChars.add(s.includes('No glyph available') ? '?' : s);
      }
    } catch (e) {
      // ignore
    }
  }

  const map = new Map();
  for (const ch of allChars) {
    let comps1 = [];
    let comps2 = [];
    let comps3 = [];
    try {
      const dec = hanzi.decompose(ch) || {};
      comps1 = dec['components1'] || [];
      comps2 = dec['components2'] || [];
      comps3 = dec['components3'] || [];
    } catch (e) {
      comps1 = comps2 = comps3 = [];
    }
    // Normalize 'No glyph available' to '?'
    const key = String(ch).includes('No glyph available') ? '?' : String(ch);
    const norm = arr => arr.map(c => {
      const s = String(c);
      return s.includes('No glyph available') ? '?' : s;
    });
    map.set(key, { once: norm(comps1), radical: norm(comps2), graphical: norm(comps3) });
  }
  return map;
}

function writeOutput(map, outPath) {
  const lines = ['character,once,radical,graphical'];
  for (const [ch, compsObj] of map.entries()) {
    const onceStr = (compsObj.once || []).join('');
    const radicalStr = (compsObj.radical || []).join('');
    const graphicalStr = (compsObj.graphical || []).join('');
    // Escape double quotes and wrap fields containing commas
    const esc = s => (s.includes(',') || s.includes('"')) ? `"${s.replace(/"/g, '""')}"` : s;
    const escCh = esc(ch);
    const escOnce = esc(onceStr);
    const escRadical = esc(radicalStr);
    const escGraphical = esc(graphicalStr);
    lines.push(`${escCh},${escOnce},${escRadical},${escGraphical}`);
  }
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
}

function main() {
  console.log('Reading characters from', INPUT_CSV);
  const chars = readCharactersWithPolars(INPUT_CSV);
  console.log('Seed characters:', chars.length);

  console.log('Collecting seed chars + immediate components, then decomposing each...');
  const dag = buildDAG(chars);
  console.log('Total entries (seed + components):', dag.size);

  console.log('Writing output to', OUTPUT_CSV);
  writeOutput(dag, OUTPUT_CSV);
  console.log('Done.');
}

if (require.main === module) main();
