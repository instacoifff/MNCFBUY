import re

with open('src/app/admin/(dashboard)/DashboardCharts.tsx', 'r') as f:
    content = f.read()

# We need to reorder the layout.
# Current order:
# 1. Top 2-Column Section (Revenue + Retention&Channels)
# 2. Middle Grid (Recent Orders)
# 3. Bottom Grid (Categories & Region)

# Let's extract the blocks.
revenue_start = content.find('{/* Left Column (Revenue Overview) */}')
revenue_end = content.find('{/* Right Column (Retention & Channels) */}')

retention_start = content.find('{/* Right Column (Retention & Channels) */}')
retention_end = content.find('{/* Middle Grid (Recent Orders) */}')

orders_start = content.find('{/* Middle Grid (Recent Orders) */}')
orders_end = content.find('{/* Bottom Grid (Categories & Region) */}')

bottom_start = content.find('{/* Bottom Grid (Categories & Region) */}')
bottom_end = content.find('    </div>\n  )\n}')

revenue_block = content[revenue_start:revenue_end].strip()
retention_block = content[retention_start:retention_end].strip()
orders_block = content[orders_start:orders_end].strip()
bottom_block = content[bottom_start:bottom_end].strip()

# Now reconstruct the layout:
new_layout = f"""
      {{/* Main 2-Column Layout */}}
      <div style={{{{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', '@media(min-width: 1200px)': {{ gridTemplateColumns: '2.3fr 1fr' }} }}}} as any>
        
        {{/* Left Main Column */}}
        <div style={{{{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}}}>
          {revenue_block}

          {orders_block}

          {bottom_block}
        </div>

        {{/* Right Main Column */}}
        {retention_block}

      </div>
"""

# Replace everything from " {/* Top 2-Column Section */}" down to "    </div>\n  )\n}"
replace_start = content.find('{/* Top 2-Column Section */}')
replace_end = bottom_end

new_content = content[:replace_start] + new_layout.strip() + '\n    </div>\n  )\n}\n'

with open('src/app/admin/(dashboard)/DashboardCharts.tsx', 'w') as f:
    f.write(new_content)

print("Layout rewritten!")
