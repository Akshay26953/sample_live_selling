const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const heartBtn = document.getElementById("heartBtn");
const viewerCount = document.getElementById("viewerCount");
const liveVideo = document.getElementById("liveVideo");
const muteBtn = document.getElementById("muteBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const chatToggle = document.getElementById("chatToggle");
const chatSection = document.getElementById("chatSection");
const productsToggle = document.getElementById("productsToggle");
const productSection = document.getElementById("productSection");

const productModal = document.getElementById("productModal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalImage = document.getElementById("modalImage");
const modalPriceEl = document.getElementById("modalPrice");
const modalMrpEl = document.getElementById("modalMrp");
const modalDiscountEl = document.getElementById("modalDiscount");
const modalDiscountBadge = document.getElementById("modalDiscountBadge");
const modalSavingsAmount = document.getElementById("modalSavingsAmount");
const qtyText = document.getElementById("qty");

const VIDEO_FALLBACK =
  "https://cdn.coverr.co/videos/coverr-woman-streaming-online-1562251274455?download=1080p";

const followBtn = document.getElementById("followBtn");
const topShareBtn = document.getElementById("topShareBtn");

let qty = 1;
let chatVisible = true;
let productsVisible = true;
let rawViewerCount = 12366;
let followingChannel = false;

const names = [
  "Rahul",
  "Priya",
  "Aman",
  "Sneha",
  "Vikas",
  "Riya",
  "Arjun"
];

const messages = [
  "Wow amazing 🔥",
  "Price please?",
  "Need this 😍",
  "Ordered already ❤️",
  "Love this product",
  "Available in black?",
  "Super quality!"
];

function formatViewerCount(n) {
  return Math.round(n).toLocaleString("en-US");
}

function addMessage(user, text) {
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `<strong>${user}</strong> ${text}`;
  chatMessages.appendChild(div);

  if (chatMessages.children.length > 8) {
    chatMessages.removeChild(chatMessages.firstChild);
  }
}

setInterval(() => {
  const user = names[Math.floor(Math.random() * names.length)];
  const text = messages[Math.floor(Math.random() * messages.length)];
  addMessage(user, text);
}, 2000);

sendBtn.addEventListener("click", sendMessage);

chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage("You", text);
  chatInput.value = "";
}

function createHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.innerHTML = "❤️";
  heart.style.left = 60 + Math.random() * (window.innerWidth - 120) + "px";
  document.querySelector(".live-app").appendChild(heart);
  setTimeout(() => heart.remove(), 3000);
}

heartBtn.addEventListener("click", () => {
  for (let i = 0; i < 5; i++) {
    setTimeout(createHeart, i * 200);
  }
});

liveVideo.addEventListener("dblclick", createHeart);

