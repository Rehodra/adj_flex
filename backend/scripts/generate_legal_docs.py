import os

# Base directory for legal documents
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'legal_docs'))

# Definitions for each category: (folder, list of filenames, optional title prefix)
IPC_SECTIONS = [
    "section_299.txt",
    "section_300.txt",
    "section_302.txt",
    "section_304.txt",
    "section_307.txt",
    "section_323.txt",
    "section_326.txt",
    "section_351.txt",
    "section_375.txt",
    "section_376.txt",
    "section_378.txt",
    "section_379.txt",
    "section_380.txt",
    "section_392.txt",
    "section_403.txt",
    "section_406.txt",
    "section_415.txt",
    "section_420.txt",
    "section_463.txt",
    "section_141.txt",
    "section_153A.txt",
    "section_295.txt",
    "section_359.txt",
    "section_363.txt",
    "section_161.txt",
    # add more up to 40 total (placeholder entries)
    "section_101.txt",
    "section_102.txt",
    "section_103.txt",
    "section_104.txt",
    "section_105.txt",
    "section_106.txt",
    "section_107.txt",
    "section_108.txt",
    "section_109.txt",
    "section_110.txt",
    "section_111.txt",
    "section_112.txt",
    "section_113.txt",
    "section_114.txt",
    "section_115.txt",
    "section_116.txt",
    "section_117.txt",
    "section_118.txt",
    "section_119.txt",
    "section_120.txt",
]

CRPC_SECTIONS = [
    "section_154.txt",
    "section_156.txt",
    "section_161.txt",
    "section_167.txt",
    "section_170.txt",
    "section_173.txt",
    "section_207.txt",
    "section_313.txt",
    "section_436.txt",
    "section_437.txt",
    "section_438.txt",
    "section_439.txt",
    "section_440.txt",
    "section_441.txt",
    "section_442.txt",
    "section_443.txt",
    "section_444.txt",
    "section_445.txt",
    "section_446.txt",
    "section_447.txt",
]

EVIDENCE_SECTIONS = [
    "section_003.txt",
    "section_005.txt",
    "section_045.txt",
    "section_060.txt",
    "section_065B.txt",
    "section_101.txt",
    "section_102.txt",
    "section_103.txt",
    "section_104.txt",
    "section_105.txt",
    "section_106.txt",
    "section_107.txt",
    "section_108.txt",
    "section_109.txt",
    "section_110.txt",
]

CONSTITUTION_ARTICLES = [
    "article_014.txt",
    "article_019.txt",
    "article_021.txt",
    "article_032.txt",
    "article_033.txt",
    "article_034.txt",
    "article_035.txt",
    "article_036.txt",
    "article_037.txt",
    "article_038.txt",
]


def write_placeholder(path, title, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(f"{title}\n\n{content}\n")


def generate_ipc():
    folder = os.path.join(BASE_DIR, "ipc")
    for filename in IPC_SECTIONS:
        section_num = filename.replace("section_", "").replace(".txt", "")
        title = f"INDIAN PENAL CODE, 1860\nSection {section_num} - Placeholder"
        content = (
            "CHAPTER: XVI - Of Offences Affecting the Human Body\n"
            "CATEGORY: Placeholder\n"
            "ACT_YEAR: 1860\n\n"
            "SECTION_TEXT: Placeholder text for IPC section {section_num}.\n"
            "KEY_POINTS: • Placeholder point 1\n"
            "• Placeholder point 2"
        )
        write_placeholder(os.path.join(folder, filename), title, content)


def generate_crpc():
    folder = os.path.join(BASE_DIR, "crpc")
    for filename in CRPC_SECTIONS:
        section_num = filename.replace("section_", "").replace(".txt", "")
        title = f"CODE OF CRIMINAL PROCEDURE, 1973\nSection {section_num} - Placeholder"
        content = (
            "CHAPTER: Placeholder\n"
            "CATEGORY: Procedural\n"
            "ACT_YEAR: 1973\n\n"
            "SECTION_TEXT: Placeholder text for CrPC section {section_num}.\n"
            "KEY_POINTS: • Placeholder point 1\n"
            "• Placeholder point 2"
        )
        write_placeholder(os.path.join(folder, filename), title, content)


def generate_evidence():
    folder = os.path.join(BASE_DIR, "evidence_act")
    for filename in EVIDENCE_SECTIONS:
        section_num = filename.replace("section_", "").replace(".txt", "")
        title = f"INDIAN EVIDENCE ACT, 1872\nSection {section_num} - Placeholder"
        content = (
            "CHAPTER: Placeholder\n"
            "CATEGORY: Placeholder\n"
            "ACT_YEAR: 1872\n\n"
            "SECTION_TEXT: Placeholder text for Evidence Act section {section_num}.\n"
            "KEY_POINTS: • Placeholder point 1\n"
            "• Placeholder point 2"
        )
        write_placeholder(os.path.join(folder, filename), title, content)


def generate_constitution():
    folder = os.path.join(BASE_DIR, "constitution")
    for filename in CONSTITUTION_ARTICLES:
        article_num = filename.replace("article_", "").replace(".txt", "")
        title = f"CONSTITUTION OF INDIA, 1950\nArticle {article_num} - Placeholder"
        content = (
            "PART: III - Fundamental Rights\n"
            "CATEGORY: Placeholder\n"
            "ADOPTED: 1950\n\n"
            "ARTICLE_TEXT: Placeholder text for Constitution article {article_num}.\n"
            "KEY_POINTS: • Placeholder point 1\n"
            "• Placeholder point 2"
        )
        write_placeholder(os.path.join(folder, filename), title, content)


def main():
    generate_ipc()
    generate_crpc()
    generate_evidence()
    generate_constitution()
    print("✅ Legal document placeholders generated successfully.")

if __name__ == "__main__":
    main()
