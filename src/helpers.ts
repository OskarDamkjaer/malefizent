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
      iframe.write(
        `<script>${code}</script` + ">" /*svelte compiler workaround*/
      );
      iframe.close();
    }
  } else {
    throw new Error(`No iframe found for ${player}`);
  }
}

export function requestTurn(player: Color, turn: PossibleTurn) {
  const doc = document.getElementById(playerConstants[player].iframeId);
  if (doc instanceof HTMLIFrameElement) {
    doc.contentWindow.postMessage(JSON.stringify(turn));
  } else {
    throw new Error(`No iframe found for ${player}`);
  }
}

/*
export function getPlayerCode(player: Color): string {
  return playerConstants[player].editorId.g editor?.state.doc.toString() ?? "";
}
*/
