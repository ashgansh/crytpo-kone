import React from "react";
import CustomCreateInvoice from "@/components/custom-create-invoice";
import InvoiceList from "@/components/invoice-list";

const InvoicesPage = () => {
  return (
    <div className="container mx-auto p-4">
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
