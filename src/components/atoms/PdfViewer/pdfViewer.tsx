import Image from "next/image";
import { PdfViewerProps } from "./types";

const PdfViewer = ({ alt, src, pageCount }: PdfViewerProps) => {
  return (
    <div className="my-28 flex flex-col items-center gap-4">
      {Array.from({ length: pageCount }).map((_, index) => {
        if (index === 0) return <div></div>;

        return (
          <div
            key={index}
            className="relative h-[90vh] w-[90vw] shadow sm:w-[80vw] lg:w-[60vw] xl:w-[40vw]"
          >
            <Image
              src={`/${src}${index >= 10 ? index : `0${index}`}.jpg`}
              fill
              alt={`${alt} ${index}`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PdfViewer;
