## Current Summary (after Phase 11)

### What exists
- **Analytics page** at `/analytics` with `DateRangePicker` + `CashFlowChart` + `CategoryBreakdownChart` + `TopCategoriesWidget`
- **Shared chart primitives**: `FIPAreaChart`, `FIPPieChart`, `ChartTooltip`, `DateRangePicker` (all with dark mode, loading/empty/error states)
- **4 API hooks**: `useCashFlow`, `useCategoryBreakdown`, `useCashFlowByAccount`, `useNetWorth`
- **Backend**: 4 analytics endpoints all working (`cash-flow`, `category-breakdown`, `cash-flow-by-account`, `net-worth`)

### What's next
1. **SpendingHeatmap** — calendar grid component (needs hook + backend endpoint or local transform)
2. **CashFlowByAccountChart** — stacked bars by account
3. **NetWorthChart** — multi-line area chart over time
4. **Period comparison** — % change badges on totals
5. **Export button** — download chart as PNG
