import fitz  # PyMuPDF
try:
    doc = fitz.open("Manual_Integracio_n_API_2_3.pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    with open("getnet_manual_extracted.txt", "w", encoding="utf-8") as f:
        f.write(text)
    print("Success")
except Exception as e:
    print(f"Failed: {e}")
