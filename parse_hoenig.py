from dataclasses import dataclass, asdict
from typing import Optional
import re
import pandas as pd


with open("hoenig.txt", "r") as f:
    lines = f.readlines()

@dataclass
class Entry:
    index: int
    gloss: str
    hanzi: Optional[str]
    pinyin: Optional[str]
    components: list[(str, int)]
    # these ones need to be added later because they appear after the primary line
    story: Optional[str] = None
    strokes: Optional[int] = None
    rank: Optional[int] = None

entries = { gloss: Entry(-1-i, gloss, None, None, []) for i, gloss in enumerate([
    # TODO: auto-generate these...
    "vertical struts",
    "a few alterations",
    "drops of rain",
    "unexpected stroke",
    "metal stand",
    "handle",
    "knife and mark",
    "unexpected mark",
    "boxy bits",
    "two breasts",
    "expelled matter",
    "measurement",
    "curvey stripe",
    "staring through window",
    "strings",
    "worm",
    "trajectory",
    "a machine",
    "twin windows",
    "divider",
    "crossed hands",
    "ceremonial sword",
    "gaping jaws",
    "a ladder",
    "weight atop slices",
    "cut marks",
    "cut mark",
    "extra stuff",
    "unexpected vertical",
    "fort",
    "wings",
    "things",
    "chopsticks",
    "various animal parts",
    "toothy jaws long tail",
])}

entry = None
story = []
strokes = None
rank = None
for line in lines:
    if line[0] == "#":
        continue
    if line[0].isdigit():
        if entry is not None:
            entry.story = " ".join(story).strip()
            entry.strokes = strokes
            entry.rank = rank

            assert story, entry
            assert entry.pinyin is None or strokes, entry
            assert entry.pinyin is None or rank, entry
            assert "CMP" in entry.story or entry.pinyin is not None, entry

        fields = line.split()
        index = int(fields[0])
        hanzi = fields[1]
        pinyin = fields[-1]

        is_cmp = (
            not re.match(".*[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜň]", pinyin)
            and hanzi not in "的嘛呢啊吗们得啦了么着吧"
            or pinyin == "r"  # this is to deal with component 了
        )

        components = []
        comp_index = None
        field_stack = []
        brace_stack = []
        for i in range(-1 if is_cmp else -2, -len(fields)+2, -1):
            if brace_stack or ")" in fields[i]:
                assert not field_stack or comp_index is None, line
                brace_stack = [fields[i]] + brace_stack
                if "(" in fields[i]:
                    contents = " ".join(brace_stack)
                    if contents not in [
                        "(altered)",
                        "(times 2 and altered)",
                        "(times 2)",
                        "(times 3)",
                        "(times 4)",
                    ]:
                        field_stack = brace_stack
                    brace_stack = []
            elif fields[i].isdigit():
                assert not field_stack, line
                comp_index = int(fields[i])
            else:
                field_stack = [fields[i]] + field_stack
                comp_gloss = " ".join(field_stack)
                if comp_gloss in entries:
                    components.append(comp_gloss)
                    assert comp_index is None, line
                    field_stack = []
                if f"{comp_gloss} {comp_index}" in entries:
                    components.append(f"{comp_gloss} {comp_index}")
                    comp_index = None
                    field_stack = []

        assert not comp_index, line
        assert field_stack, line
        gloss = " ".join(field_stack)

        assert is_cmp or not not components, line

        entry = Entry(index, gloss, hanzi, None if is_cmp else pinyin, components)
        entries[f"{gloss} {index}"] = entry
        story = []
        strokes = None
        rank = None
    else:
        if match := re.match(".*\[([0-9]+) STROKES RANK ([0-9]+)\]", line):
            strokes = int(match.group(1))
            rank = int(match.group(2))
            line = line[:line.find("[")]

        story.append(line.strip())

assert story, line
assert strokes, line
assert rank, line
entry.story = " ".join(story).strip()
entry.strokes = strokes
entry.rank = rank

df = pd.DataFrame.from_dict([asdict(e) for e in entries.values()])
df["components"] = df["components"].map(lambda comps: "|".join(entries[c].gloss for c in comps))
df.to_csv("hoenig.csv", index=False)