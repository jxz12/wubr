# IDEAS
* typeracer and keybr are two of my favourite websites
  * so I would love to combine their concepts and apply them to learning chinese
  * make them type something with the pinyin and then get rid of the pinyin to see how they do
* need an open database of hints for every character (e.g. pronounciation clue or meaning clue)
  * this should be upvoteable
* I also want to finish Schwa, this is a goal in life

* definitely incorporate ordering food as part of the game
  * also lots of chengyu
* maybe use list of kangxi radicals as a starting point too?

# How to render
* to render the wubi roots I need to vectorise the wubi86 keyboard with AI
  * and then I can manually extract the components with inkscape (tbh I could probably just trace them in inkscape)
  * and then I can render the SVG on command (unfortunately )

蓝字根：键名字
Blue characters: Key name characters
红字根：笔画标识字根
Red characters: Stroke-identifying character roots
绿字根：用于繁体字
Green characters: Used for traditional characters
下方蓝字：区位,按键
Bottom blue characters: Area position, keystrokes
下方绿字：一级备码字
Bottom green characters: First-level alternative code characters

I understand [Isolation](https://madmansnest.com/2018/05/09/wubi-part-6.html) but I don't understand how to type roots that are directly on the key
How is 文 yygy

# Shape of input data
character table (字)
* primary key should be the simplified chinese character
* note that the same character can have different pronounciations depending on context
  * so we can NOT include pinyin or jyutping here
* note that there can be multiple cangjie or wubi, but allow any when doing typing test (probably show shortest first then alphabetical order)
* columns:
  * zi (primary key)
  * cangjie
  * wubi
  * components
  * traditional

word table (词)
* note that this will share a lot of keys with characters
* but one word may have many meanings which makes it not a primary key
* columns:
  * ci (each character has foreign key to characters table)
  * traditional word (use this to build up a mapping of simplified to traditional)
  * pronounciation
  * cantonese pronounciation
  * meaning

# Piano app
* also to make that piano playing app
  * for piano make the top two rows of the keyboard the white keys, and then the number for can be black keys
  * and this works pretty well because the A key can actually be A, and Enter is E which is satisfying

  1   2       4   5       7   8   9       -   = 
Tab Q   W   E   R   T   Y   U   I   O   P   [   ]   \
 Esc A   S   D   F   G   H   J   K   L   ;   '   Entr

  G#  A#      C#  D#      F#  G#  A#      C#  D# 
G   A   B   C   D   E   F   G   A   B   C   D   E   F
 G   A   B   C   D   E   F   G   A   B   C   D   E   F

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# CSS notes
* selectors: `.` is class, `:` is pseudo-class (e.g. hover), `#` is id
* `:root` matches the root element, identical to `<html>`