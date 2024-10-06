import { LandingH1, P } from "@/components/ui/typography";
import Image from "next/image";

export default function Home() {
  return (
    <div className="max-h-[800px] overflow-crop p-8 pb-20 gap-6 sm:p-20">
      <div
        className={
          "relative flex flex-col gap-4 items-center justify-items-center"
        }
      >
        <LandingH1 className={"font-semibold text-center text-slate-700"}>
          Explore <span className={"text-yellow-600"}>Your Community</span> Like
          You've <br className={"hidden lg:block"} />
          Never Done Before.
        </LandingH1>

        <P
          className={
            "text-xl max-w-md text-center font-medium leading-8 text-muted-foreground"
          }
        >
          Our full stack curriculum is free and supported by a passionate open
          source community.
        </P>

        <div className={"w-full"}>
          <Image
            src={"/images/isometric-map.svg"}
            alt={"Isometric map"}
            width={1000}
            height={1000}
            className={"w-full -z-10 opacity-50 top-0 lg:absolute"}
          />
        </div>
      </div>
    </div>
  );
}
