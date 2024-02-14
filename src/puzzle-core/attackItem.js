import { configStore } from "@/puzzle-core";
import { getPuzzlePositionByIndex } from "@/puzzle-core/utils";
import { getTeam } from "@/socket-utils/storage";

import firePath from "@/assets/effects/fire.gif";
import rocketPath from "@/assets/effects/rocket.gif";
import explosionPath from "@/assets/effects/explosion.gif";
import tornadoPath from "@/assets/effects/tornado.gif";

const { getConfig, usingItemFire, usingItemRocket, usingItemEarthquake } = configStore;

// 불 지르기 맞는 or 보내는 효과 + usingItemFire 함수 호출
export const attackFire = (
  targets,
  targetList,
  deleted,
  bundles,
  setSnackMessage,
  setSnackOpen,
) => {
  const fireImg = document.createElement("img");
  const canvasContainer = document.getElementById("canvasContainer");
  fireImg.src = firePath;

  fireImg.style.zIndex = 100;
  fireImg.style.position = "absolute";
  fireImg.style.width = "100px";
  fireImg.style.height = "150px";
  fireImg.style.transform = "translate(-50%, -90%)";

  // fire 당하는 팀의 효과
  if (targets === getTeam().toUpperCase()) {
    if (targetList === null || targetList.length === 0) {
      // 해당되는 target이 없을 경우 알림 해야함
      setSnackMessage("불 지르기가 왔는데 운 좋게도(?)... 불 지르기 당할 맞춰진 피스가 없군요.");
      setSnackOpen(true);
      return;
    }
    console.log("fire 맞을거임");

    for (let i = 0; i < targetList.length; i++) {
      const currentTargetIdx = targetList[i];
      const [x, y] = getPuzzlePositionByIndex({
        config: getConfig(),
        puzzleIndex: currentTargetIdx,
      });

      console.log("x, y", x, y);

      const fireImgCopy = fireImg.cloneNode();

      fireImgCopy.style.left = `${x}px`;
      fireImgCopy.style.top = `${y}px`;

      canvasContainer.appendChild(fireImgCopy);

      setTimeout(() => {
        if (fireImgCopy.parentNode) {
          console.log("불 효과 삭제");
          fireImgCopy.parentNode.removeChild(fireImgCopy);
        }
      }, 2000);
    }
  } else {
    // fire 발동하는 팀의 효과
    console.log("fire 보낼거임");

    fireImg.style.left = "1040px";
    fireImg.style.top = "750px";

    canvasContainer.appendChild(fireImg);

    setTimeout(() => {
      console.log("불 효과 삭제");
      if (fireImg.parentNode) {
        fireImg.parentNode.removeChild(fireImg);
      }
    }, 2000);
  }

  setTimeout(() => {
    if (targetList && targets === getTeam().toUpperCase()) {
      console.log("fire 발동 !!");
      usingItemFire(bundles, targetList);
    }
  }, 2000);
};

