"use client";

import { api } from "~/trpc/react";

function HomePage() {
  const { data } = api.post.all.useQuery();
  return (
    <main className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      {data?.map((post) => <div key={post.id}>{post.title}</div>)}
    </main>
  );
}

export default HomePage;
