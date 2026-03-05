import markdown
from weasyprint import HTML, CSS
import re

# Read markdown
with open('/Users/danielemarino/.cursor-tutor/Virale_Post_Analyse_2026.md', 'r', encoding='utf-8') as f:
    md_content = f.read()

# Convert markdown to HTML
md = markdown.Markdown(extensions=['tables', 'fenced_code'])
html_body = md.convert(md_content)

# Full HTML with premium styling
html = f"""<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  :root {{
    --black: #0a0a0a;
    --dark: #111111;
    --accent: #0a66c2;
    --accent-light: #e8f1fb;
    --white: #ffffff;
    --gray-100: #f5f5f5;
    --gray-200: #e8e8e8;
    --gray-400: #999999;
    --gray-600: #555555;
  }}

  * {{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }}

  body {{
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 11pt;
    line-height: 1.75;
    color: var(--dark);
    background: var(--white);
  }}

  /* PAGE SETUP */
  @page {{
    size: A4;
    margin: 22mm 20mm 22mm 20mm;
    @bottom-center {{
      content: counter(page);
      font-family: 'Inter', sans-serif;
      font-size: 9pt;
      color: var(--gray-400);
    }}
  }}

  @page :first {{
    margin: 0;
    @bottom-center {{ content: none; }}
  }}

  /* COVER PAGE */
  .cover {{
    page: cover;
    width: 100%;
    height: 297mm;
    background: var(--black);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 18mm;
    page-break-after: always;
  }}

  @page cover {{
    margin: 0;
    @bottom-center {{ content: none; }}
  }}

  .cover-tag {{
    font-size: 9pt;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 20mm;
  }}

  .cover-title {{
    font-size: 38pt;
    font-weight: 900;
    line-height: 1.1;
    color: var(--white);
    margin-bottom: 8mm;
    letter-spacing: -1px;
  }}

  .cover-subtitle {{
    font-size: 14pt;
    font-weight: 400;
    color: var(--gray-400);
    margin-bottom: 16mm;
    line-height: 1.5;
  }}

  .cover-divider {{
    width: 40px;
    height: 3px;
    background: var(--accent);
    margin-bottom: 14mm;
  }}

  .cover-desc {{
    font-size: 11pt;
    color: var(--gray-400);
    line-height: 1.7;
    max-width: 130mm;
    margin-bottom: 20mm;
  }}

  .cover-author {{
    font-size: 10pt;
    font-weight: 600;
    color: var(--white);
    letter-spacing: 0.5px;
  }}

  .cover-handle {{
    font-size: 9pt;
    color: var(--accent);
    margin-top: 2mm;
  }}

  .cover-year {{
    font-size: 9pt;
    color: #444;
    margin-top: 28mm;
    letter-spacing: 1px;
  }}

  /* TOC PAGE */
  .toc-page {{
    page-break-before: always;
    page-break-after: always;
    padding: 12mm 0;
  }}

  /* CHAPTER BREAK */
  .chapter-break {{
    page-break-before: always;
    background: var(--black);
    margin: 0 -20mm;
    padding: 18mm 20mm 14mm;
    margin-bottom: 14mm;
  }}

  .chapter-num {{
    font-size: 9pt;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 4mm;
  }}

  .chapter-title {{
    font-size: 26pt;
    font-weight: 900;
    color: var(--white);
    line-height: 1.15;
    letter-spacing: -0.5px;
  }}

  /* TYPOGRAPHY */
  h1 {{
    font-size: 26pt;
    font-weight: 900;
    color: var(--black);
    line-height: 1.15;
    margin-top: 12mm;
    margin-bottom: 6mm;
    letter-spacing: -0.5px;
    page-break-after: avoid;
  }}

  h2 {{
    font-size: 15pt;
    font-weight: 800;
    color: var(--black);
    margin-top: 10mm;
    margin-bottom: 4mm;
    letter-spacing: -0.2px;
    page-break-after: avoid;
  }}

  h3 {{
    font-size: 12pt;
    font-weight: 700;
    color: var(--dark);
    margin-top: 7mm;
    margin-bottom: 3mm;
    page-break-after: avoid;
  }}

  h4 {{
    font-size: 10.5pt;
    font-weight: 600;
    color: var(--gray-600);
    margin-top: 5mm;
    margin-bottom: 2mm;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    page-break-after: avoid;
  }}

  p {{
    margin-bottom: 4mm;
    orphans: 3;
    widows: 3;
  }}

  /* HORIZONTAL RULES — Chapter separators */
  hr {{
    border: none;
    border-top: 1px solid var(--gray-200);
    margin: 10mm 0;
  }}

  /* LISTS */
  ul, ol {{
    margin: 3mm 0 5mm 6mm;
    padding: 0;
  }}

  li {{
    margin-bottom: 2mm;
    padding-left: 2mm;
  }}

  ul li::marker {{
    color: var(--accent);
  }}

  /* BLOCKQUOTES */
  blockquote {{
    border-left: 3px solid var(--accent);
    margin: 6mm 0;
    padding: 4mm 6mm;
    background: var(--accent-light);
    border-radius: 0 4px 4px 0;
    font-style: italic;
    color: var(--gray-600);
    page-break-inside: avoid;
  }}

  blockquote p {{
    margin: 0;
  }}

  /* CODE */
  code {{
    background: var(--gray-100);
    border-radius: 3px;
    padding: 1px 4px;
    font-size: 9.5pt;
    font-family: 'SF Mono', 'Fira Code', monospace;
    color: #d63384;
  }}

  pre {{
    background: var(--gray-100);
    border-radius: 6px;
    padding: 5mm;
    margin: 4mm 0;
    overflow: hidden;
    page-break-inside: avoid;
  }}

  pre code {{
    background: none;
    padding: 0;
    color: var(--dark);
  }}

  /* TABLES */
  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 5mm 0;
    font-size: 10pt;
    page-break-inside: avoid;
  }}

  th {{
    background: var(--black);
    color: var(--white);
    padding: 3mm 4mm;
    text-align: left;
    font-weight: 600;
    font-size: 9.5pt;
    letter-spacing: 0.3px;
  }}

  td {{
    padding: 2.5mm 4mm;
    border-bottom: 1px solid var(--gray-200);
    vertical-align: top;
  }}

  tr:nth-child(even) td {{
    background: var(--gray-100);
  }}

  tr:last-child td {{
    border-bottom: none;
  }}

  /* STRONG / EM */
  strong {{
    font-weight: 700;
    color: var(--black);
  }}

  em {{
    color: var(--gray-600);
  }}

  /* CHECKBOXES / Special chars */
  p:has(> input[type=checkbox]) {{
    display: flex;
    align-items: center;
    gap: 2mm;
  }}

  /* CALLOUT BOX for important info */
  .callout {{
    background: var(--accent-light);
    border-left: 4px solid var(--accent);
    border-radius: 0 6px 6px 0;
    padding: 4mm 6mm;
    margin: 5mm 0;
    page-break-inside: avoid;
  }}

  /* FOOTER LINE */
  .footer-line {{
    border-top: 1px solid var(--gray-200);
    padding-top: 4mm;
    margin-top: 10mm;
    font-size: 8.5pt;
    color: var(--gray-400);
    text-align: center;
  }}

</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <div class="cover-tag">Daniele Marino · 2026 Edition</div>
  <div class="cover-title">Die Virale<br>Post Analyse<br>2026</div>
  <div class="cover-subtitle">958 Posts. 40.000+ Datenpunkte.<br>Der neue LinkedIn-Algorithmus.</div>
  <div class="cover-divider"></div>
  <div class="cover-desc">Was wirklich viral geht — und warum dein bisheriger Ansatz 2026 nicht mehr funktioniert. Die komplette, datengestützte Neuauflage kombiniert mit dem LinkedIn Algorithmus Masterplan 2026.</div>
  <div class="cover-author">Daniele Marino</div>
  <div class="cover-handle">@danielemarino · Personal Branding Experte</div>
  <div class="cover-year">COPYRIGHT © 2026 · ALLE RECHTE VORBEHALTEN</div>
</div>

<!-- MAIN CONTENT -->
{html_body}

<div class="footer-line">
  Copyright © 2026 Daniele Marino · @danielemarino · Alle Rechte vorbehalten.
</div>

</body>
</html>"""

# Write HTML for debugging
with open('/Users/danielemarino/.cursor-tutor/Virale_Post_Analyse_2026.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("HTML written. Generating PDF...")

# Generate PDF
HTML(string=html, base_url='/').write_pdf(
    '/Users/danielemarino/Desktop/Virale_Post_Analyse_2026.pdf'
)

print("PDF saved to Desktop!")
