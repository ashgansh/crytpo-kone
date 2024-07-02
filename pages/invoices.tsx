import React from "react";
import InvoiceSection from "@/components/create-invoice";
import InvoiceDashboard from "@/components/dashboard";

const InvoicesPage = () => {
  return (
    <div className="container mx-auto">
      <InvoiceDashboard />
      <InvoiceSection />
    </div>
  );
};

export default InvoicesPage;
