import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

import {
  MAINTENANCE_AUTO_DETECTION_ENABLED,
  ROUTEMISR_API_BASE_URL,
} from "@/config/maintenance";
import { reportApiFailure, reportApiSuccess } from "@/store/maintenanceSlice";

import type {
  AddAddressRequestBody,
  AddToCartRequestBody,
  AddressesResponse,
  AuthSuccessResponse,
  CartMutationResponse,
  CartResponse,
  BrandsResponse,
  CategoryResponse,
  CategoriesResponse,
  ChangePasswordRequestBody,
  ChangePasswordResponse,
  CreateCashOrderResponse,
  CreateOnlineOrderSessionResponse,
  DeleteReviewResponse,
  ForgotPasswordRequestBody,
  ForgotPasswordResponse,
  ProductResponse,
  ProductsQueryParams,
  ProductsResponse,
  ReviewResponse,
  ReviewsListTransformed,
  ReviewsResponse,
  ResetPasswordRequestBody,
  ResetPasswordResponse,
  ShippingAddress,
  SignInRequestBody,
  SignUpRequestBody,
  SingleBrandResponse,
  SingleSubCategoryResponse,
  SubCategoriesResponse,
  UpdateAddressRequestBody,
  UpdateMeRequestBody,
  UpdateMeResponse,
  UpdateCartProductQuantityRequestBody,
  UpdateReviewRequestBody,
  UserOrdersApiResponse,
  VerifyResetCodeRequestBody,
  VerifyResetCodeResponse,
  VerifyTokenResponse,
  WishlistMutationResponse,
  WishlistResponse,
} from "@/types/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: ROUTEMISR_API_BASE_URL,
  prepareHeaders: async (headers) => {
    const session = await getSession();
    const token = session?.accessToken;

    if (token) {
      headers.set("token", token);
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithMaintenanceTracking: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (!MAINTENANCE_AUTO_DETECTION_ENABLED) {
    return result;
  }

  if ("error" in result && result.error) {
    const status = result.error.status;
    const isOutageError =
      status === "TIMEOUT_ERROR" ||
      status === "FETCH_ERROR" ||
      (typeof status === "number" && status >= 500);

    if (isOutageError) {
      api.dispatch(
        reportApiFailure(
          typeof status === "string" ? status : `HTTP_${String(status)}`,
        ),
      );
    } else {
      api.dispatch(reportApiSuccess());
    }

    return result;
  }

  api.dispatch(reportApiSuccess());
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: [
    "Cart",
    "Wishlist",
    "Brands",
    "Addresses",
    "SubCategories",
    "Reviews",
  ],
  baseQuery: baseQueryWithMaintenanceTracking,
  endpoints: (builder) => ({
    signUp: builder.mutation<AuthSuccessResponse, SignUpRequestBody>({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
    }),
    signIn: builder.mutation<AuthSuccessResponse, SignInRequestBody>({
      query: (body) => ({
        url: "/auth/signin",
        method: "POST",
        body,
      }),
    }),
    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequestBody
    >({
      query: (body) => ({
        url: "/auth/forgotPasswords",
        method: "POST",
        body,
      }),
    }),
    verifyResetCode: builder.mutation<
      VerifyResetCodeResponse,
      VerifyResetCodeRequestBody
    >({
      query: (body) => ({
        url: "/auth/verifyResetCode",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequestBody
    >({
      query: (body) => ({
        url: "/auth/resetPassword",
        method: "PUT",
        body,
      }),
    }),
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => ({
        url: "/categories",
      }),
    }),
    getSpecificCategory: builder.query<CategoryResponse, string>({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
      }),
    }),
    getSubCategories: builder.query<SubCategoriesResponse, void>({
      query: () => ({
        url: "/subcategories",
      }),
    }),
    getSpecificSubCategory: builder.query<SingleSubCategoryResponse, string>({
      query: (subId) => ({
        url: `/subcategories/${subId}`,
      }),
    }),
    getSubCategoriesOnCategory: builder.query<SubCategoriesResponse, string>({
      query: (categoryId) => ({
        url: `/categories/${categoryId}/subcategories`,
      }),
      providesTags: ["SubCategories"],
    }),
    getBrands: builder.query<BrandsResponse, void>({
      query: () => ({
        url: "/brands",
      }),
      providesTags: ["Brands"],
    }),
    getSpecificBrand: builder.query<SingleBrandResponse, string>({
      query: (brandId) => ({
        url: `/brands/${brandId}`,
      }),
    }),
    getProducts: builder.query<ProductsResponse, ProductsQueryParams | void>({
      query: (params) => {
        if (!params) {
          return {
            url: "/products",
          };
        }

        const queryParts: string[] = [];

        if (params.keyword) {
          queryParts.push(`keyword=${encodeURIComponent(params.keyword)}`);
        }

        if (params.category) {
          queryParts.push(
            `category[in]=${encodeURIComponent(params.category)}`,
          );
        }

        if (params.brand) {
          queryParts.push(`brand[in]=${encodeURIComponent(params.brand)}`);
        }

        if (params.subcategory) {
          queryParts.push(
            `subcategory[in]=${encodeURIComponent(params.subcategory)}`,
          );
        }

        if (
          typeof params.minPrice === "number" &&
          !Number.isNaN(params.minPrice)
        ) {
          queryParts.push(`price[gte]=${params.minPrice}`);
        }

        if (
          typeof params.maxPrice === "number" &&
          !Number.isNaN(params.maxPrice)
        ) {
          queryParts.push(`price[lte]=${params.maxPrice}`);
        }

        if (params.sort) {
          queryParts.push(`sort=${encodeURIComponent(params.sort)}`);
        }

        if (typeof params.limit === "number" && !Number.isNaN(params.limit)) {
          queryParts.push(`limit=${params.limit}`);
        }

        const queryString =
          queryParts.length > 0 ? `?${queryParts.join("&")}` : "";

        return {
          url: `/products${queryString}`,
        };
      },
    }),
    getProductById: builder.query<ProductResponse, string>({
      query: (id) => ({
        url: `/products/${id}`,
      }),
    }),
    createReview: builder.mutation<
      ReviewResponse,
      { productId: string; review: string; rating: number }
    >({
      query: ({ productId, review, rating }) => ({
        url: `/products/${productId}/reviews`,
        method: "POST",
        body: { review, rating },
      }),
      invalidatesTags: ["Reviews"],
    }),
    getProductReviews: builder.query<ReviewsListTransformed, string>({
      query: (productId) => ({
        url: `/products/${productId}/reviews`,
        method: "GET",
      }),
      transformResponse: (response: ReviewsResponse) => ({
        data: response.data,
        metadata: response.metadata,
      }),
      providesTags: ["Reviews"],
    }),
    getAllReviews: builder.query<ReviewsListTransformed, void>({
      query: () => ({
        url: "/reviews",
        method: "GET",
      }),
      transformResponse: (response: ReviewsResponse) => ({
        data: response.data,
        metadata: response.metadata,
      }),
      providesTags: ["Reviews"],
    }),
    getReviewById: builder.query<ReviewResponse, string>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "GET",
      }),
      providesTags: ["Reviews"],
    }),
    updateReview: builder.mutation<
      ReviewResponse,
      { id: string; body: UpdateReviewRequestBody }
    >({
      query: ({ id, body }) => ({
        url: `/reviews/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Reviews"],
    }),
    deleteReview: builder.mutation<DeleteReviewResponse, string>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),
    addToCart: builder.mutation<CartMutationResponse, AddToCartRequestBody>({
      query: (body) => ({
        url: "/cart",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    getLoggedUserCart: builder.query<CartResponse, void>({
      query: () => ({
        url: "/cart",
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),
    updateCartProductQuantity: builder.mutation<
      CartMutationResponse,
      { productId: string; body: UpdateCartProductQuantityRequestBody }
    >({
      query: ({ productId, body }) => ({
        url: `/cart/${productId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: builder.mutation<CartMutationResponse, string>({
      query: (productId) => ({
        url: `/cart/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation<CartMutationResponse, void>({
      query: () => ({
        url: "/cart",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    createCashOrder: builder.mutation<
      CreateCashOrderResponse,
      { cartId: string; shippingAddress: ShippingAddress }
    >({
      query: ({ cartId, shippingAddress }) => ({
        url: `https://ecommerce.routemisr.com/api/v2/orders/${cartId}`,
        method: "POST",
        body: { shippingAddress },
      }),
      invalidatesTags: ["Cart"],
    }),
    createOnlineOrder: builder.mutation<
      CreateOnlineOrderSessionResponse,
      { cartId: string; shippingAddress: ShippingAddress }
    >({
      query: ({ cartId, shippingAddress }) => {
        const origin =
          typeof window !== "undefined" ? window.location.origin : "";
        return {
          url: `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${origin}`,
          method: "POST",
          body: { shippingAddress },
        };
      },
      invalidatesTags: ["Cart"],
    }),
    getUserOrders: builder.query<UserOrdersApiResponse, string>({
      query: (userId) => ({
        url: `/orders/user/${userId}`,
        method: "GET",
      }),
    }),
    getWishlist: builder.query<WishlistResponse, void>({
      query: () => ({
        url: "/wishlist",
        method: "GET",
      }),
      providesTags: ["Wishlist"],
    }),
    getAddresses: builder.query<AddressesResponse, void>({
      query: () => ({
        url: "/addresses",
        method: "GET",
      }),
      providesTags: ["Addresses"],
    }),
    addAddress: builder.mutation<AddressesResponse, AddAddressRequestBody>({
      query: (body) => ({
        url: "/addresses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Addresses"],
    }),
    updateAddress: builder.mutation<
      AddressesResponse,
      { id: string; body: UpdateAddressRequestBody }
    >({
      query: ({ id, body }) => ({
        url: `/addresses/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Addresses"],
    }),
    removeAddress: builder.mutation<AddressesResponse, string>({
      query: (id) => ({
        url: `/addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Addresses"],
    }),
    updateMe: builder.mutation<UpdateMeResponse, UpdateMeRequestBody>({
      query: (body) => ({
        url: "/users/updateMe",
        method: "PUT",
        body,
      }),
    }),
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequestBody
    >({
      query: (body) => ({
        url: "/users/changeMyPassword",
        method: "PUT",
        body,
      }),
    }),
    verifyToken: builder.query<VerifyTokenResponse, void>({
      query: () => ({
        url: "/auth/verifyToken",
        method: "GET",
      }),
    }),
    addToWishlist: builder.mutation<
      WishlistMutationResponse,
      AddToCartRequestBody
    >({
      query: (body) => ({
        url: "/wishlist",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wishlist"],
    }),
    removeFromWishlist: builder.mutation<WishlistMutationResponse, string>({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useAddAddressMutation,
  useClearCartMutation,
  useChangePasswordMutation,
  useCreateCashOrderMutation,
  useCreateOnlineOrderMutation,
  useForgotPasswordMutation,
  useGetAddressesQuery,
  useGetCategoriesQuery,
  useGetSpecificCategoryQuery,
  useGetBrandsQuery,
  useGetLoggedUserCartQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetSpecificBrandQuery,
  useGetSubCategoriesQuery,
  useGetSpecificSubCategoryQuery,
  useGetSubCategoriesOnCategoryQuery,
  useCreateReviewMutation,
  useGetProductReviewsQuery,
  useGetAllReviewsQuery,
  useGetReviewByIdQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetUserOrdersQuery,
  useGetWishlistQuery,
  useRemoveAddressMutation,
  useAddToWishlistMutation,
  useResetPasswordMutation,
  useRemoveCartItemMutation,
  useRemoveFromWishlistMutation,
  useSignInMutation,
  useSignUpMutation,
  useUpdateAddressMutation,
  useUpdateCartProductQuantityMutation,
  useUpdateMeMutation,
  useVerifyResetCodeMutation,
  useVerifyTokenQuery,
} = apiSlice;

export const useSignupMutation = apiSlice.useSignUpMutation;
export const useSigninMutation = apiSlice.useSignInMutation;
