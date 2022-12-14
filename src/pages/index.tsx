import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const queryClient = trpc.useContext();

  const { data: posts } = trpc.example.getPaginated.useInfiniteQuery({
    foo: "bar",
  });

  console.log("posts:", posts);

  const create = trpc.example.create.useMutation({
    onMutate: () => {
      queryClient.example.getPaginated.cancel();

      queryClient.example.getPaginated.setInfiniteData((data) => data, {
        foo: "bar",
      });
    },
    onSettled: () => queryClient.example.getPaginated.invalidate(),
  });

  function handleCreate() {
    create.mutate({ id: String(Math.random()) });
  }

  if (!posts) {
    return <div>dont have posts</div>;
  }

  return (
    <>
      <div className="flex flex-col">
        <button className="border border-black" onClick={handleCreate}>
          create
        </button>
      </div>
      <div>
        <p>query data is currently:</p>
        <pre>{JSON.stringify(posts, null, 2)}</pre>
      </div>
    </>
  );
};

export default Home;
