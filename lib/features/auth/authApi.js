import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut } from "../auth/authSlice";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // register user
    register: builder.mutation({
      query: (data) => ({
        url: "/merchant/auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth", "user", "kycDetails", "Settings"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data?.data?.token;
          if (token) {
            Cookies.set("token", token);
            dispatch(userLoggedIn({ token }));
          }
          toast.success(data?.message || "Registration successful!");
        } catch (err) {
          console.log("Register error", err.error.data.message);
          const msg = err?.error?.data?.message || "An Error happen";
          toast.error(msg);
        }
      },
    }),

    reRegister: builder.mutation({
      query: (data) => ({
        url: "/merchant/auth/resubmit",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth", "user", "kycDetails", "Settings"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data?.data?.token;
          if (token) {
            Cookies.set("token", token);
            dispatch(userLoggedIn({ token }));
          }
        } catch (err) {
          console.log("Register error", err.error.data.message);
          const msg = err?.error?.data?.message || "An Error happen";
          toast.error(msg);
        }
      },
    }),

    // login user
    login: builder.mutation({
      query: (data) => ({
        url: "/merchant/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth", "user", "kycDetails", "Settings"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = data?.data?.token;
          if (token) {
            Cookies.set("token", token);
            dispatch(userLoggedIn({ token }));
          }
        } catch (err) {
          console.log("login error", err.error.data.message);
          const msg =
            err?.error?.data?.message ||
            "Invalid credentials. Please check and try again.";
          toast.error(msg);
        }
      },
    }),

    //logout user
    logout: builder.mutation({
      query: () => ({
        url: "/merchant/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "user", "kycDetails", "Settings"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          Cookies.remove("token");
          dispatch(userLoggedOut());
          // toast.success(data?.message || "Logout successful!");
        } catch (err) {
          console.log("logout error", err?.error?.data?.message);
          const msg = err?.error?.data?.message || "Logout failed";
          toast.error(msg);
        }
      },
    }),

    //verify email otp send
    emailOtpSend: builder.mutation({
      query: (data) => ({
        url: "/merchant/auth/email-otp/send",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(
            data?.message || "Verification code sent to your email!",
          );
        } catch (err) {
          const message =
            err?.data?.message ||
            err?.error?.data?.message ||
            err?.error?.message ||
            "Failed to send verification code. Try again later.";
          toast.error(message);
        }
      },
    }),

    //verify email otp verify
    emailOtpVerify: builder.mutation({
      query: (data) => ({
        url: "/merchant/auth/email-otp/verify",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Email verified successfully!");
        } catch (err) {
          const message =
            err?.data?.message ||
            err?.error?.data?.message ||
            err?.error?.message ||
            "Failed to verify email. Try again later.";
          toast.error(message);
        }
      },
    }),

    //verify 2fa
    twoFaVerify: builder.mutation({
      query: (data) => ({
        url: "/2fa/verify",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "2FA verified successfully!");
        } catch (err) {
          const message =
            err?.data?.message ||
            err?.error?.data?.message ||
            err?.error?.message ||
            "Failed to verify 2FA. Try again later.";
          toast.error(message);
        }
      },
    }),

    //verify forgot password otp send
    forgotPasswordOtpSend: builder.mutation({
      query: (data) => ({
        url: "/merchant/auth/forgot-password",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(
            data?.message || "Verification code sent to your email!",
          );
        } catch (err) {
          const message =
            err?.data?.message ||
            err?.error?.data?.message ||
            err?.error?.message ||
            "Failed to send verification code. Try again later.";
          toast.error(message);
        }
      },
    }),

    //verify forgot password otp verify
    forgotPasswordOtpVerify: builder.mutation({
      query: (data) => ({
        url: "/merchant/auth/reset-verify-otp",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "OTP verified successfully!");
        } catch (err) {
          const message =
            err?.data?.message ||
            err?.error?.data?.message ||
            err?.error?.message ||
            "Failed to verify OTP. Try again later.";
          toast.error(message);
        }
      },
    }),

    //reset password
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/merchant/auth/reset-password",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Password reset successfully!");
        } catch (err) {
          const message =
            err?.data?.message ||
            err?.error?.data?.message ||
            err?.error?.message ||
            "Failed to reset password. Try again later.";
          toast.error(message);
        }
      },
    }),

    //change password
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/merchant/settings/change-password",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Password Change successfully!");
        } catch (err) {
          const message =
            err?.data?.message ||
            err?.error?.data?.message ||
            err?.error?.message ||
            "Failed to Change password. Try again later.";
          toast.error(message);
        }
      },
    }),

    //2fa security
    twoFaSecurity: builder.mutation({
      query: (data) => ({
        url: "/merchant/settings/2fa",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),

    //kyc Details
    kycDetails: builder.query({
      query: () => ({
        url: `/merchant/kyc-histories`,
        method: "GET",
      }),
      providesTags: ["kycDetails"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useReRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useEmailOtpSendMutation,
  useEmailOtpVerifyMutation,
  useTwoFaVerifyMutation,
  useForgotPasswordOtpSendMutation,
  useForgotPasswordOtpVerifyMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useTwoFaSecurityMutation,
  useKycTypesQuery,
  useKycHistoryQuery,
  useKycDetailsQuery,
  useKycSubmitMutation,
} = authApi;
