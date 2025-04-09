
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProfileCreator from "./pages/ProfileCreator";
import DatabasePage from "./pages/DatabasePage";
import { Layout } from "./components/Layout";
import Providers from "./components/Providers";

const App = () => (
  <Providers>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile" element={<ProfileCreator />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/resources" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </Providers>
);

export default App;
