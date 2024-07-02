import React, { useState, useEffect } from "react";
import { useAppContext } from "@/utils/context";
import { currencies } from "@/utils/currencies";
import { config } from "@/utils/config";
import { Identity } from "@requestnetwork/request-client.js/dist/types";

const Card = ({ children, className }) => (
  <div className={`border-2 border-gray-300 ${className}`}>{children}</div>
);

const MinimalistFinanceDashboard = () => {
  const { wallet, requestNetwork } = useAppContext();
  console.log(wallet);
  const [invoices, setInvoices] = useState([]);
  const [newInvoice, setNewInvoice] = useState({
    amount: "",
    currency: "EUR",
    recipient: "",
    reason: "",
  });

  useEffect(() => {
    if (requestNetwork && wallet) {
      fetchInvoices();
    }
  }, [requestNetwork, wallet]);

  const fetchInvoices = async () => {
    if (requestNetwork && wallet) {
      console.log(wallet.accounts[0].address);
      const requests = await requestNetwork.fromIdentity({
        type: Identity.TYPE.ETHEREUM_ADDRESS,
        value: wallet.accounts[0].address,
      });
      console.log(requests);
      setInvoices(requests);
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (requestNetwork && wallet) {
      const request = await requestNetwork.createRequest({
        requestInfo: {
          currency: {
            type: newInvoice.currency === "EUR" ? "EUR" : "ERC20",
            value:
              newInvoice.currency === "EUR"
                ? "EUR"
                : currencies.find((c) => c.symbol === newInvoice.currency)
                    .address,
            network: "mainnet",
          },
          expectedAmount: newInvoice.amount,
          payee: {
            type: "ethereumAddress",
            value: wallet.accounts[0].address,
          },
          payer: {
            type: "ethereumAddress",
            value: newInvoice.recipient,
          },
          reason: newInvoice.reason,
        },
        signer: {
          type: "ethereumAddress",
          value: wallet.accounts[0].address,
        },
      });
      await request.waitForConfirmation();
      fetchInvoices();
      setNewInvoice({ amount: "", currency: "EUR", recipient: "", reason: "" });
    }
  };

  return (
    <div className="text-gray-800 p-6 font-sans">
      {/* ... (existing code for navigation and other sections) ... */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="col-span-2">
          <div className="border-b-2 border-gray-300 p-4 flex justify-between items-center bg-yellow-50">
            <h3 className="text-lg font-semibold">Invoices</h3>
            <span className="text-2xl">📄</span>
          </div>
          <div className="p-6">
            <h4 className="text-xl font-semibold mb-4">Create New Invoice</h4>
            <form onSubmit={handleCreateInvoice}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  className="border-2 border-gray-300 p-2"
                  type="number"
                  placeholder="Amount"
                  value={newInvoice.amount}
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, amount: e.target.value })
                  }
                  required
                />
                <select
                  className="border-2 border-gray-300 p-2"
                  value={newInvoice.currency}
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, currency: e.target.value })
                  }
                  required
                >
                  <option value="EUR">EUR</option>
                  {currencies.map((currency) => (
                    <option key={currency.symbol} value={currency.symbol}>
                      {currency.symbol}
                    </option>
                  ))}
                </select>
                <input
                  className="border-2 border-gray-300 p-2"
                  type="text"
                  placeholder="Recipient Address"
                  value={newInvoice.recipient}
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, recipient: e.target.value })
                  }
                  required
                />
                <input
                  className="border-2 border-gray-300 p-2"
                  type="text"
                  placeholder="Reason"
                  value={newInvoice.reason}
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, reason: e.target.value })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full border-2 border-gray-300 p-3 bg-green-500 text-white hover:bg-green-600 transition-colors"
              >
                Create Invoice
              </button>
            </form>
          </div>
          <div className="p-6 border-t-2 border-gray-300">
            <h4 className="text-xl font-semibold mb-4">Recent Invoices</h4>
            {console.log(invoices)}
            {/* {invoices.length === 0 ? (
              <p>No invoices found.</p>
            ) : (
              <ul>
                {invoices.slice(0, 5).map((invoice, index) => (
                  <li key={index} className="mb-2 p-2 border-b border-gray-200">
                    <p>
                      Amount: {invoice.expectedAmount} {invoice.currency.type}
                    </p>
                    <p>Recipient: {invoice.payee.value}</p>
                    <p>Reason: {invoice.reason}</p>
                    <p>Status: {invoice.state}</p>
                  </li>
                ))}
              </ul>
            )} */}
          </div>
        </Card>
      </div>

      {/* ... (existing code for other sections) ... */}
    </div>
  );
};

export default MinimalistFinanceDashboard;
