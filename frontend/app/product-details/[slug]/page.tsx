import { Product } from "@/@types/fullProduct";
import { GetRequestNormal } from "@/api-hook/api-hook";
import ProductPage from "@/components/ui/custom/productDetails/ProductPage";
import React from "react";

const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { slug } = await params;
  const data = await GetRequestNormal<Product>(
    `/product/get-product?slug=${slug}`
  );
  console.log("params", data);
  return <ProductPage params={data} />;
};

export default page;
