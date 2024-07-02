import React, { useState, useEffect } from "react";
import { useAppContext } from "@/utils/context";
import { formatUnits } from "viem";
import { Button } from "@/components/common";
import { truncateAddress } from "@/utils/walletUtils";
import { Types } from "@requestnetwork/request-client.js";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

const InvoiceList = () => {
  const { wallet, requestNetwork, currencyManager } = useAppContext();
  const [requests, setRequests] = useState<Types.IRequestDataWithEvents[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortColumn, setSortColumn] = useState("timestamp");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (wallet && requestNetwork) {
      fetchRequests();
    }
  }, [wallet, requestNetwork]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const requestsData = await requestNetwork?.fromIdentity({
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: wallet?.accounts[0].address,
      });
      setRequests(requestsData?.map((request) => request.getData()) || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const terms = searchQuery.toLowerCase();
    if (
      currentTab === "All" ||
      (currentTab === "Get Paid" &&
        request.payee?.value?.toLowerCase() ===
          wallet.accounts[0].address.toLowerCase()) ||
      (currentTab === "Pay" &&
        request.payer?.value?.toLowerCase() ===
          wallet.accounts[0].address.toLowerCase())
    ) {
      return (
        request.contentData?.invoiceNumber
          ?.toString()
          .toLowerCase()
          .includes(terms) ||
        truncateAddress(request.payee?.value || "")
          .toLowerCase()
          .includes(terms) ||
        truncateAddress(request.payer?.value || "")
          .toLowerCase()
          .includes(terms) ||
        request.expectedAmount.toString().includes(terms)
      );
    }
    return false;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    let valueA = a[sortColumn];
    let valueB = b[sortColumn];
    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedRequests = sortedRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const TabButton = ({ text, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? "bg-yellow-100 text-gray-900"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {text}
    </button>
  );

  const TableHeader = ({ text, column }) => (
    <th
      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center">
        {text}
        {sortColumn === column && (
          sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
        )}
      </div>
    </th>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Invoice Dashboard</h1>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex space-x-2">
          <TabButton
            text="All"
            isActive={currentTab === "All"}
            onClick={() => setCurrentTab("All")}
          />
          <TabButton
            text="Pay"
            isActive={currentTab === "Pay"}
            onClick={() => setCurrentTab("Pay")}
          />
          <TabButton
            text="Get Paid"
            isActive={currentTab === "Get Paid"}
            onClick={() => setCurrentTab("Get Paid")}
          />
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <TableHeader text="Created" column="timestamp" />
                  <TableHeader text="Invoice #" column="contentData.invoiceNumber" />
                  {currentTab === "All" && (
                    <>
                      <TableHeader text="Payee" column="payee.value" />
                      <TableHeader text="Payer" column="payer.value" />
                    </>
                  )}
                  {currentTab !== "All" && (
                    <TableHeader
                      text={currentTab === "Pay" ? "Payee" : "Payer"}
                      column={currentTab === "Pay" ? "payee.value" : "payer.value"}
                    />
                  )}
                  <TableHeader text="Expected Amount" column="expectedAmount" />
                  <TableHeader text="Status" column="state" />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedRequests.map((request, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.timestamp * 1000).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.contentData?.invoiceNumber || "-"}
                    </td>
                    {currentTab === "All" && (
                      <>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {truncateAddress(request.payee?.value || "")}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {truncateAddress(request.payer?.value || "")}
                        </td>
                      </>
                    )}
                    {currentTab !== "All" && (
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {truncateAddress(
                          currentTab === "Pay"
                            ? request.payee?.value || ""
                            : request.payer?.value || ""
                        )}
                      </td>
                    )}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatUnits(
                        BigInt(request.expectedAmount),
                        currencyManager.fromAddress(request.currencyInfo.value)
                          ?.decimals || 18
                      )}{" "}
                      {
                        currencyManager.fromAddress(request.currencyInfo.value)
                          ?.symbol
                      }
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.state === "created" ? "bg-green-100 text-green-800" :
                        request.state === "accepted" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {request.state}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <Button
              text="Previous"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
            />
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              text="Next"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default InvoiceList;