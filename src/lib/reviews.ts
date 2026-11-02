type ReviewRecord = {
  id: string;
  name: string;
  rating: number;
  text: string;
  images?: string[];
  created_at: number;
};

const STORAGE_PREFIX = "alfado-mart-reviews";

function daysAgo(days: number) {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

const seededReviews: Record<string, ReviewRecord[]> = {
  "bare-anatomy-rosemary-spray": [
    {
      id: "seed-bare-anatomy-1",
      name: "Ayesha Khan",
      rating: 5,
      text: "Mere baal kaafi smooth lag rahe hain aur spray bohat light hai. Roz subah use karne se scalp fresh feel karta hai.",
      created_at: daysAgo(2),
    },
    {
      id: "seed-bare-anatomy-2",
      name: "Hassan Raza",
      rating: 5,
      text: "Rosemary scent achi hai aur chipchipahat bilkul nahi. Hair wash ke darmiyan bhi easy refresh mil jata hai.",
      created_at: daysAgo(4),
    },
    {
      id: "seed-bare-anatomy-3",
      name: "Mehwish Ahmed",
      rating: 4,
      text: "Rice water wali feel pasand aayi, kyun ke product halka hai aur daily routine mein asaani se fit ho jata hai.",
      created_at: daysAgo(6),
    },
    {
      id: "seed-bare-anatomy-4",
      name: "Bilal Shah",
      rating: 5,
      text: "I used it for two weeks and my scalp feels cleaner. The spray bottle is very convenient.",
      created_at: daysAgo(9),
    },
    {
      id: "seed-bare-anatomy-5",
      name: "Sana Iqbal",
      rating: 5,
      text: "Mujhe sab se zyada yeh pasand aaya ke baal heavy nahi hote. Daily use ke liye bohat acha option hai.",
      created_at: daysAgo(13),
    },
    {
      id: "seed-bare-anatomy-6",
      name: "Faraz Malik",
      rating: 4,
      text: "Baal jhadne mein thori behtari mehsoos hui hai aur smell bhi mild hai. Value for money hai.",
      created_at: daysAgo(18),
    },
  ],
  ear: [
    {
      id: "seed-ear-1",
      name: "Nimra Javed",
      rating: 5,
      text: "product is good specially for ear cleaning rating 10 by 10.",
      created_at: daysAgo(1),
    },
    {
      id: "seed-ear-2",
      name: "Usman Ali",
      rating: 5,
      text: "Tip soft hai aur control achi milti hai. Simple aur useful product hai for regular cleaning.",
      created_at: daysAgo(3),
    },
    {
      id: "seed-ear-3",
      name: "Kiran Fatima",
      rating: 4,
      text: "Mujhe iska lightweight design pasand aaya.  isme almost ear cleaning har tool he nice yar.",
      created_at: daysAgo(5),
    },
    {
      id: "seed-ear-4",
      name: "Danish Qureshi",
      rating: 5,
      text: "The grip is good and the cleaning process feels very controlled. use ke liye kaafi practical hai.",
      created_at: daysAgo(8),
    },
    {
      id: "seed-ear-5",
      name: "Areeba Shah",
      rating: 5,
      text: "Mere liye sab se acha point yeh tha ke isay clean karna bhi easy hai. Daily routine mein kaam aa gaya.",
      created_at: daysAgo(12),
    },
    {
      id: "seed-ear-6",
      name: "Talha Rehman",
      rating: 4,
      text: "Safe feel hota hai aur unnecessary deep cleaning ki zarurat nahi padti. Overall achi purchase rahi.",
      created_at: daysAgo(17),
    },
  ],
  kit: [
    {
      id: "seed-kit-1",
      name: "Zainab Noor",
      rating: 5,
      text: "Ye screen magnifier movie dekhne ke liye bohat acha laga. Mobile ka display bara aur clear nazar aata hai.",
      created_at: daysAgo(1),
    },
    {
      id: "seed-kit-2",
      name: "Imran Bashir",
      rating: 5,
      text: "Foldable design bohat convenient hai aur screen ko comfortably enlarge karta hai. Ghar ke liye useful product hai.",
      created_at: daysAgo(4),
    },
    {
      id: "seed-kit-3",
      name: "Hina Tariq",
      rating: 4,
      text: "Mujhe iski viewing angle pasand aayi. Reels aur drama clips dekhne mein kaafi asaani ho gayi.",
      created_at: daysAgo(6),
    },
    {
      id: "seed-kit-4",
      name: "Saad Ahmed",
      rating: 5,
      text: "This magnifier makes my phone screen much bigger and easier to watch. Simple but very handy.",
      created_at: daysAgo(9),
    },
    {
      id: "seed-kit-5",
      name: "Maria Sohail",
      rating: 5,
      text: "Bachon ko cartoons dikhane ke liye bhi acha hai aur eye strain bhi kam feel hoti hai. Value for money hai.",
      created_at: daysAgo(13),
    },
    {
      id: "seed-kit-6",
      name: "Arsalan Junaid",
      rating: 4,
      text: "Screen clear rehti hai aur setup bhi easy hai. Travel ke waqt bhi carry karna simple lagta hai.",
      created_at: daysAgo(19),
    },
  ],
  "vegetable-cutter": [
    {
      id: "seed-vegetable-cutter-1",
      name: "Rabia Suleman",
      rating: 5,
      text: "Sabziyan slice karna ab bohat jaldi ho jata hai. Suction base strong hai aur machine stable rehti hai.",
      created_at: daysAgo(2),
    },
    {
      id: "seed-vegetable-cutter-2",
      name: "Kamran Siddiqui",
      rating: 5,
      text: "Grating aur shredding dono kaam achi tarah karta hai. Family cooking mein time save ho raha hai.",
      created_at: daysAgo(4),
    },
    {
      id: "seed-vegetable-cutter-3",
      name: "Saba Khan",
      rating: 4,
      text: "Rotating handle smooth hai aur cleaning bhi manageable hai. Salad preparation ka kaam easy lagne laga.",
      created_at: daysAgo(7),
    },
    {
      id: "seed-vegetable-cutter-4",
      name: "Nadeem Akhtar",
      rating: 5,
      text: "Very handy cutter for everyday kitchen use. Chopping speed genuinely better feel hoti hai.",
      created_at: daysAgo(10),
    },
    {
      id: "seed-vegetable-cutter-5",
      name: "Alina Riaz",
      rating: 5,
      text: "Mujhe iski build quality pasand aayi aur blades ka result bhi neat aata hai. Ghar ke liye bohat kaam ki cheez hai.",
      created_at: daysAgo(14),
    },
    {
      id: "seed-vegetable-cutter-6",
      name: "Haider Abbas",
      rating: 4,
      text: "Pehlay manual cutting mein waqt zyada lagta tha, ab kaafi fast ho gaya hai. Overall satisfied hoon.",
      created_at: daysAgo(20),
    },
  ],
  "stainless-steel-vegetable-cutter": [
    {
      id: "seed-stainless-cutter-1",
      name: "Maham Asif",
      rating: 5,
      text: "Stainless steel blades ka feel strong hai aur slicing bohat smooth hoti hai. Kitchen mein reliability achi lagi.",
      created_at: daysAgo(1),
    },
    {
      id: "seed-stainless-cutter-2",
      name: "Awais Khan",
      rating: 5,
      text: "Detachable parts ki wajah se safai asaan ho gayi. Daily cooking ke liye practical choice hai.",
      created_at: daysAgo(3),
    },
    {
      id: "seed-stainless-cutter-3",
      name: "Nadia Farooq",
      rating: 4,
      text: "Shredding aur grating dono mein consistent result milta hai. Ghar ki kitchen inventory mein acha add-on hai.",
      created_at: daysAgo(6),
    },
    {
      id: "seed-stainless-cutter-4",
      name: "Jawad Hussain",
      rating: 5,
      text: "This cutter feels sturdy and efficient. It saves time without taking much space.",
      created_at: daysAgo(9),
    },
    {
      id: "seed-stainless-cutter-5",
      name: "Hoorain Waseem",
      rating: 5,
      text: "Mujhe iska compact design bohat pasand aaya. Counter par zyada jagah bhi nahi leta.",
      created_at: daysAgo(12),
    },
    {
      id: "seed-stainless-cutter-6",
      name: "Samiullah Butt",
      rating: 4,
      text: "Roz ke kitchen kaam ke liye helpful aur durable lagta hai. Value ka hisaab theek hai.",
      created_at: daysAgo(18),
    },
  ],
  "health-healer-night-cream": [
    {
      id: "seed-night-cream-1",
      name: "Laiba Hassan",
      rating: 5,
      text: "Night cream ka texture soft hai aur subah skin hydrated feel hoti hai. Dullness mein bhi farq nazar aaya.",
      created_at: daysAgo(2),
    },
    {
      id: "seed-night-cream-2",
      name: "Faisal Mehmood",
      rating: 5,
      text: "Lightweight formula hai aur greasy bilkul nahi lagti. Raat ko lagana easy aur comfortable hai.",
      created_at: daysAgo(4),
    },
    {
      id: "seed-night-cream-3",
      name: "Sadia Raza",
      rating: 4,
      text: "Mere skin tone pe brightening effect dheere dheere mehsoos hua. Daily use mein acha result de rahi hai.",
      created_at: daysAgo(6),
    },
    {
      id: "seed-night-cream-4",
      name: "Omer Hayat",
      rating: 5,
      text: "My skin feels softer in the morning. The cream absorbs quickly and does not clog pores.",
      created_at: daysAgo(9),
    },
    {
      id: "seed-night-cream-5",
      name: "Noor Fatima",
      rating: 5,
      text: "Fine lines ke liye itna jaldi miracle nahi hota, lekin hydration bohat achi mil rahi hai. Worth trying hai.",
      created_at: daysAgo(13),
    },
    {
      id: "seed-night-cream-6",
      name: "Taimoor Sheikh",
      rating: 4,
      text: "Raat ko lagane ke baad skin smooth rehti hai aur subah fresh look aata hai. Packaging bhi neat hai.",
      created_at: daysAgo(19),
    },
  ],
};

function storageKey(productId: string) {
  return `${STORAGE_PREFIX}:${productId}`;
}

function getSeededReviews(productId: string) {
  return seededReviews[productId] ?? [];
}

// Local fallback: read reviews from localStorage, or use seeded defaults when none exist yet.
export async function fetchLocalReviews(productId: string): Promise<ReviewRecord[]> {
  try {
    const raw = window.localStorage.getItem(storageKey(productId));
    if (!raw) return getSeededReviews(productId);

    const parsed = JSON.parse(raw) as ReviewRecord[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getSeededReviews(productId);
  } catch {
    return getSeededReviews(productId);
  }
}

export async function saveLocalReviews(productId: string, reviews: ReviewRecord[]) {
  try {
    window.localStorage.setItem(storageKey(productId), JSON.stringify(reviews));
    // Broadcast to other tabs
    try {
      const bc = new BroadcastChannel("alfado-mart-reviews");
      bc.postMessage({ productId, reviews });
      bc.close();
    } catch {
      // ignore
    }
  } catch {
    // ignore
  }
}

// Optional Supabase realtime support when env vars are provided.
let supabase: any = null;
let useSupabase = false;
let createSupabaseClient: ((url: string, key: string) => any) | null = null;

async function loadSupabaseClientFactory() {
  if (createSupabaseClient !== null) {
    return createSupabaseClient;
  }

  try {
    const dynamicImport = new Function("modulePath", "return import(modulePath);") as (modulePath: string) => Promise<any>;
    const module = await dynamicImport("@supabase/supabase-js");
    createSupabaseClient = module.createClient;
  } catch {
    createSupabaseClient = null;
  }

  return createSupabaseClient;
}

export async function initReviewsClient() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (url && key) {
    try {
      const factory = await loadSupabaseClientFactory();

      if (factory) {
        supabase = factory(url, key);
        useSupabase = true;
      }
    } catch (e) {
      useSupabase = false;
    }
  }
}

export async function fetchReviews(productId: string): Promise<ReviewRecord[]> {
  if (useSupabase && supabase) {
    const { data, error } = await supabase.from("reviews").select("*").eq("product_id", productId).order("created_at", { ascending: false });
    if (!error && Array.isArray(data)) {
      return data.map((r: any) => ({ ...r, created_at: Number(r.created_at) }));
    }
  }

  return fetchLocalReviews(productId);
}

export async function addReview(productId: string, payload: Omit<ReviewRecord, "id" | "created_at">) {
  const record: ReviewRecord = { id: `r-${Date.now()}`, created_at: Date.now(), ...payload } as ReviewRecord;

  if (useSupabase && supabase) {
    try {
      await supabase.from("reviews").insert([{ ...record, product_id: productId }]);
      return record;
    } catch (e) {
      // fallback to local
    }
  }

  // local fallback: prepend to stored reviews
  const existing = await fetchLocalReviews(productId);
  const updated = [record, ...existing];
  await saveLocalReviews(productId, updated);
  return record;
}

export function subscribeToLocalReviews(productId: string, cb: (reviews: ReviewRecord[]) => void) {
  // BroadcastChannel for cross-tab live updates
  try {
    const bc = new BroadcastChannel("alfado-mart-reviews");
    const handler = (ev: MessageEvent) => {
      const payload = ev.data;
      if (!payload || payload.productId !== productId) return;
      cb(payload.reviews);
    };

    bc.addEventListener("message", handler);

    return () => {
      bc.removeEventListener("message", handler);
      bc.close();
    };
  } catch {
    return () => {};
  }
}

export function subscribeToSupabase(productId: string, cb: (reviews: ReviewRecord[]) => void) {
  if (!useSupabase || !supabase) return () => {};

  const channel = supabase
    .channel(`public:reviews:product=${productId}`)
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "reviews", filter: `product_id=eq.${productId}` }, (payload: any) => {
      (async () => {
        const list = await fetchReviews(productId);
        cb(list);
      })();
    })
    .subscribe();

  return () => {
    try {
      supabase.removeChannel(channel);
    } catch {}
  };
}
