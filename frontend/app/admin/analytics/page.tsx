"use client";
import dynamic from "next/dynamic";

import ComingSoonPage from "@/components/ui/custom/common/Comming-Soon";
import React from "react";

const Editor = dynamic(
  () => import("@/components/ui/custom/addProduct/Description"),
  { ssr: false }
);

const page = () => {
  return (
    <div>
      <h1>My Rich Text Editor</h1>
      <Editor />
    </div>
  );
};

export default page;
