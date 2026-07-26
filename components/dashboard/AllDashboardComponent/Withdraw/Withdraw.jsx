"use client";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/forms/input/InputField";
import Label from "@/components/ui/forms/input/Label";
import ReactSelectInput from "@/components/ui/forms/input/ReactSelect";
import { useT } from "@/context/TranslationContext";
import {
  useGetWithdrawAccountsQuery,
  useWithdrawNowMutation,
} from "@/lib/features/withdraw/withdrawApi";
import { calculateChargeAndTotal } from "@/utils/utils";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

const Withdraw = () => {
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState(1);
  const [successData, setSuccessData] = useState(null);
  const { data: withdrawAccountsData, isLoading: accountsLoading } =
    useGetWithdrawAccountsQuery({});
  const [withdrawNow, { isLoading: isSubmitting }] = useWithdrawNowMutation();
  const accounts = withdrawAccountsData?.data || [];
  const t = useT();

  // Build select options
  const accountOptions = accounts.map((acc) => ({
    value: acc.id,
    label: acc.method_name,
    icon: acc.method?.icon,
  }));

  // Find selected account details
  const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId);

  // Calculate charge and total
  const { charge, total } = selectedAccount
    ? calculateChargeAndTotal({
        amount,
        transferCharge: selectedAccount.method?.charge,
        transferChargeType: selectedAccount.method?.charge_type,
      })
    : { charge: 0, total: 0 };

  // Handle withdraw submit
  const handleWithdraw = async () => {
    if (!selectedAccountId) {
      toast.error("Please select a withdraw account");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (
      Number(amount) < selectedAccount?.method?.min_withdraw ||
      Number(amount) > selectedAccount?.method?.max_withdraw
    ) {
      toast.error(
        `Amount must be between ${selectedAccount?.method?.min_withdraw} and ${selectedAccount?.method?.max_withdraw}`,
      );
      return;
    }

    const result = await withdrawNow({
      withdraw_account: selectedAccountId,
      amount: amount,
    });

    if (result?.data?.status) {
      setSuccessData({
        accountName: selectedAccount?.method_name,
        method: selectedAccount?.method?.name,
        amount,
        charge,
        total,
        currency: selectedAccount?.currency,
      });
      setStep(2);
    }
  };

  return (
    <>
      {step === 1 && (
        <div className="max-w-[660px] rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-3 sm:p-5">
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              <Label htmlFor="withdraw" required>
                {t("dashboard.withdrawAccount")}
              </Label>
              <ReactSelectInput
                options={accountOptions}
                value={selectedAccountId}
                onChange={(value) => {
                  setSelectedAccountId(value);
                  setAmount("");
                }}
                placeholder={
                  accountsLoading
                    ? t("dashboard.loadingWithdrawAccount")
                    : t("dashboard.selectWithdrawAccount")
                }
                loading={accountsLoading}
                formatOptionLabel={(option) => (
                  <div className="flex items-center gap-2">
                    {option.icon && (
                      <Image
                        src={option.icon}
                        alt={option.label}
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain rounded"
                      />
                    )}
                    <span>{option.label}</span>
                  </div>
                )}
              />
            </div>

            <div className="col-span-12">
              <Label htmlFor="amount" required>
                {t("dashboard.amount")}
              </Label>
              <Input
                type="number"
                id="amount"
                name="amount"
                placeholder={t("dashboard.enterAmount")}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              {selectedAccount && (
                <p className="text-xs text-grayish/60 mt-1">
                  {t("dashboard.min")}: {selectedAccount.method?.min_withdraw}{" "}
                  {selectedAccount.currency} • {t("dashboard.max")}:{" "}
                  {selectedAccount.method?.max_withdraw}{" "}
                  {selectedAccount.currency}
                </p>
              )}
            </div>

            {selectedAccount && (
              <div className="col-span-12">
                <div className="border border-grayish/10 p-4 rounded-[10px] space-y-[16px] mt-5">
                  <div className="flex sm:flex-row flex-col sm:items-center items-start justify-between gap-1 sm:gap-2">
                    <p className="text-sm font-medium text-grayish/70">
                      {t("dashboard.accountName")}
                    </p>
                    <p className="text-sm font-medium text-grayish">
                      {selectedAccount?.method_name}
                    </p>
                  </div>
                  <div className="flex sm:flex-row flex-col sm:items-center items-start justify-between gap-1 sm:gap-2">
                    <p className="text-sm font-medium text-grayish/70">
                      {t("dashboard.method")}
                    </p>
                    <p className="text-sm font-medium text-grayish">
                      {selectedAccount?.method?.name}
                    </p>
                  </div>
                  <div className="flex sm:flex-row flex-col sm:items-center items-start justify-between gap-1 sm:gap-2">
                    <p className="text-sm font-medium text-grayish/70">
                      {t("dashboard.amount")}
                    </p>
                    <p className="text-sm font-medium text-grayish">
                      {amount || 0} {selectedAccount?.currency}
                    </p>
                  </div>
                  <div className="flex sm:flex-row flex-col sm:items-center items-start justify-between gap-1 sm:gap-2">
                    <p className="text-sm font-medium text-grayish/70">
                      {t("dashboard.charge")} (
                      {selectedAccount?.method?.charge_type === "percentage"
                        ? `${selectedAccount?.method?.charge}%`
                        : `${selectedAccount?.method?.charge} ${selectedAccount?.currency}`}
                      )
                    </p>
                    <p className="text-sm font-medium text-grayish">
                      {charge} {selectedAccount?.currency}
                    </p>
                  </div>
                  <div className="flex sm:flex-row flex-col sm:items-center items-start justify-between gap-1 sm:gap-2">
                    <p className="text-sm font-medium text-grayish/70">
                      {t("dashboard.total")}
                    </p>
                    <p className="text-sm font-medium text-grayish">
                      {total} {selectedAccount?.currency}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="col-span-12 mt-5">
              <Button
                type="button"
                variant="primary-filled"
                size="md"
                rounded="md"
                className="w-full disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleWithdraw}
                disabled={isSubmitting || !selectedAccountId || !amount}
                loading={isSubmitting}
              >
                {isSubmitting
                  ? t("dashboard.processing")
                  : t("dashboard.withdrawNow")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && successData && (
        <div className="max-w-[660px] rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-3 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[200px]">
            <Image
              src="/assets/common/bg/dot-bg.svg"
              alt="logo"
              width={150}
              height={140}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col items-center relative z-10">
            <div className="h-[56px] w-[56px] mb-5">
              <Image
                src="/assets/common/icon/withdraw-success.png"
                alt="logo"
                width={150}
                height={140}
                className="w-full h-full object-cover"
              />
            </div>
            <h5 className="text-center font-semibold text-xl text-grayish mb-1">
              {t("dashboard.withdrawSuccessfully")}
            </h5>
            <p className="text-center font-normal text-base text-grayish/60">
              {t("dashboard.yourWithdrawCompletedSuccessfully")}
            </p>
          </div>

          <div className="border border-grayish/10 p-4 rounded-[10px] space-y-[16px] mt-10 bg-white relative z-10">
            <div className="flex sm:flex-row flex-col sm:items-center items-start justify-between gap-1 sm:gap-2">
              <p className="text-sm font-medium text-grayish/70">
                {t("dashboard.accountName")}
              </p>
              <p className="text-sm font-medium text-grayish">
                {successData.accountName}
              </p>
            </div>
            <div className="flex sm:flex-row flex-col sm:items-center items-start justify-between gap-1 sm:gap-2">
              <p className="text-sm font-medium text-grayish/70">
                {t("dashboard.method")}
              </p>
              <p className="text-sm font-medium text-grayish">
                {successData.method}
              </p>
            </div>
            <div className="flex sm:flex-row flex-col sm:items-center items-start justify-between gap-1 sm:gap-2">
              <p className="text-sm font-medium text-grayish/70">
                {t("dashboard.amount")}
              </p>
              <p className="text-sm font-medium text-grayish">
                {successData.amount} {successData.currency}
              </p>
            </div>
            <div className="flex sm:flex-row flex-col sm:items-center items-start justify-between gap-1 sm:gap-2">
              <p className="text-sm font-medium text-grayish/70">
                {t("dashboard.charge")}
              </p>
              <p className="text-sm font-medium text-grayish">
                {successData.charge} {successData.currency}
              </p>
            </div>
            <div className="flex sm:flex-row flex-col sm:items-center items-start justify-between gap-1 sm:gap-2">
              <p className="text-sm font-medium text-grayish/70">
                {t("dashboard.total")}
              </p>
              <p className="text-sm font-medium text-grayish">
                {successData.total} {successData.currency}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <Button
              type="button"
              variant="primary-filled"
              size="md"
              rounded="md"
              className="w-full"
              onClick={() => {
                setSelectedAccountId("");
                setAmount("");
                setSuccessData(null);
                setStep(1);
              }}
            >
              {t("dashboard.withdrawAgain")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Withdraw;
