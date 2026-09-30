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
  whatsapp: "",
  googleMaps: ""
};


// قراءة ID الزبون من الرابط
const params = new URLSearchParams(window.location.search);

const profileId = params.get("id") || "syly";


// تحميل بيانات الزبون
async function loadProfile() {

  try {

    const response = await fetch(
      `Profiles/${profileId}.json`
    );

    if (!response.ok) {
      throw new Error("Profile not found");
    }

    const profile = await response.json();

    displayProfile(profile);

  } catch (error) {

    console.log(error);

    displayProfile(defaultProfile);

  }

}


// عرض بيانات الزبون
function displayProfile(profile) {

  document.getElementById("name").textContent =
    profile.name || defaultProfile.name;


  document.getElementById("description").textContent =
    profile.description || "";


  const profileImage =
    document.getElementById("profileImage");

  const coverImage =
    document.getElementById("coverImage");


  // صورة البروفايل
  if (profile.profileImage) {

    profileImage.src = new URL(
      profile.profileImage,
      document.baseURI
    ).href;

  } else {

    profileImage.removeAttribute("src");

  }


  // صورة الغلاف
  if (profile.coverImage) {

    coverImage.src = new URL(
      profile.coverImage,
      document.baseURI
    ).href;

  } else {

    coverImage.removeAttribute("src");

  }


  // عنوان الصفحة
  document.title =
    profile.name || "TapTapCard";


  createSocialLinks(profile);

  createContactButtons(profile);

}


// إنشاء روابط السوشيال
function createSocialLinks(profile) {

  const container =
    document.getElementById("socialLinks");

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

    if (!network.url) {
      return;
    }


    const link =
      document.createElement("a");

    link.className = "social-link";

    link.href = network.url;

    link.target = "_blank";

    link.rel = "noopener noreferrer";


    // إذا كان عندنا صورة أيقونة
    // أو إذا كانت Website نستعمل 🌐
    const iconHTML = network.imageIcon
      ? `
        <img
          src="${network.imageIcon}"
          alt="${network.name}"
        >
      `
      : `
        <span class="website-icon">
          ${network.icon}
        </span>
      `;


    link.innerHTML = `

      <span class="social-icon">

        ${iconHTML}

      </span>

      <span class="social-name">
        ${network.name}
      </span>

      <span class="social-arrow">
        ›
      </span>

    `;


    container.appendChild(link);

  });

}


// إنشاء أزرار الهاتف والواتساب وGoogle Maps
function createContactButtons(profile) {

  const phoneButton =
    document.getElementById("phoneButton");

  const whatsappButton =
    document.getElementById("whatsappButton");

  const mapsButton =
    document.getElementById("mapsButton");


  // الهاتف
  if (profile.phone) {

    phoneButton.href =
      `tel:${profile.phone}`;

  } else {

    phoneButton.style.display =
      "none";

  }


  // WhatsApp
  if (profile.whatsapp) {

    const number =
      profile.whatsapp.replace(/\D/g, "");

    whatsappButton.href =
      `https://wa.me/${number}`;

  } else {

    whatsappButton.style.display =
      "none";

  }


  // Google Maps
  if (profile.googleMaps) {

    mapsButton.href =
      profile.googleMaps;

  } else {

    mapsButton.style.display =
      "none";

  }

}


// تشغيل الموقع
loadProfile();
