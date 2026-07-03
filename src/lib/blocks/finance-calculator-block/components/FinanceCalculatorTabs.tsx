import {
  CALCULATOR_TABS,
  type CalculatorTab,
} from '@/lib/blocks/finance-calculator-block/financeCalculatorOptions'
import { cn } from '@/lib/utils/cn'

type FinanceCalculatorTabsProps = {
  activeTab: CalculatorTab
  onTabChange: (tab: CalculatorTab) => void
}

export function FinanceCalculatorTabs({ activeTab, onTabChange }: FinanceCalculatorTabsProps) {
  return (
    <div
      className="mb-6 flex flex-wrap gap-2 border-b border-neutral-200 pb-4"
      role="tablist"
      aria-label="Finance calculator mode"
    >
      {CALCULATOR_TABS.map((tab) => {
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`finance-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`finance-panel-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900',
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export function getFinanceCalculatorPanelId(tab: CalculatorTab): string {
  return `finance-panel-${tab}`
}

export function getFinanceCalculatorTabId(tab: CalculatorTab): string {
  return `finance-tab-${tab}`
}
