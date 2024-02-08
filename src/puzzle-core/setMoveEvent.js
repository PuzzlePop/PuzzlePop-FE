import { Point } from "paper/dist/paper-core";
import { debounce } from "lodash";
import { socket } from "../socket-utils/socket";
import { getRoomId, getSender } from "../socket-utils/storage";
import { getPuzzleGroup } from "./getPuzzleGroup";
import { findNearTileGroup } from "./findNearTileGroup";

const { send } = socket;

export const setMoveEvent = ({ config }) => {
  moveTile({ config });
  findNearTileGroup({ config });
  return { ...config };
};

let lastExecutionTime = 0;
const interval = 30; // 실행 간격 (40ms)

const moveTile = ({ config }) => {
  config.groupTiles.forEach((gtile, index) => {
    if (gtile[1] === null) {
      gtile[1] = undefined;
    }
  });

  // 모든 타일을 돌면서 마우스 이벤트 등록
  config.groupTiles.forEach((gtile, gtileIdx) => {
    gtile[0].onMouseDown = (event) => {
      const group = gtile[1];
      if (group !== undefined) {
        // 그룹이면 해당 그룹의 타일들 모두 앞으로 이동
        config.groupTiles.forEach((tile) => {
          if (tile[1] === group) {
            tile[0].bringToFront();
          }
        });
      } else {
        // 그룹이 아닐땐 클릭된 타일만 앞으로 이동
        event.target.bringToFront();
      }

      const puzzleGroup = getPuzzleGroup({ config, paperEvent: event });
      // socket 전송
      send(
        "/app/game/message",
        {},
        JSON.stringify({
          type: "GAME",
          roomId: getRoomId(),
          sender: getSender(),
          message: "MOUSE_DOWN",
          targets: JSON.stringify(puzzleGroup),
          position_x: gtile[0].position.x,
          position_y: gtile[0].position.y,
        }),
      );
    };

    gtile[0].onMouseDrag = (event) => {
      // 캔버스 사이즈를 벗어나지 않는 범위내로 이동
      const newPosition = {
        x: Math.min(
          Math.max(gtile[0].position._x + event.delta.x, Math.floor(config.tileWidth / 2)),
          config.project.view._viewSize._width - Math.floor(config.tileWidth / 2),
        ),
        y: Math.min(
          Math.max(gtile[0].position._y + event.delta.y, Math.floor(config.tileWidth / 2)),
          config.project.view._viewSize._height - Math.floor(config.tileWidth / 2),
        ),
      };

      const originalPosition = {
        x: gtile[0].position._x,
        y: gtile[0].position._y,
      };

      if (gtile[1] === undefined) {
        gtile[0].position = new Point(newPosition.x, newPosition.y);
      } else {
        config.groupTiles.forEach((gtile_now) => {
          if (gtile[1] === gtile_now[1]) {
            gtile_now[0].position = new Point(
              gtile_now[0].position._x + newPosition.x - originalPosition.x,
              gtile_now[0].position._y + newPosition.y - originalPosition.y,
            );
          }
        });
      }

      const puzzleGroup = getPuzzleGroup({ config, paperEvent: event });

      const currentTime = Date.now();
      if (currentTime - lastExecutionTime >= interval) {
        // 지정된 간격(interval)으로 함수 실행

        // socket 전송
        send(
          "/app/game/message",
          {},
          JSON.stringify({
            type: "GAME",
            roomId: getRoomId(),
            sender: getSender(),
            message: "MOUSE_DRAG",
            targets: JSON.stringify(puzzleGroup),
            position_x: gtile[0].position.x,
            position_y: gtile[0].position.y,
          }),
        );

        lastExecutionTime = currentTime;
      }
    };

    gtile[0].onMouseEnter = (event) => {
      //console.log("Enter", event);
    };

    gtile[0].onMouseLeave = (event) => {
      //console.log("Leave");
    };
  });
};
