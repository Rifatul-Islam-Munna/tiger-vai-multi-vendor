import {
  BoneyardPageLoading,
  SearchPageBoneyardFixture,
} from "@/components/ui/custom/boneyard/PageSkeletons";

export default function SearchProductLoading() {
  return (
    <BoneyardPageLoading
      name="search-page"
      fixture={<SearchPageBoneyardFixture />}
    />
  );
}
