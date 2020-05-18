import { EVENT_TYPE } from "../../utils/constants.js";
import { colorSelectOptionTemplate, subwayLinesTemplate } from "../../utils/templates.js";
import { subwayLineColorOptions } from "../../utils/defaultSubwayData.js";
import api from "../../api/index.js";
import Modal from "../../ui/Modal.js";

function AdminLine() {
  const $subwayLineList = document.querySelector("#subway-line-list");
  const $subwayLineNameInput = document.querySelector("#subway-line-name");
  const $subwayLineColorInput = document.querySelector("#subway-line-color");
  const $subwayLineStartTimeInput = document.querySelector("#first-time");
  const $subwayLineEndTimeInput = document.querySelector("#last-time");
  const $subwayLineIntervalTimeInput = document.querySelector("#interval-time");
  const $modalUpdateConditionInput = document.querySelector("#modal-update-condition");

  const $createSubwayLineButton = document.querySelector(
    "#subway-line-create-form #submit-button"
  );
  const subwayLineModal = new Modal();

  const onCreateSubwayLine = event => {
    event.preventDefault();
    const data = {
      name: $subwayLineNameInput.value,
      backgroundColor: $subwayLineColorInput.value,
      startTime: $subwayLineStartTimeInput.value + ":00",
      endTime: $subwayLineEndTimeInput.value + ":00",
      intervalTime: $subwayLineIntervalTimeInput.value
    };
    let $id = $modalUpdateConditionInput.getAttribute("value");
    if ($id !== "") {
      fetch(`/api/lines/${$id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: $subwayLineNameInput.value,
          backgroundColor: $subwayLineColorInput.value,
          startTime: $subwayLineStartTimeInput.value + ":00",
          endTime: $subwayLineEndTimeInput.value + ":00",
          intervalTime: $subwayLineIntervalTimeInput.value
        }),
        headers: { "Content-Type": "application/json" }
      })
      .then(data => {
        toggleAndInitializeInputs();
        $modalUpdateConditionInput.value = "";
      })

    } else {
      api.line.create(data).then(data => {
        $subwayLineList.insertAdjacentHTML(
          "beforeend",
          subwayLinesTemplate(data)
        );
        toggleAndInitializeInputs();
      });
    }
  };

  const onDeleteSubwayLine = event => {
    event.stopPropagation();
    event.preventDefault();
    const $target = event.target;
    const isDeleteButton = $target.classList.contains("mdi-delete");
    if (isDeleteButton) {
      api.line.delete($target.closest(".subway-line-item").getAttribute("value")).then(() => {
        $target.closest(".subway-line-item").remove();
      })
    }
  };

  const onUpdateSubwayLine = event => {
    event.stopPropagation();
    const $target = event.target;
    const $id = $target.closest('.subway-line-item').getAttribute("value");

    const isUpdateButton = $target.classList.contains("mdi-pencil");
    if (isUpdateButton) {
      event.stopPropagation();
      event.preventDefault();
      $modalUpdateConditionInput.value = $id;
      api.line.getOneLine($id).then(data => {
        $subwayLineNameInput.value = data.name;
        $subwayLineStartTimeInput.value = data.startTime.substring(0, 5);
        $subwayLineEndTimeInput.value = data.endTime.substring(0, 5);
        $subwayLineIntervalTimeInput.value = data.intervalTime;
        $subwayLineColorInput.value = data.backgroundColor;
      });
      toggleAndInitializeInputs();
    }
  };

  const toggleAndInitializeInputs = () => {
    subwayLineModal.toggle();
    $subwayLineNameInput.value = "";
    $subwayLineStartTimeInput.value = "";
    $subwayLineEndTimeInput.value = "";
    $subwayLineIntervalTimeInput.value = "";
    $subwayLineColorInput.value = "";
  }

  /* 처음 지하철 정보들 뿌려주는 */
  const initDefaultSubwayLines = () => {
    api.line.get().then(data => data.map(line => {
        $subwayLineList.insertAdjacentHTML(
          "beforeend",
          subwayLinesTemplate(line)
        );
      })
    )
  };

  const onReadDetailedInfo = event => {
    event.stopPropagation();
    event.preventDefault();
    const $id = event.target.getAttribute("value");
    if ($id === null) {
      return;
    }
    api.line.getOneLine($id).then(data => {
      document.querySelector('#start-time').textContent = data.startTime.substring(0, 5);
      document.querySelector('#end-time').textContent = data.endTime.substring(0, 5);
      document.querySelector('#interval').textContent = data.intervalTime;
    });
  };

  const initEventListeners = () => {
    $subwayLineList.addEventListener(EVENT_TYPE.CLICK, onDeleteSubwayLine);
    $subwayLineList.addEventListener(EVENT_TYPE.CLICK, onUpdateSubwayLine);
    $subwayLineList.addEventListener(EVENT_TYPE.CLICK, onReadDetailedInfo);
    $createSubwayLineButton.addEventListener(
      EVENT_TYPE.CLICK,
      onCreateSubwayLine
    );
  };

  const onSelectColorHandler = event => {
    event.preventDefault();
    const $target = event.target;
    if ($target.classList.contains("color-select-option")) {
      $subwayLineColorInput.value =
        $target.dataset.color;
    }
  };

  const initCreateSubwayLineForm = () => {
    const $colorSelectContainer = document.querySelector(
      "#subway-line-color-select-container"
    );
    const colorSelectTemplate = subwayLineColorOptions
    .map((option, index) => colorSelectOptionTemplate(option, index))
    .join("");
    $colorSelectContainer.insertAdjacentHTML("beforeend", colorSelectTemplate);
    $colorSelectContainer.addEventListener(
      EVENT_TYPE.CLICK,
      onSelectColorHandler
    );
  };

  this.init = () => {
    initDefaultSubwayLines();
    initEventListeners();
    initCreateSubwayLineForm();
  };
}

const adminLine = new AdminLine();
adminLine.init();
