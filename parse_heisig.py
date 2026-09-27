import re

results = []

metadata_pattern = re.compile(
    r"\bstroke order\b"
    r"|\bseen in\b"
    r"|\bframe\s+\d+\b"
    r"|\b\d+\s+strokes?\s*·"
    r"|\bprimitive\b",
    flags=re.IGNORECASE,
)

pinyin_pattern = re.compile(
    r"[a-züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜńňǹḿê'’\-]*"
    r"[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜńňǹḿ]"
    r"[a-züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜńňǹḿê'’\-]*",
    flags=re.IGNORECASE,
)
unmarked_pinyin = {
    "的": "de",
    "了": "le",
    "哇": "wa",
    "地": "de",
    "着": "zhe",
    "啦": "la",
    "么": "me",
    "呢": "ne",
    "啊": "a",
    "们": "men",
    "吧": "ba",
    "呀": "ya",
    "吗": "ma",
    "匙": "shi",
    "嘛": "ma",
    "裳": "shang",
}


with open("heisig.txt", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if not line.strip():
            continue

        sections = line.split("what is this?", maxsplit=2)
        if len(sections) != 3:
            print(i, line)
            continue

        # Extract the full displayed label.
        label = sections[1].strip().strip('"').strip()
        label = re.sub(r"\s+", " ", label)

        details = sections[2].lstrip()

        if label:
            # Match the repeated label while allowing different spacing.
            label_pattern = r"\s+".join(
                re.escape(token) for token in label.split()
            )
            repeated_label = re.match(
                label_pattern + r"(?=\s|$)",
                details,
            )

            if not repeated_label:
                raise ValueError(
                    f"Repeated label does not match {label!r}: {line!r}"
                )

            details = details[repeated_label.end():].lstrip()

        # Extract counts and variant information before removing metadata.
        frame_match = re.search(
            r"\bframe\s+(\d+)\b", details, flags=re.IGNORECASE
        )
        strokes_match = re.search(
            r"\b(\d+)\s+strokes?\b", details, flags=re.IGNORECASE
        )
        variant_match = re.search(
            r"\bvariant of\s(.)", details, flags=re.IGNORECASE
        )

        details = metadata_pattern.split(details, maxsplit=1)[0].strip()
        parts = re.split(r"[ \t]{2,}", details, maxsplit=1)

                # Separate the final pinyin word from the name.
        meaning = parts[0]
        name = meaning
        pinyin = None
        meaning_parts = meaning.rsplit(maxsplit=1)

        if len(meaning_parts) == 2:
            candidate_name, candidate_pinyin = meaning_parts

            is_tone_marked = (
                pinyin_pattern.fullmatch(candidate_pinyin) is not None
            )
            is_known_unmarked = (
                unmarked_pinyin.get(label) == candidate_pinyin.lower()
            )

            if is_tone_marked or is_known_unmarked:
                name = candidate_name
                pinyin = candidate_pinyin

        primitive = (
            line.strip().endswith("primitive")
            or line.strip().endswith('primitive"')
        )

        index = int(frame_match.group(1)) if frame_match else None
        if index is not None:
            if index > 3000:
                continue
        elif variant_match is not None:
            # index = f"variant of {variant_match.group(1)}"
            index = f"variant of {variant_match.group(1)}"
        elif primitive:
            index = "primitive"

        components = parts[1].strip() if len(parts) > 1 else ""
        if components == "" and not primitive and variant_match is None:
            # print(i, line)
            pass

        results.append({
            "components": components,
            "character": label,
            "name": name,
            "pinyin": pinyin,
            "index": index,
            "csvIndex": i+1,
            "strokes": int(strokes_match.group(1)) if strokes_match else None,
        })

import pandas as pd

df = pd.DataFrame.from_dict(results)
df[df['character'].eq("")]
df[df['pinyin'].isna() & df['index'].ne('primitive')][['character', 'name']]
breakpoint()

# TODO need to derive unique components because there are some duplicates:
# meeting is 会 and 亼
# tool is 丌 and 具

# actually it's fine for that to be one-to-many, but we really have to extract components without unicode

df2 = df[~df['index'].astype(str).str.startswith("variant")]
df2[df2['name'].duplicated(keep=False)].sort_values("name")
