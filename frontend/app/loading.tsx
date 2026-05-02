import {
  BoneyardPageLoading,
  HomePageBoneyardFixture,
} from "@/components/ui/custom/boneyard/PageSkeletons";

export default function Loading() {
  return (
    <BoneyardPageLoading
      name="home-page"
      fixture={<HomePageBoneyardFixture />}
    />
  );
}