function formatRupee(amount) {
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

function parseAmount(value) {
  const n = parseInt(String(value).replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function getProductPricing(card) {
  let mrp = parseAmount(card.dataset.mrp);
  let price = parseAmount(card.dataset.price);

  if (!mrp || !price) {
    const oldEl = card.querySelector(".old-price");
    const priceEl = card.querySelector(".price");
    mrp = parseAmount(oldEl?.textContent);
    price = parseAmount(priceEl?.textContent);
  }

  const savings = Math.max(0, mrp - price);
  const discountPct = mrp > 0 ? Math.round((savings / mrp) * 100) : 0;

  return { mrp, price, savings, discountPct };
}

function initLiveVideo() {
  if (!liveVideo) return;

  liveVideo.muted = true;
  liveVideo.setAttribute("muted", "");

  const tryPlay = () => {
    const p = liveVideo.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {});
    }
  };

  const useFallback = () => {
    if (liveVideo.dataset.fallbackUsed === "1") return;
    liveVideo.dataset.fallbackUsed = "1";
    liveVideo.src = VIDEO_FALLBACK;
    liveVideo.load();
    tryPlay();
  };

  liveVideo.addEventListener("loadeddata", tryPlay);
  liveVideo.addEventListener("canplay", tryPlay);
  liveVideo.addEventListener("error", useFallback);

  tryPlay();

  document.addEventListener(
    "click",
    () => {
      tryPlay();
    },
    { once: true }
  );
}

initLiveVideo();

setInterval(() => {
  rawViewerCount += Math.floor(Math.random() * 41) - 18;
  rawViewerCount = Math.max(9800, Math.min(rawViewerCount, 199999));
  viewerCount.textContent = formatViewerCount(rawViewerCount);
}, 3000);

muteBtn.addEventListener("click", () => {
  liveVideo.muted = !liveVideo.muted;
  muteBtn.innerHTML = liveVideo.muted
    ? `<i class="fa-solid fa-volume-xmark"></i>`
    : `<i class="fa-solid fa-volume-high"></i>`;
});

fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

function setChatVisible(visible) {
  chatVisible = visible;
  chatSection.classList.toggle("hidden", !visible);
  chatToggle.classList.toggle("active", visible);
  chatToggle.innerHTML = visible
    ? `<i class="fa-solid fa-comments"></i><span class="control-label">Chat</span>`
    : `<i class="fa-solid fa-comment-slash"></i><span class="control-label">Chat</span>`;
}

chatToggle.addEventListener("click", () => {
  setChatVisible(!chatVisible);
});

function setProductsVisible(visible) {
  productsVisible = visible;
  productSection.classList.toggle("hidden", !visible);
  productsToggle.classList.toggle("active", visible);
  productsToggle.innerHTML = visible
    ? `<i class="fa-solid fa-bag-shopping"></i><span class="control-label">Products</span>`
    : `<i class="fa-solid fa-eye-slash"></i><span class="control-label">Products</span>`;
}

productsToggle.addEventListener("click", () => {
  setProductsVisible(!productsVisible);
});

const productCards = document.querySelectorAll(".product-card");

function setActiveProduct(index) {
  productCards.forEach((card, i) => {
    card.classList.toggle("active", i === index);
  });
}

const productSwiper = new Swiper("#productSwiper", {
  slidesPerView: "auto",
  spaceBetween: 12,
  freeMode: true,
  grabCursor: true,
  on: {
    slideChange(swiper) {
      setActiveProduct(swiper.activeIndex);
    },
    touchEnd(swiper) {
      setActiveProduct(swiper.activeIndex);
    }
  }
});

setActiveProduct(0);

function openProductModal(card) {
  productModal.classList.add("is-open");
  productModal.setAttribute("aria-hidden", "false");

  modalTitle.textContent = card.querySelector("h4").textContent;
  modalImage.src = card.querySelector("img").src;
  modalImage.alt = modalTitle.textContent;

  const { mrp, price, savings, discountPct } = getProductPricing(card);
  const discountLabel = `${discountPct}% OFF`;

  if (modalMrpEl) modalMrpEl.textContent = formatRupee(mrp);
  if (modalPriceEl) modalPriceEl.textContent = formatRupee(price);
  if (modalDiscountEl) modalDiscountEl.textContent = discountLabel;
  if (modalDiscountBadge) modalDiscountBadge.textContent = discountLabel;
  if (modalSavingsAmount) modalSavingsAmount.textContent = formatRupee(savings);
}

function closeProductModal() {
  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden", "true");
}

productCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    productSwiper.slideTo(index);
    setActiveProduct(index);
    openProductModal(card);
  });

  const buyBtn = card.querySelector(".buy-btn");
  if (buyBtn) {
    buyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      productSwiper.slideTo(index);
      setActiveProduct(index);
      openProductModal(card);
    });
  }
});

closeModal.addEventListener("click", (e) => {
  e.stopPropagation();
  closeProductModal();
});

productModal.addEventListener("click", (e) => {
  if (e.target === productModal) {
    closeProductModal();
  }
});

document.getElementById("plusQty").addEventListener("click", () => {
  qty++;
  qtyText.textContent = qty;
});

document.getElementById("minusQty").addEventListener("click", () => {
  if (qty > 1) qty--;
  qtyText.textContent = qty;
});

const purchasePopup = document.getElementById("purchasePopup");

const purchaseTexts = [
  "Priya from Mumbai purchased Sneakers",
  "Rahul purchased Smart Watch",
  "Aman purchased Headphones",
  "Riya purchased Camera"
];

setInterval(() => {
  purchasePopup.textContent =
    purchaseTexts[Math.floor(Math.random() * purchaseTexts.length)];
}, 4000);

if (followBtn) {
  followBtn.addEventListener("click", () => {
    followingChannel = !followingChannel;
    followBtn.classList.toggle("following", followingChannel);
    followBtn.innerHTML = followingChannel
      ? `<i class="fa-solid fa-check" aria-hidden="true"></i> Following`
      : `<i class="fa-solid fa-user-plus" aria-hidden="true"></i> Follow`;
  });
}

if (topShareBtn) {
  topShareBtn.addEventListener("click", async () => {
    const shareData = {
      title: "Live shopping",
      text: "Join the live stream",
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      }
    } catch {
      /* user cancelled or unsupported */
    }
  });
}
