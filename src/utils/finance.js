export const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investments', 'Refunds & Cashback', 'Other Income'],
  expense: ['Food & Dining', 'Transport', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Healthcare', 'Housing', 'Education', 'Groceries', 'Travel', 'Other Expense'],
};
export const KEY = { transactions: 'finora.transactions.v1', budgets: 'finora.budgets.v1', goals: 'finora.savingsGoals.v1', settings: 'finora.settings.v1' };
export const id = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const today = () => new Date().toISOString().slice(0, 10);
export function safeRead(key, fallback) { try { const raw=localStorage.getItem(key); if(!raw)return fallback; const parsed=JSON.parse(raw); return Array.isArray(fallback)?(Array.isArray(parsed)?parsed:fallback):({...fallback,...parsed}); } catch { return fallback; } }
export const sum = (xs) => Math.round(xs.reduce((a,x)=>a+(Number(x.amount)||0),0)*100)/100;
export const money = (n,currency='INR') => new Intl.NumberFormat('en-IN',{style:'currency',currency,maximumFractionDigits:0}).format(Number(n)||0);
export const monthLabel = (m) => new Date(`${m}-02`).toLocaleDateString('en',{month:'long',year:'numeric'});
export const monthKey = (d) => String(d||'').slice(0,7);
export function suggestCategory(note,type){const rules=type==='income'?[['Salary',/\b(salary|payroll)\b/i],['Freelance',/\b(freelance|client payment)\b/i],['Investments',/\b(dividend|interest)\b/i],['Refunds & Cashback',/\b(refund|cashback)\b/i]]:[['Food & Dining',/\b(swiggy|zomato|restaurant|cafe|pizza|dinner|lunch)\b/i],['Transport',/\b(uber|ola|petrol|fuel|metro|bus)\b/i],['Shopping',/\b(amazon|flipkart|shopping|clothes)\b/i],['Bills & Utilities',/\b(electricity|water bill|internet|mobile recharge)\b/i],['Entertainment',/\b(netflix|spotify|subscription)\b/i],['Healthcare',/\b(hospital|pharmacy|medicine|doctor)\b/i],['Housing',/\b(rent|landlord)\b/i],['Education',/\b(school|course|tuition|books)\b/i]];return rules.find(([,r])=>r.test(String(note||'').toLowerCase()))?.[0]||null;}
export const escapeCSV = v => `"${String(v??'').replaceAll('"','""')}"`;
export function csvFor(rows){return ['ID,Date,Type,Amount,Category,Note,Created At,Updated At',...rows.map(x=>[x.id,x.date,x.type,x.amount,x.category,x.note,x.createdAt,x.updatedAt].map(escapeCSV).join(','))].join('\r\n');}
export function inPeriod(date,period){const d=new Date(`${date}T00:00:00`),n=new Date();if(Number.isNaN(d.getTime()))return false;if(period==='All time')return true;if(period==='This month')return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear();if(period==='Last month'){const p=new Date(n.getFullYear(),n.getMonth()-1,1);return d.getMonth()===p.getMonth()&&d.getFullYear()===p.getFullYear();}if(period==='This year')return d.getFullYear()===n.getFullYear();return d>=new Date(n.getFullYear(),n.getMonth()-2,1)&&d<=new Date(n.getFullYear(),n.getMonth()+1,0,23,59,59);}
export function calculateTotalIncome(transactions = [], predicate = () => true) {
  return sum(transactions.filter(t => t?.type === 'income' && predicate(t)).map(t => ({amount: t.amount})));
}
export function calculateTotalExpenses(transactions = [], predicate = () => true) {
  return sum(transactions.filter(t => t?.type === 'expense' && predicate(t)).map(t => ({amount: t.amount})));
}
export const calculateNetSavings = (transactions = [], predicate = () => true) => calculateTotalIncome(transactions, predicate) - calculateTotalExpenses(transactions, predicate);
export const calculateTotalBalance = transactions => calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
export function calculateCategoryExpenses(transactions = [], predicate = () => true) {
  return transactions.filter(t=>t?.type==='expense'&&predicate(t)).reduce((out,t)=>({...out,[t.category||'Uncategorized']:(out[t.category||'Uncategorized']||0)+(Number(t.amount)||0)}),{});
}
export function calculateBudgetProgress(transactions, budget) {
  const amount=sum(transactions.filter(t=>t?.type==='expense'&&t.category===budget?.category&&monthKey(t.date)===budget?.month));
  return {spent:amount,remaining:(Number(budget?.monthlyLimit)||0)-amount,percentageUsed:budget?.monthlyLimit>0?amount/budget.monthlyLimit*100:0};
}
export function calculateGoalProgress(goal={}) {
  const target=Number(goal.targetAmount)||0,current=Number(goal.currentAmount)||0;
  return {remaining:Math.max(0,target-current),percentageCompleted:target>0?current/target*100:0};
}
export function filterTransactions(transactions=[],filters={}) {
  const {search='',type='All',category='All',month='',startDate='',endDate=''}=filters;
  return transactions.filter(t=>(!search||`${t.note||''} ${t.category||''}`.toLowerCase().includes(search.toLowerCase()))&&(type==='All'||t.type===type.toLowerCase())&&(category==='All'||t.category===category)&&(!month||monthKey(t.date)===month)&&(!startDate||t.date>=startDate)&&(!endDate||t.date<=endDate));
}
export function validateTransaction(t={}) {
  if(!['income','expense'].includes(t.type))return 'Choose income or expense.';
  if(!(Number(t.amount)>0&&Number.isFinite(Number(t.amount))))return 'Amount must be greater than zero.';
  if(!/^\d{4}-\d{2}-\d{2}$/.test(t.date||'')||Number.isNaN(new Date(`${t.date}T00:00:00`).getTime()))return 'Choose a valid date.';
  if(!CATEGORIES[t.type]?.includes(t.category))return 'Choose a valid category.';
  return null;
}
