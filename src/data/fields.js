/* Searchable field catalog per module — field type drives the badge + default operator/value
   'txt'=text/contains, 'enum'=pick list (=), 'num'=numeric (range), 'date'=date (range) */
export const FIELD_DEFS = {
  drugs:{
    'Identity & Classification':[
      {n:'Drug Name', t:'txt'}, {n:'Company Name', t:'txt'}, {n:'Company HQ', t:'enum'},
      {n:'Molecule Nature', t:'enum'}, {n:'Drug Type', t:'enum'}, {n:'Technology Type', t:'enum'}, {n:'Vector Type', t:'enum'},
    ],
    'Clinical Profile':[
      {n:'Indication', t:'enum'}, {n:'Subject Characteristics', t:'txt'}, {n:'ROA', t:'enum'},
      {n:'Dosage Form', t:'enum'}, {n:'Application Type', t:'enum'},
    ],
    'Regulatory':[
      {n:'Approval Date', t:'date'},
    ],
  },
  trials:{
    'Identifiers':[
      {n:'NCT ID', t:'txt'}, {n:'Drug Name', t:'txt'},
    ],
    'Trial Design':[
      {n:'Trial Status', t:'enum'}, {n:'Biomarker Type', t:'enum'}, {n:'Enrollment Size', t:'num'},
      {n:'Trial Start Date', t:'date'}, {n:'Trial Completion Date', t:'date'},
    ],
    'Site & Personnel':[
      {n:'Clinical Site', t:'txt'}, {n:'Principal Investigator', t:'txt'},
    ],
  },
  companies:{
    'Identity':[
      {n:'Company Name', t:'txt'}, {n:'HQ', t:'enum'}, {n:'Business Type', t:'enum'},
      {n:'Highest Drug Stage', t:'enum'}, {n:'Department', t:'enum'}, {n:'Designation', t:'enum'},
    ],
    'Financials':[
      {n:'Annual Revenue', t:'num'}, {n:'COGS', t:'num'}, {n:'SG&A', t:'num'},
      {n:'Research Expenses', t:'num'}, {n:'Other Costs', t:'num'}, {n:'Operating Profit', t:'num'}, {n:'Net Profit', t:'num'},
    ],
    'Financial Ratios':[
      {n:'WACC', t:'num'}, {n:'Leverage Ratio', t:'num'}, {n:'Profitability Ratio', t:'num'},
    ],
  },
  drugprice:{
    'Identity':[
      {n:'Drug Name', t:'txt'}, {n:'Company Name', t:'txt'}, {n:'Country', t:'enum'},
      {n:'Year', t:'num'}, {n:'Package', t:'txt'}, {n:'No. of Units', t:'num'},
    ],
    'Commercial':[
      {n:'Drug Price', t:'num'}, {n:'Annual Cost of Therapy', t:'num'},
      {n:'Reimbursement (Y/N)', t:'enum'}, {n:'Reimbursement Range', t:'txt'},
    ],
  },
  cot:{
    'Identity':[
      {n:'Drug Name', t:'txt'}, {n:'Company Name', t:'txt'}, {n:'Country', t:'enum'}, {n:'Indication', t:'enum'},
    ],
    'Commercial':[
      {n:'Annual Cost of Therapy', t:'num'}, {n:'Cost per Course', t:'num'},
      {n:'Payer Type', t:'enum'}, {n:'Comparator Therapy Cost', t:'num'},
    ],
  },
  irp:{
    'Identity':[
      {n:'Drug Name', t:'txt'}, {n:'Company Name', t:'txt'}, {n:'Reference Country', t:'enum'},
    ],
    'Pricing':[
      {n:'List Price', t:'num'}, {n:'Reference Basket', t:'txt'}, {n:'US / Intl Price Ratio', t:'num'},
    ],
  },
};
export const FIELD_TYPE_DEFAULT_OP = {txt:'contains', enum:'=', num:'between', date:'between'};
export const FIELD_TYPE_DEFAULT_VAL = {txt:'(set value)', enum:'(select…)', num:'(set range)', date:'(set range)'};
