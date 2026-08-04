/** Catalog / new-vehicle LMS fields (hidden + auto-filled from vehicle/model page). */
export const catalogVehicleLmsSeedFields = [
  {
    blockType: 'text' as const,
    blockName: 'vehicleName',
    name: 'vehicleName',
    label: 'Vehicle',
    required: false,
    width: 100,
    hidden: true,
  },
  {
    blockType: 'text' as const,
    blockName: 'brand',
    name: 'brand',
    label: 'Brand',
    required: false,
    width: 50,
    hidden: true,
  },
  {
    blockType: 'text' as const,
    blockName: 'model',
    name: 'model',
    label: 'Model',
    required: false,
    width: 50,
    hidden: true,
  },
  {
    blockType: 'text' as const,
    blockName: 'modelRange',
    name: 'modelRange',
    label: 'Model Range',
    required: false,
    width: 50,
    hidden: true,
  },
]

/** Stock / showroom-only attribute fields (not used on catalog new-vehicle forms). */
export const stockVehicleLmsSeedFields = [
  {
    blockType: 'text' as const,
    blockName: 'mmCode',
    name: 'mmCode',
    label: 'MM Code',
    required: false,
    width: 50,
    hidden: true,
  },
  {
    blockType: 'text' as const,
    blockName: 'year',
    name: 'year',
    label: 'Year',
    required: false,
    width: 50,
    hidden: true,
  },
  {
    blockType: 'text' as const,
    blockName: 'mileage',
    name: 'mileage',
    label: 'Mileage',
    required: false,
    width: 50,
    hidden: true,
  },
  {
    blockType: 'text' as const,
    blockName: 'price',
    name: 'price',
    label: 'Price',
    required: false,
    width: 50,
    hidden: true,
  },
  {
    blockType: 'text' as const,
    blockName: 'stockNumber',
    name: 'stockNumber',
    label: 'Stock Number',
    required: false,
    width: 50,
    hidden: true,
  },
  {
    blockType: 'text' as const,
    blockName: 'vin',
    name: 'vin',
    label: 'VIN',
    required: false,
    width: 50,
    hidden: true,
  },
  {
    blockType: 'text' as const,
    blockName: 'dealershipName',
    name: 'dealershipName',
    label: 'Dealership Name',
    required: false,
    width: 50,
    hidden: true,
  },
  {
    blockType: 'text' as const,
    blockName: 'type',
    name: 'type',
    label: 'Type',
    required: false,
    width: 50,
    hidden: true,
  },
  {
    blockType: 'text' as const,
    blockName: 'colour',
    name: 'colour',
    label: 'Colour',
    required: false,
    width: 50,
    hidden: true,
  },
  {
    blockType: 'text' as const,
    blockName: 'regNo',
    name: 'regNo',
    label: 'Reg No',
    required: false,
    width: 50,
    hidden: true,
  },
]

/** Full VDP vehicle attribute fields (catalog + stock). */
export const vehicleLmsSeedFields = [...catalogVehicleLmsSeedFields, ...stockVehicleLmsSeedFields]

export const STOCK_VEHICLE_LMS_FIELD_NAMES = stockVehicleLmsSeedFields.map(
  (field) => field.name,
) as readonly string[]

export const CATALOG_VEHICLE_LMS_FIELD_NAMES = catalogVehicleLmsSeedFields.map(
  (field) => field.name,
) as readonly string[]
