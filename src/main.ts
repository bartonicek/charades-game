import "./style.css";
import { createEffect, createSignal } from "solid-js";
import { appenNewNode } from "./funs";

const app = document.querySelector<HTMLDivElement>("#app")!;

const headingDiv = appenNewNode(app, "div");
const heading2 = appenNewNode(headingDiv, "h1", { innerText: "Let's play" });
const heading1 = appenNewNode(headingDiv, "h1", { innerText: "Charades" });
heading1.classList.add("left", "big1", "marginless");
heading2.classList.add("left", "marginless");

const promptDiv = appenNewNode(app, "div");
const playerDiv = appenNewNode(app, "div");
promptDiv.classList.add("left");
playerDiv.classList.add("left", "button-div");

const playerInputDiv = appenNewNode(app, "div", { innerText: "Add player: " });
const playerInput = appenNewNode(playerInputDiv, "input");
const promptInputDiv = appenNewNode(app, "div", { innerText: "Add prompt: " });
const promptInput = appenNewNode(promptInputDiv, "input");

const promptHeading = appenNewNode(app, "div");
promptHeading.classList.add("big2");
const promptButton = appenNewNode(app, "button", {
  innerText: "Start game",
});
promptHeading.classList.add("offset-top");
promptButton.classList.add("offset-top");

const [players, setPlayers] = createSignal<string[]>([]);
const [prompts, setPrompts] = createSignal<string[]>([]);
const [prompt, setPrompt] = createSignal<string>("Waiting...");

createEffect(() => {
  const ps = players();
  const player = ps[ps.length - 1];
  if (ps.length === 0) return;
  const [count, setCount] = createSignal(0);
  const button = appenNewNode(playerDiv, "button", {
    innerText: `${player}: 0`,
  });

  button.onclick = () => {
    setCount((x) => x + 1);
    button.innerText = `${player}: ${count()}`;
  };
});

createEffect(() => {
  promptDiv.innerText = `Number of prompts left: ${prompts().length}`;
  promptHeading.innerText = `${prompt()}`;
});

playerInput.addEventListener("keydown", (event) => {
  if (event.code === "Enter") {
    setPlayers((players) => [...players, playerInput.value]);
    playerInput.value = "";
  }
});

promptInput.addEventListener("keydown", (event) => {
  if (event.code === "Enter") {
    setPrompts((prompts) => [...prompts, promptInput.value]);
    promptInput.value = "";
  }
});

const makePrompt = (players: string[], prompts: string[]) => {
  const [nPlayers, nPrompts] = [players.length, prompts.length];
  const playerIndices = new Set<number>();
  while (playerIndices.size < 2)
    playerIndices.add(Math.floor(Math.random() * nPlayers));
  const [player1, player2] = Array.from(playerIndices).map((i) => players[i]);
  const promptIndex = Math.floor(Math.random() * nPrompts);
  const prompt = prompts[promptIndex];
  console.log(prompt);
  const article = ["a", "e", "i", "o", "u"].includes(prompt[0].toLowerCase())
    ? "an"
    : "a";
  prompts.splice(promptIndex, 1);
  setPrompts((prompts) => [...prompts]);
  return `<b>${player1}</b> has to do ${article} <br> <span class="hidden"><b>${prompt}</b></span> <br> and <b>${player2}</b> has to guess`;
};

promptButton.addEventListener("click", () => {
  if (players().length < 2) {
    setPrompt(() => `Please add more players`);
    return;
  }
  if (!prompts().length) {
    setPrompt(() => (promptHeading.innerText = `Please add more prompts`));
    promptButton.innerText = `Resume game`;
    return;
  }

  promptButton.innerText = `Next prompt`;
  promptHeading.innerHTML = makePrompt(players(), prompts());
});
