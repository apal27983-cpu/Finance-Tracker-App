import { describe, expect, it } from 'vitest';
import { calculateBudgetProgress, calculateCategoryExpenses, calculateGoalProgress, calculateNetSavings, calculateTotalBalance, calculateTotalExpenses, calculateTotalIncome, csvFor, filterTransactions, suggestCategory, validateTransaction } from '../utils/finance';
const data=[{id:'a',date:'2026-10-03',type:'income',amount:2000,category:'Salary',note:'salary'},{id:'b',date:'2026-10-05',type:'expense',amount:500,category:'Food & Dining',note:'Cafe, "Coffee"\nwith friends'},{id:'c',date:'2026-09-02',type:'expense',amount:100,category:'Transport',note:'bus'}];
describe('finance calculations',()=>{
 it('calculates totals and net balance',()=>{expect(calculateTotalIncome(data)).toBe(2000);expect(calculateTotalExpenses(data)).toBe(600);expect(calculateNetSavings(data)).toBe(1400);expect(calculateTotalBalance(data)).toBe(1400)});
 it('filters by month and aggregates expense categories',()=>{const month=t=>t.date.startsWith('2026-10');expect(filterTransactions(data,{month:'2026-10'})).toHaveLength(2);expect(calculateCategoryExpenses(data,month)).toEqual({'Food & Dining':500})});
 it('calculates budget progress at normal, near, and over limit',()=>{const tx=(amount)=>[{type:'expense',category:'Food & Dining',date:'2026-10-05',amount}];const b={category:'Food & Dining',month:'2026-10',monthlyLimit:1000};expect(calculateBudgetProgress(tx(500),b).percentageUsed).toBe(50);expect(calculateBudgetProgress(tx(900),b).percentageUsed).toBe(90);expect(calculateBudgetProgress(tx(1200),b)).toMatchObject({percentageUsed:120,remaining:-200})});
 it('tracks completed and overfunded savings goals',()=>{expect(calculateGoalProgress({targetAmount:100,currentAmount:120})).toEqual({remaining:0,percentageCompleted:120})});
});
describe('validation and offline categorization',()=>{
 it('suggests categories from known keywords and leaves unknown text alone',()=>{expect(suggestCategory(' Swiggy dinner ','expense')).toBe('Food & Dining');expect(suggestCategory('payroll','income')).toBe('Salary');expect(suggestCategory('unmatched merchant','expense')).toBeNull();expect(suggestCategory('refund from salary','expense')).toBeNull()});
 it('rejects invalid amounts and accepts a valid transaction',()=>{const t={type:'expense',amount:1,date:'2026-10-05',category:'Food & Dining'};expect(validateTransaction({...t,amount:0})).toBeTruthy();expect(validateTransaction(t)).toBeNull()});
 it('escapes CSV quotes, commas, and newlines',()=>{const csv=csvFor(data.slice(1,2));expect(csv).toContain('"Cafe, ""Coffee""\nwith friends"')});
});
