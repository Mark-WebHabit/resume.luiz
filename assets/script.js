const parenttrail = document.querySelectorAll(".trail");
const educationNodes = document.querySelectorAll("#education > ul > li");
const carouselContainer = document.querySelector(".carousel");
const scrollRight = document.getElementById("scroll-right");
const scrollLeft = document.getElementById("scroll-left");

let achievements = [];
let projects = [];

window.addEventListener("DOMContentLoaded", loadAllDatasAndAssets);
window.addEventListener("resize", generatetrailMarker);

scrollRight.addEventListener("click", () => scrollCarousel("right"));
scrollLeft.addEventListener("click", () => scrollCarousel("left"));

// functions
async function loadAllDatasAndAssets() {
  achievements = await fetchAchievements();
  projects = await fetchProjects();

  if (achievements?.length) {
    achievements.forEach((achv) => {
      // achv.trailBracnh referes to the index of the nodes
      generateAchievmentNode(
        educationNodes[achv.trailBranch - 1],
        achv.achievements
      );
    });
  }

  // apply marker to all node that uses trail component
  parenttrail.forEach((trail) => {
    const trailLineGuide = trail.querySelector(".trail-line");
    const trailBranch = trail.querySelectorAll(".trail > li");

    generatetrailMarker(trailLineGuide, trailBranch);
  });

  projects.forEach((prj) => {
    const project = document.createElement("div");
    project.classList.add("project");

    project.innerHTML = `
            <div> 
              <h3>${prj.title}</h3>
              <br/>
              <p>
              ${prj.desc}
              </p>
            </div>

            <a href="${prj.link}" target="_blank">View Repo</a>
          `;
    carouselContainer.appendChild(project);
  });
}

function generatetrailMarker(parent, branches) {
  parent.innerHTML = "";

  const numberOfDotsToGenerate = branches.length;

  let offsetTotal = 0;
  for (let i = 0; i < numberOfDotsToGenerate; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");

    if (i === 0) {
      dot.style.top = `${0}px`;
    } else {
      dot.style.top = `${offsetTotal}px`;
    }

    parent.appendChild(dot);
    offsetTotal += branches[i].offsetHeight;
  }
}

async function fetchAchievements() {
  try {
    const response = await fetch("./assets/data/achievements.json");

    if (!response.ok) {
      throw new Error(`Error fetching achievment file: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch achievements:", error);
    return [];
  }
}

function generateAchievmentNode(parent, achievements) {
  if (!parent || !achievements || !achievements?.length) {
    return;
  }

  const ul = document.createElement("ul");
  ul.classList.add("achievement");

  achievements.forEach((achv) => {
    const li = document.createElement("li");

    li.textContent = achv;

    ul.appendChild(li);
  });

  parent.appendChild(ul);
}

async function fetchProjects() {
  try {
    const response = await fetch("./assets/data/projects.json");

    if (!response.ok) {
      throw new Error(`Error fetching projects file: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

function scrollCarousel(direction) {
  carouselContainer.scrollTo({
    left: carouselContainer.scrollLeft + (direction === "left" ? -500 : 500),
    behavior: "smooth",
  });
}
