import { NextRequest } from "next/server";

const BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const url = BASE ? `${BASE}/blog/posts/${slug}` : "";
  try {
    if (url) {
      const res = await fetch(url, { next: { revalidate: 300 } });
      const raw = await res.json();
      const data = raw?.data || raw;
      const mapped = {
        success: true,
        data: {
          title: data?.title || "",
          excerpt: data?.excerpt || "",
          imageUrl: data?.imageUrl || data?.image || null,
          tags: Array.isArray(data?.tags) ? data.tags : [],
          content: String(data?.content || ""),
          contentHtml:
            typeof data?.contentHtml === "string"
              ? data.contentHtml
              : undefined,
        },
      };
      return Response.json(mapped, { status: res.status });
    }

    const mock = {
      success: true,
      data: {
        title: "Getting Started with React Hooks",
        excerpt:
          "Learn how to use React Hooks effectively in modern applications.",
        imageUrl: null,
        tags: ["React", "Hooks"],
        content: `# React Hooks Basics\n\nHooks simplify state and side effects in function components.\n\n## Example\n\n\`\`\`tsx\nimport { useState, useEffect } from 'react'\n\nexport function Counter() {\n  const [count, setCount] = useState(0)\n  useEffect(() => {\n    document.title = \'Count: \' + count\n  }, [count])\n  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>\n}\n\`\`\`\n\n==Highlighted== text is supported.`,
      },
    };
    return Response.json(mock);
  } catch (e) {
    return Response.json(
      { success: false, error: "Failed to fetch post" },
      { status: 500 },
    );
  }
}
