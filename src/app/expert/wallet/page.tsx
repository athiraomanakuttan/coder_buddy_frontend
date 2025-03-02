"use client";
import { getExpertWalletData } from "@/app/services/expert/paymentApi";
import Navbar from "@/components/expert/Navbar/Navbar";
import { WalletDataType } from "@/types/types";
import { useEffect, useState } from "react";
import { Wallet, ArrowDownCircle } from "lucide-react";
import { formatDate } from "@/app/utils/dateUtils";
import PayoutModal from "@/components/expert/Payout/page";
import { useLocalStorage } from "@/Hooks/useLocalStorage";

const WalletPage = () => {
  const [walletData, setWalletData] = useState<WalletDataType>();
  const [payoutModel, setPayoutModel] = useState(false);
  const [token] = useLocalStorage("userAccessToken","")

  const getWalletData = async () => {
    const response = await getExpertWalletData(token);
    if (response) setWalletData(response.data);
  };

  useEffect(() => {
    getWalletData();
  }, [token, payoutModel]);

  return (
    <div className="flex h-screen">
      <div className="h-full">
        <Navbar />
      </div>
      <div className="flex-1 h-full overflow-hidden">
        <div className="h-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Wallet Balance Card */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Wallet Balance</h3>
                <button onClick={() => setPayoutModel(true)}>
                  <Wallet className="h-6 w-6 text-blue-500" />
                </button>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                ₹ {walletData?.amount.toFixed(2) || "0.00"}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Expert ID: {walletData?.expertId}
              </p>
            </div>

            {/* Transaction History Card */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Transaction History</h3>
                <ArrowDownCircle className="h-6 w-6 text-blue-500" />
              </div>

              <div className="mt-4 max-h-[calc(100vh-24rem)] overflow-y-auto">
                {walletData?.transaction && walletData.transaction.length > 0 ? (
                  <div className="space-y-4">
                    {walletData.transaction.map((transaction) => (
                      <div
                        key={transaction._id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">
                            Payment ID: {transaction.paymentId ?? transaction._id}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(transaction.dateTime)}
                          </p>
                        </div>
                        <div>
                          <p
                            className={`${
                              transaction.transactionType === "credited"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.transactionType}
                          </p>
                        </div>
                        <div className="text-2xl font-bold text-primarys">
                          ₹ {transaction.amount || "0.00"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No transactions found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {payoutModel && (
        <PayoutModal
          setIsModalOpen={setPayoutModel}
          balance={walletData?.amount ?? 0}
        />
      )}
    </div>
  );
};

export default WalletPage;