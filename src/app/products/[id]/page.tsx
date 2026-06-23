"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  Share2,
  Loader2,
  Package,
  Star,
  Truck,
  MessageSquareText,
  PencilLine,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  useGetProductByIdQuery,
  useGetProductsQuery,
  useAddToCartMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
} from "@/store/apiSlice";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import ImageGallery from "@/components/custom/ImageGallery";
import QuantitySelector from "@/components/custom/QuantitySelector";
import TrustBadges from "@/components/custom/TrustBadgesFooter";
import ProductCard from "@/components/custom/ProductCard";
import { useAuthState } from "@/hooks/useAuthState";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading product details...</p>
      </div>
    </div>
  );
}

function ReviewCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="size-14 animate-pulse rounded-full bg-slate-200" />
        <div className="flex-1">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-4 w-24 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
      <div className="mt-4 h-5 w-full animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-5 w-10/12 animate-pulse rounded bg-slate-200" />
    </div>
  );
}

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(id, {
    skip: !id,
  });
  const categoryId = product?.data?.category?._id;
  const currentProductId = product?.data?._id;

  const { data: relatedProductsResult, isSuccess: isRelatedProductsSuccess } =
    useGetProductsQuery(
      {
        category: categoryId,
        limit: 12,
      },
      {
        skip: !categoryId,
      },
    );

  const [quantity, setQuantity] = useState(1);
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const { data: wishlistData } = useGetWishlistQuery();
  const [addToWishlist, { isLoading: isAddToWishlistLoading }] =
    useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemoveFromWishlistLoading }] =
    useRemoveFromWishlistMutation();
  const { isLoggedIn, profile } = useAuthState();
  const {
    data: productReviewsResult,
    isLoading: isReviewsLoading,
    isFetching: isReviewsFetching,
    isError: isReviewsError,
  } = useGetProductReviewsQuery(id, {
    skip: !id,
  });
  const [createReview, { isLoading: isSubmittingReview }] =
    useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdatingReview }] =
    useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeletingReview }] =
    useDeleteReviewMutation();
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  // Filter similar products by category
  const similarProducts = useMemo(() => {
    if (
      !isRelatedProductsSuccess ||
      !relatedProductsResult?.data ||
      !currentProductId
    )
      return [];

    return relatedProductsResult?.data
      ?.filter((p) => p && p?._id !== currentProductId && Boolean(p?.title))
      .slice(0, 5);
  }, [currentProductId, isRelatedProductsSuccess, relatedProductsResult]);

  const isInWishlist = useMemo(() => {
    if (!currentProductId) {
      return false;
    }

    return Boolean(
      wishlistData?.data?.some((item) => item._id === currentProductId),
    );
  }, [currentProductId, wishlistData?.data]);

  const reviews = Array.isArray(productReviewsResult?.data)
    ? productReviewsResult.data
    : [];
  const currentUserId = profile?._id ?? "";
  const alreadyReviewed = useMemo(() => {
    if (!isLoggedIn || !currentUserId) {
      return false;
    }

    return reviews.some((review) => review.user?._id === currentUserId);
  }, [currentUserId, isLoggedIn, reviews]);
  const totalReviews =
    reviews.length > 0
      ? reviews.length
      : Math.max(0, product?.data?.ratingsQuantity ?? 0);

  const averageRating = useMemo(() => {
    if (totalReviews === 0) {
      return "0.0";
    }

    const totalStars = reviews.reduce((sum, review) => {
      const rating = Number(review?.rating ?? review?.ratings ?? 0);
      return sum + (Number.isFinite(rating) ? rating : 0);
    }, 0);

    return (totalStars / totalReviews).toFixed(1);
  }, [reviews, totalReviews]);

  const averageRatingValue = Number(averageRating) || 0;

  const ratingBreakdown = useMemo(() => {
    const countMap = new Map<number, number>([
      [5, 0],
      [4, 0],
      [3, 0],
      [2, 0],
      [1, 0],
    ]);

    for (const review of reviews) {
      const rating = Number(review?.rating ?? review?.ratings ?? 0);
      if (!Number.isFinite(rating) || rating <= 0) {
        continue;
      }

      const star = Math.min(5, Math.max(1, Math.round(rating)));
      countMap.set(star, (countMap.get(star) ?? 0) + 1);
    }

    return [5, 4, 3, 2, 1].map((star) => {
      const count = countMap.get(star) ?? 0;
      const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

      return {
        star,
        count,
        percentage,
      };
    });
  }, [reviews, totalReviews]);

  const handleSubmitReview = async () => {
    const trimmedComment = reviewComment.trim();
    const isEditMode = Boolean(editingReviewId);

    if (!id) {
      return;
    }

    if (!isEditMode && alreadyReviewed) {
      toast.error("You have already reviewed this product");
      return;
    }

    if (reviewRating < 1) {
      toast.error("Please select a star rating before submitting.");
      return;
    }

    if (trimmedComment.length < 3) {
      toast.error("Please write a short review comment.");
      return;
    }

    try {
      if (isEditMode && editingReviewId) {
        await updateReview({
          id: editingReviewId,
          body: {
            review: trimmedComment,
            rating: reviewRating,
          },
        }).unwrap();
      } else {
        await createReview({
          productId: id,
          review: trimmedComment,
          rating: reviewRating,
        }).unwrap();
      }

      toast.success(
        isEditMode
          ? "Your review has been updated."
          : "Thanks! Your review has been submitted.",
      );
      setReviewRating(0);
      setReviewComment("");
      setIsReviewFormOpen(false);
      setEditingReviewId(null);
    } catch (error: unknown) {
      const duplicateReviewMessage = "You already added review on this product";
      const apiMessage =
        typeof error === "object" && error !== null && "data" in error
          ? (
              (error as { data?: { message?: string } }).data?.message ?? ""
            ).trim()
          : "";

      if (apiMessage === duplicateReviewMessage) {
        toast.error("You've already reviewed this product");
        setIsReviewFormOpen(false);
        return;
      }

      toast.error("Could not submit review. Please login and try again.");
    }
  };

  const handleEditReview = (reviewId: string, rating: number, text: string) => {
    setEditingReviewId(reviewId);
    setReviewRating(rating);
    setReviewComment(text);
    setIsReviewFormOpen(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteReview(reviewId).unwrap();
      toast.success("Review deleted successfully.");
      if (editingReviewId === reviewId) {
        setEditingReviewId(null);
        setIsReviewFormOpen(false);
        setReviewRating(0);
        setReviewComment("");
      }
    } catch {
      toast.error("Failed to delete review. Please try again.");
    }
  };

  const handleWishlistToggle = async () => {
    if (
      !currentProductId ||
      isAddToWishlistLoading ||
      isRemoveFromWishlistLoading
    ) {
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(currentProductId).unwrap();
        toast.success("Removed from wishlist");
        return;
      }

      await addToWishlist({ productId: currentProductId }).unwrap();
      toast.success("Added to wishlist");
    } catch {
      toast.error("Wishlist action failed. Please try again.");
    }
  };

  const isWishlistPending =
    isAddToWishlistLoading || isRemoveFromWishlistLoading;

  if (isLoading || !product?.data) return <LoadingSpinner />;

  const currentProduct = product?.data;

  // Calculate sale percentage
  const savePercentage = currentProduct?.price
    ? Math.round(
        ((currentProduct?.price - currentProduct?.price * 0.7) /
          currentProduct?.price) *
          100,
      )
    : 0;

  // Calculate total price
  const totalPrice = currentProduct?.price
    ? currentProduct?.price * quantity
    : 0;

  // Breadcrumbs
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: product?.data?.category?.name || "Category", href: "#" },
    {
      label:
        product?.data?.title?.split(" ").slice(0, 3).join(" ") || "Product",
      href: "#",
    },
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="container mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Link
                href={crumb.href}
                className="text-gray-600 hover:text-green-600"
              >
                {crumb.label}
              </Link>
              {idx < breadcrumbs.length - 1 && (
                <span className="text-gray-400">&gt;</span>
              )}
            </div>
          ))}
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column: Gallery */}
          <div>
            <ImageGallery
              imageCover={currentProduct?.imageCover || ""}
              images={currentProduct?.images || []}
              productName={currentProduct?.title || "Product"}
            />
          </div>

          {/* Right Column: Product Info */}
          <div>
            {/* Category & Brand */}
            <div className="flex gap-2 mb-3">
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded">
                {product?.data?.category?.name || "Category"}
              </span>
              {product?.data?.brand?.name && (
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded">
                  {product?.data?.brand?.name}
                </span>
              )}
              {product?.data?.subcategory?.[0]?.name && (
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded">
                  {product?.data?.subcategory?.[0]?.name}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {product?.data?.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.round(product?.data?.ratingsAverage || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm font-semibold">
                {(product?.data?.ratingsAverage || 0).toFixed(1)}
              </span>
              <span className="text-xs text-gray-500">
                ({product?.data?.ratingsQuantity || 0} reviews)
              </span>
            </div>

            {/* Price Section */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-bold text-gray-900">
                {product?.data?.price} EGP
              </span>
              <span className="text-lg text-gray-500 line-through">
                {Math.round((product?.data?.price || 0) / 0.7)} EGP
              </span>
              {savePercentage > 0 && (
                <span className="text-sm font-bold text-white bg-red-500 px-2 py-1 rounded">
                  Save {savePercentage}%
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6 text-sm">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-green-600 font-semibold">In Stock</span>
            </div>

            {/* Description Snippet */}
            <p className="text-gray-600 text-sm mb-6 line-clamp-3">
              {product?.data?.description}
            </p>

            {/* Quantity Selector */}
            <QuantitySelector
              maxQuantity={product?.data?.quantity || 50}
              onQuantityChange={setQuantity}
            />

            {/* Total Price */}
            <div className="flex justify-between items-center py-4 border-t border-b border-gray-200 my-4">
              <span className="text-gray-700 font-medium">Total Price:</span>
              <span className="text-2xl font-bold text-green-600">
                {totalPrice.toFixed(2)} EGP
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold disabled:opacity-50"
                onClick={() => {
                  addToCart({ productId: currentProduct._id })
                    .unwrap()
                    .then(() => {
                      toast.success("Added to Cart!");
                      setQuantity(1);
                    })
                    .catch(() => {
                      toast.error("Failed to add to cart. Please try again.");
                    });
                }}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner size="sm" className="text-white" />
                    Adding...
                  </span>
                ) : (
                  "🛒 Add to Cart"
                )}
              </Button>
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 text-lg font-semibold">
                ⚡ Buy Now
              </Button>
            </div>

            {/* Wishlist & Share Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 py-6"
                onClick={handleWishlistToggle}
                disabled={isWishlistPending}
              >
                {isWishlistPending ? (
                  <Spinner size="sm" className="mr-2 text-slate-500" />
                ) : (
                  <Heart
                    size={18}
                    className={`mr-2 ${
                      isInWishlist ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                )}
                {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="py-6"
                onClick={() => toast("Share link copied!")}
              >
                <Share2 size={18} />
              </Button>
            </div>

            {/* Trust Badges */}
            <TrustBadges />
          </div>
        </div>

        {/* Details Tabs Section */}
        <div className="mb-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid h-auto grid-cols-1 gap-0 border-b-2 border-gray-200 bg-transparent p-0 sm:grid-cols-3">
              <TabsTrigger
                value="details"
                className="justify-start rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-[#16A34A] data-[state=active]:bg-[#EAF8EF] data-[state=active]:text-[#16A34A]"
              >
                <Package className="mr-2 size-4" />
                Product Details
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="justify-start rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-[#16A34A] data-[state=active]:bg-[#EAF8EF] data-[state=active]:text-[#16A34A]"
              >
                <Star className="mr-2 size-4" />
                Reviews ({totalReviews})
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="justify-start rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-[#16A34A] data-[state=active]:bg-[#EAF8EF] data-[state=active]:text-[#16A34A]"
              >
                <Truck className="mr-2 size-4" />
                Shipping & Returns
              </TabsTrigger>
            </TabsList>

            {/* Product Details Tab */}
            <TabsContent value="details" className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold mb-4">About this Product</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product?.data?.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4">Key Features</h3>
                  <ul className="space-y-2">
                    {[
                      "Premium Quality Product",
                      "100% Authentic Guarantee",
                      "Fast & Secure Packaging",
                      "Quality Tested",
                    ].map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-gray-700"
                      >
                        <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Product Info Table */}
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-bold mb-4">Product Information</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 py-2 border-b">
                    <span className="text-gray-600">Category</span>
                    <span className="font-semibold">
                      {product?.data?.category?.name}
                    </span>
                  </div>
                  {product?.data?.brand?.name && (
                    <div className="grid grid-cols-2 py-2 border-b">
                      <span className="text-gray-600">Brand</span>
                      <span className="font-semibold">
                        {product?.data?.brand?.name}
                      </span>
                    </div>
                  )}
                  {product?.data?.subcategory?.[0]?.name && (
                    <div className="grid grid-cols-2 py-2 border-b">
                      <span className="text-gray-600">Subcategory</span>
                      <span className="font-semibold">
                        {product?.data?.subcategory?.[0]?.name}
                      </span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 py-2 border-b">
                    <span className="text-gray-600">Items Sold</span>
                    <span className="font-semibold">
                      {product?.data?.sold || 0}+
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="py-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[160px_1fr]">
                  <div>
                    <p className="text-6xl leading-none font-bold text-slate-900">
                      {averageRating}
                    </p>
                    <div className="mt-3 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`size-5 ${
                            star <= Math.round(averageRatingValue)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-type-base mt-3 text-slate-500">
                      Based on {totalReviews} reviews
                    </p>
                  </div>

                  <div className="space-y-4">
                    {ratingBreakdown.map((item) => (
                      <div
                        key={item.star}
                        className="grid grid-cols-[34px_1fr_56px] items-center gap-4"
                      >
                        <span className="text-type-base text-slate-700">
                          {item.star}
                        </span>
                        <div className="h-2 rounded-full bg-slate-200">
                          <div
                            className="h-2 rounded-full bg-yellow-400 transition-all"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-type-base text-right text-slate-500">
                          {Math.round(item.percentage)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-type-lg font-bold text-slate-900">
                    Customer Reviews
                  </h3>
                  {isLoggedIn && alreadyReviewed ? (
                    <span className="inline-flex h-9 items-center rounded-full border border-[#BBF7D0] bg-[#ECFDF5] px-4 text-type-sm font-semibold text-[#15803D]">
                      You have already reviewed this product
                    </span>
                  ) : isLoggedIn ? (
                    <Button
                      type="button"
                      className="bg-[#16A34A] text-white hover:bg-[#15803D]"
                      onClick={() => setIsReviewFormOpen((prev) => !prev)}
                    >
                      <PencilLine className="size-4" />
                      Write a Review
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsReviewFormOpen(true)}
                    >
                      <PencilLine className="size-4" />
                      Write a Review
                    </Button>
                  )}
                </div>

                {!isLoggedIn ? (
                  <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
                    <p className="text-type-base font-semibold text-amber-900">
                      Please login to write a review.
                    </p>
                    <p className="text-type-sm mt-1 text-amber-800">
                      You can still browse existing reviews below.
                    </p>
                    <div className="mt-4 flex justify-center">
                      <Link
                        href="/login"
                        className="inline-flex h-10 items-center justify-center rounded-full bg-[#16A34A] px-5 text-type-sm font-semibold text-white transition hover:bg-[#15803D]"
                      >
                        Go to Login
                      </Link>
                    </div>
                  </div>
                ) : isReviewFormOpen ? (
                  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-type-base font-semibold text-slate-900">
                      {editingReviewId ? "Edit Your Rating" : "Your Rating"}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="cursor-pointer"
                          aria-label={`Set rating to ${star}`}
                        >
                          <Star
                            className={`size-6 ${
                              star <= reviewRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    <label className="text-type-base mt-4 block font-semibold text-slate-900">
                      {editingReviewId ? "Edit Your Review" : "Your Review"}
                    </label>
                    <Textarea
                      value={reviewComment}
                      onChange={(event) => setReviewComment(event.target.value)}
                      placeholder="Share your experience with this product"
                      className="mt-2 min-h-28 bg-white"
                    />

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button
                        type="button"
                        className="bg-[#16A34A] text-white hover:bg-[#15803D]"
                        onClick={handleSubmitReview}
                        disabled={isSubmittingReview || isUpdatingReview}
                      >
                        {isSubmittingReview || isUpdatingReview ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : null}
                        {editingReviewId ? "Update Review" : "Submit Review"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsReviewFormOpen(false);
                          setReviewRating(0);
                          setReviewComment("");
                          setEditingReviewId(null);
                        }}
                        disabled={isSubmittingReview || isUpdatingReview}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : null}

                {isReviewsLoading || isReviewsFetching ? (
                  <div className="mt-6 space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <ReviewCardSkeleton key={index} />
                    ))}
                  </div>
                ) : isReviewsError ? (
                  <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
                    <p className="text-type-md font-semibold text-red-700">
                      We couldn&apos;t load the reviews right now.
                    </p>
                    <p className="text-type-base mt-2 text-red-600">
                      Please refresh the page and try again.
                    </p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                    <MessageSquareText className="mx-auto size-11 text-slate-300" />
                    <p className="text-type-md mt-3 text-slate-600">
                      Customer reviews will be displayed here.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {reviews.map((review) => {
                      const reviewerName =
                        review.user?.name ?? "FreshCart User";
                      const isOwner = review.user?._id === currentUserId;
                      const reviewRatingValue = Number(
                        review.rating ?? review.ratings ?? 0,
                      );
                      const reviewText =
                        review.review ??
                        review.title ??
                        "Great product and smooth shopping experience.";
                      const initials = reviewerName
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((chunk) => chunk[0]?.toUpperCase() ?? "")
                        .join("");

                      return (
                        <article
                          key={review._id}
                          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#D1FAE5] text-type-md font-bold text-[#16A34A]">
                              {initials || "FC"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h4 className="text-type-lg font-semibold text-slate-900">
                                  {reviewerName}
                                </h4>
                                <div className="flex items-center gap-2">
                                  {isOwner ? (
                                    <>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-2 text-type-sm"
                                        onClick={() =>
                                          handleEditReview(
                                            review._id,
                                            reviewRatingValue,
                                            reviewText,
                                          )
                                        }
                                      >
                                        <Pencil className="size-3.5" />
                                        Edit
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-2 text-type-sm text-red-600 hover:text-red-700"
                                        onClick={() =>
                                          handleDeleteReview(review._id)
                                        }
                                        disabled={isDeletingReview}
                                      >
                                        <Trash2 className="size-3.5" />
                                        Delete
                                      </Button>
                                    </>
                                  ) : null}
                                  <span className="text-type-sm text-slate-500">
                                    {review.createdAt
                                      ? new Date(
                                          review.createdAt,
                                        ).toLocaleDateString()
                                      : ""}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-2 flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`size-5 ${
                                      star <= reviewRatingValue
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-slate-300"
                                    }`}
                                  />
                                ))}
                              </div>

                              <p className="text-type-md mt-3 leading-relaxed text-slate-600 italic">
                                &ldquo;{reviewText}&rdquo;
                              </p>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Shipping & Returns Tab */}
            <TabsContent value="shipping" className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Shipping Info */}
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🚚</span>
                    </div>
                    <h4 className="text-lg font-bold">Shipping Information</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">
                        ✓
                      </span>
                      <span>Free shipping on orders over 550</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">
                        ✓
                      </span>
                      <span>Standard delivery: 3-5 business days</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">
                        ✓
                      </span>
                      <span>
                        Express delivery available (1-2 business days)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">
                        ✓
                      </span>
                      <span>Track your order in real-time</span>
                    </li>
                  </ul>
                </div>

                {/* Returns & Refunds */}
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl">↩️</span>
                    </div>
                    <h4 className="text-lg font-bold">Returns & Refunds</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">
                        ✓
                      </span>
                      <span>30-day hassle-free returns</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">
                        ✓
                      </span>
                      <span>Full refund or exchange available</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">
                        ✓
                      </span>
                      <span>Free return shipping on defective items</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">
                        ✓
                      </span>
                      <span>Easy online return process</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Buyer Protection */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 shrink-0 rounded-full bg-gray-300 flex items-center justify-center">
                    🛡️
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">
                      Buyer Protection Guarantee
                    </h4>
                    <p className="text-gray-700">
                      Get a full refund if your order doesn&apos;t arrive or
                      isn&apos;t as described. We ensure your shopping
                      experience is safe and secure.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* You May Also Like Section */}
        {isRelatedProductsSuccess &&
          relatedProductsResult?.data &&
          similarProducts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {similarProducts.map((prod) => (
                    <CarouselItem
                      key={prod?._id}
                      className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                      <ProductCard product={prod} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden lg:flex" />
                <CarouselNext className="hidden lg:flex" />
              </Carousel>
            </div>
          )}
      </div>
    </div>
  );
}
