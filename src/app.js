function selectElements(selector, parentEl = document) {
  return Array.from(parentEl.querySelectorAll(selector));
}
function elementSelectedClass(element) {
  const lastSelected = selectElements(".selected", element.parentElement);
  lastSelected.forEach(el => el.classList.remove("selected"));
  element.classList.add("selected");
}

const girlSvg = document.getElementById("ac-girl-base");
const boySvg = document.getElementById("ac-boy-base");
const girlEyeOptions = document.querySelector(
  "#ac-tab-content-2 .ac-girl-options"
);
const boyEyeOptions = document.querySelector(
  "#ac-tab-content-2 .ac-boy-options"
);
const girlHairOptions = document.querySelector(
  "#ac-tab-content-3 .ac-girl-options"
);
const boyHairOptions = document.querySelector(
  "#ac-tab-content-3 .ac-boy-options"
);
const genderInput = document.querySelector(".ac-gender input[type=checkbox]");
genderInput.addEventListener("change", () => {
  if (genderInput.checked) {
    girlEyeOptions.style.display = "none";
    girlHairOptions.style.display = "none";
    girlSvg.style.display = "none";
    boyEyeOptions.style.display = "grid";
    boyHairOptions.style.display = "grid";
    boySvg.style.display = "block";
  } else {
    boyEyeOptions.style.display = "none";
    boyHairOptions.style.display = "none";
    boySvg.style.display = "none";
    girlEyeOptions.style.display = "grid";
    girlHairOptions.style.display = "grid";
    girlSvg.style.display = "block";
  }
});

const colorSetters = {
  skin(color) {
    selectElements(".ac-body").forEach(el => el.setAttribute("fill", color));
  },
  eyes(color) {
    selectElements(".eyes-iris").forEach(group => {
      Array.from(group.children).forEach(path => {
        path.setAttribute("fill", color);
      });
    });
  },
  hair(color) {
    selectElements(".ac-hair-color").forEach(group => {
      Array.from(group.children).forEach(path => {
        path.setAttribute("fill", color);
      });
    });
  }
};
const colorSetHandlers = Object.keys(
  colorSetters
).reduce((handlers, method) => {
  handlers[method] = ({ currentTarget }) => {
    elementSelectedClass(currentTarget);
    colorSetters[method](currentTarget.dataset.bgColor);
  };
  return handlers;
}, {});
selectElements(".ac-color").forEach(el => {
  el.addEventListener(
    "click",
    colorSetHandlers[el.parentElement.dataset.colorFor]
  );
});

function optionSelected(element) {
  elementSelectedClass(element);
  const cloneParent = element.parentElement.classList.contains(
    "ac-girl-options"
  )
    ? girlSvg
    : boySvg;
  const { optionType } = element.parentElement.dataset;
  const oldOption = cloneParent.querySelector(
    `[data-option-type=${optionType}]`
  );
  if (oldOption) {
    cloneParent.removeChild(oldOption);
  }
  const clonedNode = element.firstElementChild.firstElementChild.cloneNode(
    true
  );
  clonedNode.dataset.optionType = optionType;
  clonedNode.setAttribute("transform", element.dataset.transform || "");
  cloneParent.appendChild(clonedNode);
}
function getSiblingElement(element) {
  const elementIndex = Array.from(element.parentElement.children).indexOf(
    element
  );
  const parentSelector = element.parentElement.classList.contains(
    "ac-girl-options"
  )
    ? ".ac-boy-options"
    : ".ac-girl-options";
  return element.parentElement.parentElement.querySelector(parentSelector)
    .children[elementIndex];
}
selectElements(".ac-option").forEach(optionEl => {
  optionEl.addEventListener("click", () => {
    optionSelected(optionEl);
    optionSelected(getSiblingElement(optionEl));
  });
});

selectElements(".ac-option.selected").forEach(el => optionSelected(el));
