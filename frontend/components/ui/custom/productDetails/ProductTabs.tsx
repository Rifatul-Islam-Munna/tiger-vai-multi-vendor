import { Product, ReviewStats } from "@/@types/fullProduct";
import React, { JSX } from "react";
import ReviewForm from "./Rating-form";
import ReviewsList from "./user-review";
import { Star } from "lucide-react";
import { Review } from "@/@types/review";

const RatingBreakdown = ({ stats }: { stats: ReviewStats | undefined }) => {
  const getCount = (rating: number): number => {
    switch (rating) {
      case 5:
        return stats?.count5 ?? 0;
      case 4:
        return stats?.count4 ?? 0;
      case 3:
        return stats?.count3 ?? 0;
      case 2:
        return stats?.count2 ?? 0;
      case 1:
        return stats?.count1 ?? 0;
      default:
        return 0;
    }
  };

  const getWidth = (rating: number): string => {
    const count = getCount(rating);
    const total = stats?.totalReviews ?? 0;
    if (total === 0) return "0%";
    return `${Math.round((count / total) * 100)}%`;
  };

  return (
    <div className="flex-1">
      {[5, 4, 3, 2, 1].map((rating) => (
        <div key={rating} className="flex items-center gap-3 mb-2">
          <span className="text-sm w-3 text-gray-700 font-medium">
            {rating}
          </span>
          <Star className="w-4 h-4 fill-palette-btn text-palette-btn flex-shrink-0" />
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden min-w-0">
            <div
              className="bg-palette-btn h-full rounded-full transition-all duration-300"
              style={{ width: getWidth(rating) }}
            ></div>
          </div>
          <span className="text-sm text-gray-500 w-10 text-right flex-shrink-0">
            {getCount(rating)}
          </span>
        </div>
      ))}
    </div>
  );
};
const ProductTabs = ({
  params,
  activeTab,
  setActiveTab,
  renderRating,
  page,
  setPage,
  reviews,
  totalPages,
  isLoading,
}: {
  params: Product;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  renderRating: (
    rating: number | undefined,
    totalReviews: number
  ) => JSX.Element;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  reviews: Review[] | undefined;
  totalPages: number;
  isLoading: boolean;
}) => {
  return (
    <>
      <div className="border-b-2 border-gray-200 overflow-x-auto">
        <nav className="flex gap-2 sm:gap-6">
          {["Details", "specifications", "reviews", "shipping"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 sm:py-4 px-2 sm:px-4 border-b-2 font-semibold text-sm sm:text-base capitalize transition-all whitespace-nowrap min-h-[44px] ${
                activeTab === tab
                  ? "border-palette-btn text-palette-btn"
                  : "border-transparent text-gray-500 hover:text-palette-text"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      <div className="py-6 sm:py-8">
        {activeTab === "Details" && (
          <div className="space-y-2">
            {params?.company_details && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h4 className="text-lg font-bold text-palette-text mb-3">
                  Company Details
                </h4>
                <p className="text-base text-gray-700">
                  {params?.company_details}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 bg-palette-btn/5 rounded-lg border border-palette-btn/10">
              <div className="text-center py-3">
                <h4 className="font-semibold text-palette-text mb-2 text-sm sm:text-base">
                  Dimensions
                </h4>
                <p className="text-sm sm:text-base text-gray-600">
                  {params?.height || params?.width
                    ? `${params?.height ?? 0}cm × ${params?.width ?? 0}cm`
                    : "N/A"}
                </p>
              </div>
              <div className="text-center py-3 border-t sm:border-t-0 sm:border-x border-gray-300">
                <h4 className="font-semibold text-palette-text mb-2 text-sm sm:text-base">
                  Weight
                </h4>
                <p className="text-sm sm:text-base text-gray-600">
                  {params?.weight ?? "N/A"}
                </p>
              </div>
              <div className="text-center py-3 border-t sm:border-t-0">
                <h4 className="font-semibold text-palette-text mb-2 text-sm sm:text-base">
                  Brand
                </h4>
                <p className="text-sm sm:text-base text-gray-600">
                  {params?.brand?.name ?? "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-palette-text">
              Technical Specifications
            </h3>
            {params?.specifications &&
              Object.keys(params.specifications).length > 0 && (
                <div className="space-y-2">
                  {Object.entries(params.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center py-2 px-4 sm:px-6 border-b border-gray-200"
                    >
                      <span className="font-semibold text-palette-text text-sm sm:text-base">
                        {key}
                      </span>
                      <span className="text-gray-600 text-sm sm:text-base text-right ml-4">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            {(params?.certifications?.length ?? 0) > 0 && (
              <div className="mt-8">
                <h4 className="font-semibold text-palette-text mb-4 text-base sm:text-lg">
                  Certifications
                </h4>
                <div className="flex flex-wrap gap-2">
                  {params?.certifications?.map((cert, index) => (
                    <span
                      key={index}
                      className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-palette-text">
              Customer Reviews
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 sm:p-6 bg-palette-btn/5 rounded-lg border border-palette-btn/10">
              <div className="text-center sm:text-left">
                <div className="text-4xl sm:text-5xl font-bold text-palette-text">
                  {params?.stats?.averageRating?.toFixed(1) ?? "0.0"}
                </div>
                <div className="flex justify-center sm:justify-start mt-2">
                  {renderRating(
                    params?.stats?.averageRating ?? 0,
                    params?.stats?.totalReviews ?? 0
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {params?.stats?.totalReviews ?? 0} total
                </div>
              </div>
              <RatingBreakdown stats={params?.stats} />
            </div>

            <ReviewForm productId={params?._id} />
            <ReviewsList
              currentPage={page}
              onPageChange={setPage}
              reviews={reviews}
              totalPages={totalPages}
              isLoading={isLoading}
            />
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-palette-text">
              Shipping & Returns
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-4 sm:p-6 border border-gray-200 rounded-lg bg-white">
                <h4 className="font-bold text-palette-text mb-4 text-base sm:text-lg">
                  Shipping Information
                </h4>
                <div className="space-y-3">
                  {params?.shippingTime && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm sm:text-base text-gray-600">
                        Delivery Time
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-palette-text">
                        {params.shippingTime}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm sm:text-base text-gray-600">
                      Shipping Cost
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-palette-text">
                      {params?.freeShipping
                        ? "Free"
                        : `৳${params?.shippingCost ?? 0}`}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm sm:text-base text-gray-600">
                      Express Delivery
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-palette-text">
                      Available
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 border border-gray-200 rounded-lg bg-white">
                <h4 className="font-bold text-palette-text mb-4 text-base sm:text-lg">
                  Return Policy
                </h4>
                <div className="space-y-3">
                  {params?.returnPolicy && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm sm:text-base text-gray-600">
                        Return Period
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-palette-text">
                        {params.returnPolicy}
                      </span>
                    </div>
                  )}
                  {params?.warrantyPeriod && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm sm:text-base text-gray-600">
                        Warranty
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-palette-text">
                        {params.warrantyPeriod}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-2">
                    <span className="text-sm sm:text-base text-gray-600">
                      Return Shipping
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-palette-text">
                      Free
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-palette-btn/5 border-2 border-palette-btn/20 rounded-lg">
              <h4 className="font-bold text-palette-text mb-4 text-base sm:text-lg">
                Return Process
              </h4>
              <ol className="space-y-3 text-sm sm:text-base text-gray-700">
                <li className="flex gap-3">
                  <span className="font-bold text-palette-btn flex-shrink-0">
                    1.
                  </span>
                  <span>Contact our support team to initiate a return</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-palette-btn flex-shrink-0">
                    2.
                  </span>
                  <span>Pack the item in its original packaging</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-palette-btn flex-shrink-0">
                    3.
                  </span>
                  <span>Print the prepaid return label we will email you</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-palette-btn flex-shrink-0">
                    4.
                  </span>
                  <span>
                    Drop off at any courier location or schedule pickup
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-palette-btn flex-shrink-0">
                    5.
                  </span>
                  <span>Refund will be processed within 3-5 business days</span>
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductTabs;
