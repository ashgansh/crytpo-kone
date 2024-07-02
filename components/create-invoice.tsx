import("@requestnetwork/create-invoice-form");
import("@requestnetwork/invoice-dashboard");

import React, { useEffect, useRef } from "react";
import { useAppContext } from "@/utils/context";
import { currencies } from "@/utils/currencies";
import { config } from "@/utils/config";
import { CreateInvoiceFormProps, InvoiceDashboardProps } from "@/types";

const Card = ({ children, className }) => (
  <div className={`border-2 border-gray-300 ${className}`}>{children}</div>
);

const InvoiceSection = () => {
  const { wallet, requestNetwork } = useAppContext();
  const createInvoiceFormRef = useRef<CreateInvoiceFormProps>(null);
  const invoiceDashboardRef = useRef<InvoiceDashboardProps>(null);

  useEffect(() => {
    if (createInvoiceFormRef.current) {
      createInvoiceFormRef.current.config = config;

      if (wallet && requestNetwork) {
        createInvoiceFormRef.current.signer = wallet.accounts[0].address;
        createInvoiceFormRef.current.requestNetwork = requestNetwork;
        createInvoiceFormRef.current.currencies = currencies;
      }
    }

    if (invoiceDashboardRef.current) {
      invoiceDashboardRef.current.config = config;

      if (wallet && requestNetwork) {
        invoiceDashboardRef.current.wallet = wallet;
        invoiceDashboardRef.current.requestNetwork = requestNetwork;
        invoiceDashboardRef.current.currencies = currencies;
      }
    }
  }, [wallet, requestNetwork]);

  return (
    <div className="text-gray-800 p-6 font-sans">
      {/* <Card className="mb-8">
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
      </Card> */}
      {/* <Card className="mb-8">
        <div className="border-b-2 border-gray-300 p-4 flex justify-between items-center bg-blue-50">
          <h3 className="text-lg font-semibold">Latest Invoices</h3>
          <span className="text-2xl">📊</span>
        </div>
        <div className="p-6">
          <invoice-dashboard ref={invoiceDashboardRef} />
        </div>
      </Card> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="">
          <div className="border-b-2 border-gray-300 p-4 flex justify-between items-center bg-yellow-50">
            <h3 className="text-lg font-semibold">Create Invoice</h3>
            <span className="text-2xl">📄</span>
          </div>
          <div className="">
            <create-invoice-form ref={createInvoiceFormRef} />
          </div>
        </Card>
      </div>

      {/* ... (rest of the existing dashboard sections) ... */}
    </div>
  );
};

export default InvoiceSection;
