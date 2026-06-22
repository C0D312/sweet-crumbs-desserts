const filterButtons = document.querySelectorAll(".filter-button");
const menuCards = document.querySelectorAll(".menu-card");
const dessertChoices = Array.from(document.querySelectorAll("input[name='dessert']"));
const deliveryChoices = Array.from(document.querySelectorAll("input[name='delivery']"));
const orderForm = document.querySelector("#orderForm");
const summaryTitle = document.querySelector("#summaryTitle");
const summaryItems = document.querySelector("#summaryItems");
const summaryTotal = document.querySelector("#summaryTotal");
const summaryMeta = document.querySelector("#summaryMeta");
const dateInput = document.querySelector("input[name='date']");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    menuCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.group !== filter;
    });
  });
});

function selectedDesserts() {
  return dessertChoices.filter((choice) => choice.checked);
}

function selectedDelivery() {
  return deliveryChoices.find((choice) => choice.checked)?.value || "Pickup";
}

function updateSummary() {
  const selected = selectedDesserts();
  const delivery = selectedDelivery();
  const date = dateInput.value;

  summaryTitle.textContent = selected.length ? `${selected.length} sweet pick${selected.length === 1 ? "" : "s"}` : "Pick your desserts";
  summaryItems.innerHTML = "";

  if (!selected.length) {
    const item = document.createElement("li");
    item.textContent = "No desserts selected yet.";
    summaryItems.append(item);
  } else {
    selected.forEach((choice) => {
      const item = document.createElement("li");
      item.textContent = choice.dataset.label;
      summaryItems.append(item);
    });
  }

  const minimum = selected.reduce((total, choice) => total + Number(choice.dataset.price || 0), 0);
  summaryTotal.textContent = minimum ? `From $${minimum}` : "$0";
  summaryMeta.textContent = `${delivery} selected.${date ? ` Needed on ${date}.` : " Choose a date to finish your enquiry."}`;
}

dessertChoices.forEach((choice) => choice.addEventListener("change", updateSummary));
deliveryChoices.forEach((choice) => choice.addEventListener("change", updateSummary));
dateInput.addEventListener("change", updateSummary);

document.querySelectorAll(".add-item").forEach((button) => {
  button.addEventListener("click", () => {
    const choice = dessertChoices.find((item) => item.value === button.dataset.item);

    if (choice) {
      choice.checked = true;
      updateSummary();
      document.querySelector("#order").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(orderForm);
  const desserts = selectedDesserts().map((choice) => choice.dataset.label);
  const lines = [
    "Hi Sweet Crumbs,",
    "",
    "I would like to make a dessert enquiry.",
    "",
    `Name: ${formData.get("name")}`,
    `Contact: ${formData.get("contact")}`,
    `Date needed: ${formData.get("date")}`,
    `Occasion: ${formData.get("occasion")}`,
    `Pickup or delivery: ${selectedDelivery()}`,
    `Desserts: ${desserts.length ? desserts.join(", ") : "Not selected"}`,
    `Notes: ${formData.get("notes") || "None"}`,
  ];

  const subject = encodeURIComponent("Sweet Crumbs order enquiry");
  const body = encodeURIComponent(lines.join("\n"));
  window.location.href = `mailto:hello@sweetcrumbs.com.au?subject=${subject}&body=${body}`;
});

updateSummary();
