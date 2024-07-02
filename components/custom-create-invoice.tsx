import React, { useState } from "react";
import { useAppContext } from "@/utils/context";
import { currencies } from "@/utils/currencies";
import { Types } from "@requestnetwork/request-client.js";
import { parseUnits } from "viem";
import { Button } from "@/components/common";
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { ChevronDown } from 'lucide-react';

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`${className}`}>{children}</div>
);

const CustomCreateInvoice = () => {
  const { wallet, requestNetwork } = useAppContext();
  const [newInvoice, setNewInvoice] = useState({
    amount: "",
    currency: currencies[0].symbol,
    recipient: "",
    reason: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requestNetwork && wallet) {
      setIsCreating(true);
      const toastId = toast.loading('Preparing to create invoice...');
      try {
        const currency = currencies.find(c => c.symbol === newInvoice.currency);
        const amountInSmallestUnit = parseUnits(newInvoice.amount, currency.decimals).toString();

        toast.loading('Waiting for signature...', { id: toastId });
        const request = await requestNetwork.createRequest({
          requestInfo: {
            currency: {
              type: currency.type,
              value: currency.address,
              network: currency.network as any,
            },
            expectedAmount: amountInSmallestUnit,
            payee: {
              type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
              value: wallet.accounts[0].address,
            },
            payer: {
              type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
              value: newInvoice.recipient,
            },
          },
          contentData: {
            reason: newInvoice.reason,
          },
          signer: {
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: wallet.accounts[0].address,
          },
        });

        toast.loading('Invoice created. Waiting for confirmation...', { id: toastId });
        await request.waitForConfirmation();

        toast.success('Invoice created and confirmed successfully!', { id: toastId });
        setNewInvoice({ amount: "", currency: currencies[0].symbol, recipient: "", reason: "" });
      } catch (error) {
        console.error("Failed to create invoice:", error);
        toast.error('Failed to create invoice. Please try again.', { id: toastId });
      } finally {
        setIsCreating(false);
      }
    }
  };

  return (
    <div className="text-gray-800 font-sans">
      <Toaster position="top-right" />
      <Card className="mb-8">
        <div className="border-b-2 border-gray-300 p-4 flex justify-between items-center bg-yellow-100 rounded-t-md">
          <h3 className="text-lg font-semibold">Create Custom Invoice</h3>
          <span className="text-2xl">📄</span>
        </div>
        <div className="pt-5 p-2">
          <form onSubmit={handleCreateInvoice} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount and Currency</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  className="flex-grow border border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                  placeholder="Enter amount"
                  required
                />
                <div className="relative">
                  <select
                    className="appearance-none bg-gray-100 border border-gray-300shadow-sm pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={newInvoice.currency}
                    onChange={(e) => setNewInvoice({ ...newInvoice, currency: e.target.value })}
                    required
                  >
                    {currencies.map((currency) => (
                      <option key={currency.symbol} value={currency.symbol}>
                        {currency.symbol}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Recipient Address</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={newInvoice.recipient}
                onChange={(e) => setNewInvoice({ ...newInvoice, recipient: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Reason</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300  shadow-sm p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={newInvoice.reason}
                onChange={(e) => setNewInvoice({ ...newInvoice, reason: e.target.value })}
                required
              />
            </div>
            <Button
              type="submit"
              text={isCreating ? "Creating Invoice..." : "Create Custom Invoice"}
              className="w-full justify-center py-4"
              disabled={isCreating}
              icon={
                <Image
                  src="/android-chrome-512x512.png"
                  alt="Invoice icon"
                  width={24}
                  height={24}
                  className="mr-2"
                />
              }
            />
          </form>
        </div>
      </Card>
    </div>
  );
};

export default CustomCreateInvoice;