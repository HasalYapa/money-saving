// App-wide configuration 

export const config = {
  currency: {
    code: 'LKR',
    symbol: 'රු',
    name: 'Sri Lankan Rupee',
    format: (amount: number) => `රු${amount.toFixed(2)}`
  }
} 