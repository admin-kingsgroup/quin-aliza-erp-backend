const DocSeries = require('../../features/settings/settings.model').DocSeries;

const nextDocNumber = async (module, branchId) => {
  const key = branchId ? `${module}_${branchId}` : module;
  const series = await DocSeries.findOneAndUpdate(
    { module: key },
    { $inc: { currentNo: 1 }, $set: { lastUsed: new Date() } },
    { new: true, upsert: true }
  );
  const no = series.currentNo;
  const prefix = series.prefix || module.toUpperCase().slice(0, 3);
  return `${prefix}-${String(no).padStart(6, '0')}`;
};

module.exports = { nextDocNumber };
