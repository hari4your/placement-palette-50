import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import CodingProfiles from "./pages/CodingProfiles";
import DSAPDFs from "./pages/DSAPDFs";
import Notes from "./pages/Notes";
import InterviewExperiences from "./pages/InterviewExperiences";
import Projects from "./pages/Projects";
import Resume from "./pages/Resume";
import CompanyPrep from "./pages/CompanyPrep";
import HRQnA from "./pages/HRQnA";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/coding-profiles" element={<CodingProfiles />} />
            <Route path="/dsa-pdfs" element={<DSAPDFs />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/interviews" element={<InterviewExperiences />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/company-prep" element={<CompanyPrep />} />
            <Route path="/hr-qna" element={<HRQnA />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
