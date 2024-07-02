import React, { useState, useEffect } from "react";
import { useAppContext } from "@/utils/context";
import { formatUnits } from "viem";
import { Button, Dropdown } from "@/components/common";
import { truncateAddress } from "@/utils/walletUtils";
import { Types } from "@requestnetwork/request-client.js";

const InvoiceDashboard = () => {
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

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex space-x-2">
          <Button
            text="All"
            onClick={() => setCurrentTab("All")}
            className={`px-4 py-2 rounded-md ${
              currentTab === "All" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
          />
          <Button
            text="Pay"
            onClick={() => setCurrentTab("Pay")}
            className={`px-4 py-2 rounded-md ${
              currentTab === "Pay" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
          />
          <Button
            text="Get Paid"
            onClick={() => setCurrentTab("Get Paid")}
            className={`px-4 py-2 rounded-md ${
              currentTab === "Get Paid" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
          />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded-md w-full sm:w-auto"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto ">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th onClick={() => handleSort("timestamp")}>Created</th>
                  <th onClick={() => handleSort("contentData.invoiceNumber")}>
                    Invoice #
                  </th>
                  {currentTab === "All" && (
                    <>
                      <th onClick={() => handleSort("payee.value")}>Payee</th>
                      <th onClick={() => handleSort("payer.value")}>Payer</th>
                    </>
                  )}
                  {currentTab !== "All" && (
                    <th
                      onClick={() =>
                        handleSort(
                          currentTab === "Pay" ? "payee.value" : "payer.value"
                        )
                      }
                    >
                      {currentTab === "Pay" ? "Payee" : "Payer"}
                    </th>
                  )}
                  <th onClick={() => handleSort("expectedAmount")}>
                    Expected Amount
                  </th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((request, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td>
                      {new Date(request.timestamp * 1000).toLocaleDateString()}
                    </td>
                    <td>{request.contentData?.invoiceNumber || "-"}</td>
                    {currentTab === "All" && (
                      <>
                        <td>{truncateAddress(request.payee?.value || "")}</td>
                        <td>{truncateAddress(request.payer?.value || "")}</td>
                      </>
                    )}
                    {currentTab !== "All" && (
                      <td>
                        {truncateAddress(
                          currentTab === "Pay"
                            ? request.payee?.value || ""
                            : request.payer?.value || ""
                        )}
                      </td>
                    )}
                    <td>
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
                    <td>{request.state}</td>
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
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
            />
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              text="Next"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default InvoiceDashboard;
