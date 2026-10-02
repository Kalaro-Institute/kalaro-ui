import { useState } from "react";
import { Link } from "react-router";
import { Rss, Clock, ArrowRight, Search, ArrowLeft } from "lucide-react";
import { POSTS, type Post } from "@/app/data/resources";
import { PageHero, NotFound, ResourceStrip } from "./Shared";

const CATEGORIES = [
  "All",
  "HMO Operations",
  "Claims & Billing",
  "Career",
  "Regulation",
  "Technology",
] as const;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/* Blog index - lists every post with a live filter and search. */
export function BlogIndex() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");

  const posts = POSTS.filter((p) => {
    const matchCategory = category === "All" || p.category === category;
    const matchQuery =
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(query.toLowerCase());
    return matchCategory && matchQuery;
  });

  const [featured, ...rest] = posts;

  return (
    <div className="bg-[#f7faf7] font-[Poppins,sans-serif]">
      <PageHero
        eyebrow="Blog & Articles"
        title="Practical writing on HMO operations, claims and healthcare careers"
        body="Written by the people who do the work. Every article aims to leave you with something you can act on the same day."
      />

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-10">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 bg-white text-sm outline-none focus:border-green-500"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  category === c
                    ? "bg-green-700 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {featured && (
          <Link
            to={`/resources/blog/${featured.slug}`}
            className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden mb-8 hover:border-green-300 hover:shadow-lg transition-all"
          >
            <div className="grid md:grid-cols-[1fr_280px] items-stretch">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                    Latest
                  </span>
                  <span className="text-xs text-gray-400">{featured.category}</span>
                </div>
                <h2 className="text-2xl font-extrabold text-[#1a2332] mb-3 group-hover:text-green-700 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  {featured.excerpt}
                </p>
                <PostMeta post={featured} />
              </div>
              <div className="bg-green-50 flex items-center justify-center">
                <Rss className="w-14 h-14 text-green-600/40" />
              </div>
            </div>
          </Link>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((post) => (
            <Link
              key={post.slug}
              to={`/resources/blog/${post.slug}`}
              className="group bg-white border border-gray-100 rounded-2xl p-6 flex flex-col hover:border-green-300 hover:shadow-lg transition-all"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2.5 py-1 rounded-full self-start mb-4">
                {post.category}
              </span>
              <h3 className="font-bold text-[#1a2332] leading-snug mb-2 group-hover:text-green-700 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">
                {post.excerpt}
              </p>
              <PostMeta post={post} />
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-14 sm:py-20 text-gray-400">
            <Rss className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No articles match your search.</p>
            <p className="text-sm mt-1">Try a different keyword or category.</p>
          </div>
        )}
      </section>

      <ResourceStrip />
    </div>

  );
}
function PostMeta({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
      <span className="font-semibold text-gray-600">{post.author}</span>
      <span>{formatDate(post.date)}</span>
      <span className="flex items-center gap-1">
        <Clock className="w-3 h-3" /> {post.readMinutes} min read
      </span>
    </div>
  );
}



/* Single article. */
export function BlogPost({ slug }: { slug: string }) {
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return <NotFound label="Article" />;

  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="bg-[#f7faf7] font-[Poppins,sans-serif]">
      <section className="bg-[#1b5e20] text-white">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <Link
            to="/resources/blog"
            className="inline-flex items-center gap-2 text-sm text-green-200 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> All articles
          </Link>
          <span className="block text-[11px] font-bold uppercase tracking-wider bg-green-500/25 text-green-100 px-3 py-1 rounded-full w-fit mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-5">
            {post.title}
          </h1>
          <p className="text-green-100 text-lg leading-relaxed mb-6">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-green-200">
            <span className="font-semibold text-white">{post.author}</span>
            <span>{formatDate(post.date)}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {post.readMinutes} min read
            </span>
          </div>
        </div>
      </section>

      <ResourceStrip />

      <article className="max-w-3xl mx-auto px-6 py-14">
        <div className="space-y-6">
          {post.body.map((para, i) => (
            <p
              key={i}
              className={`leading-[1.8] text-gray-700 ${
                i === 0 ? "text-lg text-gray-800 font-medium" : "text-[15px]"
              }`}
            >
              {para}
            </p>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            to="/resources/library"
            className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-gray-100 rounded-2xl p-6 hover:border-green-300 transition-colors"
          >
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-green-700 mb-1.5">
                Put this into practice
              </p>
              <h3 className="font-bold text-[#1a2332]">
                Download the templates and checklists
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Free checklists, contract templates and policy guides.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-green-700">
              Visit the library <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        <h2 className="text-xl font-extrabold text-[#1a2332] mt-14 mb-6">
          Keep reading
        </h2>
        <div className="space-y-3">
          {related.map((r) => (
            <Link
              key={r.slug}
              to={`/resources/blog/${r.slug}`}
              className="group flex items-center justify-between gap-4 bg-white border border-gray-100 rounded-xl px-5 py-4 hover:border-green-300 transition-colors"
            >
              <span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  {r.category}
                </span>
                <span className="block font-semibold text-[#1a2332] group-hover:text-green-700 transition-colors">
                  {r.title}
                </span>
              </span>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-green-600 shrink-0" />
            </Link>
          ))}
        </div>
      </article>

      <ResourceStrip />

    </div>
  );
}

