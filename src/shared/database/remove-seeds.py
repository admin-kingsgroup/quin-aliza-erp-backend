"""
Removes SEED_* constant blocks from App.jsx and cleans up fallback references.
Run from anywhere: python remove-seeds.py
"""
import re

path = r'C:\Users\Admin\codes\kbiz360-quin-aliza-frontend\src\App.jsx'

with open(path, 'r', encoding='utf-8', newline='') as f:
    content = f.read()

original_len = len(content)

# 1. Remove each SEED_* block (const SEED_X = [...]; or const SEED_X = {...};)
#    These are top-level const declarations spanning multiple lines until ];
seed_names = ['SEED_SUPPLIERS', 'SEED_TRANSPORTERS', 'SEED_AGENCIES',
              'SEED_ITEMS', 'SEED_PLANS', 'SEED_VOUCHERS']

for name in seed_names:
    # Match: const NAME = [ ... ]; (multiline, non-greedy to stop at first ];)
    pattern = rf'const {name}\s*=\s*\[[\s\S]*?\];\s*\n'
    content = re.sub(pattern, '', content)

# 2. Remove the "// Prices in USD FOB" comment that preceded SEED_VOUCHERS
content = content.replace('// Prices in USD FOB\n', '')

# 3. Remove the import of SEED_COGS_ACCOUNT, mergeSeeds, mergeSeedsById, mergeSuppliersById
#    from seed-data.js (keep REMEMBER_KEY, _loadRemembered which are still needed)
content = content.replace(
    '  SEED_COGS_ACCOUNT, mergeSeeds, mergeSeedsById, mergeSuppliersById,\n',
    ''
)

# 4. Remove seed fallbacks in the load useEffect
removals = [
    # Merge seed calls
    "      d.suppliers      = mergeSuppliersById(d.suppliers||[], SEED_SUPPLIERS);\n",
    "      d.transporters   = mergeSeeds(d.transporters||[],   SEED_TRANSPORTERS);\n",
    "      d.customAgencies = mergeSeeds(d.customAgencies||[], SEED_AGENCIES);\n",
    "      d.productItems   = mergeSeedsById(d.productItems||[], SEED_ITEMS);\n",
    "      d.vouchers       = mergeSeedsById(d.vouchers||[],     SEED_VOUCHERS);\n",
    "      d.importPlans    = mergeSeedsById(d.importPlans||[],  SEED_PLANS);\n",
    # Patch blocks that reference seed IDs
    '      // Patch: force Jinfa country=Zambia and fix IMPO MTL0001 currency=USD + charges + sales prices\n',
    '      d.suppliers = d.suppliers.map(s=>s.name==="Jinfa"?{...s,country:"Zambia"}:s);\n',
    # COGS account seed
    '      if(Array.isArray(d.financeAccounts) && !d.financeAccounts.find(a=>a.name==="Cost of Goods Sold"))\n',
    '        d.financeAccounts.push(SEED_COGS_ACCOUNT);\n',
    # Merge seeds line in the default init block
    '      // Merge seed data (won\'t duplicate if name already exists)\n',
]
for r in removals:
    content = content.replace(r, '')

# 5. Remove the multi-line voucher patch block (seed_v002 patch)
patch_pattern = r'\s*d\.vouchers\s*=\s*d\.vouchers\.map\(v=>\{[\s\S]*?if\(v\.id!=="seed_v002"\)[^\n]*\n[\s\S]*?\}\);\s*\n'
content = re.sub(patch_pattern, '\n', content)

# 6. Replace seed fallbacks in the parallel load block
content = content.replace(
    "        productItems:      _v(_items)              || [],",
    "        productItems:      _v(_items)              || [],"
)  # no-op, already correct

with open(path, 'w', encoding='utf-8', newline='') as f:
    f.write(content)

removed = original_len - len(content)
print(f'Done. Removed ~{removed} chars ({removed//1000}KB) of seed data from App.jsx')
