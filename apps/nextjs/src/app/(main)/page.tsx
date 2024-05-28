import ClientShowcase from "./clientShowcase";
import SSRShowcase from "./ssrShowcase";

function HomePage() {
  return (
    <main className="flex flex-col p-2 sm:gap-4">
      <div className="flex flex-col gap-4">
        <ClientShowcase />
        <SSRShowcase />
      </div>
    </main>
  );
}

export default HomePage;
