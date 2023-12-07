import { AutoplayVideo } from "../AutoplayVideo";
import { NewFile } from "../NewFile";
import { ExtraLargeTitle } from "../Primitives/ExtraLargeTitle";
import { SmallSubtitle } from "../Primitives/SmallSubtitle";

import heroVideo from "~/assets/home/JsonHero2.mp4";

const jsonHeroTitle = "JSON Parser.";
const jsonHeroSlogan = "Safe. Selfhosted. Private.";

export function HomeHeroSection() {
  return (
    <div
      className={`flex items-stretch flex-col md:flex-row bg-[rgb(56,52,139)] lg:p-6 lg:pb-16 pt-20 lg:pt-32`}
    >
      
      <div className="self-center flex align-center md:w-1/2 px-6 pb-8 mt-8 lg:mt-0">
        <div className="max-w-lg">
          <ExtraLargeTitle className="text-lime-300">
            {jsonHeroTitle}
          </ExtraLargeTitle>
          <ExtraLargeTitle className="text-white mb-4">
            {jsonHeroSlogan}
          </ExtraLargeTitle>
          <SmallSubtitle className="text-slate-200 mb-8">
            Stop copying your  JSON to external editors and start
            using inhouse secure self hosted json parser.
            With ability to share and edit.
          </SmallSubtitle>
        
        </div>
      </div>
      <div className="self-center md:w-1/2 md:pr-10 flex justify-end">
        <div className="w-full min-h-200">
          <NewFile />
        </div>
      </div>
    </div>
  );
}
