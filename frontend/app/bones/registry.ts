import { registerBones } from "boneyard-js";
import { configureBoneyard } from "boneyard-js/react";

configureBoneyard({
  color: "#e5e7eb",
  shimmerColor: "#f3f4f6",
  animate: "shimmer",
  speed: "1.8s",
  transition: 200,
});

registerBones({});
