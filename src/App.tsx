import LeftPage from "@/components/LeftPage";
import RightPage from "@/components/RightPage";
import TopBar from "@/components/TopBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex h-screen flex-col bg-background">
        <TopBar />
        <div className="flex w-full flex-col justify-start px-10 pt-10 md:flex-row md:justify-around">
          <LeftPage />
          <RightPage />
        </div>
      </main>
    </QueryClientProvider>
  );
}

export default App;
