import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Navbar from "@/components/layout/Navbar";
import OpenCVLoader from "@/components/processing/OpenCVLoader";
import AnalysisWorkspace from "@/components/dashboard/AnalysisWorkspace";
export default function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <OpenCVLoader>
        <AnalysisWorkspace />
      </OpenCVLoader>

      <Footer />
    </>
  );
}