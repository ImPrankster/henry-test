import NavBar from "./nav";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <NavBar />
      <div className="w-14" />
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default MainLayout;
