/*
  REVIEW BACKEND SETUP (Supabase)
  --------------------------------
  This site can stay on GitHub Pages. Supabase only stores review submissions.
  1. Create a free Supabase project.
  2. Run the SQL in README.md.
  3. Paste the Project URL and anon/public key below.
  4. Approve a review by setting approved=true in the Supabase Table Editor.
*/
const SUPABASE_URL = "";
const SUPABASE_ANON_KEY = "";

const reviewWall = document.getElementById("reviewWall");
const reviewForm = document.getElementById("reviewForm");
const reviewFormStatus = document.getElementById("reviewFormStatus");
const reviewAverage = document.getElementById("reviewAverage");
const reviewCount = document.getElementById("reviewCount");
const reviewStars = document.getElementById("reviewStars");

const reviewsConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[char]);
}

function renderStars(rating) {
  const rounded = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

function renderReviews(reviews) {
  if (!reviewWall) return;

  if (!reviews.length) {
    reviewWall.innerHTML = `
      <div class="review-empty">
        <span class="review-empty-icon">✦</span>
        <h3>Be one of the first to share your experience.</h3>
        <p>Once approved, client reviews will appear here with the rating, goal and feedback they chose to share.</p>
      </div>`;
    if (reviewAverage) reviewAverage.textContent = "—";
    if (reviewStars) reviewStars.textContent = "☆☆☆☆☆";
    if (reviewCount) reviewCount.textContent = "No published reviews yet";
    return;
  }

  const average = reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length;
  if (reviewAverage) reviewAverage.textContent = average.toFixed(1);
  if (reviewStars) reviewStars.textContent = renderStars(average);
  if (reviewCount) reviewCount.textContent = `${reviews.length} published review${reviews.length === 1 ? "" : "s"}`;

  reviewWall.innerHTML = reviews.map((item) => {
    const initial = escapeHtml((item.name || "C").trim().charAt(0).toUpperCase());
    return `
      <article class="review-card">
        <div class="review-card-head">
          <div class="review-avatar" aria-hidden="true">${initial}</div>
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <span>${escapeHtml(item.goal || "Personal training")}</span>
          </div>
          <div class="review-card-stars" aria-label="${Number(item.rating)} out of 5 stars">${renderStars(item.rating)}</div>
        </div>
        <blockquote>“${escapeHtml(item.review)}”</blockquote>
      </article>`;
  }).join("");
}

async function loadApprovedReviews() {
  if (!reviewsConfigured || !reviewWall) return;

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/reviews?approved=eq.true&select=id,name,rating,goal,review,created_at&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    if (!response.ok) throw new Error("Unable to load reviews");
    renderReviews(await response.json());
  } catch (error) {
    if (reviewCount) reviewCount.textContent = "Reviews temporarily unavailable";
  }
}

if (reviewForm) {
  reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!reviewsConfigured) {
      if (reviewFormStatus) {
        reviewFormStatus.textContent = "Review submissions are designed and ready. Connect the Supabase details in reviews.js to make them live on GitHub Pages.";
        reviewFormStatus.classList.add("is-warning");
      }
      return;
    }

    const formData = new FormData(reviewForm);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      rating: Number(formData.get("rating")),
      goal: String(formData.get("goal") || "").trim(),
      review: String(formData.get("review") || "").trim(),
      approved: false
    };

    if (reviewFormStatus) {
      reviewFormStatus.textContent = "Submitting your review…";
      reviewFormStatus.classList.remove("is-warning", "is-success");
    }

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Submission failed");

      reviewForm.reset();
      if (reviewFormStatus) {
        reviewFormStatus.textContent = "Thank you — your review was submitted and will appear after approval.";
        reviewFormStatus.classList.add("is-success");
      }
    } catch (error) {
      if (reviewFormStatus) {
        reviewFormStatus.textContent = "I couldn't submit that review right now. Please try again in a moment.";
        reviewFormStatus.classList.add("is-warning");
      }
    }
  });
}

loadApprovedReviews();
