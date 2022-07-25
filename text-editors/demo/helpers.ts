import type { Color, PossibleTurn } from "./game";

export const playerConstants: Record<
  Color,
  { iframeId: string; editorId: string }
> = {
  RED: { iframeId: "red-iframe", editorId: "red-editor" },
  GREEN: { iframeId: "green-iframe", editorId: "green-editor" },
  YELLOW: { iframeId: "yellow-iframe", editorId: "yellow-editor" },
  BLUE: { iframeId: "blue-iframe", editorId: "blue-editor" },
};

export function loadPlayerCode(player: Color, code: string) {
  const doc = document.getElementById(playerConstants[player].iframeId);
  if (doc instanceof HTMLIFrameElement) {
    const iframe = doc.contentDocument;
    if (iframe) {
      iframe.open();
      iframe.write(`<script>${code}</script>`);
      iframe.close();
    }
  } else {
    throw new Error(`No iframe found for ${player}`);
  }
}

export function requestTurn(player: Color, turn: PossibleTurn) {
  const doc = document.getElementById(playerConstants[player].iframeId);
  if (doc instanceof HTMLIFrameElement) {
    //console.log(JSON.stringify(turn));
    doc.contentWindow?.postMessage(JSON.stringify(turn), "*");
  } else {
    console.log("no iframe");
    throw new Error(`No iframe found for ${player}`);
  }
}
