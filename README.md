# MoneyWise - Personal Finance Manager

A Next.js application for tracking expenses, setting budgets, and achieving savings goals.

## Features

- **Dashboard**: Overview of your financial situation with key metrics
- **Expense Tracking**: Log and categorize daily expenses
- **Budget Management**: Set and monitor category-based budgets
- **Savings Goals**: Create and track progress toward financial goals
- **User Authentication**: Secure login and registration

## Tech Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: MongoDB (using Mongoose)
- **Authentication**: JWT-based authentication
- **Styling**: Tailwind CSS with custom components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/money-saving.git
   cd money-saving
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/src/app`: Next.js pages and routes
- `/src/components`: Reusable React components
- `/src/lib`: Utility functions and helpers
- `/src/models`: Database models

## Future Enhancements

- Expense reports and analytics
- Bill payment reminders
- Financial insights and recommendations
- Budget prediction based on past spending
- Mobile app version 