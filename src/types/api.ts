// ── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

// ── Users ─────────────────────────────────────────────────────────────────────

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface UserResponse {
  id: string
  name: string
  email: string
  role: 'MEMBER' | 'ADMIN'
  createdAt: string
}

// ── Assets ────────────────────────────────────────────────────────────────────

export type AssetType = 'STOCK' | 'CRYPTO' | 'REAL_ESTATE' | 'CASH' | 'OTHER'
export type ValuationMode = 'MARKET_PRICE' | 'MANUAL'

export interface CreateAssetRequest {
  userId?: string
  type: AssetType
  name: string
  symbol?: string
  quantity: number
  valuationMode: ValuationMode
  manualUnitValue?: number
  currency: string
}

export interface UpdateAssetRequest {
  name: string
  symbol?: string
  quantity: number
  valuationMode: ValuationMode
  manualUnitValue?: number
  currency: string
}

export interface AssetResponse {
  id: string
  userId: string
  type: AssetType
  name: string
  symbol?: string
  quantity: number
  valuationMode: ValuationMode
  manualUnitValue?: number
  currency: string
  createdAt: string
}

// ── Incomes ───────────────────────────────────────────────────────────────────

export type IncomeFrequency = 'MONTHLY' | 'WEEKLY' | 'FORTNIGHTLY' | 'YEARLY' | 'ONE_TIME'

export interface CreateIncomeRequest {
  userId?: string
  source: string
  frequency: IncomeFrequency
  amount: number
  currency: string
  startsAt: string
  endsAt?: string
}

export interface UpdateIncomeRequest {
  source: string
  frequency: IncomeFrequency
  amount: number
  currency: string
  startsAt: string
  endsAt?: string
}

export interface IncomeResponse {
  id: string
  userId: string
  source: string
  frequency: IncomeFrequency
  amount: number
  currency: string
  startsAt: string
  endsAt?: string
}

// ── Expenses ──────────────────────────────────────────────────────────────────

export type ExpenseCategory =
  | 'RENT' | 'MORTGAGE' | 'GROCERIES' | 'UTILITIES' | 'TRANSPORT'
  | 'INSURANCE' | 'HEALTH' | 'ENTERTAINMENT' | 'EDUCATION'
  | 'SUBSCRIPTIONS' | 'TAX' | 'OTHER'

export type ExpenseFrequency = 'MONTHLY' | 'WEEKLY' | 'FORTNIGHTLY' | 'YEARLY' | 'ONE_TIME'

export interface CreateExpenseRequest {
  userId?: string
  category: ExpenseCategory
  description: string
  frequency: ExpenseFrequency
  amount: number
  currency: string
  startsAt: string
  endsAt?: string
}

export interface UpdateExpenseRequest {
  category: ExpenseCategory
  description: string
  frequency: ExpenseFrequency
  amount: number
  currency: string
  startsAt: string
  endsAt?: string
}

export interface ExpenseResponse {
  id: string
  userId: string
  category: ExpenseCategory
  description: string
  frequency: ExpenseFrequency
  amount: number
  currency: string
  startsAt: string
  endsAt?: string
}

// ── Financial Summary ─────────────────────────────────────────────────────────

export interface SummaryResponse {
  userId: string
  currency: string
  totalAssetsValue: number
  monthlyIncome: number
  monthlyExpenses: number
  monthlySavings: number
  savingsRate: number
  unpricedAssetsCount: number
}

// ── Summary Subscriptions ─────────────────────────────────────────────────────

export type SubscriptionFrequency = 'WEEKLY' | 'MONTHLY'

export interface CreateSubscriptionRequest {
  userId?: string
  frequency: SubscriptionFrequency
  currency: string
}

export interface UpdateSubscriptionRequest {
  frequency: SubscriptionFrequency
  currency: string
}

export interface SubscriptionResponse {
  id: string
  userId: string
  frequency: SubscriptionFrequency
  currency: string
  nextSendAt: string
}
