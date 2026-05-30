/**
 * One-time migration: pushes frontend SEED_* data into MongoDB.
 * Run once: node src/shared/database/migrate-seed-data.js
 * Safe to re-run — uses upsert by legacyId/code so no duplicates.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const mongoose = require('mongoose');
const logger   = require('../utils/logger');

const Supplier = require('../../features/masters/suppliers/suppliers.model');
const Item     = require('../../features/masters/items/items.model');

// ── Import pipeline models ─────────────────────────────────────────────────
// Inline lightweight schemas to avoid importing the full feature module
const importPlanSchema = new mongoose.Schema({
  legacyId: { type: String, unique: true, sparse: true },
  planNo: String, planType: String, name: String,
  business: String, country: String, supplier: String, supplierId: String,
  createdDate: String, status: { type: String, default: 'active' },
  notes: String,
  items: [{ id: String, description: String, itemId: String, plannedQty: Number, unit: String, targetFOB: Number }],
}, { timestamps: true });

const importVoucherSchema = new mongoose.Schema({
  legacyId: { type: String, unique: true, sparse: true },
  voucherNo: { type: String, required: true },
  impoType: { type: String, default: 'HD' },
  productType: String,
  business: String, country: String, currency: { type: String, default: 'USD' },
  supplier: String, supplierId: String,
  customAgency: String, customAgencyId: String,
  transporter: String, transporterId: String,
  planId: String, planNo: String,
  orderDate: String, notes: String, status: { type: String, default: 'active' },
  items: mongoose.Schema.Types.Mixed,
  charges: mongoose.Schema.Types.Mixed,
  steps: mongoose.Schema.Types.Mixed,
  payments: [mongoose.Schema.Types.Mixed],
}, { timestamps: true });

// Avoid OverwriteModelError if models already exist
const ImportPlan    = mongoose.models.ImportPlan    || mongoose.model('ImportPlan',    importPlanSchema);
const ImportVoucher = mongoose.models.ImportVoucher || mongoose.model('ImportVoucher', importVoucherSchema);

// ── Seed Data (copied exactly from frontend App.jsx) ──────────────────────

const SEED_SUPPLIERS = [
  { legacyId:'seed_sup1', name:'Jigar',         type:'supplier',        country:'China',  contact:'', email:'', address:'' },
  { legacyId:'seed_sup2', name:'Rohan',         type:'supplier',        country:'India',  contact:'', email:'', address:'' },
  { legacyId:'seed_sup3', name:'Zaveri Allana', type:'supplier',        country:'Dubai',  contact:'', email:'', address:'' },
  { legacyId:'seed_sup4', name:'Jinfa',         type:'supplier',        country:'Zambia', contact:'', email:'', address:'' },
  { legacyId:'seed_sup5', name:'GTS',           type:'supplier',        country:'India',  contact:'', email:'', address:'' },
  { legacyId:'seed_sup6', name:'Lodhia',        type:'supplier',        country:'India',  contact:'', email:'', address:'' },
];

const SEED_TRANSPORTERS = [
  { legacyId:'seed_tr1', name:'NNS Logistics',    type:'transporter', country:'China', contact:'' },
  { legacyId:'seed_tr2', name:'Honest Logistics', type:'transporter', country:'China', contact:'' },
];

const SEED_AGENCIES = [
  { legacyId:'seed_ca1', name:'Kalonji Duan', type:'clearing_agent', country:'China', contact:'', email:'', address:'' },
  { legacyId:'seed_ca2', name:'Prince Duan',  type:'clearing_agent', country:'China', contact:'', email:'', address:'' },
  { legacyId:'seed_ca3', name:'Platini Duan', type:'clearing_agent', country:'China', contact:'', email:'', address:'' },
  { legacyId:'seed_ca4', name:'Berry Duan',   type:'clearing_agent', country:'China', contact:'', email:'', address:'' },
];

const SEED_ITEMS = [
  { code:'seed_it01', name:'Ferron 10',           productType:'pt_mf', category:'Structural Steel',         unit:'MTR', description:'Iron rebar / ferron 10mm' },
  { code:'seed_it02', name:'Ferron 12',           productType:'pt_mf', category:'Structural Steel',         unit:'MTR', description:'Iron rebar / ferron 12mm' },
  { code:'seed_it03', name:'Ferron 16',           productType:'pt_mf', category:'Structural Steel',         unit:'MTR', description:'Iron rebar / ferron 16mm' },
  { code:'seed_it04', name:'Tube 20x20',          productType:'pt_mo', category:'Square & Rectangular Tubes',unit:'MTR', description:'Square hollow tube 20×20mm' },
  { code:'seed_it05', name:'Tube 40x40',          productType:'pt_mo', category:'Square & Rectangular Tubes',unit:'MTR', description:'Square hollow tube 40×40mm' },
  { code:'seed_it06', name:'National Paint 1LTR', productType:'pt_hd', category:'Paints & Coatings',        unit:'PCS', description:'National Paint — 1 litre tin' },
  { code:'seed_it07', name:'Philips Tube Light',  productType:'pt_hd', category:'Electrical',               unit:'PCS', description:'Philips fluorescent / LED tube light' },
  { code:'seed_it08', name:'Motor Pump 4HP',      productType:'pt_hd', category:'Machinery',                unit:'PCS', description:'Water motor pump 4 horsepower' },
  { code:'seed_it09', name:'Generator 3 KVA',     productType:'pt_hd', category:'Machinery',                unit:'PCS', description:'Petrol / diesel generator 3 KVA' },
  { code:'seed_it10', name:'Angle 25',            productType:'pt_mf', category:'Structural Steel',         unit:'MTR', description:'Steel angle iron 25mm' },
  { code:'seed_it11', name:'Angle 30',            productType:'pt_mf', category:'Structural Steel',         unit:'MTR', description:'Steel angle iron 30mm' },
  { code:'seed_it12', name:'Roofing Sheet BG 28', productType:'pt_mo', category:'Sheets & Roofing',         unit:'PCS', description:'Galvanised roofing sheet gauge 28' },
  { code:'seed_it13', name:'Roofing Sheet BG 34', productType:'pt_mo', category:'Sheets & Roofing',         unit:'PCS', description:'Galvanised roofing sheet gauge 34' },
  { code:'seed_it14', name:'Chair Marriage Red',  productType:'pt_hd', category:'Furniture',                unit:'PCS', description:'Red plastic wedding / marriage chair' },
];

const SEED_PLANS = [
  {
    legacyId: 'seed_plan1',
    planNo: 'PLAN HD0001/Apr/2026', planType: 'HD',
    name: 'Q2 2026 Hardware Bulk Plan',
    business: 'Quin Aliza Group Company', country: 'China',
    supplier: 'Jigar', supplierId: 'seed_sup1',
    createdDate: '2026-04-15', status: 'active',
    notes: 'Bulk hardware import plan — to be imported via multiple IMPOs',
    items: [
      { id:'spi1', description:'Roofing Sheet BG 28', itemId:'seed_it12', plannedQty:10000, unit:'PCS', targetFOB:4 },
      { id:'spi2', description:'Roofing Sheet BG 34', itemId:'seed_it13', plannedQty:8000,  unit:'PCS', targetFOB:3.5 },
      { id:'spi3', description:'Chair Marriage Red',  itemId:'seed_it14', plannedQty:2000,  unit:'PCS', targetFOB:5.5 },
    ],
  },
  {
    legacyId: 'seed_plan2',
    planNo: 'PLAN MTL 0001/May/2026', planType: 'MTL',
    name: 'Q2 2026 Steel & Tube MTL Plan',
    business: 'Quin Aliza Group Company', country: 'India',
    supplier: 'Rohan', supplierId: 'seed_sup2',
    createdDate: '2026-05-01', status: 'active',
    notes: 'Bulk steel import via land route (MTL) — Ferron, Tube and Angle',
    items: [
      { id:'spi2_1', description:'Ferron 10',  itemId:'seed_it01', plannedQty:20000, unit:'MTR', targetFOB:0.85 },
      { id:'spi2_2', description:'Ferron 12',  itemId:'seed_it02', plannedQty:40000, unit:'MTR', targetFOB:1.05 },
      { id:'spi2_3', description:'Ferron 16',  itemId:'seed_it03', plannedQty:10000, unit:'MTR', targetFOB:1.45 },
      { id:'spi2_4', description:'Tube 20x20', itemId:'seed_it04', plannedQty:5000,  unit:'MTR', targetFOB:1.20 },
      { id:'spi2_5', description:'Tube 40x40', itemId:'seed_it05', plannedQty:3000,  unit:'MTR', targetFOB:1.85 },
      { id:'spi2_6', description:'Angle 25',   itemId:'seed_it10', plannedQty:15000, unit:'MTR', targetFOB:0.75 },
      { id:'spi2_7', description:'Angle 30',   itemId:'seed_it11', plannedQty:25000, unit:'MTR', targetFOB:0.90 },
    ],
  },
];

const SEED_VOUCHERS = [
  {
    legacyId: 'seed_v001',
    voucherNo: 'IMPO HD0001/Apr/2026', impoType: 'HD', productType: 'pt_mo',
    business: 'Quin Aliza Group Company', country: 'China', currency: 'USD',
    supplier: 'Jigar', supplierId: 'seed_sup1',
    customAgency: 'Kalonji Duan', customAgencyId: 'seed_ca1',
    transporter: 'NNS Logistics', transporterId: 'seed_tr1',
    planId: 'seed_plan1', planNo: 'PLAN HD0001/Apr/2026',
    orderDate: '2026-04-20', status: 'active',
    items: [
      { id:'seed_v001_i1', description:'Roofing Sheet BG 28', qty:3000, unit:'PCS', fobLocal:29,     salesPrice:10 },
      { id:'seed_v001_i2', description:'Roofing Sheet BG 34', qty:2500, unit:'PCS', fobLocal:25.375, salesPrice:8 },
      { id:'seed_v001_i3', description:'Chair Marriage Red',  qty:500,  unit:'PCS', fobLocal:39.875, salesPrice:12 },
    ],
    charges: { seaFreight:2500, insurance:0, supplierCharges:1000, localPortCharges:0, transportDarKasumbalesa:6500, customsKasumbalesa:8500, transportKasumLubumbashi:0 },
    steps: {
      order_prepared:  { date:'2026-04-20', notes:'Order prepared for Jigar — Roofing sheets & chairs' },
      order_confirmed: { date:'2026-04-22', ref:'PO-HD-001', notes:'Order placed with Jigar' },
      payment: { date:'', notes:'' }, shipment_released: { date:'', notes:'' },
      dar_port: { date:'', notes:'' }, transit_kasumbalesa: { date:'', notes:'' },
      kasumbalesa: { date:'', notes:'' }, transit_lubumbashi: { date:'', notes:'' },
    },
    payments: [],
    notes: 'FOB: BG28=$4/pc, BG34=$3.5/pc, Chair=$5.5/pc | Transporter: NNS Logistics | Agent: Kalonji Duan',
  },
  {
    legacyId: 'seed_v002',
    voucherNo: 'IMPO MTL0001/May/2026', impoType: 'MTL',
    business: 'Quin Aliza Group Company', country: 'Zambia', currency: 'USD',
    supplier: 'Jinfa', supplierId: 'seed_sup4',
    customAgency: '', customAgencyId: '', transporter: '', transporterId: '',
    planId: 'seed_plan2', planNo: 'PLAN MTL 0001/May/2026',
    orderDate: '2026-05-11', status: 'active',
    items: [
      { id:'seed_v002_i1', description:'Ferron 10', qty:5000, unit:'PCS', fobLocal:2.60, salesPrice:4.8 },
      { id:'seed_v002_i2', description:'Ferron 12', qty:3000, unit:'PCS', fobLocal:2.90, salesPrice:5.2 },
      { id:'seed_v002_i3', description:'Ferron 16', qty:1000, unit:'PCS', fobLocal:3.20, salesPrice:7.2 },
    ],
    charges: { seaFreight:0, insurance:0, supplierCharges:0, localPortCharges:0, transportDarKasumbalesa:0, customsKasumbalesa:8500, transportKasumLubumbashi:0 },
    steps: {
      order_prepared: { date:'2026-05-11', notes:'IMPO MTL created — Ferron 10/12/16 from Jinfa India' },
      order_confirmed: { date:'', notes:'' }, payment: { date:'', notes:'' },
      shipment_released: { date:'', notes:'' }, dar_port: { date:'', notes:'' },
      transit_kasumbalesa: { date:'', notes:'' }, kasumbalesa: { date:'', notes:'' },
      transit_lubumbashi: { date:'', notes:'' },
    },
    payments: [],
    notes: 'FOB: Ferron 10=$2.60, Ferron 12=$2.90, Ferron 16=$3.20 | Supplier: Jinfa Zambia | MTL Land Cargo',
  },
];

// ── Migration ─────────────────────────────────────────────────────────────

async function upsertMany(Model, docs, keyField, label) {
  let created = 0, skipped = 0;
  for (const doc of docs) {
    const filter = { [keyField]: doc[keyField] };
    const result = await Model.findOneAndUpdate(filter, { $set: doc }, { upsert: true, new: true });
    if (result.createdAt && new Date() - result.createdAt < 5000) created++; else skipped++;
  }
  logger.info(`${label}: ${created} created, ${skipped} already existed`);
}

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quinaliza');
  logger.info('Connected to MongoDB');

  // Drop old unique index on Supplier.code if it exists
  try { await Supplier.collection.dropIndex('code_1'); } catch (_) {}
  // Add legacyId field to Supplier model dynamically
  if (!Supplier.schema.path('legacyId')) {
    Supplier.schema.add({ legacyId: { type: String, unique: true, sparse: true } });
  }

  await upsertMany(Supplier, SEED_SUPPLIERS,   'legacyId', 'Suppliers');
  await upsertMany(Supplier, SEED_TRANSPORTERS,'legacyId', 'Transporters');
  await upsertMany(Supplier, SEED_AGENCIES,    'legacyId', 'Clearing Agencies');
  await upsertMany(Item,     SEED_ITEMS,        'code',     'Items');
  await upsertMany(ImportPlan,    SEED_PLANS,    'legacyId', 'Import Plans');
  await upsertMany(ImportVoucher, SEED_VOUCHERS, 'legacyId', 'Import Vouchers');

  logger.info('Migration complete — all seed data is now in MongoDB');
  await mongoose.disconnect();
}

migrate().catch(err => { logger.error('Migration failed:', err); process.exit(1); });
