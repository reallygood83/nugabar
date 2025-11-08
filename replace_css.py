#!/usr/bin/env python3
"""
Replace CSS in HTML file with Neo-Brutalism styles
"""

# Read the original HTML file
with open('/Users/moon/Desktop/nugabar-main/NugabarComplete.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Read the new CSS
with open('/Users/moon/Desktop/nugabar-main/neo-brutalism-styles.css', 'r', encoding='utf-8') as f:
    new_css = f.read()

# Replace CSS section (lines 8-1270 with new CSS)
# Keep first 7 lines (DOCTYPE, html, head, base, meta, title)
# Then insert new style tag with new CSS
# Then keep everything from line 1271 onwards (</head><body>...)

new_html = []
new_html.extend(lines[:7])  # Lines 1-7
new_html.append('  <style>\n')  # Line 8 - start of style tag
new_html.append(new_css)  # New CSS content
if not new_css.endswith('\n'):
    new_html.append('\n')
new_html.extend(lines[1270:])  # Line 1271 onwards (</style></head><body>...)

# Write the new HTML file
with open('/Users/moon/Desktop/nugabar-main/NugabarComplete_NeoBrutalism.html', 'w', encoding='utf-8') as f:
    f.writelines(new_html)

print("✅ Neo-Brutalism CSS successfully applied!")
print("📁 New file: /Users/moon/Desktop/nugabar-main/NugabarComplete_NeoBrutalism.html")
print("💾 Backup file: /Users/moon/Desktop/nugabar-main/NugabarComplete.backup.html")
