// components/PageBanner.tsx
import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbRoute {
  title: string;
  link: string;
}

interface PageBannerProps {
  title: string;
  routes?: BreadcrumbRoute[];
  backgroundImage?: string;
}

const PageBanner: React.FC<PageBannerProps> = ({
  title,
  routes = [],
  backgroundImage = "/page-title.png", // default background
}) => {
  return (
    <div
      className="relative w-full h-[280px] md:h-[320px] flex flex-col items-center justify-center bg-cover  bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Optional overlay for better text readability */}
      <div className="absolute inset-0 bg-black/5" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          {title}
        </h1>

        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            {/* Home - Always default */}
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {/* Dynamic routes */}
            {routes.map((route, index) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  {index === routes.length - 1 ? (
                    // Last item is the current page
                    <BreadcrumbPage>{route.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={route.link}>{route.title}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default PageBanner;
