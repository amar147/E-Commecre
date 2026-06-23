export interface ApiError {
  value: string;
  msg: string;
  param: string;
  location: string;
}

export interface ApiErrorResponse {
  statusMsg?: string;
  message: string;
  errors?: ApiError[];
}

export interface ApiPaginationMetadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
  prevPage?: number;
}

export interface UserPayload {
  name: string;
  email: string;
  role: string;
}

export interface AuthUserPayload extends UserPayload {
  _id: string;
}

export interface SignUpRequestBody {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface SignInRequestBody {
  email: string;
  password: string;
}

export interface ForgotPasswordRequestBody {
  email: string;
}

export interface VerifyResetCodeRequestBody {
  resetCode: string;
}

export interface VerifyResetCodeResponse {
  status: string;
}

export interface ResetPasswordRequestBody {
  email: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  token: string;
}

export interface AuthSuccessResponse {
  message: string;
  user: AuthUserPayload;
  token: string;
}

export interface ForgotPasswordResponse {
  statusMsg: string;
  message: string;
}

export interface CategorySummary {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

export interface BrandSummary {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface SubcategorySummary {
  _id?: string;
  name: string;
  slug?: string;
  category?: string;
}

export interface Product {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  imageCover: string;
  images: string[];
  quantity?: number;
  price: number;
  sold?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  category: CategorySummary;
  brand?: BrandSummary;
  subcategory?: SubcategorySummary[];
}

export interface ProductsResponse {
  results: number;
  metadata: ApiPaginationMetadata;
  data: Product[];
}

export interface ProductsQueryParams {
  keyword?: string;
  category?: string;
  brand?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  limit?: number;
}

export interface ProductResponse {
  data: Product;
}

export interface CategoriesResponse {
  results: number;
  metadata?: ApiPaginationMetadata;
  data: CategorySummary[];
}

export interface CategoryResponse {
  data: CategorySummary;
}

export interface SubCategoriesResponse {
  results: number;
  data: SubCategory[];
}

export interface SingleSubCategoryResponse {
  data: SubCategory;
}

export interface BrandsResponse {
  results: number;
  data: Brand[];
}

export interface SingleBrandResponse {
  data: Brand;
}

export interface CartProduct {
  _id: string;
  title: string;
  imageCover: string;
  category: CategorySummary;
  brand?: BrandSummary;
  price: number;
  id?: string;
}

export interface CartProductLine {
  _id: string;
  count: number;
  price: number;
  product: CartProduct;
}

export interface CartData {
  _id: string;
  cartOwner: string;
  products: CartProductLine[];
  totalCartPrice: number;
}

export interface CartResponse {
  status: string;
  numOfCartItems: number;
  data: CartData;
  message?: string;
}

export interface AddToCartRequestBody {
  productId: string;
}

export interface UpdateCartProductQuantityRequestBody {
  count: number;
}

export interface CartMutationResponse {
  status: string;
  message?: string;
  numOfCartItems?: number;
  data?: CartData | null;
}

export interface WishlistResponse {
  status: string;
  count: number;
  data: Product[];
}

export interface WishlistMutationResponse {
  status: string;
  message: string;
  data?: string[];
}

export interface CreateCashOrderResponse {
  status: string;
  message?: string;
  data?: {
    _id: string;
    user: string;
    cartItems: Array<{
      product: string;
      count: number;
      price: number;
      _id: string;
    }>;
    totalOrderPrice: number;
    paymentMethodType: "cash";
    isPaid: boolean;
    isDelivered: boolean;
    createdAt: string;
  };
}

export interface CreateOnlineOrderSessionResponse {
  status: string;
  session: {
    url: string;
    id: string;
  };
}

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export type OrderResponse =
  | CreateCashOrderResponse
  | CreateOnlineOrderSessionResponse;

export interface OrderItem {
  _id: string;
  product:
    | string
    | {
        _id?: string;
        title?: string;
        imageCover?: string;
        image?: string;
      };
  count: number;
  price: number;
}

export interface Order {
  _id: string;
  user: string;
  cartItems: OrderItem[];
  totalOrderPrice: number;
  shippingAddress: ShippingAddress;
  paymentMethodType: "cash" | "card";
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}

export interface UserOrdersResponse {
  status: string;
  results: number;
  data: Order[];
}

export type UserOrdersApiResponse = UserOrdersResponse | Order[];

export interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface UserData {
  name: string;
  email: string;
  phone: string;
}

export interface VerifyTokenResponse {
  message: string;
  decoded: {
    id: string;
    name: string;
    role: string;
  };
}

export interface AddressesResponse {
  message?: string;
  data: Address[];
}

export interface AddAddressRequestBody {
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface UpdateAddressRequestBody {
  name?: string;
  details?: string;
  phone?: string;
  city?: string;
}

export interface UpdateMeRequestBody {
  name?: string;
  email?: string;
  phone?: string;
}

export interface UpdateMeResponse {
  message: string;
  user: UserData;
}

export interface ChangePasswordRequestBody {
  currentPassword: string;
  password: string;
  rePassword: string;
}

export interface ChangePasswordResponse {
  message: string;
  token?: string;
}

export interface ReviewUser {
  _id: string;
  name: string;
}

export interface Review {
  _id: string;
  review?: string;
  rating?: number;
  title?: string;
  ratings?: number;
  user: ReviewUser;
  product?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReviewRequestBody {
  review: string;
  rating: number;
}

export interface UpdateReviewRequestBody {
  review?: string;
  rating?: number;
}

export interface ReviewResponse {
  message?: string;
  data: Review;
}

export interface ReviewsResponse {
  results: number;
  metadata?: ApiPaginationMetadata;
  data: Review[];
}

export interface ReviewsListTransformed {
  data: Review[];
  metadata?: ApiPaginationMetadata;
}

export interface DeleteReviewResponse {
  status?: string;
  message?: string;
}
