
const defaultProfile = {
  name: "Nom du profil",
  description: "Votre présence digitale en un seul lien",
  profileImage: "",
  coverImage: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  snapchat: "",
  website: "",
  phone: "",
  phone2: "",
  whatsapp: "",
  whatsapp2: "",
  googleMaps: ""
};

// إعدادات Supabase
const SUPABASE_URL = "https://gzdaauwvteuouxuqjmbz.supabase.co";
const SUPABASE_KEY = "sb_publishable_eicaSCmYo18u524iPoChHw_1d5t9Sqy";

// قراءة معرّف الزبون من الرابط
const params = new URLSearchParams(window.location.search);
const profileId = params.get("id") || "syly";

// تجهيز رابط الصورة
function getImageUrl(value) {
  const path = String(value || "").trim();

  if (!path) return "";

  // إذا كان الرابط كاملاً
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // مسار صورة داخل Supabase: vendorId/clientId/file
  if (/^\d+\/\d+\//.test(path)) {
    const safePath = path
      .split("/")
      .map(part => encodeURIComponent(part))
      .join("/");

    return `${SUPABASE_URL}/storage/v1/object/public/client-images/${safePath}`;
  }

  // الصور القديمة الموجودة في GitHub
  return new URL(path, document.baseURI).href;
}

// تحميل الزبون من Supabase
async function loadFromSupabase() {
  const url = new URL(`${SUPABASE_URL}/rest/v1/clients`);

  url.searchParams.set("select", "*");
  url.searchParams.set("slug", `eq.${profileId}`);
  url.searchParams.set("is_public", "eq.true");
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY
    }
  });

  if (!response.ok) {
    throw new Error("Supabase request failed");
  }

  const rows = await response.json();

  if (!rows.length) return null;

  const row = rows[0];

  return {
    name: row.name,
    description: row.description,
    profileImage: getImageUrl(row.profile_image),
    coverImage: getImageUrl(row.cover_image),
    instagram: row.instagram,
    facebook: row.facebook,
    tiktok: row.tiktok,
    snapchat: row.snapchat,
    website: row.website,
    phone: row.phone,
    phone2: row.phone2,
    whatsapp: row.whatsapp,
    whatsapp2: row.whatsapp2,
    googleMaps: row.google_maps
  };
}

// تحميل JSON القديم إذا لم نجد الزبون في Supabase
async function loadFromJSON() {
  const response = await fetch(
    `Profiles/${encodeURIComponent(profileId)}.json`
  );

  if (!response.ok) {
    throw new Error("Old profile not found");
  }

  return await response.json();
}

// تحميل البيانات
async function loadProfile() {
  let profile;

  try {
    profile = await loadFromSupabase();
  } catch (error) {
    console.error("Supabase:", error);
  }

  if (profile) {
    displayProfile(profile);
    return;
  }

  try {
    profile = await loadFromJSON();
    displayProfile(profile);
  } catch (error) {
    console.error("Profile:", error);
    displayProfile(defaultProfile);
  }
}

// عرض البيانات
function displayProfile(profile) {
  document.getElementById("name").textContent =
    profile.name || defaultProfile.name;

  document.getElementById("description").textContent =
    profile.description || "";

  const profileImage = document.getElementById("profileImage");
  const coverImage = document.getElementById("coverImage");

  if (profile.profileImage) {
    profileImage.src = getImageUrl(profile.profileImage);
  } else {
    profileImage.removeAttribute("src");
  }

  if (profile.coverImage) {
    coverImage.src = getImageUrl(profile.coverImage);
  } else {
    coverImage.removeAttribute("src");
  }

  document.title = profile.name || "NAQRA";

  createSocialLinks(profile);
  createContactButtons(profile);
}

// روابط مواقع التواصل
function createSocialLinks(profile) {
  const container = document.getElementById("socialLinks");
  container.innerHTML = "";

  const socialNetworks = [
    {
      name: "Instagram",
      imageIcon: "https://cdn.simpleicons.org/instagram",
      url: profile.instagram
    },
    {
      name: "Facebook",
      imageIcon: "https://cdn.simpleicons.org/facebook/1877F2",
      url: profile.facebook
    },
    {
      name: "TikTok",
      imageIcon: "https://cdn.simpleicons.org/tiktok/000000",
      url: profile.tiktok
    },
    {
      name: "Snapchat",
      imageIcon: "https://cdn.simpleicons.org/snapchat",
      url: profile.snapchat
    },
    {
      name: "Website",
      icon: "🌐",
      url: profile.website
    }
  ];

  socialNetworks.forEach(network => {
    if (!network.url) return;

    const link = document.createElement("a");
    link.className = "social-link";
    link.href = network.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const iconHTML = network.imageIcon
      ? `<img src="${network.imageIcon}" alt="${network.name}">`
      : `<span class="website-icon">${network.icon}</span>`;

    link.innerHTML = `
      <span class="social-icon">${iconHTML}</span>
      <span class="social-name">${network.name}</span>
      <span class="social-arrow">›</span>
    `;

    container.appendChild(link);
  });
}

// إعداد أزرار الهاتف وواتساب
function setupContactButton(buttonId, value, type) {
  const button = document.getElementById(buttonId);
  if (!button) return;

  const number = String(value || "").trim();

  if (!number) {
    button.style.display = "none";
    button.removeAttribute("href");
    return;
  }

  if (type === "whatsapp" && !number.replace(/\D/g, "")) {
    button.style.display = "none";
    button.removeAttribute("href");
    return;
  }

  button.style.display = "";

  if (type === "phone") {
    button.href = `tel:${number}`;
  }

  if (type === "whatsapp") {
    button.href = `https://wa.me/${number.replace(/\D/g, "")}`;
  }
}

// أزرار الاتصال والخرائط
function createContactButtons(profile) {
  setupContactButton("phoneButton", profile.phone, "phone");
  setupContactButton("phoneButton2", profile.phone2, "phone");

  setupContactButton("whatsappButton", profile.whatsapp, "whatsapp");
  setupContactButton("whatsappButton2", profile.whatsapp2, "whatsapp");

  const mapsButton = document.getElementById("mapsButton");

  if (!mapsButton) return;

  if (profile.googleMaps) {
    mapsButton.href = profile.googleMaps;
    mapsButton.style.display = "";
    mapsButton.target = "_blank";
    mapsButton.rel = "noopener noreferrer";
  } else {
    mapsButton.style.display = "none";
    mapsButton.removeAttribute("href");
  }
}

// تشغيل الصفحة
loadProfile();
