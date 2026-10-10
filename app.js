
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
  document.title = profile.name || "NAQRA";

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
    if (!network.url) return;

    const link = document.createElement("a");

    link.className = "social-link";
    link.href = network.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

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

      <span class="social-arrow">›</span>
    `;

    container.appendChild(link);
  });
}


// إنشاء أزرار الاتصال
function createContactButtons(profile) {
  const contactContainer =
    document.getElementById("contactButtons");

  // إذا كان عندك contactButtons في HTML
  // ننشئو الأزرار الأربعة داخله تلقائيًا.
  if (contactContainer) {
    contactContainer.innerHTML = "";

    const contacts = [
      {
        label: "Téléphone 1",
        value: profile.phone,
        type: "phone"
      },
      {
        label: "Téléphone 2",
        value: profile.phone2,
        type: "phone"
      },
      {
        label: "WhatsApp 1",
        value: profile.whatsapp,
        type: "whatsapp"
      },
      {
        label: "WhatsApp 2",
        value: profile.whatsapp2,
        type: "whatsapp"
      }
    ];

    contacts.forEach(contact => {
      if (!contact.value) return;

      const button = document.createElement("a");

      button.className = "contact-button";
      button.textContent = contact.label;

      if (contact.type === "phone") {
        button.href = `tel:${contact.value}`;
      } else {
        const number = contact.value.replace(/\D/g, "");
        button.href = `https://wa.me/${number}`;
        button.target = "_blank";
        button.rel = "noopener noreferrer";
      }

      contactContainer.appendChild(button);
    });
  }

  // دعم الأزرار القديمة الموجودة في HTML
  const phoneButton =
    document.getElementById("phoneButton");

  const whatsappButton =
    document.getElementById("whatsappButton");

  const mapsButton =
    document.getElementById("mapsButton");

  if (phoneButton) {
    if (profile.phone) {
      phoneButton.href = `tel:${profile.phone}`;
      phoneButton.style.display = "";
    } else {
      phoneButton.style.display = "none";
    }
  }

  if (whatsappButton) {
    if (profile.whatsapp) {
      const number = profile.whatsapp.replace(/\D/g, "");
      whatsappButton.href = `https://wa.me/${number}`;
      whatsappButton.style.display = "";
    } else {
      whatsappButton.style.display = "none";
    }
  }

  if (mapsButton) {
    if (profile.googleMaps) {
      mapsButton.href = profile.googleMaps;
      mapsButton.style.display = "";
      mapsButton.target = "_blank";
      mapsButton.rel = "noopener noreferrer";
    } else {
      mapsButton.style.display = "none";
    }
  }
}


// تشغيل الموقع
loadProfile();
