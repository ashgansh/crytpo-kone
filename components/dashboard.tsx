import React, { useState, useEffect } from "react";
import { useAppContext } from "@/utils/context";
import { formatUnits } from "viem";
import { Button, Dropdown } from "@/components/common";
import { truncateAddress } from "@/utils/walletUtils";
import { Types } from "@requestnetwork/request-client.js";
import { CurrencyManager } from "@requestnetwork/currency";

const InvoiceDashboard = () => {
  const { wallet, requestNetwork } = useAppContext();
  const [requests, setRequests] = useState<Types.IRequestDataWithEvents[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortColumn, setSortColumn] = useState("timestamp");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const currencyManager = new CurrencyManager();

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
        value: wallet.accounts[0].address,
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
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <Button
            text="All"
            onClick={() => setCurrentTab("All")}
            className={
              currentTab === "All" ? "bg-green" : "bg-gray-200 text-gray-800"
            }
          />
          <Button
            text="Pay"
            onClick={() => setCurrentTab("Pay")}
            className={
              currentTab === "Pay" ? "bg-green" : "bg-gray-200 text-gray-800"
            }
          />
          <Button
            text="Get Paid"
            onClick={() => setCurrentTab("Get Paid")}
            className={
              currentTab === "Get Paid"
                ? "bg-green"
                : "bg-gray-200 text-gray-800"
            }
          />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="min-w-full bg-white">
            <thead>
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
                <tr key={index}>
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

          <div className="mt-4 flex justify-between items-center">
            <Button
              text="Previous"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              text="Next"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default InvoiceDashboard;
