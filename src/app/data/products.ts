/* Shop catalogue: physical goods the institute sells.

   Separate from courses.ts and services.ts on purpose. A product is
   a thing that ships - a book, a workbook, a branded kit. Courses are
   programmes and services are fee-based work; neither can be put in a
   parcel, so neither belongs here. */

export type ProductCategory = "Books" | "Templates" | "Kits" | "Apparel";

export type Product = {
  slug: string;
  title: string;
  category: ProductCategory;
  /** Base price in USD; converted per visitor at render time. */
  priceUsd: number;
  /** Was-price, when the item is on promotion. */
  compareAtUsd?: number;
  summary: string;
  description: string;
  img: string;
  /** Bullet points shown on the product page. */
  highlights: string[];
  /** Physical attributes. stock = units on hand; omit when unlimited. */
  pages?: number;
  format?: string;
  stock?: number;
  badge?: string;
};

const IMG = {
  books:
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
  workbook:
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
  notebook:
    "https://images.unsplash.com/photo-1531346878377-a5be20888e57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
  kit:
    "https://images.unsplash.com/photo-1526947425960-945c6e72858f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
  apparel:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
};

export const PRODUCTS: Product[] = [
  {
    slug: "hmo-operations-handbook",
    title: "HMO Operations Handbook",
    category: "Books",
    priceUsd: 45,
    summary:
      "The complete operating reference: enrolment, benefits, providers, claims and member service.",
    description:
      "The book we run our own programmes from. It walks through the full HMO lifecycle in the order it happens - how members join, how benefits are designed, how providers are contracted and paid, how claims move from submission to settlement, and how member service turns all of that into a retained member. Written for officers who need to understand not just what to do, but why the operational choices matter.",
    img: IMG.books,
    pages: 296,
    format: "Hardcover",
    stock: 40,
    badge: "Best seller",
    highlights: [
      "296 pages of operational detail",
      "Real claim and enrolment workflows",
      "Templates for provider agreements and benefit design",
      "Written by practising HMO operators, not academics",
    ],
  },
  {
    slug: "claims-adjudication-workbook",
    title: "Claims Adjudication Workbook",
    category: "Books",
    priceUsd: 28,
    summary:
      "Work through 50 real claim scenarios and learn the five rejections that cause most delays.",
    description:
      "A practical workbook rather than a textbook. Each exercise presents a genuine claim situation - incomplete provider details, a diagnosis that does not support the procedure billed, a duplicate submission, a benefit limit exceeded without authorisation - and asks you to find the problem and decide what should happen. Come in with the theory from the handbook, come out having actually done it.",
    img: IMG.workbook,
    pages: 148,
    format: "Paperback",
    stock: 60,
    highlights: [
      "50 worked claim scenarios",
      "The five rejection reasons, explained",
      "Provider query and dispute templates included",
      "Suitable for new and experienced adjudicators",
    ],
  },
  {
    slug: "glossary-of-health-insurance-terms",
    title: "Glossary of Health Insurance Terms",
    category: "Books",
    priceUsd: 18,
    compareAtUsd: 22,
    summary:
      "Every acronym and term a new HMO officer is expected to know, in plain language.",
    description:
      "Capitation, empanelment, community rating, third-party administration - the vocabulary of the industry, defined without assuming you already know it. Every entry gives a short version for a quick answer and a fuller explanation for when the distinction actually matters. Written to be kept at a desk and reached for often.",
    img: IMG.notebook,
    pages: 112,
    format: "Paperback",
    stock: 120,
    badge: "Great value",
    highlights: [
      "Over 120 terms and acronyms",
      "Short and full explanations for each",
      "Cross-references to related concepts",
      "Also available free on this site",
    ],
  },
{
    slug: "provider-contract-pack",
    title: "Provider Contract Pack",
    category: "Templates",
    priceUsd: 35,
    summary:
      "The full suite of provider agreement templates, with a guide on what to change.",
    description:
      "A working provider contract, a service-level agreement covering response times and escalation, and a panel nomination form. Each template is annotated so you can see which clauses matter commercially and which are boilerplate. Written to be adapted to your scheme rather than merely read.",
    img: IMG.kit,
    format: "Digital + printed",
    highlights: [
      "Provider service agreement",
      "Member service level agreement",
      "Panel nomination and vetting forms",
      "Clause-by-clause guidance notes",
    ],
  },
  {
    slug: "new-officer-starter-kit",
    title: "New HMO Officer Starter Kit",
    category: "Kits",
    priceUsd: 65,
    summary:
      "Everything a new officer needs in week one: handbook, workbook, glossary and templates.",
    description:
      "The onboarding pack we give new officers on their first day. Bundled because the pieces reinforce each other - the glossary gives you the vocabulary, the handbook the operating model, the workbook the practice, and the templates the things you will actually be asked to produce in your first month.",
    img: IMG.kit,
    format: "Boxed set",
    stock: 25,
    badge: "Save 17%",
    highlights: [
      "HMO Operations Handbook",
      "Claims Adjudication Workbook",
      "Glossary of Health Insurance Terms",
      "Provider Contract Pack",
    ],
  },
  {
    slug: "institute-branded-notebook",
    title: "Institute Branded Notebook",
    category: "Apparel",
    priceUsd: 9,
    summary:
      "A quality hardbound notebook for claim logs, site visits and the notes that matter.",
    description:
      "The same notebook we hand out at our workshops. Hardbound, lay-flat binding and a dotted-grid format that suits claim logs and handover notes. Branded with the institute mark.",
    img: IMG.apparel,
    stock: 200,
    highlights: [
      "A5 hardbound, lay-flat",
      "Dotted grid pages",
      "Institute branded",
      "Bulk discounts available",
    ],
  },
];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Books",
  "Templates",
  "Kits",
  "Apparel",
];

export const getProduct = (slug: string) =>
  PRODUCTS.find((p) => p.slug === slug);
