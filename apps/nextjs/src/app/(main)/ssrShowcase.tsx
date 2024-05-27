import { Card, CardContent, CardHeader } from "@henry/ui/card";

import { api } from "~/trpc/server";

async function SSRShowcase() {
  const data = await api.post.all();

  return (
    <Card>
      <CardHeader>Posts fetched on server</CardHeader>
      <CardContent className="flex flex-col gap-2">
        {data.map((post) => (
          <div key={post.id} className="rounded-md bg-primary/10 p-2">
            {post.title}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default SSRShowcase;
