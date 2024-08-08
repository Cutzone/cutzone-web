import PdfViewer from "@/components/atoms/PdfViewer/pdfViewer";

const TermosDeUso = () => {
  return (
    <PdfViewer alt="Termos de uso" src="termos-de-uso_page-00" pageCount={11} />
  );
};

export default TermosDeUso;
