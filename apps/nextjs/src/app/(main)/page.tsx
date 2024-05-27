import ClientShowcase from "./clientShowcase";
import SSRShowcase from "./ssrShowcase";

function HomePage() {
  return (
    <main className="flex flex-col sm:gap-4 sm:pl-14">
      <div className="flex flex-col gap-4 p-4">
        <ClientShowcase />
        <SSRShowcase />
      </div>
    </main>
  );
}

export default HomePage;
