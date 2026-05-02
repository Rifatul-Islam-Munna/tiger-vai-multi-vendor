"use client";

import type { ReactNode } from "react";
import { Skeleton } from "boneyard-js/react";
import "@/app/bones/registry";

function Bone({ className }: { className: string }) {
  return <div className={`bg-gray-200 ${className}`} />;
}

export function HomePageBoneyardFixture() {
  return (
    <div className="bg-palette-bg">
      <section className="w-full py-16 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <Bone className="h-14 w-11/12 rounded-lg md:h-20" />
              <Bone className="h-5 w-4/5 rounded" />
              <Bone className="h-5 w-3/5 rounded" />
              <div className="flex gap-4 pt-2">
                <Bone className="h-12 w-44 rounded-full" />
                <Bone className="h-12 w-40 rounded-full" />
              </div>
            </div>
            <Bone className="aspect-[4/3] w-full rounded-lg" />
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-8">
        <div className="container mx-auto">
          <Bone className="mb-6 h-9 w-56 rounded" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-lg bg-white">
                <Bone className="aspect-square w-full" />
                <div className="p-3">
                  <Bone className="mx-auto h-4 w-3/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-3 md:px-0">
          <Bone className="mb-8 h-9 w-64 rounded" />
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="rounded-lg bg-white p-2">
                <Bone className="aspect-square w-full rounded" />
                <div className="space-y-2 p-2">
                  <Bone className="h-4 w-2/3 rounded" />
                  <Bone className="h-4 w-full rounded" />
                  <Bone className="h-5 w-24 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function SearchPageBoneyardFixture() {
  return (
    <div className="min-h-screen bg-palette-bg">
      <div className="container mx-auto px-4 py-8">
        <Bone className="mb-8 h-10 w-72 rounded" />
        <div className="flex gap-6">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="space-y-5 rounded-lg border border-gray-200 bg-white p-6">
              <Bone className="h-7 w-36 rounded" />
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Bone className="h-4 w-28 rounded" />
                  <Bone className="h-9 w-full rounded" />
                </div>
              ))}
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Bone className="h-7 w-44 rounded" />
              <Bone className="h-10 w-full rounded sm:w-52" />
            </div>
            <div className="mb-4 flex gap-2 overflow-hidden">
              {Array.from({ length: 5 }).map((_, index) => (
                <Bone key={index} className="h-8 w-28 shrink-0 rounded-full" />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="rounded-lg bg-white p-2">
                  <Bone className="aspect-square w-full rounded" />
                  <div className="space-y-2 p-2">
                    <Bone className="h-3 w-1/2 rounded" />
                    <Bone className="h-4 w-full rounded" />
                    <Bone className="h-4 w-4/5 rounded" />
                    <Bone className="h-5 w-24 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export function BoneyardPageCapture({
  name,
  fixture,
  children,
}: {
  name: string;
  fixture: ReactNode;
  children: ReactNode;
}) {
  return (
    <Skeleton
      name={name}
      loading={false}
      fixture={fixture}
      fallback={fixture}
      animate="shimmer"
      transition={300}
    >
      {children}
    </Skeleton>
  );
}

export function BoneyardPageLoading({
  name,
  fixture,
}: {
  name: string;
  fixture: ReactNode;
}) {
  return (
    <Skeleton
      name={name}
      loading
      fixture={fixture}
      fallback={fixture}
      animate="shimmer"
      transition={300}
    >
      {fixture}
    </Skeleton>
  );
}
