"use client";
import Image from "next/image";
import { useT } from "@/context/TranslationContext";
import {
  useGetTransferConfigQuery,
  useLookupTransferRecipientQuery,
  useSendTransferMutation,
  useValidateTransferMutation,
} from "@/lib/features/transfer/transferApi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Transfer = () => {
  const [recipientPhone, setRecipientPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState(1);
  const [successData, setSuccessData] = useState(null);
  const [errors, setErrors] = useState({});
  const [recipientName, setRecipientName] = useState("");
  const [lookupNotFound, setLookupNotFound] = useState(false);
  const [lookupAttempted, setLookupAttempted] = useState(false);

  const { data: configData, isLoading: configLoading } =
    useGetTransferConfigQuery({});
  const { data: lookupData, isLoading: isLookingUp } =
    useLookupTransferRecipientQuery(recipientPhone, {
      skip: !recipientPhone || recipientPhone.trim().length < 3,
    });
  const [sendTransfer, { isLoading: isSubmitting }] =
    useSendTransferMutation();
  const [validateTransfer, { isLoading: isValidating }] =
    useValidateTransferMutation();

  const t = useT();
  const balance = configData?.data?.user_balance ?? 0;
  const transferEnabled = configData?.data?.transfer_status === 1;

  useEffect(() => {
    if (!lookupData) {
      setRecipientName("");
      setLookupNotFound(false);
      setLookupAttempted(false);
      return;
    }

    setLookupAttempted(true);

    if (lookupData.status === true && lookupData.data?.full_name) {
      setRecipientName(lookupData.data.full_name);
      setLookupNotFound(false);
    } else {
      setRecipientName("");
      setLookupNotFound(true);
    }
  }, [lookupData]);

  useEffect(() => {
    setLookupNotFound(false);
    setLookupAttempted(false);
  }, [recipientPhone]);

  const validateForm = () => {
    const newErrors = {};
    if (!recipientPhone.trim()) {
      newErrors.recipientPhone = t("dashboard.recipientRequired");
    }
    if (!amount || Number(amount) <= 0) {
      newErrors.amount = t("dashboard.enterValidAmount");
    } else if (Number(amount) > balance) {
      newErrors.amount = t("dashboard.insufficientBalance");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleValidate = async () => {
    if (!validateForm()) return;

    try {
      const result = await validateTransfer({
        recipient_phone: recipientPhone.trim(),
        amount: Number(amount),
      });

      if (result?.data?.status) {
        handleSend();
      } else {
        toast.error(result?.data?.message || "Validation failed");
      }
    } catch (err) {
      // error handled in api
    }
  };

  const handleSend = async () => {
    try {
      const result = await sendTransfer({
        recipient_phone: recipientPhone.trim(),
        amount: Number(amount),
      });

      if (result?.data?.status) {
        setSuccessData({
          recipient: result.data?.data?.transaction?.recipient,
          recipientPhone: result.data?.data?.transaction?.recipient_phone,
          amount: amount,
        });
        setStep(2);
      }
    } catch (err) {
      // error handled in api
    }
  };

  const handleSubmit = () => {
    handleValidate();
  };

  const resetForm = () => {
    setRecipientPhone("");
    setAmount("");
    setSuccessData(null);
    setStep(1);
    setErrors({});
    setRecipientName("");
    setLookupNotFound(false);
    setLookupAttempted(false);
  };

  if (configLoading) {
    return (
      <div className="max-w-[660px] mx-auto pt-6 sm:pt-10">
        <div className="rounded-[20px] border border-[rgba(7,33,38,0.16)] bg-white p-6 sm:p-8 animate-pulse space-y-6">
          <div className="h-5 bg-gray-200 rounded w-1/3" />
          <div className="h-14 bg-gray-200 rounded-2xl" />
          <div className="h-14 bg-gray-200 rounded-2xl" />
          <div className="h-12 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!transferEnabled) {
    return (
      <div className="max-w-[660px] mx-auto pt-6 sm:pt-10">
        <div className="rounded-[20px] border border-[rgba(7,33,38,0.16)] bg-white p-6 sm:p-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-grayish/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-grayish/60 text-base">{t("dashboard.transferNotEnabled")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {step === 1 && (
        <div className="max-w-[660px] mx-auto pt-6 sm:pt-10 space-y-5">
          {/* Balance Card */}
          <div className="rounded-[20px] bg-gradient-to-br from-[#072126] to-[#0d2d33] p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#44F1A6]/10 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#44F1A6]/5 rounded-full translate-y-1/2 -translate-x-1/4" />
            <div className="relative z-10">
              <p className="text-white/70 text-sm font-medium mb-1">{t("dashboard.availableBalance")}</p>
              <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                {balance.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Transfer Form Card */}
          <div className="rounded-[20px] border border-[rgba(7,33,38,0.16)] bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#44F1A6]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#44F1A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-grayish">{t("dashboard.sendMoneyTitle") || t("dashboard.sendMoney")}</h3>
                <p className="text-sm text-grayish/60">{t("sendMoney.subtitle") || t("sendMoneyTitle")}</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-grayish mb-2.5">
                  {t("dashboard.recipientPhone")} <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder={t("dashboard.enterRecipientPhone")}
                    className="w-full h-[52px] rounded-2xl border-2 border-transparent bg-[rgba(7,33,38,0.04)] px-4 text-sm font-medium text-grayish placeholder:text-grayish/40 hover:border-[#8D999B] hover:bg-transparent focus:border-[#8D999B] focus:ring-2 focus:ring-[#8D999B]/20 focus:bg-transparent transition-all outline-none"
                  />
                </div>
                {errors.recipientPhone && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.recipientPhone}</p>
                )}

                {isLookingUp && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-4 h-4 border-2 border-[#44F1A6]/30 border-t-[#44F1A6] rounded-full animate-spin" />
                    <span className="text-xs text-grayish/60">
                      {t("dashboard.lookingUp") === "dashboard.lookingUp" ? "Looking up recipient..." : t("dashboard.lookingUp")}
                    </span>
                  </div>
                )}

                {recipientName && !isLookingUp && (
                  <div className="flex items-center gap-2 mt-2">
                    <svg className="w-4 h-4 text-[#44F1A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-semibold text-grayish">{recipientName}</span>
                  </div>
                )}

                {lookupAttempted && lookupNotFound && !isLookingUp && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">No user found with this phone number</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-grayish mb-2.5">
                  {t("dashboard.amount")} <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={t("dashboard.enterAmount")}
                    className="w-full h-[52px] rounded-2xl border-2 border-transparent bg-[rgba(7,33,38,0.04)] px-4 text-sm font-medium text-grayish placeholder:text-grayish/40 hover:border-[#8D999B] hover:bg-transparent focus:border-[#8D999B] focus:ring-2 focus:ring-[#8D999B]/20 focus:bg-transparent transition-all outline-none"
                  />
                </div>
                {errors.amount && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.amount}</p>
                )}
                <p className="text-xs text-grayish/50 mt-1.5">
                  {t("dashboard.availableBalance")}: <span className="font-semibold text-grayish/70">{balance.toFixed(2)}</span>
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || isValidating}
                className="w-full h-[52px] rounded-2xl bg-[#44F1A6] hover:bg-[#3de099] disabled:opacity-60 disabled:cursor-not-allowed text-[#072126] font-semibold text-base transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting || isValidating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#072126]/30 border-t-[#072126] rounded-full animate-spin" />
                    {t("dashboard.sending")}
                  </>
                ) : (
                  t("dashboard.send")
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && successData && (
        <div className="max-w-[660px] mx-auto pt-6 sm:pt-10">
          <div className="rounded-[20px] border border-[rgba(7,33,38,0.16)] bg-white overflow-hidden">
            {/* Success Header */}
            <div className="relative bg-gradient-to-br from-[#072126] to-[#0d2d33] px-6 sm:px-8 py-10 text-center overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#44F1A6] rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#44F1A6] rounded-full translate-y-1/2 -translate-x-1/4" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#44F1A6]/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#44F1A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{t("dashboard.sendMoneySuccess")}</h3>
                <p className="text-white/70 text-sm">{t("dashboard.yourWithdrawCompletedSuccessfully") || t("sendMoney.successMessage")}</p>
              </div>
            </div>

            {/* Transaction Summary */}
            <div className="px-6 sm:px-8 py-6">
              <div className="rounded-2xl bg-[rgba(7,33,38,0.03)] border border-[rgba(7,33,38,0.08)] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-grayish/70 font-medium">{t("dashboard.recipient")}</span>
                  <span className="text-sm font-semibold text-grayish">{successData.recipient}</span>
                </div>
                <div className="h-px bg-[rgba(7,33,38,0.06)]" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-grayish/70 font-medium">{t("dashboard.amount")}</span>
                  <span className="text-sm font-semibold text-grayish">{successData.amount}</span>
                </div>
                <div className="h-px bg-[rgba(7,33,38,0.06)]" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-grayish/70 font-medium">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#44F1A6]/10 text-[#2CA77B]">
                    {t("dashboard.sendMoneySuccess")}
                  </span>
                </div>
              </div>

              <button
                onClick={resetForm}
                className="w-full h-[52px] mt-6 rounded-2xl bg-[#44F1A6] hover:bg-[#3de099] text-[#072126] font-semibold text-base transition-colors"
              >
                {t("dashboard.sendMoney")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Transfer;
