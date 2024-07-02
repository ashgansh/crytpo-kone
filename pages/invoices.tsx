import React from "react";
import CustomCreateInvoice from "@/components/custom-create-invoice";
import InvoiceList from "@/components/invoice-list";

const InvoicesPage = () => {
  return (
    <div className="flex justify-between items-center border-b border-gray-300 pb-4 max-w-7xl mx-auto pt-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <CustomCreateInvoice />
        </div>
        <div>
          <InvoiceList />
        </div>
      </div>
    </div>
  );
};

export default InvoicesPage;