// 로켓 맞는 or 보내는 효과 + usingItemRocket 함수 호출
export const attackRocket = (targets, targetList, deleted, setSnackMessage, setSnackOpen) => {
  const rocketImg = document.createElement("img");
  const canvasContainer = document.getElementById("canvasContainer");
  rocketImg.src = rocketPath;

  rocketImg.style.zIndex = 100;
  rocketImg.style.position = "absolute";

  // rocket 당하는 팀의 효과
  if (targets === getTeam().toUpperCase()) {
    if (targetList === null || targetList.length === 0) {
      // 해당되는 target이 없을 경우 알림 해야함
      setSnackMessage("로켓이왔는데 운 좋게도(?)... 로켓을 맞을 맞춰진 피스가 없군요.");
      setSnackOpen(true);
      return;
    }
    console.log("rocket 맞을거임");

    const centerIdx = targetList[parseInt(targetList.length / 2) + 1];
    const [position_x, position_y] = getPuzzlePositionByIndex({
      config: getConfig(),
      puzzleIndex: centerIdx,
    });
    console.log("centerIdx는 여기야", position_x, position_y);

    rocketImg.style.left = `${position_x}px`;
    rocketImg.style.top = "200px";
    rocketImg.style.transform = "translate(-50%, -50%) rotate(180deg)";

    canvasContainer.appendChild(rocketImg);

    // 1초 뒤 폭발효과 더함
    const explosionImg = document.createElement("img");
    explosionImg.src = explosionPath;

    explosionImg.style.zIndex = 101;
    explosionImg.style.position = "absolute";
    explosionImg.style.width = "200px";
    explosionImg.style.height = "200px";

    explosionImg.style.left = `${position_x}px`;
    explosionImg.style.top = `${position_y}px`;
    explosionImg.style.transform = "translate(-50%, -50%)";

    setTimeout(() => {
      console.log("폭발 효과 추가");
      canvasContainer.appendChild(explosionImg);
    }, 1000);

    setTimeout(() => {
      console.log("로켓 효과, 폭발 효과 삭제");
      if (rocketImg.parentNode) {
        rocketImg.parentNode.removeChild(rocketImg);
      }
      if (explosionImg.parentNode) {
        explosionImg.parentNode.removeChild(explosionImg);
      }
    }, 2000);
  } else {
    // rocket 발동하는 팀의 효과
    console.log("rocket 보낼거임");

    rocketImg.style.left = "1000px";
    rocketImg.style.top = "230px";
    rocketImg.style.transform = "translate(-50%, -50%)";

    canvasContainer.appendChild(rocketImg);

    setTimeout(() => {
      console.log("로켓 효과 삭제");
      if (rocketImg.parentNode) {
        rocketImg.parentNode.removeChild(rocketImg);
      }
    }, 2000);
  }

  setTimeout(() => {
    if (targetList && targets === getTeam().toUpperCase()) {
      console.log("rocket 발동 !!");
      usingItemRocket(targetList);
    }
  }, 2000);
};

// 지진 맞는 or 보내는 효과 + usingItemEarthquake 함수 호출
export const attackEarthquake = (targets, targetList, deleted, setSnackMessage, setSnackOpen) => {
  const tornadoImg = document.createElement("img");
  const canvasContainer = document.getElementById("canvasContainer");
  tornadoImg.src = tornadoPath;

  tornadoImg.style.zIndex = 100;
  tornadoImg.style.position = "absolute";
  tornadoImg.style.width = "200px";
  tornadoImg.style.height = "225px";
  tornadoImg.style.transform = "translate(-50%, -95%)";

  // earthquake 당하는 팀의 효과
  if (targets === getTeam().toUpperCase()) {
    if (targetList === null || targetList.length === 0) {
      // 해당되는 target이 없을 경우 알림 해야함
      setSnackMessage("회오리가 왔는데 운 좋게도 흩어질 피스가 없군요!");
      setSnackOpen(true);
      return;
    }

    tornadoImg.style.left = "100px";
    tornadoImg.style.top = "100px";
    tornadoImg.style.animation = "tornado-animation 1.2s linear forwards";

    canvasContainer.appendChild(tornadoImg);

    setTimeout(() => {
      console.log("earthquake 발동 !!");
      if (tornadoImg.parentNode) {
        tornadoImg.parentNode.removeChild(tornadoImg);
      }
      usingItemEarthquake(targetList, deleted);
    }, 1200);
  } else {
    // earthquake 발동하는 팀의 효과
    tornadoImg.style.left = "1000px";
    tornadoImg.style.top = "230px";
    tornadoImg.style.animation = "tornado-send-animation 1.2s linear forwards";

    canvasContainer.appendChild(tornadoImg);

    setTimeout(() => {
      console.log("지진 효과 발동 !!");
      if (tornadoImg.parentNode) {
        tornadoImg.parentNode.removeChild(tornadoImg);
      }
    }, 1200);
  }
};
