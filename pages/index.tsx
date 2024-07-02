import React from "react";

const Card = ({ children }) => <div>{children}</div>;

const MinimalistFinanceDashboard = () => {
  return (
    <div className="container mx-auto">
    <div className="text-gray-800 p-6 font-sans">
      <Card >
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Account Overview</h2>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm mb-1">Total Balance</p>
              <p className="text-4xl font-bold">€23,456</p>
              <p className="text-sm mt-2">Crypto: €12,345 · Stables: €11,111</p>
            </div>
            <div className="text-right">
              <p className="text-sm mb-1">30-day Yield Gains</p>
              <p className="text-3xl font-bold text-blue-600">+5.2%</p>
              <p className="text-xl">€1,234.56</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card >
          <div className="border-b-2 border-gray-300 p-4 flex justify-between items-center bg-purple-50">
            <h3 className="text-lg font-semibold">Gnosis Pay Visa</h3>
            <span className="text-2xl">💳</span>
          </div>
          <div className="p-6">
            <p className="font-mono text-xl mb-2">**** **** **** 3456</p>
            <p className="text-gray-600 mb-1">John Doe</p>
            <p className="text-gray-600">Expires: 12/25</p>
          </div>
          <button className="w-full border-t-2 border-gray-300 p-3 hover:bg-gray-100 transition-colors flex justify-center items-center">
            Manage Card <span className="ml-2">→</span>
          </button>
        </Card>

        <Card >
          <div className="border-b-2 border-gray-300 p-4 flex justify-between items-center bg-green-50">
            <h3 className="text-lg font-semibold">Earn Yield with sDAI</h3>
            <span className="text-2xl">📈</span>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-1">sDAI Balance</p>
            <p className="text-2xl font-bold mb-4">1,234.56 sDAI</p>
            <p className="text-sm text-gray-600 mb-1">Current Yield</p>
            <p className="text-2xl font-bold text-blue-600">4.75% APY</p>
          </div>
          <button className="w-full border-t-2 border-gray-300 p-3 hover:bg-gray-100 transition-colors flex justify-center items-center">
            Manage Yield <span className="ml-2">→</span>
          </button>
        </Card>

        <Card >
          <div className="border-b-2 border-gray-300 p-4 flex justify-between items-center bg-blue-50">
            <h3 className="text-lg font-semibold">IBAN Account</h3>
            <span className="text-2xl">🏦</span>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-2">
              Your personal IBAN for crypto and fiat transactions
            </p>
            <p className="font-mono text-lg mb-2">
              DE12 3456 7890 1234 5678 90
            </p>
            <p className="text-gray-600 mb-1">Account Holder: John Doe</p>
            <p className="text-gray-600">Bank: Commerzbank AG</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card >
          <div className="border-b-2 border-gray-300 p-4 flex justify-between items-center bg-orange-50">
            <h3 className="text-lg font-semibold">IBAN Transfers</h3>
            <span className="text-2xl">↗️</span>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient IBAN
              </label>
              <input
                className="w-full border-2 border-gray-300 p-2 font-mono"
                value="DE12 3456 7890 1234 5678 90"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                className="w-full border-2 border-gray-300 p-2 font-mono"
                value="1,000.00"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference
              </label>
              <input
                className="w-full border-2 border-gray-300 p-2 font-mono"
                value="Invoice #123"
                readOnly
              />
            </div>
            <button className="w-full border-2 border-gray-300 p-3 hover:bg-gray-100 transition-colors flex justify-center items-center">
              Transfer <span className="ml-2">→</span>
            </button>
          </div>
        </Card>

        <Card >
          <div className="border-b-2 border-gray-300 p-4 flex justify-between items-center bg-indigo-50">
            <h3 className="text-lg font-semibold">Transactions</h3>
            <button className="text-sm underline">View All</button>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center py-2 border-b-2 border-gray-300">
              <div>
                <p className="font-medium">Yield Earnings</p>
                <p className="text-sm text-gray-600">2023-04-15</p>
                <p className="text-sm text-gray-600">
                  Monthly yield earnings from sDAI investment
                </p>
              </div>
              <span className="text-blue-600 font-medium">+€50</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b-2 border-gray-300">
              <div>
                <p className="font-medium">SEPA Payment Received</p>
                <p className="text-sm text-gray-600">2023-04-12</p>
                <p className="text-sm text-gray-600">
                  Invoice #4567 from Client ABC
                </p>
              </div>
              <span className="text-blue-600 font-medium">+€1,000</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b-2 border-gray-300">
              <div>
                <p className="font-medium">Bank Deposit</p>
                <p className="text-sm text-gray-600">2023-04-10</p>
                <p className="text-sm text-gray-600">
                  Direct deposit from savings
                </p>
              </div>
              <span className="text-blue-600 font-medium">+€2,500</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b-2 border-gray-300">
              <div>
                <p className="font-medium">Software Subscription</p>
                <p className="text-sm text-gray-600">2023-04-08</p>
                <p className="text-sm text-gray-600">
                  Monthly subscription for project management software
                </p>
              </div>
              <span className="text-red-600 font-medium">-€200</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b-2 border-gray-300">
              <div>
                <p className="font-medium">Crypto Transfer</p>
                <p className="text-sm text-gray-600">2023-04-05</p>
                <p className="text-sm text-gray-600">
                  Payment for freelance design services
                </p>
              </div>
              <span className="text-red-600 font-medium">-€150</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </div>
  );
};

export default MinimalistFinanceDashboard;
