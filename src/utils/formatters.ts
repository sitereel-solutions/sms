// Indian Rupee currency formatter with correct lakh/crore commas
export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '₹0';
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));
  
  const str = absAmount.toString();
  let lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `${isNegative ? '-' : ''}₹${res}`;
}

export function formatCompactCurrency(amount: number): string {
  if (Math.abs(amount) >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (Math.abs(amount) >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  if (Math.abs(amount) >= 1000) {
    return `₹${(amount / 1000).toFixed(1)} K`;
  }
  return formatCurrency(amount);
}

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertBelowThousand(n: number): string {
  let str = '';
  if (n >= 100) {
    str += ONES[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }
  if (n >= 20) {
    str += TENS[Math.floor(n / 10)] + ' ';
    n %= 10;
  }
  if (n > 0) {
    str += ONES[n] + ' ';
  }
  return str.trim();
}

export function numberToWordsINR(amount: number): string {
  if (amount === 0) return 'Zero Rupees Only';
  
  const num = Math.floor(Math.abs(amount));
  let result = '';
  
  const crore = Math.floor(num / 10000000);
  let rem = num % 10000000;
  
  const lakh = Math.floor(rem / 100000);
  rem %= 100000;
  
  const thousand = Math.floor(rem / 1000);
  rem %= 1000;
  
  const hundred = rem;
  
  if (crore > 0) {
    result += convertBelowThousand(crore) + ' Crore ';
  }
  if (lakh > 0) {
    result += convertBelowThousand(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    result += convertBelowThousand(thousand) + ' Thousand ';
  }
  if (hundred > 0) {
    result += convertBelowThousand(hundred) + ' ';
  }
  
  return result.trim() + ' Rupees Only';
}

export function getStatusBadgeClasses(status: string): string {
  switch (status.toLowerCase()) {
    case 'paid':
    case 'success':
    case 'resolved':
    case 'active':
    case 'approved':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20';
    case 'pending':
    case 'in progress':
      return 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/20';
    case 'overdue':
    case 'failed':
    case 'urgent':
    case 'high':
      return 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/20';
    case 'occupied':
      return 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/20';
    case 'vacant':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    case 'owner':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'tenant':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}
